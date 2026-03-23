import { useState, useEffect } from 'react'

const verdictColor = v =>
  v === 'Strong match'   ? '#16a34a' :
  v === 'Good match'     ? '#059669' :
  v === 'Moderate match' ? '#d97706' : '#dc2626'

const verdictBg = v =>
  v === 'Strong match'   ? '#dcfce7' :
  v === 'Good match'     ? '#d1fae5' :
  v === 'Moderate match' ? '#fef3c7' : '#fef2f2'

function SkillPill({ skill, type }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 500, margin: '2px',
      background: type === 'match' ? '#dcfce7' : '#fef2f2',
      color:      type === 'match' ? '#166534' : '#991b1b',
      border:     `1px solid ${type === 'match' ? '#16a34a' : '#dc2626'}`
    }}>{skill}</span>
  )
}

function JobCard({ job, onViewCandidates }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '12px', padding: '20px', marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ fontWeight: 600, fontSize: '16px', margin: '0 0 4px' }}>{job.title}</h4>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            {job.company} · {job.location} · {job.experience}+ yrs
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 700, color: '#1d4ed8', margin: '0 0 4px', fontSize: '15px' }}>
            ₹{(job.salary_min/100000).toFixed(0)}–{(job.salary_max/100000).toFixed(0)} LPA
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>posted by {job.posted_by}</p>
        </div>
      </div>
      <div style={{ marginTop: '12px' }}>
        {job.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
          <span key={s} style={{
            display: 'inline-block', background: '#ede9fe', color: '#5b21b6',
            padding: '2px 8px', borderRadius: '20px', fontSize: '11px',
            fontWeight: 500, margin: '2px'
          }}>{s}</span>
        ))}
      </div>
      <button
        onClick={() => onViewCandidates(job)}
        style={{
          marginTop: '14px', padding: '8px 16px',
          background: '#1d4ed8', color: '#fff',
          border: 'none', borderRadius: '8px',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer'
        }}
      >
        View ranked candidates
      </button>
    </div>
  )
}

function RankedJobCard({ job }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '12px', padding: '20px', marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ fontWeight: 600, fontSize: '15px', margin: '0 0 4px' }}>{job.title}</h4>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            {job.company} · {job.location} · {job.experience}+ yrs ·
            ₹{(job.salary_min/100000).toFixed(0)}–{(job.salary_max/100000).toFixed(0)} LPA
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: verdictBg(job.verdict), color: verdictColor(job.verdict),
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 600
          }}>{job.verdict}</span>
          <span style={{ fontSize: '22px', fontWeight: 700, color: verdictColor(job.verdict) }}>
            {job.match_score}%
          </span>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
          <div style={{
            width: `${job.match_score}%`, height: '100%',
            background: verdictColor(job.verdict), borderRadius: '3px',
            transition: 'width .6s ease'
          }}/>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        style={{
          marginTop: '10px', background: 'none', border: 'none',
          color: '#1d4ed8', fontSize: '12px', cursor: 'pointer', padding: 0
        }}
      >
        {open ? 'Hide details' : 'Show skill breakdown'}
      </button>

      {open && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Matched: </span>
            {job.matched_skills.map(s => <SkillPill key={s} skill={s} type="match"/>)}
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>Missing: </span>
            {job.missing_skills.length > 0
              ? job.missing_skills.map(s => <SkillPill key={s} skill={s} type="missing"/>)
              : <span style={{ fontSize: '12px', color: '#9ca3af' }}>None</span>
            }
          </div>
        </div>
      )}
    </div>
  )
}

function RankedCandidateCard({ candidate }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '12px', padding: '20px', marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ fontWeight: 600, fontSize: '15px', margin: '0 0 4px' }}>{candidate.name}</h4>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            {candidate.email} · {candidate.experience} yrs experience
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: verdictBg(candidate.verdict), color: verdictColor(candidate.verdict),
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 600
          }}>{candidate.verdict}</span>
          <span style={{ fontSize: '22px', fontWeight: 700, color: verdictColor(candidate.verdict) }}>
            {candidate.match_score}%
          </span>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
          <div style={{
            width: `${candidate.match_score}%`, height: '100%',
            background: verdictColor(candidate.verdict), borderRadius: '3px',
            transition: 'width .6s ease'
          }}/>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        style={{
          marginTop: '10px', background: 'none', border: 'none',
          color: '#1d4ed8', fontSize: '12px', cursor: 'pointer', padding: 0
        }}
      >
        {open ? 'Hide details' : 'Show skill breakdown'}
      </button>

      {open && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Matched: </span>
            {candidate.matched_skills.map(s => <SkillPill key={s} skill={s} type="match"/>)}
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>Missing: </span>
            {candidate.missing_skills.length > 0
              ? candidate.missing_skills.map(s => <SkillPill key={s} skill={s} type="missing"/>)
              : <span style={{ fontSize: '12px', color: '#9ca3af' }}>None</span>
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default function SmartMatch() {
  const [view, setView]               = useState('candidate') // 'candidate' | 'recruiter'
  const [jobs, setJobs]               = useState([])
  const [rankedJobs, setRankedJobs]   = useState([])
  const [rankedCandidates, setRankedCandidates] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [candidateId, setCandidateId] = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [success, setSuccess]         = useState(null)

  const [jobForm, setJobForm] = useState({
    title: '', company: '', location: '', description: '',
    skills: '', experience: 2, salary_min: 500000,
    salary_max: 1000000, posted_by: ''
  })

  const [candidateForm, setCandidateForm] = useState({
    name: '', email: '', experience: 1
  })
  const [resumeFile, setResumeFile] = useState(null)

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    try {
      const res  = await fetch('/api/matching/jobs')
      const data = await res.json()
      setJobs(data)
    } catch {}
  }

  const handlePostJob = async () => {
    setLoading(true); setError(null); setSuccess(null)
    try {
      const res  = await fetch('/api/matching/jobs/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm)
      })
      const data = await res.json()
      setSuccess(`Job "${data.title}" posted successfully! Job ID: ${data.job_id}`)
      setJobForm({ title: '', company: '', location: '', description: '',
        skills: '', experience: 2, salary_min: 500000, salary_max: 1000000, posted_by: '' })
      fetchJobs()
    } catch {
      setError('Failed to post job.')
    } finally { setLoading(false) }
  }

  const handleRegisterCandidate = async () => {
    if (!resumeFile) { setError('Please upload a resume PDF'); return }
    setLoading(true); setError(null); setSuccess(null)
    try {
      const formData = new FormData()
      formData.append('name',        candidateForm.name)
      formData.append('email',       candidateForm.email)
      formData.append('experience',  candidateForm.experience)
      formData.append('resume_file', resumeFile)

      const res  = await fetch('/api/matching/candidates/register', {
        method: 'POST', body: formData
      })
      const data = await res.json()
      setCandidateId(data.candidate_id)
      setSuccess(`Registered successfully! Found ${data.skill_count} skills. Fetching job matches...`)

      const jobRes  = await fetch(`/api/matching/candidates/${data.candidate_id}/jobs`)
      const jobData = await jobRes.json()
      setRankedJobs(jobData.ranked_jobs || [])
    } catch {
      setError('Registration failed. Make sure FastAPI is running.')
    } finally { setLoading(false) }
  }

  const handleViewCandidates = async (job) => {
    setSelectedJob(job)
    setLoading(true)
    try {
      const res  = await fetch(`/api/matching/jobs/${job.id}/candidates`)
      const data = await res.json()
      setRankedCandidates(data.ranked_candidates || [])
    } catch {
      setError('Failed to load candidates.')
    } finally { setLoading(false) }
  }

  const tabStyle = (active) => ({
    padding: '10px 28px', border: 'none', cursor: 'pointer',
    fontWeight: 600, fontSize: '14px', borderRadius: '8px',
    background: active ? '#1d4ed8' : '#f3f4f6',
    color:      active ? '#fff'    : '#6b7280',
    transition: 'all .15s'
  })

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #d1d5db', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'inherit',
    boxSizing: 'border-box', marginBottom: '12px'
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 2rem' }}>

      <h2 style={{ fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>Smart Matching</h2>
      <p style={{ color: '#6b7280', marginBottom: '28px' }}>
        Candidates get ranked job listings. Recruiters get ranked candidates. Powered by cosine similarity.
      </p>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        <button style={tabStyle(view === 'candidate')} onClick={() => { setView('candidate'); setError(null); setSuccess(null) }}>
          Candidate view
        </button>
        <button style={tabStyle(view === 'recruiter')} onClick={() => { setView('recruiter'); setError(null); setSuccess(null) }}>
          Recruiter view
        </button>
      </div>

      {error   && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontSize: '14px', marginBottom: '16px' }}>{success}</div>}

      {/* ── CANDIDATE VIEW ── */}
      {view === 'candidate' && (
        <div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>Register as candidate</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                placeholder="Full name"
                value={candidateForm.name}
                onChange={e => setCandidateForm({...candidateForm, name: e.target.value})}
                style={inputStyle}
              />
              <input
                placeholder="Email address"
                value={candidateForm.email}
                onChange={e => setCandidateForm({...candidateForm, email: e.target.value})}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Experience — {candidateForm.experience} {candidateForm.experience === 1 ? 'year' : 'years'}
              </label>
              <input
                type="range" min="0" max="15" step="1"
                value={candidateForm.experience}
                onChange={e => setCandidateForm({...candidateForm, experience: Number(e.target.value)})}
                style={{ width: '100%' }}
              />
            </div>

            <label style={{
              display: 'block', border: '2px dashed #d1d5db',
              borderRadius: '10px', padding: '24px',
              textAlign: 'center', cursor: 'pointer',
              background: '#f9fafb', marginBottom: '16px'
            }}>
              <input type="file" accept=".pdf" style={{ display: 'none' }}
                onChange={e => setResumeFile(e.target.files[0])} />
              {resumeFile
                ? <p style={{ color: '#16a34a', fontWeight: 600, margin: 0 }}>✓ {resumeFile.name}</p>
                : <p style={{ color: '#6b7280', margin: 0 }}>Click to upload resume PDF</p>
              }
            </label>

            <button
              onClick={handleRegisterCandidate}
              disabled={!candidateForm.name || !candidateForm.email || !resumeFile || loading}
              style={{
                width: '100%', padding: '12px',
                background: (!candidateForm.name || !candidateForm.email || !resumeFile || loading) ? '#9ca3af' : '#1d4ed8',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontWeight: 600, fontSize: '15px',
                cursor: (!candidateForm.name || !candidateForm.email || !resumeFile || loading) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Registering...' : 'Register and find matching jobs'}
            </button>
          </div>

          {rankedJobs.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>
                Your job matches — ranked by fit
              </h3>
              {rankedJobs.map(job => <RankedJobCard key={job.job_id} job={job}/>)}
            </div>
          )}
        </div>
      )}

      {/* ── RECRUITER VIEW ── */}
      {view === 'recruiter' && (
        <div>
          {/* Post job form */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>Post a job</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Job title" value={jobForm.title}
                onChange={e => setJobForm({...jobForm, title: e.target.value})} style={inputStyle}/>
              <input placeholder="Company name" value={jobForm.company}
                onChange={e => setJobForm({...jobForm, company: e.target.value})} style={inputStyle}/>
              <input placeholder="Location" value={jobForm.location}
                onChange={e => setJobForm({...jobForm, location: e.target.value})} style={inputStyle}/>
              <input placeholder="Your name / email" value={jobForm.posted_by}
                onChange={e => setJobForm({...jobForm, posted_by: e.target.value})} style={inputStyle}/>
              <input placeholder="Min salary (₹)" type="number" value={jobForm.salary_min}
                onChange={e => setJobForm({...jobForm, salary_min: Number(e.target.value)})} style={inputStyle}/>
              <input placeholder="Max salary (₹)" type="number" value={jobForm.salary_max}
                onChange={e => setJobForm({...jobForm, salary_max: Number(e.target.value)})} style={inputStyle}/>
            </div>

            <input
              placeholder="Required skills (comma separated, e.g. python, react, postgresql)"
              value={jobForm.skills}
              onChange={e => setJobForm({...jobForm, skills: e.target.value})}
              style={inputStyle}
            />

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Min experience required — {jobForm.experience} {jobForm.experience === 1 ? 'year' : 'years'}
              </label>
              <input type="range" min="0" max="15" step="1"
                value={jobForm.experience}
                onChange={e => setJobForm({...jobForm, experience: Number(e.target.value)})}
                style={{ width: '100%' }}/>
            </div>

            <textarea
              rows={4} placeholder="Job description..."
              value={jobForm.description}
              onChange={e => setJobForm({...jobForm, description: e.target.value})}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            <button
              onClick={handlePostJob}
              disabled={!jobForm.title || !jobForm.company || !jobForm.skills || loading}
              style={{
                width: '100%', padding: '12px',
                background: (!jobForm.title || !jobForm.company || !jobForm.skills || loading) ? '#9ca3af' : '#1d4ed8',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontWeight: 600, fontSize: '15px',
                cursor: (!jobForm.title || !jobForm.company || !jobForm.skills || loading) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Posting...' : 'Post job'}
            </button>
          </div>

          {/* All posted jobs */}
          {jobs.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: '16px' }}>
                All posted jobs ({jobs.length})
              </h3>
              {jobs.map(job => (
                <JobCard key={job.id} job={job} onViewCandidates={handleViewCandidates}/>
              ))}
            </div>
          )}

          {/* Ranked candidates for selected job */}
          {selectedJob && (
            <div style={{ marginTop: '28px' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                Candidates ranked for: {selectedJob.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
                {rankedCandidates.length} candidate{rankedCandidates.length !== 1 ? 's' : ''} in database
              </p>
              {loading
                ? <p style={{ color: '#6b7280' }}>Ranking candidates...</p>
                : rankedCandidates.length > 0
                  ? rankedCandidates.map(c => <RankedCandidateCard key={c.candidate_id} candidate={c}/>)
                  : <p style={{ color: '#9ca3af', fontSize: '14px' }}>No candidates registered yet. Ask candidates to sign up!</p>
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}