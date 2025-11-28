import { Button } from "@/components/ui/button"
import Link from "next/link"
import { query } from "@/lib/database"

async function getDashboardStats() {
  try {
    // For POC, we use the demo user
    const userRes = await query('SELECT id FROM users WHERE email = $1', ['demo@clarity.ai'])
    if (userRes.rows.length === 0) return null

    const userId = userRes.rows[0].id

    const [sessionsRes, scoresRes] = await Promise.all([
      query('SELECT COUNT(*) as count FROM speech_analyses WHERE user_id = $1', [userId]),
      query('SELECT AVG(pronunciation_score) as avg_score FROM speech_analyses WHERE user_id = $1', [userId])
    ])

    return {
      totalSessions: parseInt(sessionsRes.rows[0].count),
      avgScore: parseFloat(scoresRes.rows[0].avg_score || '0') * 100
    }
  } catch (error) {
    console.warn('Failed to fetch dashboard stats (DB might be offline):', error)
    return null
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Clarity Coach AI
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome back!</span>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Pronunciation Journey
          </h1>
          <p className="text-gray-600">
            Track your progress and continue improving your English pronunciation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Practice Sessions"
            value={stats?.totalSessions.toString() || "0"}
            subtitle="Total sessions completed"
            icon="📊"
          />
          <StatCard
            title="Pronunciation Score"
            value={stats?.avgScore ? `${stats.avgScore.toFixed(0)}%` : "--"}
            subtitle="Average accuracy"
            icon="🎯"
          />
          <StatCard
            title="Current Level"
            value="B1"
            subtitle="Estimated CEFR level"
            icon="📈"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Button asChild size="lg">
              <Link href="/assessment">Take CEFR Assessment</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/coaching">Start Practice Session</Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            {stats?.totalSessions ? (
              <p>You have completed {stats.totalSessions} sessions. Keep it up!</p>
            ) : (
              <>
                <p>No activity yet. Start your first practice session!</p>
                <Button asChild className="mt-4">
                  <Link href="/coaching">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon }: {
  title: string
  value: string
  subtitle: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}
