import { useState } from 'react'

function Section({ title, content, color = '#1d4ed8' }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '12px', marginBottom: '12px',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '14px 20px',
          background: 'none', border: 'none',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer',
          borderBottom: open ? '1px solid #e5e7eb' : 'none'
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px', color }}>{title}</span>
        <span style={{ color: '#9ca3af', fontSize: '18px' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{
          padding: '16px 20px', fontSize: '14px',
          lineHeight: 1.7, color: '#374151',
          whiteSpace: 'pre-wrap'
        }}>
          {content}
        </div>
      )}
    </div>
  )
}

function parseResponse(text) {
  const sections = {}
  const patterns = [
    { key: 'summary',  label: 'Improved summary',          color: '#1d4ed8' },
    { key: 'bullets',  label: 'Strengthened bullets',       color: '#059669' },
    { key: 'skills',   label: 'Recommended skills section', color: '#7c3aed' },
    { key: 'analysis', label: 'What changed and why',       color: '#d97706' }
  ]

  const markers = [
    'IMPROVED SUMMARY:',
    'STRENGTHENED BULLETS:',
    'RECOMMENDED SKILLS SECTION:',
    'WHAT CHANGED AND WHY:'
  ]

  let remaining = text
  markers.forEach((marker, i) => {
    const start = remaining.indexOf(marker)
    if (start === -1) return
    const nextMarker = markers.slice(i + 1).map(m => remaining.indexOf(m, start + 1)).filter(n => n > -1)
    const end = nextMarker.length > 0 ? Math.min(...nextMarker) : remaining.length
    sections[patterns[i].key] = {
      content: remaining.slice(start + marker.length, end).trim(),
      label:   patterns[i].label,
      color:   patterns[i].color
    }
  })

  if (Object.keys(sections).length === 0) {
    sections['full'] = { content: text, label: 'AI suggestions', color: '#1d4ed8' }
  }

  return sections
}

export default function ResumeWriter() {
  const [file, setFile]       = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleImprove = async () => {
    if (!file || !jobDesc.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const formData = new FormData()
      formData.append('resume_file',     file)
      formData.append('job_description', jobDesc)
      const res  = await fetch('/api/ai/improve-resume', {
        method: 'POST', body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Check FastAPI is running.')
    } finally { setLoading(false) }
  }

  const sections = result ? parseResponse(result.improved_resume) : {}

  return (
    <div style={{ maxWidth: '860px', margin: '40px auto', padding: '0 2rem' }}>

      <h2 style={{ fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
        AI Resume Writer
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Upload your resume and a job description. Claude will add missing keywords,
        strengthen your bullet points, and make your resume ATS-ready.
      </p>

      <div style={{
        background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: '16px', padding: '28px', marginBottom: '24px'
      }}>
        <label style={{
          display: 'block', border: '2px dashed #d1d5db',
          borderRadius: '12px', padding: '32px',
          textAlign: 'center', cursor: 'pointer',
          background: '#f9fafb', marginBottom: '16px'
        }}>
          <input type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={e => setFile(e.target.files[0])}/>
          {file
            ? <p style={{ color: '#16a34a', fontWeight: 600, margin: 0 }}>✓ {file.name}</p>
            : <div>
                <p style={{ color: '#374151', fontWeight: 500, margin: '0 0 6px' }}>Click to upload resume PDF</p>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Claude will analyze and improve it</p>
              </div>
          }
        </label>

        <textarea
          rows={6}
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px',
            border: '1px solid #d1d5db', borderRadius: '8px',
            fontSize: '14px', fontFamily: 'inherit',
            resize: 'vertical', boxSizing: 'border-box'
          }}
        />
      </div>

      <button
        onClick={handleImprove}
        disabled={!file || !jobDesc.trim() || loading}
        style={{
          width: '100%', padding: '14px',
          background: (!file || !jobDesc.trim() || loading) ? '#9ca3af' : '#1d4ed8',
          color: '#fff', border: 'none', borderRadius: '8px',
          fontWeight: 600, fontSize: '16px',
          cursor: (!file || !jobDesc.trim() || loading) ? 'not-allowed' : 'pointer',
          marginBottom: '24px'
        }}
      >
        {loading ? 'Claude is improving your resume...' : 'Improve my resume with AI'}
      </button>

      {error && (
        <div style={{
          padding: '12px 16px', background: '#fef2f2',
          border: '1px solid #fecaca', borderRadius: '8px',
          color: '#dc2626', fontSize: '14px', marginBottom: '16px'
        }}>{error}</div>
      )}

      {result && (
        <div>
          {/* Score summary */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px', marginBottom: '24px'
          }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px' }}>Original match score</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#d97706', margin: 0 }}>{result.original_score}%</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px' }}>Skills matched</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a', margin: 0 }}>{result.matched_skills.length}</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px' }}>Keywords added</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#1d4ed8', margin: 0 }}>{result.missing_skills.length}</p>
            </div>
          </div>

          {/* Missing skills added */}
          {result.missing_skills.length > 0 && (
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: '12px', padding: '16px', marginBottom: '16px'
            }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', marginBottom: '8px' }}>
                Keywords Claude added to your resume
              </p>
              <div>
                {result.missing_skills.map(s => (
                  <span key={s} style={{
                    display: 'inline-block',
                    background: '#dbeafe', color: '#1e40af',
                    padding: '3px 10px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 500, margin: '3px',
                    border: '1px solid #93c5fd'
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* AI suggestions */}
          <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>AI improvements</h3>
          {Object.values(sections).map((section, i) => (
            <Section key={i} title={section.label} content={section.content} color={section.color}/>
          ))}
        </div>
      )}
    </div>
  )
}