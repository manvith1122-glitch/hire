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
  User, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Layers,
  ArrowUpRight,
  Compass
} from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, role } = useAuth();

  // Role: CANDIDATE | REFERRER | RECRUITER
  const [selectedRole, setSelectedRole] = useState('CANDIDATE');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Candidate specific
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState('2');
  
  // Referrer specific
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  
  // Recruiter specific
  const [recruiterCompany, setRecruiterCompany] = useState('');
  const [hiringDomain, setHiringDomain] = useState('Software Engineering');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'CANDIDATE') navigate('/dashboard', { replace: true });
      else if (role === 'REFERRER') navigate('/referrer-dashboard', { replace: true });
      else if (role === 'RECRUITER') navigate('/recruiter-dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!name.trim()) {
      setErrorMsg('Please enter your full legal or professional name.');
      document.getElementById('register-name')?.focus();
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      document.getElementById('register-email')?.focus();
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      document.getElementById('register-password')?.focus();
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both entries.');
      document.getElementById('register-confirm-password')?.focus();
      return;
    }
    if (selectedRole === 'REFERRER' && !companyName.trim()) {
      setErrorMsg('Please specify the company you are currently employed with.');
      return;
    }
    if (selectedRole === 'RECRUITER' && !recruiterCompany.trim()) {
      setErrorMsg('Please specify your hiring company or agency.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Code of Conduct and Verification terms to proceed.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole,
        companyName: selectedRole === 'REFERRER' ? companyName.trim() : recruiterCompany.trim(),
        jobTitle: selectedRole === 'REFERRER' ? jobTitle.trim() : headline.trim(),
        department: selectedRole === 'REFERRER' ? department : hiringDomain,
        skills: skills ? skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : undefined,
        experienceYears: Number(experienceYears) || 2
      };

      await register(payload);
      // Navigation happens in useEffect when isAuthenticated becomes true
    } catch (err) {
      setErrorMsg(err.message || 'Account registration failed. Please verify your details.');
    } finally {
      setLoading(false);
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
              Account Onboarding
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} className="hide-on-mobile">
            Already registered?
          </span>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '0.825rem', padding: '0.45rem 0.9rem' }}>
            Sign In Instead
          </Link>
        </div>
      </header>

      {/* Main Two-Part Composition */}
      <main className="login-composition-grid">
        {/* Left Side: Role Architecture & Value Proposition */}
        <section className="login-narrative-panel" aria-label="Role Overview">
          <div className="narrative-content-wrap">
            <div className="editorial-eyebrow">
              <span className="eyebrow-dot" />
              <span>COMMUNITY ECOSYSTEM</span>
            </div>

            <h1 className="narrative-headline">
              Join a network where <em>reputation</em> precedes the resume.
            </h1>

            <p className="narrative-lead">
              ReferHire aligns incentives across job seekers, company insiders, and talent leads. 
              Select your primary capacity on the platform to unlock role-tailored workflows.
            </p>

            {/* Interactive Role Comparison Cards */}
            <div className="role-selection-grid" role="radiogroup" aria-label="Select Account Role">
              {/* Candidate Card */}
              <div 
                className={`role-select-card ${selectedRole === 'CANDIDATE' ? 'role-card-active' : ''}`}
                onClick={() => setSelectedRole('CANDIDATE')}
                role="radio"
                aria-checked={selectedRole === 'CANDIDATE'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('CANDIDATE')}
              >
                <div className="role-card-header">
                  <div className="role-icon-box" style={{ background: 'var(--color-cobalt-subtle)', color: 'var(--color-cobalt)' }}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <strong className="role-card-title">Job Candidate</strong>
                    <span className="role-card-tag">Seeking Referrals</span>
                  </div>
                  {selectedRole === 'CANDIDATE' && <CheckCircle2 size={18} className="role-selected-check" />}
                </div>
                <p className="role-card-desc">
                  Browse verified opportunities, benchmark your skill compatibility, and submit targeted referral pitches directly to employees at target firms.
                </p>
                <div className="role-card-bullets">
                  <span>&bull; Direct insider endorsement</span>
                  <span>&bull; AI resume intelligence</span>
                </div>
              </div>

              {/* Referrer Card */}
              <div 
                className={`role-select-card ${selectedRole === 'REFERRER' ? 'role-card-active' : ''}`}
                onClick={() => setSelectedRole('REFERRER')}
                role="radio"
                aria-checked={selectedRole === 'REFERRER'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('REFERRER')}
              >
                <div className="role-card-header">
                  <div className="role-icon-box" style={{ background: 'rgba(16, 117, 72, 0.1)', color: 'var(--emerald-success)' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong className="role-card-title">Company Referrer</strong>
                    <span className="role-card-tag">Verified Employee</span>
                  </div>
                  {selectedRole === 'REFERRER' && <CheckCircle2 size={18} className="role-selected-check" />}
                </div>
                <p className="role-card-desc">
                  Monetize your professional goodwill. Review curated pitches from vetted engineers and endorse them to your company's ATS for referral bonuses.
                </p>
                <div className="role-card-bullets">
                  <span>&bull; Corporate domain verified</span>
                  <span>&bull; Full pitch review control</span>
                </div>
              </div>

              {/* Recruiter Card */}
              <div 
                className={`role-select-card ${selectedRole === 'RECRUITER' ? 'role-card-active' : ''}`}
                onClick={() => setSelectedRole('RECRUITER')}
                role="radio"
                aria-checked={selectedRole === 'RECRUITER'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedRole('RECRUITER')}
              >
                <div className="role-card-header">
                  <div className="role-icon-box" style={{ background: 'rgba(20, 23, 28, 0.08)', color: 'var(--text-primary)' }}>
                    <Building2 size={18} />
                  </div>
                  <div>
                    <strong className="role-card-title">Talent Partner / Recruiter</strong>
                    <span className="role-card-tag">Hiring Authority</span>
                  </div>
                  {selectedRole === 'RECRUITER' && <CheckCircle2 size={18} className="role-selected-check" />}
                </div>
                <p className="role-card-desc">
                  Post strategic openings, inspect internal referral pipelines, and prioritize candidates with verifiable teammate endorsements.
                </p>
                <div className="role-card-bullets">
                  <span>&bull; Pre-screened candidates</span>
                  <span>&bull; Faster time-to-hire</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Registration Form */}
        <section className="login-form-panel" aria-labelledby="register-title">
          <div className="form-content-wrap">
            <div className="form-header-block">
              <span className="form-step-tag">CREATE CREDENTIALS &bull; {selectedRole}</span>
              <h2 id="register-title" className="form-headline">Create your account.</h2>
              <p className="form-subtext">
                Joining ReferHire as a <strong>{selectedRole.toLowerCase()}</strong>. Setup takes under 60 seconds.
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="auth-error-banner" role="alert" aria-live="polite" tabIndex={-1}>
                <AlertCircle size={18} style={{ color: 'var(--rose-danger)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--rose-danger)', marginBottom: '2px' }}>
                    Registration requirement not met
                  </strong>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    {errorMsg}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="auth-form-body">
              {/* Common Fields */}
              <div className="form-group">
                <label htmlFor="register-name" className="field-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <div className="input-with-icon-wrap">
                  <User className="field-prefix-icon" size={17} />
                  <input
                    id="register-name"
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="editorial-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-email" className="field-label">
                  {selectedRole === 'REFERRER' ? 'Corporate Work Email' : 'Email Address'} <span className="required-star">*</span>
                </label>
                <div className="input-with-icon-wrap">
                  <Mail className="field-prefix-icon" size={17} />
                  <input
                    id="register-email"
                    type="email"
                    required
                    placeholder={selectedRole === 'REFERRER' ? 'name@google.com' : 'name@example.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="editorial-input"
                  />
                </div>
                {selectedRole === 'REFERRER' && (
                  <span style={{ fontSize: '0.725rem', color: 'var(--emerald-success)', display: 'block', marginTop: '4px' }}>
                    &bull; Used to verify corporate identity for referral credibility
                  </span>
                )}
              </div>

              {/* Password Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group">
                  <label htmlFor="register-password" className="field-label">
                    Password <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon-wrap">
                    <Lock className="field-prefix-icon" size={17} />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="editorial-input"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm-password" className="field-label">
                    Confirm <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon-wrap">
                    <Lock className="field-prefix-icon" size={17} />
                    <input
                      id="register-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="editorial-input"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {selectedRole === 'CANDIDATE' && (
                <>
                  <div className="form-group">
                    <label htmlFor="candidate-headline" className="field-label">
                      Professional Headline / Desired Role
                    </label>
                    <input
                      id="candidate-headline"
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="editorial-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
                    <div className="form-group">
                      <label htmlFor="candidate-skills" className="field-label">
                        Key Skills (comma separated)
                      </label>
                      <input
                        id="candidate-skills"
                        type="text"
                        placeholder="react, node.js, mongodb, docker"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="editorial-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="candidate-exp" className="field-label">
                        Years Exp
                      </label>
                      <select
                        id="candidate-exp"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="editorial-input"
                        style={{ height: '44px' }}
                      >
                        <option value="1">1 year</option>
                        <option value="2">2 years</option>
                        <option value="4">3-5 years</option>
                        <option value="7">6-8 years</option>
                        <option value="10">10+ years</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {selectedRole === 'REFERRER' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div className="form-group">
                      <label htmlFor="referrer-company" className="field-label">
                        Current Company <span className="required-star">*</span>
                      </label>
                      <div className="input-with-icon-wrap">
                        <Building2 className="field-prefix-icon" size={17} />
                        <input
                          id="referrer-company"
                          type="text"
                          required
                          placeholder="e.g. Google, Microsoft"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="editorial-input"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="referrer-title" className="field-label">
                        Your Job Title
                      </label>
                      <input
                        id="referrer-title"
                        type="text"
                        placeholder="Staff Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="editorial-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="referrer-dept" className="field-label">
                      Department
                    </label>
                    <select
                      id="referrer-dept"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="editorial-input"
                      style={{ height: '44px' }}
                    >
                      <option value="Engineering">Engineering / Technology</option>
                      <option value="Product">Product Management</option>
                      <option value="Design">Design & Research</option>
                      <option value="Data">Data & Analytics</option>
                      <option value="Operations">Operations / Finance</option>
                    </select>
                  </div>
                </>
              )}

              {selectedRole === 'RECRUITER' && (
                <>
                  <div className="form-group">
                    <label htmlFor="recruiter-company" className="field-label">
                      Organization Name <span className="required-star">*</span>
                    </label>
                    <div className="input-with-icon-wrap">
                      <Building2 className="field-prefix-icon" size={17} />
                      <input
                        id="recruiter-company"
                        type="text"
                        required
                        placeholder="e.g. TechCorp Labs"
                        value={recruiterCompany}
                        onChange={(e) => setRecruiterCompany(e.target.value)}
                        className="editorial-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="recruiter-domain" className="field-label">
                      Primary Hiring Specialization
                    </label>
                    <input
                      id="recruiter-domain"
                      type="text"
                      placeholder="e.g. Cloud Infrastructure, Full Stack Web"
                      value={hiringDomain}
                      onChange={(e) => setHiringDomain(e.target.value)}
                      className="editorial-input"
                    />
                  </div>
                </>
              )}

              {/* Code of Conduct Checkbox */}
              <div className="form-options-row">
                <label className="checkbox-label" htmlFor="terms-checkbox">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span>
                    I agree to the ReferHire Professional Conduct Pledge (no spam solicitations, verified credentials only).
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary submit-auth-btn"
                aria-busy={loading}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span className="spinner-inline" /> Provisioning account...
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Complete Registration <ArrowRight size={16} />
                  </span>
                )}
              </button>

              {/* Back to Login Footer */}
              <div className="auth-footer-link">
                <span>Already have a ReferHire account?</span>
                <Link to="/login" className="register-now-link">
                  Sign in here <ArrowRight size={13} style={{ display: 'inline', marginLeft: '3px' }} />
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

