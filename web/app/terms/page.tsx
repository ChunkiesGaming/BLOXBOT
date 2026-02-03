import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - bloxbot',
  description: 'Terms of Service for bloxbot',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col p-6 md:p-8">
      <div className="max-w-3xl mx-auto w-full flex-1">
        <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-4">Last updated: February 2026</p>
        <div className="prose prose-invert prose-sm max-w-none space-y-4 text-gray-300">
          <p>
            By using bloxbot, you agree to these Terms of Service. If you do not agree, do not use the service.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Eligibility</h2>
          <p>
            You must have a valid Roblox account and comply with Roblox&apos;s terms. Use of our service is subject to your jurisdiction&apos;s laws.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Service Description</h2>
          <p>
            bloxbot lets you complete quests in supported Roblox experiences and view progress and rewards on our website. We do not guarantee uninterrupted service or specific rewards.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Your Conduct</h2>
          <p>
            You may not cheat, abuse, or attempt to manipulate quest progress or rewards. We may suspend or terminate access for violations.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Changes</h2>
          <p>
            We may update these terms. Continued use after changes constitutes acceptance. Check this page for the latest version.
          </p>
          <h2 className="text-xl font-semibold text-white mt-6">Contact</h2>
          <p>
            For questions about these terms, contact us through the contact method provided in the app or on our main site.
          </p>
        </div>
      </div>
    </main>
  )
}
