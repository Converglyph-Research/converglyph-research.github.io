import React from 'react';
import Link from 'next/link';
import { ClientNavbarWrapper } from '@/components/layout/ClientNavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { fetchArticlesApi } from '@/lib/api';

export async function generateStaticParams() {
  const enArticles = await fetchArticlesApi('en').catch(() => []);
  const slugs = enArticles.map(a => ({ slug: a.slug }));
  return slugs.length > 0 ? slugs : [
    { slug: 'western-astrodienst-ephemeris' },
    { slug: 'bazi-four-pillars-lst' },
    { slug: 'tu-vi-dau-so-classical-matrix' },
    { slug: 'pythagorean-numerology-reductions' },
    { slug: 'iching-divination-archetypes' },
    { slug: 'prospective-prediction-ledger-brier' }
  ];
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const articles = await fetchArticlesApi('en').catch(() => []);
  const article = articles.find(a => a.slug === params.slug) || {
    title: params.slug.replace(/-/g, ' ').toUpperCase(),
    category: "Research Monograph",
    read_time: "6 min read",
    date: "October 2026",
    content: "Detailed methodology monograph under active peer development."
  };

  return (
    <>
      <PrototypeNotice />
      <ClientNavbarWrapper />

      <main className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Link href="/research" style={{ color: 'var(--celestial-gold)', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Return to Research Overview
            </Link>
          </div>

          <article className="matrix-editorial-card" style={{ padding: '3rem 2.5rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
              <span className="status-chip confirmed">{article.category}</span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--moon-ivory)', marginTop: '0.65rem', marginBottom: '0.5rem', lineHeight: 1.15 }}>
                {article.title}
              </h1>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {article.read_time} • {article.date} • Converglyph Research
              </div>
            </div>

            <div style={{ fontSize: '0.95rem', color: 'var(--moon-ivory)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {article.content}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
