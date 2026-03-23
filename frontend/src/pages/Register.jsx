import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Register({ onSwitch }) {
  const { login }             = useAuth()
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'candidate' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleRegister = async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail); return }

      const loginRes  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })
      const loginData = await loginRes.json()
      const payload   = JSON.parse(atob(loginData.access_token.split('.')[1]))
      login(loginData.access_token, {
        id:    payload.sub,
        name:  payload.name,
        email: payload.email,
        role:  payload.role
      })
    } catch {
      setError('Registration failed. Make sure FastAPI is running.')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1px solid #d1d5db', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'inherit',
    boxSizing: 'border-box', marginBottom: '12px'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px' }}>

        <h2 style={{ fontWeight: 700, fontSize: '24px', marginBottom: '8px' }}>Create account</h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>Join CareerIQ — it's free</p>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <input placeholder="Full name" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} style={inputStyle}/>
        <input placeholder="Email address" type="email" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} style={inputStyle}/>
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} style={inputStyle}/>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>I am a</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['candidate', 'recruiter'].map(r => (
              <button
                key={r}
                onClick={() => setForm({...form, role: r})}
                style={{
                  flex: 1, padding: '10px',
                  border: `2px solid ${form.role === r ? '#1d4ed8' : '#e5e7eb'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  background: form.role === r ? '#eff6ff' : '#fff',
                  color:      form.role === r ? '#1d4ed8' : '#6b7280',
                  fontWeight: form.role === r ? 600 : 400,
                  fontSize: '14px', textTransform: 'capitalize'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={!form.name || !form.email || !form.password || loading}
          style={{
            width: '100%', padding: '12px',
            background: (!form.name || !form.email || !form.password || loading) ? '#9ca3af' : '#1d4ed8',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontWeight: 600, fontSize: '15px',
            cursor: (!form.name || !form.email || !form.password || loading) ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Already have an account?{' '}
          <span onClick={onSwitch} style={{ color: '#1d4ed8', cursor: 'pointer', fontWeight: 600 }}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}