import { useState } from 'react'
import axios from 'axios'

export default function Shorten({ onAnalytics }) {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit() {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await axios.post('/api/shorten', { url, slug: slug || undefined })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Hero text */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: -1,
        }}>
          Shorten.<br />
          <span style={{ color: 'var(--accent)' }}>Track.</span> Share.
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 12, fontSize: 15 }}>
          Paste a long URL and get a clean short link with click analytics.
        </p>
      </div>

      {/* Form */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>
            DESTINATION URL
          </label>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && url && handleSubmit()}
            placeholder="https://example.com/very/long/url"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>
            CUSTOM SLUG <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <span style={{
              padding: '10px 12px',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRight: 'none',
              borderRadius: 'var(--radius) 0 0 var(--radius)',
              color: 'var(--muted)',
              fontFamily: 'Space Mono, monospace',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}>snip.app/</span>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="my-link"
              style={{ ...inputStyle, marginTop: 0, borderRadius: '0 var(--radius) var(--radius) 0', borderLeft: 'none' }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !url}
          style={{
            marginTop: 4,
            padding: '12px 20px',
            background: loading || !url ? 'var(--surface2)' : 'var(--accent)',
            color: loading || !url ? 'var(--muted)' : '#000',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontWeight: 700,
            fontSize: 14,
            cursor: loading || !url ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            letterSpacing: 0.5,
          }}
        >
          {loading ? 'Shortening...' : 'Shorten URL →'}
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: 'rgba(255,77,77,0.08)',
          border: '1px solid rgba(255,77,77,0.2)',
          borderRadius: 'var(--radius)',
          color: 'var(--danger)',
          fontSize: 14,
          fontFamily: 'Space Mono, monospace',
        }}>
          ✕ {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: 20,
          padding: 24,
          background: 'var(--accent-dim)',
          border: '1px solid var(--accent)',
          borderRadius: 10,
          animation: 'fadeIn 0.2s ease',
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>

          <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'Space Mono, monospace', letterSpacing: 1, marginBottom: 8 }}>
            ✓ LINK CREATED
          </div>

          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--accent)',
            marginBottom: 6,
            wordBreak: 'break-all',
          }}>
            <a href={result.shortUrl} target="_blank" rel="noreferrer">{result.shortUrl}</a>
          </div>

          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, wordBreak: 'break-all' }}>
            → {result.originalUrl}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} style={ghostBtn}>
              {copied ? '✓ Copied' : 'Copy link'}
            </button>
            <button onClick={() => onAnalytics(result.slug)} style={ghostBtn}>
              View analytics →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: 8,
  padding: '10px 12px',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Space Mono, monospace',
  transition: 'border-color 0.15s',
}

const ghostBtn = {
  padding: '8px 14px',
  background: 'transparent',
  border: '1px solid var(--accent)',
  color: 'var(--accent)',
  borderRadius: 'var(--radius)',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'Space Mono, monospace',
  transition: 'all 0.15s',
}