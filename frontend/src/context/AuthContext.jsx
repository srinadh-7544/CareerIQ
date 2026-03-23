import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('careeriq_token')
      const savedUser  = localStorage.getItem('careeriq_user')
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch {
      localStorage.removeItem('careeriq_token')
      localStorage.removeItem('careeriq_user')
    } finally {
      setReady(true)
    }
  }, [])

  const login = (tokenData, userData) => {
    localStorage.setItem('careeriq_token', tokenData)
    localStorage.setItem('careeriq_user',  JSON.stringify(userData))
    setToken(tokenData)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('careeriq_token')
    localStorage.removeItem('careeriq_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, token, login, logout,
      isLoggedIn: !!token,
      ready
    }}>
      {ready ? children : null}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

const authFetch = async (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
}