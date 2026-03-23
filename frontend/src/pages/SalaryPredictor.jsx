import { useState } from 'react'

const ROLES = [
  'backend developer',
  'frontend developer',
  'full stack developer',
  'data scientist',
  'ml engineer',
  'devops engineer'
]

const LOCATIONS = [
  'Bangalore', 'Mumbai', 'Delhi',
  'Hyderabad', 'Pune', 'Chennai',
  'Kolkata', 'Other'
]

const ALL_SKILLS = [
  'python', 'javascript', 'typescript', 'java', 'react',
  'node.js', 'fastapi', 'django', 'postgresql', 'mysql',
  'mongodb', 'sql', 'pandas', 'numpy', 'machine learning',
  'scikit-learn', 'tensorflow', 'docker', 'git', 'aws',
  'azure', 'linux', 'rest api', 'html', 'css'
]

export default function SalaryPredictor() {
  const [role, setRole]           = useState('full stack developer')
  const [experience, setExperience] = useState(2)
  const [location, setLocation]   = useState('Bangalore')
  const [skills, setSkills]       = useState([])
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const toggleSkill = (skill) => {
    setSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch('/api/salary/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, experience, location, skills })
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Something went wrong. Make sure FastAPI is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '860px', margin: '40px auto', padding: '0 2rem' }}>

      <h2 style={{ fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
        Salary Predictor
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Enter your profile and get a salary estimate based on role, experience,
        location, and skills — powered by a numpy linear regression model.
      </p>

      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px'
      }}>

        {/* Role + Location row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Job role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px',
                border: '1px solid #d1d5db', borderRadius: '8px',
                fontSize: '14px', fontFamily: 'inherit'
              }}
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Location
            </label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px',
                border: '1px solid #d1d5db', borderRadius: '8px',
                fontSize: '14px', fontFamily: 'inherit'
              }}
            >
              {LOCATIONS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience slider */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>
            Experience — {experience} {experience === 1 ? 'year' : 'years'}
          </label>
          <input
            type="range"
            min="0" max="15" step="1"
            value={experience}
            onChange={e => setExperience(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
            <span>Fresher</span>
            <span>5 yrs</span>
            <span>10 yrs</span>
            <span>15 yrs</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>
            Your skills — {skills.length} selected
          </label>
          <div>
            {ALL_SKILLS.map(skill => (
              <span
                key={skill}
                onClick={() => toggleSkill(skill)}
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  margin: '3px',
                  cursor: 'pointer',
                  border: '1.5px solid',
                  background:   skills.includes(skill) ? '#dbeafe' : '#f9fafb',
                  color:        skills.includes(skill) ? '#1e40af' : '#6b7280',
                  borderColor:  skills.includes(skill) ? '#1d4ed8' : '#e5e7eb',
                  transition: 'all .15s'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: loading ? '#9ca3af' : '#1d4ed8',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '24px'
        }}
      >
        {loading ? 'Predicting...' : 'Predict My Salary'}
      </button>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '14px',
          marginBottom: '16px'
        }}>{error}</div>
      )}

      {result && (
        <div style={{ marginTop: '8px' }}>

          {/* Main salary card */}
          <div style={{
            background: '#fff',
            border: '2px solid #1d4ed8',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Estimated salary</p>
            <p style={{ fontSize: '52px', fontWeight: 700, color: '#1d4ed8', lineHeight: 1, margin: 0 }}>
              {result.formatted.mid}
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
              Range: {result.formatted.lower} — {result.formatted.upper}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Role: <strong style={{ color: '#374151' }}>{result.role}</strong>
              </span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Location: <strong style={{ color: '#374151' }}>{result.location}</strong>
              </span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Model R²: <strong style={{ color: '#374151' }}>{result.model_r2}</strong>
              </span>
            </div>
          </div>

          {/* Salary range bar */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
              Salary range
            </p>
            <div style={{ position: 'relative', height: '12px', background: '#e5e7eb', borderRadius: '6px' }}>
              <div style={{
                position: 'absolute',
                left: '10%', right: '10%',
                height: '100%',
                background: 'linear-gradient(90deg, #bfdbfe, #1d4ed8)',
                borderRadius: '6px'
              }}/>
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: '-4px',
                width: '20px', height: '20px',
                background: '#1d4ed8',
                borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 0 0 2px #1d4ed8'
              }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
              <span>{result.formatted.lower}</span>
              <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{result.formatted.mid}</span>
              <span>{result.formatted.upper}</span>
            </div>
          </div>

          {/* Insights */}
          {result.insights.length > 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                How to earn more
              </h4>
              {result.insights.map((insight, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 0',
                  borderBottom: i < result.insights.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <span style={{
                    width: '20px', height: '20px',
                    background: '#dbeafe', color: '#1e40af',
                    borderRadius: '50%', fontSize: '11px',
                    fontWeight: 700, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px'
                  }}>{i + 1}</span>
                  <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{insight}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}