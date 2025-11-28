import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

const speechKey = process.env.AZURE_SPEECH_KEY!
const serviceRegion = process.env.AZURE_SPEECH_REGION!

export const createSpeechConfig = () => {
  return sdk.SpeechConfig.fromSubscription(speechKey, serviceRegion)
}

export const createAudioConfig = () => {
  return sdk.AudioConfig.fromDefaultMicrophoneInput()
}

// Speech recognition with pronunciation assessment
export const recognizeSpeechWithPronunciation = async (audioBuffer: ArrayBuffer): Promise<{
  text: string
  confidence: number
  pronunciationAssessment?: any
}> => {
  return new Promise((resolve, reject) => {
    try {
      const speechConfig = createSpeechConfig()
      speechConfig.speechRecognitionLanguage = "en-US"

      // Enable pronunciation assessment
      const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
        "", // Reference text (empty for open speech)
        sdk.PronunciationAssessmentGradingSystem.HundredMark,
        sdk.PronunciationAssessmentGranularity.Phoneme,
        true
      )

      const audioConfig = sdk.AudioConfig.fromWavFileInput(Buffer.from(audioBuffer))
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

      pronunciationAssessmentConfig.applyTo(recognizer)

      recognizer.recognizeOnceAsync(
        (result) => {
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            const pronunciationResult = sdk.PronunciationAssessmentResult.fromResult(result)
            resolve({
              text: result.text,
              confidence: 1.0, // Simplified confidence
              pronunciationAssessment: {
                accuracyScore: pronunciationResult.accuracyScore,
                fluencyScore: pronunciationResult.fluencyScore,
                completenessScore: pronunciationResult.completenessScore,
                pronunciationScore: pronunciationResult.pronunciationScore,
                words: pronunciationResult.detailResult.Words
              }
            })
          } else {
            resolve({
              text: '',
              confidence: 0.0,
              pronunciationAssessment: null
            })
          }
          recognizer.close()
        },
        (error) => {
          reject(error)
          recognizer.close()
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

// Accent detection helper
export const detectAccent = async (audioBuffer: ArrayBuffer): Promise<{
  detectedAccent: string
  confidence: number
}> => {
  // Note: Azure Speech SDK doesn't have a direct "detect accent" API in the same way as language detection.
  // However, we can use Language Identification if we want to distinguish between locales (e.g. en-US vs en-GB).
  // For true accent detection (e.g. "French accent in English"), this requires a custom model or different service.
  // For this POC, we will use a simplified approach or mock it if Azure doesn't support it out of the box for this tier.

  // For now, we'll return a placeholder as true accent classification is a complex ML task
  // often requiring custom models. We can update this to use Azure's Language ID if needed.
  return Promise.resolve({
    detectedAccent: 'en-US', // Defaulting to target
    confidence: 0.85
  })
}

// Audio preprocessing for optimization
export const preprocessAudio = (audioBlob: Blob): Promise<ArrayBuffer> => {
  return audioBlob.arrayBuffer()
}