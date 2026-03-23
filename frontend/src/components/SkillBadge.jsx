const colors = {
  programming: { bg: '#ede9fe', text: '#5b21b6' },
  frontend:    { bg: '#dbeafe', text: '#1e40af' },
  backend:     { bg: '#dcfce7', text: '#166534' },
  database:    { bg: '#fef9c3', text: '#854d0e' },
  data:        { bg: '#fce7f3', text: '#9d174d' },
  devops:      { bg: '#fee2e2', text: '#991b1b' },
  tools:       { bg: '#f3f4f6', text: '#374151' },
  cloud:       { bg: '#e0f2fe', text: '#075985' },
}

export default function SkillBadge({ skill, category, type }) {
  const color = colors[category] || colors.tools

  const borderColor = type === 'matched' ? '#16a34a'
                    : type === 'missing'  ? '#dc2626'
                    : 'transparent'

  return (
    <span style={{
      display: 'inline-block',
      background: color.bg,
      color: color.text,
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 500,
      margin: '3px',
      border: `1.5px solid ${borderColor}`
    }}>
      {skill}
    </span>
  )
}