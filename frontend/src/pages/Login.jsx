import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login({ onSwitch }) {
  const { login }               = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ identifier, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || 'Invalid credentials')
        return
      }

      const parts = data.access_token.split('.')
      if (parts.length !== 3) {
        setError('Invalid token received')
        return
      }

      const payload = JSON.parse(atob(parts[1]))
      login(data.access_token, {
        id:    payload.sub,
        name:  payload.name,
        email: payload.email,
        role:  payload.role
      })

    } catch {
      setError('Login failed. Make sure FastAPI is running.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'inherit',
    boxSizing: 'border-box', marginBottom: '12px',
    outline: 'none', transition: 'border-color .15s'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{
        background: '#fff', border: '1.5px solid #e5e7eb',
        borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '400px'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '28px', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Career<span style={{ color: '#1d4ed8' }}>IQ</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', background: '#fef2f2',
            border: '1px solid #fecaca', borderRadius: '8px',
            color: '#dc2626', fontSize: '13px', marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
          Username or email
        </label>
        <input
          placeholder="Enter your username or email"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#1d4ed8'}
          onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
        />

        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
          Password
        </label>
        <input
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#1d4ed8'}
          onBlur={e  => e.target.style.borderColor = '#e5e7eb'}
        />

        <button
          onClick={handleLogin}
          disabled={!identifier || !password || loading}
          style={{
            width: '100%', padding: '12px',
            background: (!identifier || !password || loading) ? '#9ca3af' : '#1d4ed8',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontWeight: 600, fontSize: '15px',
            cursor: (!identifier || !password || loading) ? 'not-allowed' : 'pointer',
            marginBottom: '16px', marginTop: '4px'
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          No account?{' '}
          <span
            onClick={onSwitch}
            style={{ color: '#1d4ed8', cursor: 'pointer', fontWeight: 600 }}
          >
            Create one free
          </span>
        </p>

      </div>
    </div>
  )
}