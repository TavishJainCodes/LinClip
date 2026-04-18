import { useState } from 'react'
import Shorten from './pages/Shorten'
import Analytics from './pages/Analytics'
import './style.css'

export default function App() {
  const [page, setPage] = useState('shorten')
  const [analyticsSlug, setAnalyticsSlug] = useState(null)

  function goToAnalytics(slug) {
    setAnalyticsSlug(slug)
    setPage('analytics')
  }

  return (
    <div style={{
      maxWidth: 720,
      margin: '0 auto',
      padding: '48px 24px',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <header style={{ marginBottom: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            onClick={() => setPage('shorten')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{
              background: 'var(--accent)',
              color: '#000',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              fontSize: 13,
              padding: '4px 8px',
              borderRadius: 4,
              letterSpacing: 1,
            }}>SNIP</span>
            <span style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'Space Mono, monospace' }}>
              url shortener
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 4 }}>
            {['shorten', 'analytics'].map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  background: page === p ? 'var(--surface2)' : 'transparent',
                  border: page === p ? '1px solid var(--border)' : '1px solid transparent',
                  color: page === p ? 'var(--text)' : 'var(--muted)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius)',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'Space Mono, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  transition: 'all 0.15s',
                }}
              >
                {p}
              </button>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginTop: 24 }} />
      </header>

      {page === 'shorten' && <Shorten onAnalytics={goToAnalytics} />}
      {page === 'analytics' && <Analytics slug={analyticsSlug} />}
    </div>
  )
}
