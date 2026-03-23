import { useState } from 'react'

export default function SkillGap() {
  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!file || !jobDesc.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('resume_file', file)
      formData.append('job_description', jobDesc)

      const response = await fetch('/api/skillgap/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Something went wrong. Make sure FastAPI is running.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result
    ? result.readiness_score >= 70
      ? '#16a34a'
      : result.readiness_score >= 40
      ? '#d97706'
      : '#dc2626'
    : '#1d4ed8'

  const priorityColor = (rank) =>
    rank <= 3 ? '#dc2626' : rank <= 6 ? '#d97706' : '#16a34a'

  return (
    <div style={{ maxWidth: '860px', margin: '40px auto', padding: '0 2rem' }}>

      <h2 style={{ fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
        Skill Gap Engine
      </h2>

      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Upload your resume and a job description. Get a ranked learning plan.
      </p>

      {/* File Upload */}
      <label style={{
        display: 'block',
        border: '2px dashed #d1d5db',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        cursor: 'pointer',
        background: '#fff',
        marginBottom: '16px'
      }}>
        <input
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file ? (
          <p style={{ color: '#16a34a', fontWeight: 600, margin: 0 }}>
            ✓ {file.name}
          </p>
        ) : (
          <p style={{ color: '#6b7280', margin: 0 }}>
            Click to upload resume PDF
          </p>
        )}
      </label>

      {/* Job Description */}
      <textarea
        rows={5}
        placeholder="Paste job description here..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '16px'
        }}
      />

      {/* Button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || !jobDesc.trim() || loading}
        style={{
          width: '100%',
          padding: '14px',
          background: (!file || !jobDesc.trim() || loading) ? '#9ca3af' : '#1d4ed8',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: (!file || !jobDesc.trim() || loading) ? 'not-allowed' : 'pointer',
          marginBottom: '16px'
        }}
      >
        {loading ? 'Analyzing...' : 'Generate Learning Plan'}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px',
          background: '#fef2f2',
          color: '#dc2626',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: '40px' }}>

          {/* Score Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {[
              { label: 'Readiness', value: result.readiness_score + '%', color: scoreColor },
              { label: 'Match score', value: result.match_score + '%', color: '#1d4ed8' },
              { label: 'Skills you have', value: result.summary.skills_you_have, color: '#16a34a' },
              { label: 'Skills to learn', value: result.summary.skills_to_learn, color: '#dc2626' },
            ].map(card => (
              <div key={card.label} style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{card.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Learning Table */}
          {result.learning_path?.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Priority', 'Skill', 'Category', 'Hours', 'Resource'].map(h => (
                    <th key={h} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.learning_path.map(item => (
                  <tr key={item.skill}>
                    <td style={{ padding: '10px' }}>{item.priority_rank}</td>
                    <td style={{ padding: '10px' }}>{item.skill}</td>
                    <td style={{ padding: '10px' }}>{item.category}</td>
                    <td style={{ padding: '10px' }}>{item.hours_to_learn}h</td>
                    <td style={{ padding: '10px' }}>
                      <a
                        href={item.resource_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#1d4ed8' }}
                      >
                        {item.free_resource} →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Matched Skills */}
          {result.matched_skills?.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ color: '#16a34a' }}>
                Skills you already have ({result.matched_skills.length})
              </h4>
              {result.matched_skills.map(skill => (
                <span key={skill} style={{
                  display: 'inline-block',
                  margin: '4px',
                  padding: '4px 10px',
                  background: '#dcfce7',
                  borderRadius: '20px'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}