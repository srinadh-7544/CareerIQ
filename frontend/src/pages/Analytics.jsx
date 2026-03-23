import { useState, useEffect } from 'react'

const CATEGORY_COLORS = {
  programming: '#1d4ed8',
  frontend:    '#7c3aed',
  backend:     '#059669',
  database:    '#d97706',
  data:        '#dc2626',
  devops:      '#0891b2',
  tools:       '#6b7280',
  cloud:       '#0284c7'
}

function BarChart({ data, valueKey, labelKey, color = '#1d4ed8', unit = '' }) {
  const max = Math.max(...data.map(d => d[valueKey]))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '160px', fontSize: '12px',
            color: '#374151', textAlign: 'right',
            flexShrink: 0, textTransform: 'capitalize'
          }}>
            {item[labelKey]}
          </div>
          <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '4px', height: '28px', position: 'relative' }}>
            <div style={{
              width: `${(item[valueKey] / max) * 100}%`,
              height: '100%',
              background: color,
              borderRadius: '4px',
              transition: 'width .6s ease',
              display: 'flex', alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '8px',
              minWidth: '40px'
            }}>
              <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>
                {item[valueKey]}{unit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data, labelKey, valueKey }) {
  const total = data.reduce((s, d) => s + d[valueKey], 0)
  let cumulative = 0
  const colors = Object.values(CATEGORY_COLORS)

  const slices = data.map((item, i) => {
    const pct   = item[valueKey] / total
    const start = cumulative
    cumulative += pct
    const startAngle = start * 2 * Math.PI - Math.PI / 2
    const endAngle   = cumulative * 2 * Math.PI - Math.PI / 2
    const r = 80, cx = 100, cy = 100
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const large = pct > 0.5 ? 1 : 0
    return {
      path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`,
      color: colors[i % colors.length],
      label: item[labelKey],
      value: item[valueKey],
      pct: Math.round(pct * 100)
    }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 200 200" width="180" height="180">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2"/>
        ))}
        <circle cx="100" cy="100" r="50" fill="#fff"/>
        <text x="100" y="96" textAnchor="middle" fontSize="14" fontWeight="700" fill="#374151">{total}</text>
        <text x="100" y="112" textAnchor="middle" fontSize="10" fill="#6b7280">skills</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: s.color, flexShrink: 0 }}/>
            <span style={{ color: '#374151', textTransform: 'capitalize' }}>{s.label}</span>
            <span style={{ color: '#9ca3af', marginLeft: 'auto' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color = '#1d4ed8' }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '12px', padding: '20px', textAlign: 'center'
    }}>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', textTransform: 'capitalize' }}>{label}</p>
      <p style={{ fontSize: '26px', fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '16px', padding: '24px', marginBottom: '20px'
    }}>
      <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '20px', color: '#111827' }}>{title}</h3>
      {children}
    </div>
  )
}

export default function Analytics() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    fetch('/api/analytics/market')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load analytics. Make sure FastAPI is running.'); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
      Loading market analytics...
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '20px', background: '#fef2f2', borderRadius: '12px', color: '#dc2626' }}>
      {error}
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 2rem' }}>

      <h2 style={{ fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
        Job Market Analytics
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Real-time insights from market data — salary trends, skill demand, and premium skills.
      </p>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <StatCard label="Avg market salary"    value={`₹${data.summary.avg_market_salary} LPA`} color="#1d4ed8"/>
        <StatCard label="Total roles tracked"  value={data.summary.total_roles}  color="#7c3aed"/>
        <StatCard label="Skills in database"   value={data.summary.total_skills} color="#059669"/>
        <StatCard label="Most demanded skill"  value={data.summary.most_demanded_skill} color="#d97706"/>
      </div>

      {/* Salary by role */}
      <Card title="Average salary by role (LPA)">
        <BarChart
          data={data.avg_salary_by_role}
          labelKey="role"
          valueKey="avg_salary_lpa"
          color="#1d4ed8"
          unit=" L"
        />
      </Card>

      {/* Top skills by demand */}
      <Card title="Top 10 skills by market demand">
        <BarChart
          data={data.top_skills_by_demand}
          labelKey="skill"
          valueKey="demand_score"
          color="#7c3aed"
        />
      </Card>

      {/* Salary growth + Skills by category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        <Card title="Skills by category">
          <DonutChart
            data={data.skills_by_category}
            labelKey="category"
            valueKey="count"
          />
        </Card>

        <Card title="Avg learning hours by category">
          <BarChart
            data={data.avg_hours_by_category}
            labelKey="category"
            valueKey="avg_hours"
            color="#059669"
            unit="h"
          />
        </Card>

      </div>

      {/* Skill premium */}
      <Card title="Salary premium for key skills">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.skill_premium.map(item => (
            <div key={item.skill} style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px', background: '#f9fafb',
              borderRadius: '10px', flexWrap: 'wrap', gap: '12px'
            }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>{item.skill}</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>
                  With: ₹{item.with_skill} LPA &nbsp;|&nbsp; Without: ₹{item.without} LPA
                </p>
              </div>
              <span style={{
                background: '#dcfce7', color: '#166534',
                padding: '4px 14px', borderRadius: '20px',
                fontSize: '14px', fontWeight: 700
              }}>
                +{item.premium_pct}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Salary by experience */}
      <Card title="Salary growth by experience (LPA)">
        <BarChart
          data={data.salary_by_experience}
          labelKey="experience_years"
          valueKey="avg_salary_lpa"
          color="#d97706"
          unit=" L"
        />
      </Card>

    </div>
  )
}