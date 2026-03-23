import { useState } from 'react'
import Login from './Login'
import Register from './Register'

export default function Auth() {
  const [mode, setMode] = useState('login')
  return mode === 'login'
    ? <Login    onSwitch={() => setMode('register')} />
    : <Register onSwitch={() => setMode('login')} />
}