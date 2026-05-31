import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | FORGE',
  description: 'FORGE terms of service. Free to use, no account required. Pro subscription terms.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-zinc-300">
      <Link href="/" className="text-xs text-orange-400 hover:text-orange-300 mb-8 inline-block">← Back to FORGE</Link>

      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-zinc-500 text-sm mb-10">Last updated: May 2026</p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p className="text-zinc-400">
            By using FORGE, you agree to these terms. If you do not agree, do not use FORGE. These terms apply to the free tier and the Pro subscription. FORGE is provided by its creator (&quot;we&quot;, &quot;us&quot;).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
          <p className="text-zinc-400 mb-3">
            FORGE is a personal life operating system that tracks health, body, wealth, and mind data. All personal data is stored locally on your device. Oracle AI is powered by Anthropic&apos;s Claude API.
          </p>
          <p className="text-zinc-400">
            The free tier is provided at no charge and may include usage limits (e.g., Oracle queries per day). Pro subscription removes these limits and adds additional features.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. Pro Subscription</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
            <li>Pro is billed monthly or annually via Stripe</li>
            <li>A 7-day free trial is available — no charge until the trial ends</li>
            <li>Cancel anytime before the trial ends to pay nothing</li>
            <li>After the trial, billing occurs at the start of each billing period</li>
            <li>Cancel anytime from the billing portal — access continues until the end of the period</li>
            <li>Refunds: we offer a 30-day money-back guarantee for annual plans. Contact support@forge-life.app</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. Data and Privacy</h2>
          <p className="text-zinc-400">
            All personal data you log is stored exclusively on your device. We have no access to your health, financial, or personal data. See our <Link href="/privacy" className="text-orange-400 hover:text-orange-300">Privacy Policy</Link> for full details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. Acceptable Use</h2>
          <p className="text-zinc-400 mb-3">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
            <li>Use FORGE for any illegal purpose</li>
            <li>Attempt to reverse engineer, bypass, or abuse the Oracle rate limits</li>
            <li>Use automated tools to make excessive API requests</li>
            <li>Misrepresent yourself or your subscription status</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. Medical Disclaimer</h2>
          <p className="text-zinc-400">
            FORGE is not a medical device and Oracle is not a medical professional. Data and recommendations provided by FORGE are for informational and self-improvement purposes only. Do not use FORGE as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">7. Limitation of Liability</h2>
          <p className="text-zinc-400">
            FORGE is provided &quot;as is&quot; without warranties of any kind. We are not liable for any loss of data (including localStorage data cleared by browser updates), service interruptions, or decisions made based on Oracle recommendations. Use at your own discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">8. Changes to Terms</h2>
          <p className="text-zinc-400">
            We may update these terms. Continued use of FORGE after changes constitutes acceptance. Material changes will be communicated via the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
          <p className="text-zinc-400">
            Questions: <a href="mailto:support@forge-life.app" className="text-orange-400 hover:text-orange-300">support@forge-life.app</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-zinc-800 flex gap-6 text-xs text-zinc-500">
        <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
        <Link href="/pricing" className="hover:text-zinc-300">Pricing</Link>
        <Link href="/" className="hover:text-zinc-300">Back to FORGE</Link>
      </div>
    </div>
  )
}
