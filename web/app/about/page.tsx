import Link from 'next/link'

export const metadata = {
  title: 'About - bloxbot',
  description: 'What is bloxbot and who it’s for.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col p-6 md:p-10">
      <div className="max-w-3xl mx-auto w-full flex-1">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About bloxbot</h1>
        <p className="text-gray-400 text-lg mb-12">
          bloxbot is a rewards layer for Roblox. It connects your Roblox account to quests and rewards in one dashboard.
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">What is it?</h2>
            <p className="text-gray-400">
              bloxbot lets you complete quests inside supported Roblox experiences—playtime, wins, zones, and more—and earn points. Your progress and pending rewards are shown in a single dashboard. When you’re ready, you can link a wallet and claim what you’ve earned.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Who is it for?</h2>
            <p className="text-gray-400">
              Anyone who plays Roblox and wants to see their quest progress and rewards in one place. You only need a Roblox account to get started. Linking a wallet is optional and only needed when you want to claim rewards.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">One dashboard</h2>
            <p className="text-gray-400">
              After you sign in with Roblox, you get one dashboard: active quests, points, and pending claims. No need to jump between games or sites to check progress—it’s all here.
            </p>
          </div>
        </section>

        <div className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-gray-300 text-sm">
            <Link href="/how-it-works" className="text-primary hover:underline font-medium">How it works</Link> · <Link href="/" className="text-primary hover:underline font-medium">Get started</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
