import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CANDIDATE',
    companyName: '',
    jobTitle: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (roleName) => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(roleName);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '2.25rem' }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <button
            type="button"
            className={`nav-link ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setError(null); }}
            style={{ fontWeight: 700, fontSize: '1rem' }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`nav-link ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setError(null); }}
            style={{ fontWeight: 700, fontSize: '1rem' }}
          >
            Create Account
          </button>
        </div>

        {/* Instant Demo Logins Section */}
        <div style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            Instant Testing Personas (Pre-seeded DB):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
              onClick={() => handleDemo('CANDIDATE')}
            >
              <User size={13} color="var(--color-cobalt)" /> Candidate (Aarav)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
              onClick={() => handleDemo('REFERRER')}
            >
              <ShieldCheck size={13} color="var(--emerald-success)" /> Referrer (Google)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
              onClick={() => handleDemo('RECRUITER')}
            >
              <Briefcase size={13} color="#7C3AED" /> Recruiter (TechCorp)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
              onClick={() => handleDemo('ADMIN')}
            >
              <Sparkles size={13} color="var(--amber-warning)" /> Platform Admin
            </button>
          </div>
        </div>

        {error && (
          <div 
            role="alert" 
            aria-live="polite"
            style={{ background: 'var(--rose-bg)', border: '1px solid rgba(197, 48, 48, 0.3)', color: 'var(--rose-danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="auth-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="auth-name"
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Maya Chen"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                  <User size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="auth-role">Account Role</label>
                <select
                  id="auth-role"
                  className="select-field"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="CANDIDATE">Candidate (Discover jobs & request referrals)</option>
                  <option value="REFERRER">Corporate Referrer (Review & refer candidates)</option>
                  <option value="RECRUITER">Corporate Recruiter (Post jobs & manage pipeline)</option>
                </select>
              </div>

              {formData.role === 'REFERRER' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="auth-company">Company Name</label>
                  <input
                    id="auth-company"
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Google, Microsoft, Stripe"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              )}
            </>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="auth-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-email"
                type="email"
                className="input-field"
                required
                placeholder={formData.role === 'REFERRER' ? 'yourname@company.com (Corporate domain)' : 'you@example.com'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ paddingLeft: '2.25rem' }}
              />
              <Mail size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="auth-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type="password"
                className="input-field"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ paddingLeft: '2.25rem' }}
              />
              <Lock size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Complete Registration' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
};
