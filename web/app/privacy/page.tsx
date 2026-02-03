import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - bloxbot',
  description: 'Privacy Policy for bloxbot',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col p-6 md:p-8">
      <div className="max-w-3xl mx-auto w-full flex-1">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-4">Last updated: February 2026</p>
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-gray-300">
          <p>
            bloxbot (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy describes how we collect, use, and protect your information when you use our service.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Information We Collect</h2>
          <p>
            When you log in with Roblox, we receive your Roblox user ID and username from Roblox. We use this to link your in-game progress (quests, points, claims) to your account on our website.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">How We Use It</h2>
          <p>
            We use your Roblox identity to display your quest progress, points, and rewards. If you link a Solana wallet, we store the wallet address you provide to enable future reward claims.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Data Sharing</h2>
          <p>
            We do not sell your data. We may share data only as required by law or to operate the service (e.g., with Roblox for authentication).
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Contact</h2>
          <p>
            For privacy questions, contact us through the contact method provided in the app or on our main site.
          </p>
        </div>
      </div>
    </main>
  )
}
