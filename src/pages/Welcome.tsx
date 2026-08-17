import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MarketingLayout from '../components/marketing/MarketingLayout';
import { useAuth } from '../contexts/AuthContext';
import { FishSVG } from '../components/Visuals';
import { CheckIcon, StarIcon, ArrowRightIcon, ChartIcon, DropIcon, HeartIcon, CartIcon } from '../components/Icons';
import { PLANS, formatPrice } from '../data/plans';
import { PRODUCTS } from '../data/products';

const STATS = [
  { value: '48k+', label: 'Water tests logged' },
  { value: '12k+', label: 'Bettas tracked' },
  { value: '4.9', label: 'Average keeper rating' },
  { value: '31%', label: 'Fewer emergency water crashes*' },
];

const FEATURES = [
  {
    icon: HeartIcon,
    title: 'Health score that is actually useful',
    body: 'BettaScore reads water chemistry and behavior together, then tells you what to fix first.',
  },
  {
    icon: DropIcon,
    title: 'Water logging in under 30 seconds',
    body: 'Temperature, pH, ammonia, nitrite, nitrate — with ranges that match real betta science, not forum folklore.',
  },
  {
    icon: ChartIcon,
    title: 'Trends before symptoms',
    body: 'Pro charts catch nitrate creep and heater drift days before fins look ragged.',
  },
  {
    icon: CartIcon,
    title: 'Gear that pays for the subscription',
    body: 'A curated shop of heaters, tests, and food. Pro members keep 10–15% via partner pricing.',
  },
];

const STEPS = [
  { n: '01', title: 'Create a habitat profile', body: 'Size, heat, and filtration. We flag anything below the 5-gallon standard.' },
  { n: '02', title: 'Log your betta', body: 'Name, color, appetite, fins, and behavior. Two minutes, then you have a baseline.' },
  { n: '03', title: 'Test water weekly', body: 'We score the reading, recommend a change if needed, and remember the history.' },
];

const TESTIMONIALS = [
  {
    name: 'Maya Chen',
    role: 'Home keeper, Seattle',
    quote: 'I used to guess. After two weeks of logging, I caught ammonia at 0.25 before he stopped eating. That paid for a year of Pro.',
    avatar: '/avatars/avatar-maya.jpg',
  },
  {
    name: 'James Ortiz',
    role: 'Rescue volunteer',
    quote: 'We run eight recovery tanks. The care log is how we prove to adopters that a fish is actually stable.',
    avatar: '/avatars/avatar-james.jpg',
  },
  {
    name: 'Leo Park',
    role: 'First-time keeper',
    quote: 'The shop recommendations were uncomfortably accurate. I needed a heater. The app said so. The fish agreed.',
    avatar: '/avatars/avatar-leo.jpg',
  },
];

const FAQ = [
  {
    q: 'Is this only for bettas?',
    a: 'Yes. The ranges, feeding math, and disease protocols are written for Betta splendens — not a generic “tropical fish” template.',
  },
  {
    q: 'Do I need an account?',
    a: 'You can try the product immediately. Create a free account when you want cloud backup, history, and the shop discount.',
  },
  {
    q: 'How does the shop make money?',
    a: 'Partner links. We only list gear we would put on our own tanks. Editorial recommendations are not paid placements.',
  },
  {
    q: 'Can I cancel Pro anytime?',
    a: 'Yes. You keep Starter features. History remains exportable for 30 days after you downgrade.',
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user, enableGuestMode } = useAuth();

  const start = () => {
    if (user) navigate('/dashboard');
    else navigate('/signup');
  };

  const tryProduct = () => {
    if (user) navigate('/dashboard');
    else {
      enableGuestMode();
      navigate('/dashboard');
    }
  };

  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="eyebrow">The betta care platform</div>
            <h1 className="display mt-4 text-4xl leading-[1.05] sm:text-6xl">
              Professional betta care, without the guesswork.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-600">
              Track water, health, and feeding in one place. Get alerts before problems get expensive. Then buy the right gear — not another cup kit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-button hover:bg-brand-700"
              >
                {user ? 'Open dashboard' : 'Start free'}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <button
                onClick={tryProduct}
                className="inline-flex items-center justify-center rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-800 hover:border-ink-400"
              >
                {user ? 'Continue setup' : 'Try the product'}
              </button>
            </div>
            <p className="mt-4 text-xs text-ink-500">No credit card for Starter. Upgrade when the history matters.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <img
              src="/images/hero-aquarium.jpg"
              alt="A healthy betta in a planted aquarium"
              className="h-[420px] w-full rounded-[28px] object-cover shadow-lift"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-soft backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-brand-700">BettaScore</div>
                  <div className="font-display text-2xl">92 — Excellent</div>
                </div>
                <FishSVG color="#e11d48" mood="happy" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-ink-900/5 bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl text-ink-900">{stat.value}</div>
              <div className="mt-1 text-sm text-ink-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="container-page py-20">
        <div className="max-w-2xl">
          <div className="eyebrow">Why keepers switch</div>
          <h2 className="display mt-3 text-3xl sm:text-4xl">Built like a product, not a hobby spreadsheet.</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="surface-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">{feature.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <img src="/images/feature-dashboard.jpg" alt="Care insights on a tablet beside a tank" className="h-64 w-full rounded-3xl object-cover" />
          <img src="/images/feature-testing.jpg" alt="Testing aquarium water" className="h-64 w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-ink-950 py-20 text-cream-50">
        <div className="container-page">
          <div className="eyebrow text-brand-300">How it works</div>
          <h2 className="display mt-3 text-3xl text-white sm:text-4xl">Three steps. Then the tank runs on data.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="font-display text-3xl text-brand-300">{step.n}</div>
                <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Pricing</div>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Free to start. Paid when the history is worth it.</h2>
          </div>
          <button onClick={() => navigate('/pricing')} className="hidden rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold sm:inline-flex">
            Compare plans
          </button>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 ${plan.highlighted ? 'border-brand-600 bg-white shadow-lift' : 'border-ink-900/10 bg-white/70'}`}
            >
              <div className="text-sm font-semibold text-brand-700">{plan.name}</div>
              <div className="mt-2 font-display text-4xl">
                {formatPrice(plan.monthly)}
                <span className="text-base font-sans font-medium text-ink-500">{plan.monthly ? '/mo' : ''}</span>
              </div>
              <p className="mt-2 text-sm text-ink-600">{plan.tagline}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.slice(0, 5).map((feature) => (
                  <li key={feature.label} className="flex items-start gap-2 text-sm">
                    <CheckIcon className={`mt-0.5 h-4 w-4 ${feature.included ? 'text-brand-600' : 'text-ink-300'}`} />
                    <span className={feature.included ? 'text-ink-800' : 'text-ink-400 line-through'}>{feature.label}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(plan.id === 'free' ? '/signup' : `/checkout?plan=${plan.id}`)}
                className={`mt-6 w-full rounded-full py-2.5 text-sm font-semibold ${
                  plan.highlighted ? 'bg-brand-600 text-white' : 'bg-ink-900 text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-8">
        <div className="flex items-end justify-between">
          <div>
            <div className="eyebrow">Partner shop</div>
            <h2 className="display mt-3 text-3xl">Gear we actually put on tanks.</h2>
          </div>
          <button onClick={() => navigate('/shop')} className="text-sm font-semibold text-brand-700">Browse shop</button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.slice(0, 4).map((product) => (
            <div key={product.id} className="overflow-hidden rounded-3xl border border-ink-900/8 bg-white">
              <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-1 text-xs font-semibold text-ink-500">
                  <StarIcon className="h-3.5 w-3.5 text-coral-500" />
                  {product.rating} · {product.reviews.toLocaleString()}
                </div>
                <div className="mt-1 font-semibold">{product.name}</div>
                <div className="mt-1 text-sm text-brand-700">${product.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="eyebrow">Keepers</div>
        <h2 className="display mt-3 text-3xl">What changed after they stopped guessing.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name} className="surface-card p-6">
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-ink-500">{item.role}</div>
                </div>
              </div>
              <blockquote className="mt-4 text-sm leading-6 text-ink-700">“{item.quote}”</blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <h2 className="display text-3xl">Questions, answered.</h2>
        <div className="mt-8 divide-y divide-ink-900/10 rounded-3xl border border-ink-900/10 bg-white">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="cursor-pointer list-none font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm leading-6 text-ink-600">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-xs text-ink-400">*Based on keepers who logged weekly tests for 90 days versus their prior self-reported crash rate.</p>
      </section>
    </MarketingLayout>
  );
}
