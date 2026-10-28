import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  User, 
  Sparkles, 
  Briefcase, 
  Send, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MapPin, 
  Plus, 
  X, 
  Save, 
  Calendar, 
  Bookmark, 
  TrendingUp, 
  FileText, 
  Bot, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Check,
  Building
} from 'lucide-react';

export const CandidateDashboard = ({ onOpenCopilot, onNavigateToSkills, onViewJobDetails, onRequestReferral, onExploreJobs, onExploreReferrers }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('referrals'); // 'referrals' | 'applications' | 'saved' | 'profile'
  const [referralRequests, setReferralRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editable profile state
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [experienceYears, setExperienceYears] = useState(profile?.experienceYears || 2);
  const [skills, setSkills] = useState(profile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || 'Full Stack Engineer');
      setLocation(profile.location || 'Bengaluru, India');
      setExperienceYears(profile.experienceYears || 2);
      setSkills(profile.skills || ['react', 'node.js', 'mongodb', 'express']);
    }
  }, [profile]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [refRes, appRes, savedRes] = await Promise.all([
        api.getMyReferralRequests(),
        api.getMyApplications(),
        api.getSavedJobs().catch(() => ({ success: true, data: [] }))
      ]);
      if (refRes.success) setReferralRequests(refRes.data);
      if (appRes.success) setApplications(appRes.data);
      if (savedRes.success) setSavedJobs(savedRes.data);
    } catch (err) {
      console.error('Error loading candidate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateCompleteness = () => {
    let score = 20;
    if (headline && headline.trim()) score += 15;
    if (location && location.trim()) score += 15;
    if (skills && skills.length >= 3) score += 20;
    if (experienceYears > 0) score += 15;
    if (profile?.projects?.length > 0 || profile?.bio) score += 15;
    return Math.min(100, score);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim().toLowerCase())) {
      setSkills([...skills, newSkillInput.trim().toLowerCase()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const res = await api.updateCandidateProfile({
        headline,
        location,
        experienceYears,
        skills
      });
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await refreshProfile();
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge" style={{ background: 'var(--amber-bg)', color: 'var(--amber-warning)', border: '1px solid rgba(180, 83, 9, 0.3)' }}><Clock size={12} /> Pending Review</span>;
      case 'ACCEPTED':
      case 'CONVERTED_TO_APPLICATION':
        return <span className="badge badge-referrer"><CheckCircle2 size={12} /> Referral Submitted to Recruiter</span>;
      case 'REJECTED':
        return <span className="badge" style={{ background: 'var(--rose-bg)', color: 'var(--rose-danger)', border: '1px solid rgba(197, 48, 48, 0.3)' }}><XCircle size={12} /> Declined</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-candidate"><Sparkles size={12} /> Shortlisted</span>;
      case 'INTERVIEW_SCHEDULED':
        return <span className="badge badge-candidate"><Calendar size={12} /> Interview Scheduled</span>;
      case 'OFFERED':
      case 'HIRED':
        return <span className="badge badge-referrer"><CheckCircle2 size={12} /> {status}</span>;
      default:
        return <span className="badge badge-mono">{status}</span>;
    }
  };

  const completeness = calculateCompleteness();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Candidate Overview Header */}
      <div className="surface-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img 
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
            alt={user?.name}
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: 'var(--radius-full)', 
              objectFit: 'cover', 
              border: '2px solid var(--color-cobalt)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 className="editorial-title" style={{ fontSize: '1.65rem', fontWeight: 600 }}>{user?.name}</h1>
              <span className="badge badge-candidate">Candidate Workspace</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
              {headline} • <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {location}
            </p>
          </div>
        </div>

        {/* Profile Completeness Gauge & Key Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '140px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Profile Health</span>
              <strong className="font-mono" style={{ color: completeness >= 80 ? 'var(--emerald-success)' : 'var(--amber-warning)' }}>
                {completeness}%
              </strong>
            </div>
            <div style={{ width: '140px', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${completeness}%`, 
                height: '100%', 
                background: completeness >= 80 ? 'var(--emerald-success)' : 'var(--amber-warning)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--emerald-success)' }}>
                {referralRequests.length}
              </div>
              <div style={{ fontSize: '0.685rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Referrals
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-cobalt)' }}>
                {applications.length}
              </div>
              <div style={{ fontSize: '0.685rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Applications
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {savedJobs.length}
              </div>
              <div style={{ fontSize: '0.685rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Bookmarks
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (No Emojis; Clear Icons) */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`nav-link ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrals')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Send size={14} /> Referral Requests ({referralRequests.length})
        </button>
        <button 
          className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <FileText size={14} /> Application Pipeline ({applications.length})
        </button>
        <button 
          className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Bookmark size={14} /> Bookmarked Requisitions ({savedJobs.length})
        </button>
        <button 
          className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <User size={14} /> Technical Profile & Skills
        </button>
      </div>

      {/* TAB 1: Referral Requests */}
      {activeTab === 'referrals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div className="surface-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              Loading referral records...
            </div>
          ) : referralRequests.length > 0 ? (
            referralRequests.map((req) => (
              <div key={req._id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {req.jobId?.title || 'Engineering Requisition'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>{req.companyName}</strong>
                      <span>•</span>
                      <span>Target Referrer: <strong>{req.referrerId?.name}</strong></span>
                      <span>•</span>
                      <span>Submitted on {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    YOUR PERSONALIZED PITCH MESSAGE:
                  </div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{req.pitchMessage}"
                  </p>
                </div>

                {req.referrerNotes && (
                  <div style={{ background: 'var(--emerald-bg)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(16, 117, 72, 0.25)', fontSize: '0.875rem' }}>
                    <strong style={{ color: 'var(--emerald-success)' }}>Referrer Endorsement Note:</strong>
                    <p style={{ color: 'var(--text-primary)', marginTop: '0.25rem' }}>{req.referrerNotes}</p>
                  </div>
                )}

                {req.rejectionReason && (
                  <div style={{ background: 'var(--rose-bg)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(197, 48, 48, 0.25)', fontSize: '0.875rem' }}>
                    <strong style={{ color: 'var(--rose-danger)' }}>Referrer Feedback:</strong>
                    <p style={{ color: 'var(--text-primary)', marginTop: '0.25rem' }}>{req.rejectionReason}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <Send size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No referral requests submitted yet</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                Discover verified opportunities and connect with corporate employees to initiate your first endorsement request.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                {onExploreJobs && (
                  <button className="btn btn-cobalt btn-sm" onClick={onExploreJobs}>
                    Explore Open Positions <ArrowRight size={13} />
                  </button>
                )}
                {onExploreReferrers && (
                  <button className="btn btn-secondary btn-sm" onClick={onExploreReferrers}>
                    Find Corporate Referrers
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Applications Pipeline */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="surface-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {app.jobId?.title || 'Applied Position'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    <strong>{app.jobId?.companyName || 'Technology Leader'}</strong>
                    <span>•</span>
                    <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                    {app.referredBy && (
                      <span className="badge badge-referrer" style={{ fontSize: '0.7rem' }}>
                        <ShieldCheck size={11} /> Referred by {app.referredBy?.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <FileText size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No direct applications in progress</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                Applications submitted directly or converted through employee referrals will appear here with live stage tracking.
              </p>
              {onExploreJobs && (
                <button className="btn btn-secondary btn-sm" onClick={onExploreJobs}>
                  Browse Opportunities
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Saved Requisitions */}
      {activeTab === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {savedJobs.length > 0 ? (
            <div className="grid-2">
              {savedJobs.map((job) => (
                <div key={job._id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {job.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: '0.75rem' }}>
                      <strong>{job.companyName}</strong> • {job.location}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-mono">{job.workMode}</span>
                      <span className="badge badge-mono">{job.salary?.min ? `₹${(job.salary.min/100000).toFixed(1)}LPA+` : 'Competitive'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button 
                      className="btn btn-referral btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => onRequestReferral && onRequestReferral(job)}
                    >
                      <Send size={13} /> Request Referral
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewJobDetails && onViewJobDetails(job)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <Bookmark size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No bookmarked opportunities</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                Bookmark interesting job openings in the Discover Jobs explorer to compare them later side-by-side.
              </p>
              {onExploreJobs && (
                <button className="btn btn-secondary btn-sm" onClick={onExploreJobs}>
                  Discover Requisitions to Save
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Manage Profile & Skills */}
      {activeTab === 'profile' && (
        <div className="surface-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Candidate Career Profile
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                This data powers your automated skill compatibility scoring and is shown to referrers when reviewing endorsements.
              </p>
            </div>

            <button 
              className="btn btn-cobalt"
              onClick={handleSaveProfile}
              disabled={profileSaving}
            >
              <Save size={15} /> {profileSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>

          {saveSuccess && (
            <div style={{ background: 'var(--emerald-bg)', border: '1px solid rgba(16, 117, 72, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--emerald-success)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} /> Profile changes saved and synced across match engines!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input 
                type="text" 
                className="input-field" 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)} 
                placeholder="e.g. Full-Stack MERN Developer | React & Node.js"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Location</label>
              <input 
                type="text" 
                className="input-field" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="e.g. Bengaluru, India"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Relevant Experience</label>
              <input 
                type="number" 
                step="0.5" 
                min="0" 
                max="30" 
                className="input-field" 
                value={experienceYears} 
                onChange={(e) => setExperienceYears(parseFloat(e.target.value) || 0)} 
              />
            </div>
          </div>

          {/* Technical Skills Tag Manager */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              Core Technical Competencies (Used for Transparent Match Scoring)
            </label>

            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem', maxWidth: '480px', marginBottom: '1rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Add a technical skill (e.g. TypeScript, Docker, Redis)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                <Plus size={15} /> Add Skill
              </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="skill-chip matched"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '0.35rem', color: 'inherit' }}
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
