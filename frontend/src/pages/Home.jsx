import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '📄', title: 'Resume Analyzer',  desc: 'Extract skills from PDF and score against any job description using cosine similarity.',  path: '/analyzer'      },
  { icon: '🎯', title: 'Skill Gap Engine', desc: 'Find missing skills, ranked by market demand with direct links to free learning resources.', path: '/skillgap'      },
  { icon: '💰', title: 'Salary Predictor', desc: 'Predict your salary range using a numpy regression model trained on real market data.',      path: '/salary'        },
  { icon: '📊', title: 'Market Analytics', desc: 'Live dashboard showing salary trends, top skills, and premium skill analysis.',              path: '/analytics'     },
  { icon: '🤝', title: 'Smart Matching',   desc: 'Candidates get ranked jobs. Recruiters get ranked candidates. Both powered by AI.',          path: '/match'         },
  { icon: '🤖', title: 'AI Assistant',     desc: 'Claude-powered career coach for interview prep, career advice, and job search strategy.',    path: '/chat'          },
  { icon: '✍️', title: 'Resume Writer',    desc: 'Claude rewrites your resume with missing keywords and stronger bullet points automatically.', path: '/resume-writer' },
]

export default function Home() {
  const { isLoggedIn, user } = useAuth()

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 2rem' }}>

      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        {isLoggedIn && (
          <div style={{
            display: 'inline-block',
            background: '#eff6ff', color: '#1d4ed8',
            padding: '6px 16px', borderRadius: '20px',
            fontSize: '13px', fontWeight: 600, marginBottom: '20px'
          }}>
            Welcome back, {user?.name}
          </div>
        )}
        <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1px' }}>
          Land your dream job<br/>
          <span style={{ color: '#1d4ed8' }}>with AI-powered insights</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 }}>
          CareerIQ analyzes your resume, predicts your salary, finds skill gaps,
          and matches you with the right jobs — all in one platform.
        </p>
        {isLoggedIn
          ? (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/analyzer" style={{
                padding: '14px 32px', background: '#1d4ed8',
                color: '#fff', borderRadius: '10px',
                fontWeight: 700, fontSize: '16px'
              }}>Analyze my resume</Link>
              <Link to="/chat" style={{
                padding: '14px 32px', background: '#fff',
                color: '#1d4ed8', borderRadius: '10px',
                fontWeight: 700, fontSize: '16px',
                border: '2px solid #1d4ed8'
              }}>Talk to AI Assistant</Link>
            </div>
          )
          : (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/auth" style={{
                padding: '14px 32px', background: '#1d4ed8',
                color: '#fff', borderRadius: '10px',
                fontWeight: 700, fontSize: '16px'
              }}>Get started free</Link>
            </div>
          )
        }
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {FEATURES.map(f => (
          <Link
            key={f.path}
            to={isLoggedIn ? f.path : '/auth'}
            style={{
              background: '#fff',
              border: '1.5px solid #e5e7eb',
              borderRadius: '14px',
              padding: '24px',
              transition: 'all .2s',
              display: 'block'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#1d4ed8'
              e.currentTarget.style.transform   = 'translateY(-2px)'
              e.currentTarget.style.boxShadow   = '0 8px 24px rgba(29,78,216,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.transform   = 'translateY(0)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{f.title}</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: '72px', textAlign: 'center',
        padding: '40px', background: '#fff',
        borderRadius: '16px', border: '1.5px solid #e5e7eb'
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
          Built for Indian IT job seekers
        </h2>
        <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '28px' }}>
          Salary data, skill demand, and job matching optimized for the Indian market
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { value: '30+', label: 'Skills tracked'    },
            { value: '6',   label: 'Job roles covered' },
            { value: 'AI',  label: 'Powered by Claude' },
            { value: '100%', label: 'Free to use'      }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '32px', fontWeight: 800, color: '#1d4ed8', margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0 0' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}