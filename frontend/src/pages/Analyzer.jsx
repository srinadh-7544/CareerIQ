import { useState } from 'react'

export default function Analyzer() {
  const [file, setFile]       = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleAnalyze = async () => {
    if (!file || !jobDesc.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('resume_file', file)
      formData.append('job_description', jobDesc)
      const response = await fetch('/api/resume/match', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Something went wrong. Make sure FastAPI is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result
    ? result.match_score >= 70 ? '#16a34a'
    : result.match_score >= 40 ? '#d97706'
    : '#dc2626'
    : '#1d4ed8'

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 2rem' }}>

      <h2 style={{ fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
        Resume Analyzer
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Upload your PDF resume and paste a job description to get your match score.
      </p>

      <label style={{
        display: 'block',
        border: '2px dashed #d1d5db',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
        background: '#fff',
        marginBottom: '20px'
      }}>
        <input
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={e => setFile(e.target.files[0])}
        />
        {file
          ? <p style={{ fontWeight: 600, color: '#16a34a', margin: 0 }}>✓ {file.name}</p>
          : <div>
              <p style={{ color: '#374151', fontWeight: 500, marginBottom: '6px' }}>
                Click to upload your resume PDF
              </p>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
                Only PDF files are supported
              </p>
            </div>
        }
      </label>

      <textarea
        rows={6}
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical',
          marginBottom: '16px',
          boxSizing: 'border-box'
        }}
      />

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
          fontSize: '16px',
          cursor: (!file || !jobDesc.trim() || loading) ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '40px' }}>

          <div style={{
            background: '#fff',
            border: `2px solid ${scoreColor}`,
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Match score</p>
            <p style={{ fontSize: '72px', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
              {result.match_score}%
            </p>
            <span style={{
              display: 'inline-block',
              marginTop: '12px',
              padding: '4px 16px',
              background: scoreColor + '20',
              color: scoreColor,
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              {result.verdict}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ fontWeight: 600, marginBottom: '12px', color: '#16a34a' }}>
                Matched skills ({result.matched_skills.length})
              </h4>
              {result.matched_skills.length > 0
                ? result.matched_skills.map(s => (
                    <span key={s} style={{
                      display: 'inline-block',
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      margin: '3px',
                      border: '1.5px solid #16a34a'
                    }}>{s}</span>
                  ))
                : <p style={{ fontSize: '13px', color: '#9ca3af' }}>No matches found</p>
              }
            </div>

            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ fontWeight: 600, marginBottom: '12px', color: '#dc2626' }}>
                Missing skills ({result.missing_skills.length})
              </h4>
              {result.missing_skills.length > 0
                ? result.missing_skills.map(s => (
                    <span key={s} style={{
                      display: 'inline-block',
                      background: '#fef2f2',
                      color: '#991b1b',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      margin: '3px',
                      border: '1.5px solid #dc2626'
                    }}>{s}</span>
                  ))
                : <p style={{ fontSize: '13px', color: '#9ca3af' }}>No missing skills</p>
              }
            </div>
          </div>

        </div>
      )}
    </div>
  )
}