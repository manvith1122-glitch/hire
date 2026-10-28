import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Building2,
  Users,
  Compass,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('referhire_remember') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [activeTab, setActivePersonaTab] = useState(null);

  // If already authenticated, redirect to role-specific dashboard
  useEffect(() => {
    if (isAuthenticated && role) {
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        if (role === 'CANDIDATE') navigate('/dashboard', { replace: true });
        else if (role === 'REFERRER') navigate('/referrer-dashboard', { replace: true });
        else if (role === 'RECRUITER') navigate('/recruiter-dashboard', { replace: true });
        else if (role === 'ADMIN') navigate('/admin-dashboard', { replace: true });
        else navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate, location]);

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('referhire_saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your work or personal email address.');
      document.getElementById('login-email')?.focus();
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      document.getElementById('login-password')?.focus();
      return;
    }

    setLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem('referhire_remember', 'true');
        localStorage.setItem('referhire_saved_email', email.trim());
      } else {
        localStorage.removeItem('referhire_remember');
        localStorage.removeItem('referhire_saved_email');
      }

      await login(email.trim(), password);
      // Navigation will trigger via useEffect when isAuthenticated turns true
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoRole) => {
    setActivePersonaTab(demoRole);
    setErrorMsg('');
    if (demoRole === 'CANDIDATE') {
      setEmail('candidate@referhire.com');
      setPassword('password123');
    } else if (demoRole === 'REFERRER') {
      setEmail('referrer@google.com');
      setPassword('password123');
    } else if (demoRole === 'RECRUITER') {
      setEmail('recruiter@techcorp.com');
      setPassword('password123');
    } else if (demoRole === 'ADMIN') {
      setEmail('admin@referhire.com');
      setPassword('password123');
    }
  };

  return (
    <div className="login-editorial-page">
      {/* Top Utility Bar */}
      <header className="login-header-bar" role="banner">
        <Link to="/landing" className="nav-brand" style={{ textDecoration: 'none' }} aria-label="ReferHire Home">
          <div className="nav-brand-mark">RH</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Refer<span style={{ color: 'var(--color-cobalt)' }}>Hire</span>
            </span>
            <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', fontWeight: 600, marginTop: '-2px' }}>
              Verified Referral Network
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} className="hide-on-mobile">
            Explore public directory?
          </span>
          <Link to="/jobs" className="btn btn-secondary" style={{ fontSize: '0.825rem', padding: '0.45rem 0.9rem' }}>
            Browse Opportunities <ArrowUpRight size={14} style={{ marginLeft: '4px' }} />
          </Link>
        </div>
      </header>

      {/* Main Two-Part Composition */}
      <main className="login-composition-grid">
        {/* Left Side: Brand & Product Storytelling */}
        <section className="login-narrative-panel" aria-label="ReferHire Product Story">
          <div className="narrative-content-wrap">
            {/* Editorial Badge */}
            <div className="editorial-eyebrow">
              <span className="eyebrow-dot" />
              <span>THE ADVOCACY ADVANTAGE</span>
            </div>

            <h1 className="narrative-headline">
              Your next opportunity starts with a <em>verified insider</em> conversation.
            </h1>

            <p className="narrative-lead">
              Cold applications encounter silent algorithms. ReferHire connects exceptional candidates 
              directly with verified employees at top technology companies who endorse credentials, 
              provide internal context, and escort resumes straight to hiring managers.
            </p>

            {/* Bespoke SVG / CSS Connection Diagram */}
            <div className="advocacy-matrix-card" aria-label="Referral Path Visualization">
              <div className="matrix-header">
                <span className="matrix-title">HOW VERIFIED REFERRALS WORK</span>
                <span className="matrix-status">
                  <span className="matrix-pulse" /> Live Escrow Protocol
                </span>
              </div>

              <div className="matrix-nodes-row">
                {/* Node 1 */}
                <div className="matrix-node">
                  <div className="node-icon-wrap" style={{ background: 'rgba(37, 84, 215, 0.08)', color: 'var(--color-cobalt)' }}>
                    <Users size={18} />
                  </div>
                  <div className="node-label">Candidate</div>
                  <div className="node-sub">Portfolio & Proof</div>
                </div>

                {/* Connection 1 */}
                <div className="matrix-connector">
                  <div className="connector-line" />
                  <span className="connector-chip">Structured Pitch</span>
                </div>

                {/* Node 2 */}
                <div className="matrix-node active-node">
                  <div className="node-icon-wrap" style={{ background: 'rgba(16, 117, 72, 0.12)', color: 'var(--emerald-success)' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div className="node-label">Verified Insider</div>
                  <div className="node-sub">Corporate Email Auth</div>
                </div>

                {/* Connection 2 */}
                <div className="matrix-connector">
                  <div className="connector-line" />
                  <span className="connector-chip">Direct Referral</span>
                </div>

                {/* Node 3 */}
                <div className="matrix-node">
                  <div className="node-icon-wrap" style={{ background: 'rgba(20, 23, 28, 0.08)', color: 'var(--text-primary)' }}>
                    <Building2 size={18} />
                  </div>
                  <div className="node-label">Hiring Desk</div>
                  <div className="node-sub">Fast-Track Review</div>
                </div>
              </div>

              {/* Three Credibility Pillars */}
              <div className="matrix-pillars">
                <div className="pillar-item">
                  <CheckCircle2 size={15} style={{ color: 'var(--emerald-success)', flexShrink: 0 }} />
                  <div>
                    <strong>100% Corporate Domain Verification</strong>
                    <span>No unverified accounts or third-party recruiters.</span>
                  </div>
                </div>
                <div className="pillar-item">
                  <CheckCircle2 size={15} style={{ color: 'var(--emerald-success)', flexShrink: 0 }} />
                  <div>
                    <strong>High-Signal Structured Pitches</strong>
                    <span>Standardized project benchmarks eliminate spam outreach.</span>
                  </div>
                </div>
                <div className="pillar-item">
                  <CheckCircle2 size={15} style={{ color: 'var(--emerald-success)', flexShrink: 0 }} />
                  <div>
                    <strong>Transparent Pipeline Milestones</strong>
                    <span>Real-time status notifications at every referral review step.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Context Banner */}
            <div className="curated-ecosystem-quote">
              <span className="quote-mark">“</span>
              <p>
                Candidates submitted through employee referrals are <strong>4x more likely</strong> to 
                receive an interview invitation and onboard 55% faster than public board applicants.
              </p>
              <cite>— Industry Recruitment Benchmark Audit</cite>
            </div>
          </div>
        </section>

        {/* Right Side: Editorial Authentication Form */}
        <section className="login-form-panel" aria-labelledby="signin-title">
          <div className="form-content-wrap">
            {/* Form Header */}
            <div className="form-header-block">
              <span className="form-step-tag">SECURE ACCESS</span>
              <h2 id="signin-title" className="form-headline">Welcome back.</h2>
              <p className="form-subtext">
                Enter your credentials to access your referral requests, track active applications, and manage hiring pipelines.
              </p>
            </div>

            {/* Error Summary Banner (Focusable, Accessible WCAG 2.2 AA) */}
            {errorMsg && (
              <div 
                className="auth-error-banner" 
                role="alert" 
                aria-live="polite"
                tabIndex={-1}
              >
                <AlertCircle size={18} style={{ color: 'var(--rose-danger)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--rose-danger)', marginBottom: '2px' }}>
                    Authentication could not proceed
                  </strong>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {errorMsg}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Demo Persona Switcher (Convenient Dev/Evaluation Helper) */}
            <div className="demo-persona-box" aria-label="One-click demo credentials selector">
              <div className="demo-persona-header">
                <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                  One-Click Demo Credentials
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--color-cobalt)', fontWeight: 500 }}>
                  Pre-configured accounts
                </span>
              </div>
              <div className="persona-pills-row" role="group" aria-label="Demo Role Presets">
                <button
                  type="button"
                  className={`persona-pill ${activeTab === 'CANDIDATE' ? 'persona-pill-active' : ''}`}
                  onClick={() => handleQuickFill('CANDIDATE')}
                  title="Candidate: Alex Chen (Software Engineer)"
                >
                  <span className="pill-dot candidate-dot" />
                  Candidate
                </button>
                <button
                  type="button"
                  className={`persona-pill ${activeTab === 'REFERRER' ? 'persona-pill-active' : ''}`}
                  onClick={() => handleQuickFill('REFERRER')}
                  title="Referrer: Priya Sundaram (Google)"
                >
                  <span className="pill-dot referrer-dot" />
                  Referrer
                </button>
                <button
                  type="button"
                  className={`persona-pill ${activeTab === 'RECRUITER' ? 'persona-pill-active' : ''}`}
                  onClick={() => handleQuickFill('RECRUITER')}
                  title="Recruiter: Marcus Vance (TechCorp)"
                >
                  <span className="pill-dot recruiter-dot" />
                  Recruiter
                </button>
                <button
                  type="button"
                  className={`persona-pill ${activeTab === 'ADMIN' ? 'persona-pill-active' : ''}`}
                  onClick={() => handleQuickFill('ADMIN')}
                  title="Platform Administrator"
                >
                  <span className="pill-dot admin-dot" />
                  Admin
                </button>
              </div>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} noValidate className="auth-form-body">
              {/* Email Field */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <label htmlFor="login-email" className="field-label">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Corporate or Personal
                  </span>
                </div>
                <div className="input-with-icon-wrap">
                  <Mail className="field-prefix-icon" size={17} />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="editorial-input"
                    aria-required="true"
                    aria-invalid={!!errorMsg && !email.trim()}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <label htmlFor="login-password" className="field-label">
                    Password <span className="required-star">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="forgot-link-btn"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="input-with-icon-wrap">
                  <Lock className="field-prefix-icon" size={17} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="editorial-input"
                    style={{ paddingRight: '2.75rem' }}
                    aria-required="true"
                    aria-invalid={!!errorMsg && !password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me */}
              <div className="form-options-row">
                <label className="checkbox-label" htmlFor="remember-me-checkbox">
                  <input
                    id="remember-me-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span>Keep me signed in for 30 days</span>
                </label>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary submit-auth-btn"
                aria-busy={loading}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span className="spinner-inline" /> Authenticating credentials...
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Sign in to Account <ArrowRight size={16} />
                  </span>
                )}
              </button>

              {/* Registration Link Footer */}
              <div className="auth-footer-link">
                <span>New to ReferHire?</span>
                <Link to="/register" className="register-now-link">
                  Create an account <ArrowRight size={13} style={{ display: 'inline', marginLeft: '3px' }} />
                </Link>
              </div>

              {/* Security Audit Badge */}
              <div className="security-notice-footer">
                <ShieldCheck size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <span>
                  Encrypted session &bull; Role-gated endpoints &bull; WCAG 2.2 compliant authentication
                </span>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div 
          className="modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="forgot-title"
          onClick={() => setShowForgotPasswordModal(false)}
        >
          <div 
            className="modal-content" 
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--color-cobalt-subtle)', color: 'var(--color-cobalt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={20} />
              </div>
              <div>
                <h3 id="forgot-title" style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Password Recovery
                </h3>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>
                  ReferHire Verified Protocol
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              In compliance with enterprise security requirements, password reset tokens are delivered 
              directly to your verified corporate or registered address. 
            </p>

            <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Quick Recovery During Review
              </div>
              <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                For evaluation accounts, the default password is: <code style={{ background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '3px', fontWeight: 600, color: 'var(--color-cobalt)' }}>password123</code>.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setShowForgotPasswordModal(false)}
                style={{ width: '100%' }}
              >
                Understood, Return to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

