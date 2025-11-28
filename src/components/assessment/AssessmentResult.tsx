import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AssessmentResultProps {
    results: {
        text: string
        confidence: number
        pronunciation: {
            accuracyScore: number
            fluencyScore: number
            completenessScore: number
            pronunciationScore: number
            words: any[]
        }
        accent: {
            detectedAccent: string
            confidence: number
        }
    }
    onRetry: () => void
}

export default function AssessmentResult({ results, onRetry }: AssessmentResultProps) {
    const { pronunciation, accent } = results

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-white">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
                <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {pronunciation.pronunciationScore.toFixed(0)}
                </div>
                <p className="text-gray-300">Overall Pronunciation Score</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <ScoreCard title="Accuracy" score={pronunciation.accuracyScore} />
                <ScoreCard title="Fluency" score={pronunciation.fluencyScore} />
                <ScoreCard title="Completeness" score={pronunciation.completenessScore} />
            </div>

            <div className="bg-white/5 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Detailed Feedback</h3>
                <div className="space-y-4">
                    <div>
                        <span className="text-gray-400 block text-sm">Detected Accent</span>
                        <span className="text-lg capitalize">{accent.detectedAccent} ({Math.round(accent.confidence * 100)}% confidence)</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-sm mb-2">Transcribed Text</span>
                        <p className="p-4 bg-black/20 rounded-lg italic">"{results.text}"</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 justify-center">
                <Button onClick={onRetry} variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10 text-white">
                    Try Again
                </Button>
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
        </div>
    )
}

function ScoreCard({ title, score }: { title: string; score: number }) {
    return (
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold mb-1">{score.toFixed(0)}</div>
            <div className="text-sm text-gray-400">{title}</div>
        </div>
    )
}
