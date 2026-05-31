import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | FORGE',
  description: 'FORGE is local-first. Your health, financial, and personal data never leaves your device. Here\'s exactly what we collect and why.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <Link href="/" className="text-xs text-orange-400 hover:text-orange-300 mb-8 inline-block">← Back to FORGE</Link>

      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-zinc-500 text-sm mb-10">Last updated: May 2026</p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">The Short Version</h2>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-2">
            <p>✓ Your health, financial, and personal data is stored <strong>only on your device</strong> — in your browser&apos;s local storage.</p>
            <p>✓ We have <strong>no database of user data</strong>. We cannot access, sell, or lose your data because we never have it.</p>
            <p>✓ When you use Oracle AI, the text of your query and an <strong>anonymised summary</strong> of your data is sent to Anthropic&apos;s API. Anthropic does not store this beyond the request. Your name is never sent.</p>
            <p>✓ If you subscribe to Pro, Stripe handles your payment. We never see your full card number.</p>
            <p>✓ Vercel Analytics collects <strong>anonymous aggregate</strong> page view data (no cookies, no fingerprinting, GDPR compliant).</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. What We Collect</h2>
          <h3 className="font-medium text-white mb-2">Data You Log in FORGE</h3>
          <p className="text-zinc-400 mb-3">
            All data you log — sleep, HRV, workouts, nutrition, transactions, goals, habits, journal entries — is stored exclusively in your browser&apos;s localStorage. This data never leaves your device unless you explicitly choose to export it or send a query to Oracle.
          </p>

          <h3 className="font-medium text-white mb-2">Oracle AI Queries</h3>
          <p className="text-zinc-400 mb-3">
            When you send a message to Oracle, we transmit: (1) your message text, and (2) an anonymised summary of your FORGE data (aggregate scores, recent trends — not individual transactions or personal identifiers). This is sent to Anthropic&apos;s Claude API for processing. Anthropic&apos;s privacy policy governs how they handle API data. We do not log or store these queries on our servers.
          </p>

          <h3 className="font-medium text-white mb-2">Payment Information</h3>
          <p className="text-zinc-400 mb-3">
            Pro subscriptions are processed by Stripe. We receive a Stripe customer ID and subscription status. We never see your full card number, CVV, or bank account details.
          </p>

          <h3 className="font-medium text-white mb-2">Analytics</h3>
          <p className="text-zinc-400">
            We use Vercel Analytics for anonymous aggregate page view data. No cookies are set. No IP addresses are stored. No individual user is tracked. This is GDPR compliant by design.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. What We Don&apos;t Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
            <li>We do not collect your name (unless you provide your email for our newsletter)</li>
            <li>We do not track individual users across sessions</li>
            <li>We do not use advertising cookies or third-party trackers</li>
            <li>We do not sell data — there is no data to sell</li>
            <li>We do not have a user database with your health or financial records</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Your Rights (GDPR)</h2>
          <p className="text-zinc-400 mb-3">
            Under GDPR, you have the right to access, correct, export, and delete your data. Because your data is stored locally on your device, you have full control at all times:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
            <li><strong>Access:</strong> Your data is in your browser. Open FORGE → Settings → Export Data.</li>
            <li><strong>Deletion:</strong> Clear FORGE data in Settings, or clear your browser&apos;s localStorage for this site.</li>
            <li><strong>Portability:</strong> Export to CSV or JSON at any time from Settings.</li>
            <li><strong>Newsletter opt-out:</strong> Email us at support@forge-life.app to be removed from any list.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Data Retention</h2>
          <p className="text-zinc-400">
            Your FORGE data persists in your browser until you clear it or clear your browser&apos;s site data. If you clear your browser or switch devices, your data will be lost. We recommend regular exports as backup. Cloud sync with end-to-end encryption is on our roadmap.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Cookies</h2>
          <p className="text-zinc-400">
            FORGE does not use cookies for tracking. Vercel Analytics does not use cookies. Stripe may set cookies for fraud prevention when you initiate a payment, governed by Stripe&apos;s privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Changes to This Policy</h2>
          <p className="text-zinc-400">
            We will notify users of material changes to this policy via a banner in the app. The &quot;Last updated&quot; date at the top will always reflect the most recent revision.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Contact</h2>
          <p className="text-zinc-400">
            Questions? Email us: <a href="mailto:support@forge-life.app" className="text-orange-400 hover:text-orange-300">support@forge-life.app</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-zinc-800 flex gap-6 text-xs text-zinc-500">
        <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
        <Link href="/pricing" className="hover:text-zinc-300">Pricing</Link>
        <Link href="/" className="hover:text-zinc-300">Back to FORGE</Link>
      </div>
    </div>
  )
}
