import PracticeSession from '@/components/coaching/PracticeSession'

const PRACTICE_SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "She sells seashells by the seashore.",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    "I scream, you scream, we all scream for ice cream."
]

export default function CoachingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Practice Session
                    </h1>
                    <p className="text-gray-400">
                        Read the sentences aloud to improve your pronunciation
                    </p>
                </div>

                <PracticeSession sentences={PRACTICE_SENTENCES} />
            </div>
        </div>
    )
}
