import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Sparkles, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Users, 
  Layers, 
  Bot, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';

export const Navbar = ({ 
  onOpenAuth, 
  activeTab, 
  setActiveTab, 
  onToggleNotifications, 
  unreadCount = 0, 
  onOpenCopilot 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout, quickDemoLogin, isAuthenticated } = useAuth();

  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Default to light editorial mode if unset
  const [theme, setTheme] = useState(() => localStorage.getItem('referhire_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('referhire_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNavigate = (path, tabKey) => {
    if (setActiveTab && tabKey) {
      setActiveTab(tabKey);
    }
    navigate(path);
    setMobileMenuOpen(false);
    setToolsMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleDemoSwitch = async (targetRole) => {
    try {
      await quickDemoLogin(targetRole);
      setDemoMenuOpen(false);
      setMobileMenuOpen(false);
      if (targetRole === 'CANDIDATE') handleNavigate('/dashboard', 'dashboard');
      else if (targetRole === 'REFERRER') handleNavigate('/referrer-dashboard', 'referrer-dashboard');
      else if (targetRole === 'RECRUITER') handleNavigate('/recruiter-dashboard', 'recruiter-dashboard');
      else if (targetRole === 'ADMIN') handleNavigate('/admin-dashboard', 'admin-dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const getRoleBadgeClass = () => {
    switch (role) {
      case 'CANDIDATE': return 'badge-candidate';
      case 'REFERRER': return 'badge-referrer';
      case 'RECRUITER': return 'badge-recruiter';
      case 'ADMIN': return 'badge-admin';
      default: return 'badge-candidate';
    }
  };

  const isCurrent = (path, tabKey) => {
    return location.pathname === path || activeTab === tabKey;
  };

  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        {/* Left: Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}>
          <div 
            className="nav-brand" 
            onClick={() => {
              if (isAuthenticated) {
                if (role === 'CANDIDATE') handleNavigate('/dashboard', 'dashboard');
                else if (role === 'REFERRER') handleNavigate('/referrer-dashboard', 'referrer-dashboard');
                else if (role === 'RECRUITER') handleNavigate('/recruiter-dashboard', 'recruiter-dashboard');
                else if (role === 'ADMIN') handleNavigate('/admin-dashboard', 'admin-dashboard');
              } else {
                handleNavigate('/landing', 'landing');
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate(isAuthenticated ? '/dashboard' : '/landing')}
            aria-label="ReferHire Home"
          >
            <div className="nav-brand-mark">
              RH
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                Refer<span style={{ color: 'var(--color-cobalt)' }}>Hire</span>
              </span>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', fontWeight: 600, marginTop: '-3px' }}>
                Referral Network
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button 
              className={`nav-link ${isCurrent('/jobs', 'jobs') ? 'active' : ''}`}
              onClick={() => handleNavigate('/jobs', 'jobs')}
            >
              Discover Jobs
            </button>
            <button 
              className={`nav-link ${isCurrent('/referrers', 'referrers') ? 'active' : ''}`}
              onClick={() => handleNavigate('/referrers', 'referrers')}
            >
              Find Referrers
            </button>

            {/* Career Intelligence Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className={`nav-link ${isCurrent('/skill-universe', 'skill-universe') || isCurrent('/resume-intel', 'resume-intel') ? 'active' : ''}`}
                onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                aria-expanded={toolsMenuOpen}
              >
                <span>Career Intelligence</span>
                <ChevronDown size={13} style={{ transform: toolsMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {toolsMenuOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: '260px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    animation: 'scaleUp 0.15s ease-out'
                  }}
                  onMouseLeave={() => setToolsMenuOpen(false)}
                >
                  <button
                    className="nav-link"
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem' }}
                    onClick={() => handleNavigate('/skill-universe', 'skill-universe')}
                  >
                    <Layers size={16} color="var(--color-cobalt)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>Skill Constellation</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Interactive role requirements</div>
                    </div>
                  </button>

                  <button
                    className="nav-link"
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem' }}
                    onClick={() => handleNavigate('/resume-intel', 'resume-intel')}
                  >
                    <FileText size={16} color="var(--emerald-success)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>Resume Intelligence</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Benchmark against job requisitions</div>
                    </div>
                  </button>

                  <button
                    className="nav-link"
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem' }}
                    onClick={() => {
                      if (onOpenCopilot) onOpenCopilot();
                      setToolsMenuOpen(false);
                    }}
                  >
                    <Bot size={16} color="var(--color-cobalt)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>Career Copilot (AI)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Contextual application assistant</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Public Landing Link (Accessible when unauthenticated) */}
            {!isAuthenticated && (
              <button 
                className={`nav-link ${isCurrent('/landing', 'landing') ? 'active' : ''}`}
                onClick={() => handleNavigate('/landing', 'landing')}
              >
                3D Network
              </button>
            )}

            {/* Workspace Link (for Authenticated Users) */}
            {isAuthenticated && (
              <button 
                className={`nav-link ${location.pathname.includes('dashboard') || (activeTab && activeTab.includes('dashboard')) ? 'active' : ''}`}
                onClick={() => {
                  if (role === 'CANDIDATE') handleNavigate('/dashboard', 'dashboard');
                  else if (role === 'REFERRER') handleNavigate('/referrer-dashboard', 'referrer-dashboard');
                  else if (role === 'RECRUITER') handleNavigate('/recruiter-dashboard', 'recruiter-dashboard');
                  else if (role === 'ADMIN') handleNavigate('/admin-dashboard', 'admin-dashboard');
                }}
              >
                Workspace
              </button>
            )}
          </nav>
        </div>

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Quick Demo Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
              title="Switch demo persona for testing"
            >
              <span className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>DEMO:</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {role ? role.toLowerCase() : 'Persona'}
              </strong>
              <ChevronDown size={12} />
            </button>

            {demoMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  width: '240px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  animation: 'scaleUp 0.15s ease-out'
                }}
                onMouseLeave={() => setDemoMenuOpen(false)}
              >
                <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', padding: '0.4rem 0.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  SELECT DEMO PERSONA:
                </div>
                <button 
                  onClick={() => handleDemoSwitch('CANDIDATE')} 
                  className="nav-link" 
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}
                >
                  <User size={14} color="var(--color-cobalt)" /> Candidate (Alex Chen)
                </button>
                <button 
                  onClick={() => handleDemoSwitch('REFERRER')} 
                  className="nav-link" 
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}
                >
                  <ShieldCheck size={14} color="var(--emerald-success)" /> Referrer (Google: Priya)
                </button>
                <button 
                  onClick={() => handleDemoSwitch('RECRUITER')} 
                  className="nav-link" 
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}
                >
                  <Briefcase size={14} color="#7C3AED" /> Recruiter (TechCorp: Marcus)
                </button>
                <button 
                  onClick={() => handleDemoSwitch('ADMIN')} 
                  className="nav-link" 
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}
                >
                  <CheckCircle2 size={14} color="var(--amber-warning)" /> Platform Administrator
                </button>
              </div>
            )}
          </div>

          {/* Theme Mode Toggle */}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            title={`Switch to ${theme === 'dark' ? 'Light Editorial' : 'Dark Slate'} mode`}
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications Trigger */}
          {isAuthenticated && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={onToggleNotifications}
              style={{ position: 'relative', width: '36px', height: '36px', padding: 0 }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-cobalt)'
                }} />
              )}
            </button>
          )}

          {/* Auth State Cluster */}
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link 
                to="/login"
                className="btn btn-ghost btn-sm"
                style={{ textDecoration: 'none' }}
              >
                Sign in
              </Link>
              <Link 
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.65rem' }}
              >
                <img 
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                  alt={user?.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.825rem' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <span className={`badge ${getRoleBadgeClass()}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  {role}
                </span>
                <ChevronDown size={12} />
              </button>

              {userMenuOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    width: '220px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    animation: 'scaleUp 0.15s ease-out'
                  }}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                  </div>

                  <button 
                    onClick={() => {
                      if (role === 'CANDIDATE') handleNavigate('/dashboard', 'dashboard');
                      else if (role === 'REFERRER') handleNavigate('/referrer-dashboard', 'referrer-dashboard');
                      else if (role === 'RECRUITER') handleNavigate('/recruiter-dashboard', 'recruiter-dashboard');
                      else if (role === 'ADMIN') handleNavigate('/admin-dashboard', 'admin-dashboard');
                      setUserMenuOpen(false);
                    }}
                    className="nav-link"
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <User size={14} /> My Workspace
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="nav-link"
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose-danger)' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="btn btn-ghost btn-sm mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            style={{ width: '36px', height: '36px', padding: 0 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav 
          aria-label="Mobile navigation"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <button 
            className={`nav-link ${isCurrent('/jobs', 'jobs') ? 'active' : ''}`}
            onClick={() => handleNavigate('/jobs', 'jobs')}
            style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.95rem' }}
          >
            Discover Jobs
          </button>
          <button 
            className={`nav-link ${isCurrent('/referrers', 'referrers') ? 'active' : ''}`}
            onClick={() => handleNavigate('/referrers', 'referrers')}
            style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.95rem' }}
          >
            Find Referrers
          </button>
          <button 
            className={`nav-link ${isCurrent('/skill-universe', 'skill-universe') ? 'active' : ''}`}
            onClick={() => handleNavigate('/skill-universe', 'skill-universe')}
            style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.95rem' }}
          >
            Skill Constellation
          </button>
          <button 
            className={`nav-link ${isCurrent('/resume-intel', 'resume-intel') ? 'active' : ''}`}
            onClick={() => handleNavigate('/resume-intel', 'resume-intel')}
            style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.95rem' }}
          >
            Resume Intelligence
          </button>

          {!isAuthenticated && (
            <button 
              className={`nav-link ${isCurrent('/landing', 'landing') ? 'active' : ''}`}
              onClick={() => handleNavigate('/landing', 'landing')}
              style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.95rem' }}
            >
              3D Referral Network
            </button>
          )}

          {isAuthenticated ? (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button 
                className={`nav-link ${location.pathname.includes('dashboard') ? 'active' : ''}`}
                onClick={() => {
                  if (role === 'CANDIDATE') handleNavigate('/dashboard', 'dashboard');
                  else if (role === 'REFERRER') handleNavigate('/referrer-dashboard', 'referrer-dashboard');
                  else if (role === 'RECRUITER') handleNavigate('/recruiter-dashboard', 'recruiter-dashboard');
                  else if (role === 'ADMIN') handleNavigate('/admin-dashboard', 'admin-dashboard');
                }}
                style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                My Workspace ({role})
              </button>
              <button 
                className="nav-link"
                onClick={handleLogout}
                style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontSize: '0.95rem', color: 'var(--rose-danger)' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.4rem', display: 'flex', gap: '0.5rem' }}>
              <Link 
                to="/login" 
                className="btn btn-secondary btn-sm"
                onClick={() => setMobileMenuOpen(false)}
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm"
                onClick={() => setMobileMenuOpen(false)}
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};
