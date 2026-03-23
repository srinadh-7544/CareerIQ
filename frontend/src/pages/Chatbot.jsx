import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const SUGGESTIONS = [
  "How do I prepare for a Python developer interview?",
  "What skills should I learn to become a data scientist?",
  "How do I negotiate my salary?",
  "Review my career path from frontend to full stack",
  "What's the difference between SQL and NoSQL?",
  "How do I write a strong resume summary?"
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      alignItems: 'flex-end',
      gap: '8px'
    }}>
      {!isUser && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#1d4ed8', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, flexShrink: 0
        }}>AI</div>
      )}
      <div style={{
        maxWidth: '72%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#1d4ed8' : '#fff',
        color:      isUser ? '#fff'    : '#1f2937',
        border:     isUser ? 'none'    : '1px solid #e5e7eb',
        fontSize: '14px',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap'
      }}>
        {msg.content}
      </div>
      {isUser && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#e5e7eb', color: '#374151',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, flexShrink: 0
        }}>You</div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '16px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: '#1d4ed8', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: 700
      }}>AI</div>
      <div style={{
        padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
        background: '#fff', border: '1px solid #e5e7eb',
        display: 'flex', gap: '4px', alignItems: 'center'
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#9ca3af',
            animation: 'bounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`
          }}/>
        ))}
      </div>
    </div>
  )
}

export default function Chatbot() {
  const { user }                  = useAuth()
  const [messages, setMessages]   = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! I'm your CareerIQ AI assistant. I can help you with career advice, interview prep, skill recommendations, and job search strategies. What would you like to know?`
    }
  ])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res  = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Make sure the FastAPI server is running.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 2rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontWeight: 700, fontSize: '24px', marginBottom: '4px' }}>AI Career Assistant</h2>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Powered by Claude — ask anything about your career</p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px',
        background: '#f9fafb', borderRadius: '16px',
        border: '1px solid #e5e7eb', marginBottom: '16px'
      }}>
        {messages.map((msg, i) => <Message key={i} msg={msg}/>)}
        {loading && <TypingIndicator/>}
        <div ref={bottomRef}/>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                padding: '6px 12px', background: '#eff6ff',
                border: '1px solid #bfdbfe', borderRadius: '20px',
                fontSize: '12px', color: '#1d4ed8',
                cursor: 'pointer', fontWeight: 500
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <textarea
          rows={2}
          placeholder="Ask about career advice, interview tips, skills to learn..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          style={{
            flex: 1, padding: '12px 16px',
            border: '1px solid #d1d5db', borderRadius: '12px',
            fontSize: '14px', fontFamily: 'inherit',
            resize: 'none', outline: 'none',
            lineHeight: 1.5
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            padding: '12px 20px',
            background: (!input.trim() || loading) ? '#9ca3af' : '#1d4ed8',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontWeight: 600, fontSize: '14px',
            cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
            height: '52px'
          }}
        >
          Send
        </button>
      </div>
      <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
        Press Enter to send · Shift+Enter for new line
      </p>

    </div>
  )
}