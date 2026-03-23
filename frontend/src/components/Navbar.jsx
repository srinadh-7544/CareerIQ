import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { path: '/analyzer',      label: 'Resume Analyzer' },
  { path: '/skillgap',      label: 'Skill Gap'       },
  { path: '/salary',        label: 'Salary'          },
  { path: '/analytics',     label: 'Analytics'       },
  { path: '/match',         label: 'Smart Match'     },
  { path: '/chat',          label: 'AI Assistant'    },
  { path: '/resume-writer', label: 'Resume Writer'   },
]

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/auth'), 50 }

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1.5px solid #e5e7eb',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>

      <Link to="/" style={{
        fontWeight: 800, fontSize: '20px',
        color: '#1d4ed8', letterSpacing: '-0.5px'
      }}>
        Career<span style={{ color: '#1f2937' }}>IQ</span>
      </Link>

      {isLoggedIn ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: location.pathname === link.path ? 600 : 400,
                color:      location.pathname === link.path ? '#1d4ed8' : '#6b7280',
                background: location.pathname === link.path ? '#eff6ff' : 'transparent',
                transition: 'all .15s'
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 8px' }}/>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              color: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '13px', fontWeight: 700
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', lineHeight: 1.2 }}>
                {user?.name}
              </span>
              <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px', background: 'none',
                border: '1.5px solid #e5e7eb', borderRadius: '6px',
                fontSize: '12px', color: '#6b7280', fontWeight: 500
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/auth" style={{
            padding: '8px 20px', background: '#1d4ed8',
            color: '#fff', borderRadius: '8px',
            fontWeight: 600, fontSize: '14px'
          }}>
            Sign in
          </Link>
        </div>
      )}
    </nav>
  )
}