import React from 'react';

export function PageSkeleton() {
  return (
    <div className="page-rise" aria-busy="true" aria-live="polite">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton mt-4 h-10 w-64 max-w-full" />
      <div className="skeleton mt-3 h-4 w-full max-w-lg" />
      <div className="mt-8 grid gap-4 lg:grid-cols-12">
        <div className="skeleton h-56 lg:col-span-4" />
        <div className="skeleton h-56 lg:col-span-8" />
        <div className="skeleton h-24 lg:col-span-3" />
        <div className="skeleton h-24 lg:col-span-3" />
        <div className="skeleton h-24 lg:col-span-3" />
        <div className="skeleton h-24 lg:col-span-3" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="empty-state">
      {icon && <div className="mb-3 flex justify-center text-brand-700 dark:text-brand-300">{icon}</div>}
      <p className="font-display text-xl text-ink-900 dark:text-cream-50">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500 dark:text-cream-100/70">{body}</p>
    </div>
  );
}
