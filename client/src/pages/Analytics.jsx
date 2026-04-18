import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Analytics({ slug: initialSlug }) {
  const [slug, setSlug] = useState(initialSlug || '')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialSlug) fetchAnalytics(initialSlug)
  }, [initialSlug])

  async function fetchAnalytics(s) {
    setError(null)
    setData(null)
    setLoading(true)
    try {
      const res = await axios.get(`/api/analytics/${s}`)
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: -1 }}>
          Analytics
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 15 }}>
          Enter a slug to see its click breakdown.
        </p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <span style={{ padding: '10px 12px', color: 'var(--muted)', fontFamily: 'Space Mono, monospace', fontSize: 13 }}>snip.app/</span>
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && slug && fetchAnalytics(slug)}
            placeholder="slug"
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'Space Mono, monospace', padding: '10px 12px 10px 0' }}
          />
        </div>
        <button
          onClick={() => fetchAnalytics(slug)}
          disabled={loading || !slug}
          style={{
            padding: '10px 20px',
            background: loading || !slug ? 'var(--surface2)' : 'var(--accent)',
            color: loading || !slug ? 'var(--muted)' : '#000',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontWeight: 700,
            fontSize: 13,
            cursor: loading || !slug ? 'not-allowed' : 'pointer',
            fontFamily: 'Space Mono, monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '...' : 'Fetch →'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: 14, fontFamily: 'Space Mono, monospace' }}>
          ✕ {error}
        </div>
      )}

      {data && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
            <StatCard label="Total Clicks" value={data.totalClicks} accent />
            <StatCard label="Slug" value={`/${data.slug}`} mono />
            <StatCard label="Created" value={new Date(data.createdAt).toLocaleDateString()} />
          </div>

          {/* URL */}
          <div style={{ padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 32, fontSize: 13, color: 'var(--muted)', fontFamily: 'Space Mono, monospace', wordBreak: 'break-all' }}>
            → <a href={data.originalUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text)' }}>{data.originalUrl}</a>
          </div>

          {/* Breakdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <BreakdownTable title="Country" rows={data.breakdown.byCountry} labelKey="country" />
            <BreakdownTable title="Device" rows={data.breakdown.byDevice} labelKey="device_type" />
            <BreakdownTable title="Browser" rows={data.breakdown.byBrowser} labelKey="browser" />
            <BreakdownTable title="OS" rows={data.breakdown.byOs} labelKey="os" />
            <BreakdownTable title="Referrer" rows={data.breakdown.byReferrer} labelKey="referrer" wide />
            <BreakdownTable title="By Day" rows={data.breakdown.byDay} labelKey="date" wide />
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent, mono }) {
  return (
    <div style={{
      padding: '16px 20px',
      background: accent ? 'var(--accent-dim)' : 'var(--surface)',
      border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ fontSize: 11, color: accent ? 'var(--accent)' : 'var(--muted)', fontFamily: 'Space Mono, monospace', letterSpacing: 1, marginBottom: 6 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent ? 'var(--accent)' : 'var(--text)', fontFamily: mono ? 'Space Mono, monospace' : 'Syne, sans-serif' }}>{value}</div>
    </div>
  )
}

function BreakdownTable({ title, rows, labelKey, wide }) {
  if (!rows || rows.length === 0) return null
  const total = rows.reduce((s, r) => s + parseInt(r.count), 0)

  return (
    <div style={{
      gridColumn: wide ? 'span 2' : 'span 1',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, fontFamily: 'Space Mono, monospace', letterSpacing: 1, color: 'var(--muted)' }}>
        {title.toUpperCase()}
      </div>
      <div style={{ padding: '8px 0' }}>
        {rows.map((row, i) => {
          const pct = Math.round((parseInt(row.count) / total) * 100)
          return (
            <div key={i} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, fontSize: 13, fontFamily: 'Space Mono, monospace', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row[labelKey] || '—'}
              </div>
              <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 2, flexShrink: 0 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'Space Mono, monospace', width: 24, textAlign: 'right', flexShrink: 0 }}>
                {row.count}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}