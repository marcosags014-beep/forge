export function ArticleJsonLd({ title, description, url, datePublished }: {
  title: string
  description: string
  url: string
  datePublished?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    author: { '@type': 'Organization', name: 'FORGE' },
    publisher: {
      '@type': 'Organization',
      name: 'FORGE',
      url: 'https://forge-five-flax.vercel.app',
    },
    datePublished: datePublished ?? '2026-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function SoftwareJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FORGE',
    description: 'One dashboard for health, body, money, and goals. AI tells you what to focus on today.',
    url: 'https://forge-five-flax.vercel.app',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS (PWA), Android (PWA)',
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'EUR', name: 'Free' },
      { '@type': 'Offer', price: '9.99', priceCurrency: 'EUR', name: 'Pro', billingDuration: 'P1M' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
