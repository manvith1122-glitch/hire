import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { JobListings } from './pages/JobListings';
import { ReferrersDirectory } from './pages/ReferrersDirectory';
import { CareerSkillUniverse } from './pages/CareerSkillUniverse';
import { ResumeIntelligence } from './pages/ResumeIntelligence';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { ReferrerDashboard } from './pages/ReferrerDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthModal } from './components/AuthModal';
import { ReferralModal } from './components/ReferralModal';
import { JobDetailsModal } from './components/JobDetailsModal';
import { MatchIntelligenceModal } from './components/MatchIntelligenceModal';
import { CareerCopilot } from './components/CareerCopilot';
import { NotificationDrawer } from './components/NotificationDrawer';
import { api } from './services/api';
import { CheckCircle2, AlertCircle, Bot, Sparkles, Compass } from 'lucide-react';

// Root Entry Redirection Helper
const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: 'var(--bg-canvas)'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--border-medium)',
          borderTopColor: 'var(--color-cobalt)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          ReferHire &bull; Resolving session...
        </span>
      </div>
    );
  }

  // When unauthenticated, show the dedicated login page per Phase 3 requirements
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // When authenticated, route to the appropriate role dashboard
  if (role === 'CANDIDATE') return <Navigate to="/dashboard" replace />;
  if (role === 'REFERRER') return <Navigate to="/referrer-dashboard" replace />;
  if (role === 'RECRUITER') return <Navigate to="/recruiter-dashboard" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;

  return <Navigate to="/dashboard" replace />;
};

const AppShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, role, isAuthenticated } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [referralModalJob, setReferralModalJob] = useState(null);
  const [jobDetailsTarget, setJobDetailsTarget] = useState(null);
  const [matchIntelligenceTarget, setMatchIntelligenceTarget] = useState(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || (location.pathname === '/' && !isAuthenticated);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (e) {
      // ignore
    }
  };

  const loadSavedJobs = async () => {
    if (!isAuthenticated || role !== 'CANDIDATE') return;
    try {
      const res = await api.getSavedJobs();
      if (res.success && res.data) {
        setSavedJobIds(res.data.map(j => j._id));
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadNotifications();
    loadSavedJobs();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, role]);

  const handleToggleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'CANDIDATE') {
      showToast('Saving opportunities is reserved for candidate profiles.', 'error');
      return;
    }

    try {
      const res = await api.toggleSaveJob(jobId);
      if (res.success) {
        if (res.isSaved) {
          setSavedJobIds(prev => [...prev, jobId]);
          showToast('Opportunity saved to your bookmarks!');
        } else {
          setSavedJobIds(prev => prev.filter(id => id !== jobId));
          showToast('Opportunity removed from bookmarks.');
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to update saved job', 'error');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      await loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      await loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyDirect = async (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'CANDIDATE') {
      showToast('Please sign in as Candidate to submit applications.', 'error');
      return;
    }

    try {
      const res = await api.applyToJob({
        jobId: job._id,
        coverLetter: `Direct application submitted for ${job.title}`
      });
      if (res.success) {
        showToast(`🎉 Applied successfully to ${job.title} at ${job.companyName}!`);
        await loadNotifications();
      }
    } catch (err) {
      showToast(err.message || 'Application failed', 'error');
    }
  };

  const handleRequestReferral = (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (role !== 'CANDIDATE') {
      showToast('Please sign in as Candidate to request referrals.', 'error');
      return;
    }
    setReferralModalJob(job);
  };

  const handleReferralSuccess = (result) => {
    setReferralModalJob(null);
    showToast('🚀 Referral pitch dispatched to verified insider!');
    loadNotifications();
    navigate('/dashboard');
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: toastMessage.type === 'error' ? 'var(--rose-danger)' : 'var(--emerald-success)',
          color: '#ffffff',
          padding: '0.85rem 1.35rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 600,
          fontSize: '0.925rem',
          animation: 'fadeInModal 0.25s ease-out'
        }}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Top Navbar (hidden on dedicated auth pages for focused experience) */}
      {!isAuthPage && (
        <Navbar 
          onOpenAuth={() => navigate('/login')}
          onToggleNotifications={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
          unreadCount={unreadCount}
          onOpenCopilot={() => setCopilotOpen(true)}
        />
      )}

      {/* Routes Matrix */}
      <Routes>
        {/* Root Route: Login Page for visitors, Dashboard for members */}
        <Route path="/" element={isAuthenticated ? <RootRedirect /> : <LoginPage />} />

        {/* Dedicated Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public Discovery / Landing */}
        <Route path="/landing" element={
          <main className="main-content">
            <LandingPage
              onExploreJobs={() => navigate('/jobs')}
              onExploreReferrers={() => navigate('/referrers')}
              onOpenSkillUniverse={() => navigate('/skill-universe')}
              onOpenCopilot={() => setCopilotOpen(true)}
              onRequestReferral={handleRequestReferral}
              onApplyDirect={handleApplyDirect}
              onViewJobDetails={(job) => setJobDetailsTarget(job)}
              onOpenMatchIntelligence={(job) => setMatchIntelligenceTarget(job)}
              onOpenAuth={() => navigate('/login')}
              savedJobIds={savedJobIds}
              onToggleSaveJob={handleToggleSaveJob}
            />
          </main>
        } />

        {/* Public / Semi-Public Explorer Routes */}
        <Route path="/jobs" element={
          <main className="main-content">
            <JobListings 
              onRequestReferral={handleRequestReferral}
              onApplyDirect={handleApplyDirect}
              onViewDetails={(job) => setJobDetailsTarget(job)}
              onOpenMatchIntelligence={(job) => setMatchIntelligenceTarget(job)}
              savedJobIds={savedJobIds}
              onToggleSave={handleToggleSaveJob}
            />
          </main>
        } />

        <Route path="/referrers" element={
          <main className="main-content">
            <ReferrersDirectory 
              onRequestReferralForCompany={() => navigate('/jobs')}
            />
          </main>
        } />

        <Route path="/skill-universe" element={
          <main className="main-content">
            <CareerSkillUniverse 
              onSelectJob={(job) => setJobDetailsTarget(job)}
            />
          </main>
        } />

        <Route path="/resume-intel" element={
          <main className="main-content">
            <ResumeIntelligence 
              onExploreJobs={() => navigate('/jobs')}
            />
          </main>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['CANDIDATE', 'ADMIN']}>
            <main className="main-content">
              <CandidateDashboard 
                onOpenCopilot={() => setCopilotOpen(true)}
                onNavigateToSkills={() => navigate('/skill-universe')}
                onViewJobDetails={(job) => setJobDetailsTarget(job)}
                onRequestReferral={handleRequestReferral}
                onExploreJobs={() => navigate('/jobs')}
                onExploreReferrers={() => navigate('/referrers')}
              />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/candidate-dashboard" element={
          <Navigate to="/dashboard" replace />
        } />

        <Route path="/referrer-dashboard" element={
          <ProtectedRoute allowedRoles={['REFERRER', 'ADMIN']}>
            <main className="main-content">
              <ReferrerDashboard />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/recruiter-dashboard" element={
          <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
            <main className="main-content">
              <RecruiterDashboard />
            </main>
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <main className="main-content">
              <AdminDashboard />
            </main>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Copilot Trigger (when not on auth page) */}
      {!isAuthPage && (
        <button
          onClick={() => setCopilotOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 90,
            background: 'var(--text-primary)',
            color: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '0.65rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            boxShadow: 'var(--shadow-lg)',
            transition: 'transform var(--transition-fast)'
          }}
          aria-label="Open Career Copilot"
        >
          <Bot size={16} />
          <span>Career Copilot</span>
        </button>
      )}

      {/* Production Editorial Footer (hidden on auth pages) */}
      {!isAuthPage && (
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '3.5rem 1.5rem',
          background: 'var(--bg-surface)',
          marginTop: 'auto'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div className="nav-brand-mark" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>RH</div>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  Refer<span style={{ color: 'var(--color-cobalt)' }}>Hire</span>
                </span>
              </div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                High-trust employee referral network engineered for senior technology professionals and verified insiders.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Platform
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <li><button onClick={() => navigate('/jobs')} className="btn btn-ghost" style={{ padding: 0, height: 'auto', color: 'var(--text-secondary)' }}>Opportunity Scanner</button></li>
                <li><button onClick={() => navigate('/referrers')} className="btn btn-ghost" style={{ padding: 0, height: 'auto', color: 'var(--text-secondary)' }}>Verified Insiders</button></li>
                <li><button onClick={() => navigate('/landing')} className="btn btn-ghost" style={{ padding: 0, height: 'auto', color: 'var(--text-secondary)' }}>3D Referral Network</button></li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Intelligence
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <li><button onClick={() => navigate('/skill-universe')} className="btn btn-ghost" style={{ padding: 0, height: 'auto', color: 'var(--text-secondary)' }}>Skill Constellation</button></li>
                <li><button onClick={() => navigate('/resume-intel')} className="btn btn-ghost" style={{ padding: 0, height: 'auto', color: 'var(--text-secondary)' }}>Resume Scoring</button></li>
                <li><button onClick={() => setCopilotOpen(true)} className="btn btn-ghost" style={{ padding: 0, height: 'auto', color: 'var(--text-secondary)' }}>AI Career Copilot</button></li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Governance & Trust
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                <li>Corporate Domain Verification</li>
                <li>Peer Review Protocol</li>
                <li>Zero Resume Spam Policy</li>
              </ul>
            </div>
          </div>

          <div style={{
            maxWidth: '1280px',
            margin: '2rem auto 0',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-tertiary)'
          }}>
            <div>&copy; {new Date().getFullYear()} ReferHire Systems Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span>Privacy Standard</span>
              <span>Terms of Engagement</span>
              <span>Security Audits</span>
            </div>
          </div>
        </footer>
      )}

      {/* Global Modals & Drawers */}
      {authModalOpen && (
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      )}

      {referralModalJob && (
        <ReferralModal
          isOpen={!!referralModalJob}
          onClose={() => setReferralModalJob(null)}
          job={referralModalJob}
          onSuccess={handleReferralSuccess}
        />
      )}

      {jobDetailsTarget && (
        <JobDetailsModal
          isOpen={!!jobDetailsTarget}
          onClose={() => setJobDetailsTarget(null)}
          job={jobDetailsTarget}
          onRequestReferral={handleRequestReferral}
          onApplyDirect={handleApplyDirect}
          isSaved={savedJobIds.includes(jobDetailsTarget._id)}
          onToggleSave={() => handleToggleSaveJob(jobDetailsTarget._id)}
        />
      )}

      {matchIntelligenceTarget && (
        <MatchIntelligenceModal
          isOpen={!!matchIntelligenceTarget}
          onClose={() => setMatchIntelligenceTarget(null)}
          job={matchIntelligenceTarget}
          onRequestReferral={handleRequestReferral}
        />
      )}

      <CareerCopilot 
        isOpen={copilotOpen} 
        onClose={() => setCopilotOpen(false)} 
        onRequestReferral={handleRequestReferral}
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
