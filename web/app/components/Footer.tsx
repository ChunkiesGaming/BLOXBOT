import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <Link href="/how-it-works" className="hover:text-white transition">
            How it works
          </Link>
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms of Service
          </Link>
        </nav>
        <p className="mt-4 text-center text-xs text-gray-500">
          © {year} bloxbot. Complete quests in Roblox and earn rewards.
        </p>
      </div>
    </footer>
  )
}
