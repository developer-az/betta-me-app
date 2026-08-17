import React from 'react';
import { useLocation } from 'react-router-dom';
import MarketingLayout from '../components/marketing/MarketingLayout';
import Layout from '../components/Layout';
import { CATEGORY_LABELS, Product, ProductCategory, PRODUCTS } from '../data/products';
import { StarIcon } from '../components/Icons';
import { useSubscription } from '../contexts/SubscriptionContext';

function ProductCard({ product, discount }: { product: Product; discount: number }) {
  const price = discount ? product.price * (1 - discount) : product.price;
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-ink-900/8 bg-white dark:border-white/10 dark:bg-ink-800">
      <div className="relative">
        <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-white">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-brand-700">
          {CATEGORY_LABELS[product.category]}
        </div>
        <h3 className="mt-1 font-display text-2xl">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-ink-600 dark:text-cream-100/70">{product.blurb}</p>
        <p className="mt-2 text-xs text-ink-500">{product.why}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">
              ${price.toFixed(2)}
              {discount > 0 && (
                <span className="ml-2 text-xs font-medium text-ink-400 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-500">
              <StarIcon className="h-3.5 w-3.5 text-coral-500" />
              {product.rating} · {product.reviews.toLocaleString()} reviews
            </div>
          </div>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noreferrer sponsored"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Shop
          </a>
        </div>
      </div>
    </article>
  );
}

export function ShopCatalog() {
  const { shopDiscount, isPro } = useSubscription();
  const [category, setCategory] = React.useState<ProductCategory | 'all'>('all');
  const items = PRODUCTS.filter((p) => category === 'all' || p.category === category);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('all')}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${category === 'all' ? 'bg-ink-900 text-white' : 'bg-white dark:bg-ink-800'}`}
        >
          All
        </button>
        {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((key) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              category === key ? 'bg-ink-900 text-white' : 'bg-white dark:bg-ink-800'
            }`}
          >
            {CATEGORY_LABELS[key]}
          </button>
        ))}
      </div>
      {shopDiscount > 0 && (
        <div className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
          Your {isPro ? 'member' : ''} pricing is on — {Math.round(shopDiscount * 100)}% off partner products.
        </div>
      )}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} discount={shopDiscount} />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const location = useLocation();
  const inApp = location.pathname.startsWith('/app');
  const content = (
    <section className={inApp ? '' : 'container-page py-16'}>
      <div className="max-w-2xl">
        <div className="eyebrow">Partner shop</div>
        <h1 className="display mt-3 text-4xl">The short list. Not the aisle.</h1>
        <p className="mt-3 text-ink-600 dark:text-cream-100/70">
          Every product here solves a real failure mode: unstable heat, dirty water, empty calories, or ragged fins. Purchases via partner links help keep Betta Me running.
        </p>
      </div>
      <div className="mt-8">
        <ShopCatalog />
      </div>
    </section>
  );

  if (inApp) return <Layout>{content}</Layout>;
  return <MarketingLayout>{content}</MarketingLayout>;
}
