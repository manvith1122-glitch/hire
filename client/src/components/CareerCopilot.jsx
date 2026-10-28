import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  ChevronRight, 
  Briefcase, 
  FileText, 
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

export const CareerCopilot = ({ isOpen, onClose, onNavigateToJob }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Welcome to ReferHire Career Copilot.

I am your career co-pilot and referral strategist. I can help benchmark your skills against live engineering requisitions, identify skill gaps, and compose persuasive referral pitches.

Suggested actions:
• "Find jobs that match my skills"
• "Help me write a referral request"
• "What skills should I improve for senior roles?"
• "Prepare me for a technical interview"`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'Find jobs that match my skills',
    'Help me write a referral request',
    'Identify skill gaps in my profile',
    'Prepare me for a recruiter screening'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text || text.trim() === '') return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatCopilot({
        message: text,
        history: messages
      });

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: res.data.response,
            actionableJobs: res.data.actionableJobs,
            provider: res.data.provider
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Unable to process query: ${err.message || 'Please check connection.'}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }} role="dialog" aria-modal="true">
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          height: '100vh',
          maxHeight: '100vh',
          maxWidth: '480px',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: 'var(--bg-surface)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-cobalt)'
            }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Career Copilot</h3>
                <span className="badge badge-candidate" style={{ fontSize: '0.65rem' }}>AI</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Strategic Career & Referral Assistant
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }}
            aria-label="Close copilot"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Feed */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '92%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: m.role === 'user' ? 'var(--text-primary)' : 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: m.role === 'user' ? 'var(--bg-surface)' : 'var(--text-primary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {m.content}
              </div>

              {m.provider && (
                <span className="font-mono" style={{ fontSize: '0.675rem', color: 'var(--text-dim)', alignSelf: 'flex-start', paddingLeft: '0.25rem' }}>
                  Engine: {m.provider}
                </span>
              )}

              {/* Actionable Job Links */}
              {m.actionableJobs && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.45rem' }}>
                  {m.actionableJobs.map((job) => (
                    <button
                      key={job.id}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                      onClick={() => {
                        if (onNavigateToJob) onNavigateToJob(job);
                        onClose();
                      }}
                    >
                      <span>{job.title} ({job.company})</span>
                      <span className="font-mono" style={{ color: 'var(--emerald-success)', fontWeight: 700 }}>
                        {job.matchScore}% Fit <ArrowRight size={11} style={{ display: 'inline' }} />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.825rem'
            }}>
              <Sparkles size={14} color="var(--color-cobalt)" />
              <span>Analyzing requisition database & reasoning...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Carousel */}
        <div style={{
          padding: '0.65rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          background: 'var(--bg-subtle)'
        }}>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.725rem',
                whiteSpace: 'nowrap',
                padding: '0.3rem 0.65rem'
              }}
              onClick={() => handleSend(prompt)}
            >
              <Zap size={10} color="var(--color-cobalt)" /> {prompt}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.5rem',
            background: 'var(--bg-surface)'
          }}
        >
          <label htmlFor="copilot-input" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            Ask Copilot
          </label>
          <input
            id="copilot-input"
            type="text"
            className="input-field"
            placeholder="Ask Copilot about roles, skills, or referrals..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ fontSize: '0.875rem' }}
          />
          <button
            type="submit"
            className="btn btn-cobalt"
            disabled={loading || !input.trim()}
            style={{ padding: '0 1rem' }}
            aria-label="Send query"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
