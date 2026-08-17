import React from 'react';
import MarketingLayout from '../components/marketing/MarketingLayout';

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <article className="container-page max-w-3xl py-16">
        <div className="eyebrow">Legal</div>
        <h1 className="display mt-3 text-4xl">Privacy policy</h1>
        <p className="mt-4 text-sm text-ink-500">Last updated August 14, 2026</p>
        <div className="mt-8 space-y-5 text-sm leading-7 text-ink-700">
          <p>
            Betta Me stores the account data you provide (email), tank and fish profiles, water readings, and care logs. We use this data to operate the product, calculate health scores, and — if you opt in — improve recommendations.
          </p>
          <p>
            Authentication is handled by Supabase. We do not sell personal data. Partner shop clicks may be tracked with standard affiliate parameters so we can attribute commissions.
          </p>
          <p>
            You can export your data from Account, and you can delete your account by emailing hello@bettame.app. Analytics, if enabled in settings, are aggregated.
          </p>
          <p>
            Questions: hello@bettame.app
          </p>
        </div>
      </article>
    </MarketingLayout>
  );
}

export function TermsPage() {
  return (
    <MarketingLayout>
      <article className="container-page max-w-3xl py-16">
        <div className="eyebrow">Legal</div>
        <h1 className="display mt-3 text-4xl">Terms of service</h1>
        <p className="mt-4 text-sm text-ink-500">Last updated August 14, 2026</p>
        <div className="mt-8 space-y-5 text-sm leading-7 text-ink-700">
          <p>
            Betta Me is a care-tracking product, not a veterinary service. Health scores and protocols are educational. If your fish is in distress, consult a qualified aquatic veterinarian.
          </p>
          <p>
            Starter is free. Paid plans renew until canceled. Demo checkout in this environment does not charge a card. Production billing will be processed by a third-party provider.
          </p>
          <p>
            Partner product links may earn a commission. We do not guarantee third-party availability, pricing, or shipping.
          </p>
          <p>
            You retain ownership of the data you enter. We retain a license to host it while your account is active.
          </p>
        </div>
      </article>
    </MarketingLayout>
  );
}
