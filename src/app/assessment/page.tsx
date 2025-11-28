'use client'

import { useState } from 'react'
import AudioRecorder from '@/components/AudioRecorder'
import AssessmentResult from '@/components/assessment/AssessmentResult'

export default function AssessmentPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRecordingComplete = async (blob: Blob, url: string) => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', blob)

      const response = await fetch('/api/speech/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error('Assessment error:', err)
      setError('Failed to analyze speech. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRetry = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pronunciation Assessment
          </h1>
          <p className="text-gray-400">
            Record yourself speaking and get instant AI-powered feedback
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-center">
            {error}
          </div>
        )}

        {isAnalyzing ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-white text-lg">Analyzing your pronunciation...</p>
          </div>
        ) : results ? (
          <AssessmentResult results={results} onRetry={handleRetry} />
        ) : (
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        )}
      </div>
    </div>
  )
}
