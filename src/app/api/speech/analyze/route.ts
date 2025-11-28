import { NextRequest, NextResponse } from 'next/server'
import { recognizeSpeechWithPronunciation, detectAccent, preprocessAudio } from '@/lib/azure-speech'
import { query } from '@/lib/database'

// Helper to get or create a demo user for the POC
async function getDemoUser() {
    const result = await query('SELECT id FROM users WHERE email = $1', ['demo@clarity.ai'])
    if (result.rows.length > 0) {
        return result.rows[0].id
    }

    const newUser = await query(
        `INSERT INTO users (email, password_hash, full_name, native_language) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id`,
        ['demo@clarity.ai', 'demo_hash', 'Demo User', 'Spanish']
    )
    return newUser.rows[0].id
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const audioFile = formData.get('audio') as Blob

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            )
        }

        // Preprocess audio (convert to ArrayBuffer)
        const audioBuffer = await preprocessAudio(audioFile)

        // Run analysis in parallel
        const [pronunciationResult, accentResult] = await Promise.all([
            recognizeSpeechWithPronunciation(audioBuffer),
            detectAccent(audioBuffer)
        ])

        // Save to database
        try {
            const userId = await getDemoUser()
            const { pronunciationAssessment } = pronunciationResult

            if (pronunciationAssessment) {
                await query(
                    `INSERT INTO speech_analyses 
           (user_id, transcription, detected_accent, confidence_score, pronunciation_score, fluency_score, audio_duration)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        userId,
                        pronunciationResult.text,
                        accentResult.detectedAccent,
                        pronunciationResult.confidence,
                        pronunciationAssessment.pronunciationScore / 100, // Normalize to 0-1
                        pronunciationAssessment.fluencyScore / 100,      // Normalize to 0-1
                        0 // Duration placeholder
                    ]
                )
            }
        } catch (dbError) {
            console.error('Database save error:', dbError)
            // Continue even if DB save fails, so user still gets feedback
        }

        return NextResponse.json({
            text: pronunciationResult.text,
            confidence: pronunciationResult.confidence,
            pronunciation: pronunciationResult.pronunciationAssessment,
            accent: accentResult,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Speech analysis error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze speech' },
            { status: 500 }
        )
    }
}
