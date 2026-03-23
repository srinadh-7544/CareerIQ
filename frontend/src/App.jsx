import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Analyzer from './pages/Analyzer'
import SkillGap from './pages/SkillGap'
import SalaryPredictor from './pages/SalaryPredictor'
import Analytics from './pages/Analytics'
import SmartMatch from './pages/SmartMatch'
import Chatbot from './pages/Chatbot'
import ResumeWriter from './pages/ResumeWriter'

function Protected({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const { isLoggedIn } = useAuth()
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/auth"         element={isLoggedIn ? <Navigate to="/" replace /> : <Auth />} />
        <Route path="/analyzer"     element={<Protected><Analyzer /></Protected>} />
        <Route path="/skillgap"     element={<Protected><SkillGap /></Protected>} />
        <Route path="/salary"       element={<Protected><SalaryPredictor /></Protected>} />
        <Route path="/analytics"    element={<Protected><Analytics /></Protected>} />
        <Route path="/match"        element={<Protected><SmartMatch /></Protected>} />
        <Route path="/chat"         element={<Protected><Chatbot /></Protected>} />
        <Route path="/resume-writer" element={<Protected><ResumeWriter /></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}