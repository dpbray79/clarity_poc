'use client'

import { useState } from 'react'
import AudioRecorder from '@/components/AudioRecorder'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PracticeSessionProps {
    sentences: string[]
}

export default function PracticeSession({ sentences }: PracticeSessionProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [feedback, setFeedback] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const currentSentence = sentences[currentIndex]

    const handleRecordingComplete = async (blob: Blob) => {
        setIsAnalyzing(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('audio', blob)
            // In a real app, we'd send the reference text for better accuracy
            // formData.append('referenceText', currentSentence)

            const response = await fetch('/api/speech/analyze', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Analysis failed')

            const data = await response.json()
            setFeedback(data)
        } catch (err) {
            console.error(err)
            setError('Failed to analyze speech')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleNext = () => {
        setFeedback(null)
        setError(null)
        if (currentIndex < sentences.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
                <span className="text-sm font-medium text-purple-400 uppercase tracking-wider">
                    Sentence {currentIndex + 1} of {sentences.length}
                </span>
                <h2 className="text-3xl font-bold text-white mt-4 leading-relaxed">
                    "{currentSentence}"
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-center">
                    {error}
                </div>
            )}

            {isAnalyzing ? (
                <div className="text-center py-12">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-white">Analyzing...</p>
                </div>
            ) : feedback ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-white animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center mb-6">
                        <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                            {feedback.pronunciation.pronunciationScore.toFixed(0)}
                        </div>
                        <p className="text-gray-300">Score</p>
                    </div>

                    <div className="flex gap-4 justify-center mt-8">
                        <Button
                            onClick={() => setFeedback(null)}
                            variant="outline"
                            className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
                        >
                            Try Again
                        </Button>
                        {currentIndex < sentences.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                            >
                                Next Sentence
                            </Button>
                        ) : (
                            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                                <Link href="/dashboard">Finish Session</Link>
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            )}
        </div>
    )
}
