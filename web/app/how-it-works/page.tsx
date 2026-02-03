import Link from 'next/link'

export const metadata = {
  title: 'How it works - bloxbot',
  description: 'Learn how bloxbot connects Roblox quests, points, and rewards.',
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen flex flex-col p-6 md:p-10">
      <div className="max-w-3xl mx-auto w-full flex-1">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">How it works</h1>
        <p className="text-gray-400 text-lg mb-12">
          bloxbot connects your Roblox account to quests and rewards. Here’s the flow.
        </p>

        <section className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">1. Sign in with Roblox</h2>
            <p className="text-gray-400">
              Use your existing Roblox account to sign in. We only receive your Roblox user ID and username so we can link your in-game progress to your dashboard.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">2. Play supported experiences</h2>
            <p className="text-gray-400 mb-3">
              Supported Roblox games have quests you can complete—for example:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-2">
              <li>Playtime quests (play for X minutes)</li>
              <li>Win quests (win a match)</li>
              <li>Zone quests (reach a location or level)</li>
            </ul>
            <p className="text-gray-400 mt-3">
              When you complete a quest in-game, progress is recorded and points are awarded.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">3. Track progress in your dashboard</h2>
            <p className="text-gray-400">
              After signing in, your dashboard shows active quests, current progress, total points, and any pending claims. You can see everything in one place without leaving the site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">4. Link a wallet and claim rewards</h2>
            <p className="text-gray-400">
              When you’re ready to redeem rewards, link a Solana wallet from your dashboard. Pending claims can then be claimed. You control when to link and when to claim.
            </p>
          </div>
        </section>

        <div className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-gray-300 text-sm">
            Ready to start? <Link href="/" className="text-primary hover:underline font-medium">Go to Home</Link> and sign in with Roblox to see your quests and dashboard.
          </p>
        </div>
      </div>
    </main>
  )
}
