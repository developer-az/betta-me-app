import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MarketingLayout from '../components/marketing/MarketingLayout';
import { GUIDES, getGuide } from '../data/guides';
import { useSubscription } from '../contexts/SubscriptionContext';
import { LockIcon } from '../components/Icons';

export default function GuidesPage() {
  const [query, setQuery] = React.useState('');
  const filtered = GUIDES.filter((guide) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      guide.title.toLowerCase().includes(q) ||
      guide.excerpt.toLowerCase().includes(q) ||
      guide.level.toLowerCase().includes(q)
    );
  });

  return (
    <MarketingLayout>
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <div className="eyebrow">Care library</div>
          <h1 className="display mt-3 text-4xl">Written for bettas. Not “tropical fish.”</h1>
          <p className="mt-3 text-ink-600">
            Practical protocols you can finish in a coffee break. Care+ unlocks disease identification and treatment sequences.
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides…"
            className="mt-6 w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm"
          />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filtered.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="surface-card p-6 transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-brand-700">
                <span>{guide.level}</span>
                {guide.premium && <span className="inline-flex items-center gap-1 text-coral-600"><LockIcon className="h-3.5 w-3.5" /> Care+</span>}
              </div>
              <h2 className="mt-3 font-display text-2xl">{guide.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">{guide.excerpt}</p>
              <div className="mt-4 text-xs text-ink-500">{guide.minutes} min read</div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-8 text-sm text-ink-500">No guides match “{query}”.</p>
        )}
      </section>
    </MarketingLayout>
  );
}

export function GuideArticlePage() {
  const { slug } = useParams();
  const guide = slug ? getGuide(slug) : undefined;
  const { canUsePremiumGuides } = useSubscription();
  const navigate = useNavigate();

  if (!guide) {
    return (
      <MarketingLayout>
        <div className="container-page py-24 text-center">
          <h1 className="display text-3xl">Guide not found</h1>
          <Link to="/guides" className="mt-4 inline-block text-brand-700">Back to library</Link>
        </div>
      </MarketingLayout>
    );
  }

  const locked = Boolean(guide.premium && !canUsePremiumGuides);

  return (
    <MarketingLayout>
      <article className="container-page max-w-3xl py-16">
        <Link to="/guides" className="text-sm font-semibold text-brand-700">Library</Link>
        <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink-500">
          {guide.level} · {guide.minutes} min
        </div>
        <h1 className="display mt-2 text-4xl">{guide.title}</h1>
        <p className="mt-4 text-lg text-ink-600">{guide.excerpt}</p>
        <div className="mt-10 space-y-5 text-base leading-8 text-ink-800">
          {(locked ? guide.body.slice(0, 1) : guide.body).map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        {locked && (
          <div className="mt-8 rounded-3xl bg-ink-950 p-6 text-cream-50">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-300">
              <LockIcon className="h-4 w-4" /> Care+ protocol
            </div>
            <p className="mt-2 text-sm leading-6 text-white/70">
              The rest of this guide is a treatment sequence — dosing, timelines, and what to skip. Unlock it with Care+.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-4 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Upgrade to Care+
            </button>
          </div>
        )}
      </article>
    </MarketingLayout>
  );
}
