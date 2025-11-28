'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    checkMicrophonePermission()
    return () => {
      stopRecording()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermissionGranted(true)
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      setError('Microphone permission denied. Please allow microphone access.')
      setPermissionGranted(false)
    }
  }

  const startRecording = async () => {
    try {
      setError(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4'
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, url)
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setIsPaused(false)
      startTimer()
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording. Please check your microphone.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      stopTimer()
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        startTimer()
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        stopTimer()
      }
    }
  }

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const resetRecording = () => {
    setAudioUrl(null)
    setRecordingTime(0)
    audioChunksRef.current = []
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!permissionGranted) {
    return (
      <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/10">
        <div className="mb-4">
          <div className="text-6xl mb-4">🎤</div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">Microphone Access Required</h3>
        <p className="text-gray-400 mb-4">
          Please allow microphone access to record your pronunciation.
        </p>
        <button 
          onClick={checkMicrophonePermission}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
        >
          Request Permission
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Record Your Pronunciation
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-gray-400">
            {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to record'}
          </div>
        </div>

        <div className="relative">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <div className="w-8 h-8 bg-white rounded-sm"></div>
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
            >
              🎤
            </button>
          )}
        </div>

        {isRecording && (
          <div className="flex space-x-4">
            <button
              onClick={pauseRecording}
              className="px-6 py-2 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              onClick={stopRecording}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:scale-105 transition-transform"
            >
              ⏹️ Stop
            </button>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="w-full space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Recording complete!</p>
              <audio 
                controls 
                src={audioUrl} 
                className="w-full"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetRecording}
                className="flex-1 py-2 px-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
              >
                🔄 Record Again
              </button>
              <button
                onClick={() => console.log('Analyzing audio...', audioUrl)}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:scale-105 transition-transform"
              >
                ✨ Analyze Pronunciation
              </button>
            </div>
          </div>
        )}

        {!isRecording && !audioUrl && (
          <div className="text-center text-sm text-gray-400 max-w-md">
            <p className="mb-2">
              Click the microphone button to start recording.
            </p>
            <p>
              Speak clearly and naturally. You can pause and resume anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
