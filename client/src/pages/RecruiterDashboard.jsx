import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Building2, 
  Briefcase, 
  Plus, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Award, 
  Sparkles, 
  Filter, 
  MapPin, 
  Check, 
  Clock,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [filterReferredOnly, setFilterReferredOnly] = useState(false);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: 'TechCorp Labs',
    workMode: 'REMOTE',
    location: 'Bengaluru / Remote',
    minSalary: 1400000,
    maxSalary: 2400000,
    minExp: 2,
    maxExp: 5,
    skills: 'react, node.js, mongodb, express, git',
    description: 'We are seeking a proactive software engineer to join our core product engineering team.',
    allowReferrals: true
  });
  const [postJobLoading, setPostJobLoading] = useState(false);

  // Active status update modal
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [statusNote, setStatusNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.getJobs({ limit: 50 });
      if (res.success && res.data?.length > 0) {
        setJobs(res.data);
        if (!selectedJobId) {
          setSelectedJobId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!selectedJobId) return;
    try {
      const res = await api.getJobApplications(selectedJobId, {
        isReferred: filterReferredOnly ? 'true' : undefined
      });
      if (res.success) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId, filterReferredOnly]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showPostJobModal) setShowPostJobModal(false);
        if (statusModalApp) setStatusModalApp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPostJobModal, statusModalApp]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostJobLoading(true);
    try {
      const res = await api.createJob({
        title: newJob.title,
        companyName: newJob.companyName,
        workMode: newJob.workMode,
        location: newJob.location,
        salary: { min: Number(newJob.minSalary), max: Number(newJob.maxSalary) },
        experience: { min: Number(newJob.minExp), max: Number(newJob.maxExp) },
        skills: newJob.skills.split(',').map(s => s.trim().toLowerCase()),
        description: newJob.description,
        allowReferrals: newJob.allowReferrals
      });

      if (res.success) {
        setShowPostJobModal(false);
        setNewJob({
          title: '',
          companyName: 'TechCorp Labs',
          workMode: 'REMOTE',
          location: 'Bengaluru / Remote',
          minSalary: 1400000,
          maxSalary: 2400000,
          minExp: 2,
          maxExp: 5,
          skills: 'react, node.js, mongodb, express, git',
          description: 'We are seeking a proactive software engineer to join our core product engineering team.',
          allowReferrals: true
        });
        await fetchJobs();
      }
    } catch (err) {
      alert(err.message || 'Failed to post job');
    } finally {
      setPostJobLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusModalApp) return;

    setStatusUpdating(true);
    try {
      const payload = {
        status: newStatus,
        note: statusNote
      };

      if (newStatus === 'INTERVIEW_SCHEDULED') {
        payload.interviewDetails = {
          scheduledAt: interviewDate || new Date(Date.now() + 2 * 86400000),
          meetingLink: meetingLink || 'https://meet.google.com/referhire-interview',
          roundName: 'Technical & System Design Round'
        };
      }

      const res = await api.updateApplicationStatus(statusModalApp._id, payload);
      if (res.success) {
        setStatusModalApp(null);
        await fetchApplications();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Recruiter Header Banner */}
      <div className="surface-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 className="editorial-title" style={{ fontSize: '1.65rem', fontWeight: 600 }}>Recruiter Pipeline Hub</h1>
              <span className="badge badge-recruiter">Talent Operations</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> • Review candidates endorsed by verified internal referrers.
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowPostJobModal(true)}
        >
          <Plus size={16} /> Create Requisition
        </button>
      </div>

      {/* Main Candidate Pipeline Panel */}
      <div className="surface-card" style={{ padding: '1.75rem' }}>
        {/* Requisition selector & filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <label className="form-label" style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>
              Active Requisition:
            </label>
            <select
              className="select-field"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              style={{ maxWidth: '420px' }}
            >
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} — {j.companyName} ({j.applicationCount || 0} applicants)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className={`filter-pill ${filterReferredOnly ? 'active' : ''}`}
              onClick={() => setFilterReferredOnly(!filterReferredOnly)}
            >
              <ShieldCheck size={13} /> {filterReferredOnly ? 'Showing Employee Referred Only' : 'Filter Referred Candidates'}
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Candidate Dossiers ({applications.length})
          </h2>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              Loading applications...
            </div>
          ) : applications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map((app) => (
                <div key={app._id} className="surface-card" style={{
                  padding: '1.25rem',
                  border: app.isReferred ? '1px solid rgba(16, 117, 72, 0.35)' : '1px solid var(--border-subtle)',
                  background: app.isReferred ? 'var(--emerald-bg)' : 'var(--bg-surface)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img 
                        src={app.candidateId?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${app.candidateId?.name}`}
                        alt={app.candidateId?.name}
                        style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {app.candidateId?.name}
                          </span>
                          {app.isReferred && (
                            <span className="badge badge-referrer" style={{ fontSize: '0.7rem' }}>
                              <ShieldCheck size={11} /> Endorsed by Internal Referrer
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          {app.candidateId?.email} • Received on {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div className="match-score-badge high">
                        <Sparkles size={12} /> {app.skillsMatchScore}% Skill Fit
                      </div>
                      <span className="badge badge-candidate">
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Referrer Endorsement Note */}
                  {app.isReferred && app.referrerId && (
                    <div style={{ background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.825rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      <strong>Referrer Endorsement:</strong> Endorsed by {app.referrerId.name}. "{app.coverLetter || 'Qualified engineer recommended for interview queue.'}"
                    </div>
                  )}

                  {/* Skills badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>MATCHED SKILLS:</span>
                    {app.matchingSkills?.map((s) => (
                      <span key={s} className="skill-chip matched" style={{ fontSize: '0.75rem' }}>
                        <Check size={10} /> {s}
                      </span>
                    ))}
                    {app.missingSkills?.map((s) => (
                      <span key={s} className="skill-chip missing" style={{ fontSize: '0.75rem' }}>
                        ○ {s}
                      </span>
                    ))}
                  </div>

                  {/* Pipeline Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setStatusModalApp(app);
                        setNewStatus('SHORTLISTED');
                        setStatusNote('Candidate shortlisted for next round based on strong skill alignment.');
                      }}
                    >
                      <Sparkles size={13} /> Shortlist
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setStatusModalApp(app);
                        setNewStatus('INTERVIEW_SCHEDULED');
                        setStatusNote('Interview invitation sent.');
                      }}
                    >
                      <Calendar size={13} /> Schedule Interview
                    </button>
                    <button 
                      className="btn btn-referral btn-sm"
                      onClick={() => {
                        setStatusModalApp(app);
                        setNewStatus('OFFERED');
                        setStatusNote('Formal compensation offer extended.');
                      }}
                    >
                      <Award size={13} /> Extend Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No candidates in pipeline for this requisition yet.
            </div>
          )}
        </div>
      </div>

      {/* Post Requisition Modal */}
      {showPostJobModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                Create Engineering Requisition
              </h2>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPostJobModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePostJob}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required
                    placeholder="e.g. Senior MERN Architect"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required
                    value={newJob.companyName}
                    onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Work Mode</label>
                  <select 
                    className="select-field"
                    value={newJob.workMode}
                    onChange={(e) => setNewJob({ ...newJob, workMode: e.target.value })}
                  >
                    <option value="REMOTE">REMOTE</option>
                    <option value="HYBRID">HYBRID</option>
                    <option value="ONSITE">ONSITE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Min Salary (INR)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={newJob.minSalary}
                    onChange={(e) => setNewJob({ ...newJob, minSalary: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Salary (INR)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={newJob.maxSalary}
                    onChange={(e) => setNewJob({ ...newJob, maxSalary: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (Comma-separated)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                  placeholder="react, node.js, mongodb, express, docker"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Description</label>
                <textarea 
                  className="textarea-field" 
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowPostJobModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-cobalt btn-sm"
                  disabled={postJobLoading}
                >
                  {postJobLoading ? 'Publishing...' : 'Publish Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Status Transition Modal */}
      {statusModalApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Update Pipeline Decision: {statusModalApp.candidateId?.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Transitioning application status for <strong>{statusModalApp.jobId?.title}</strong>
            </p>

            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">Target Pipeline Stage</label>
                <select
                  className="select-field"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="SHORTLISTED">SHORTLISTED (Technical Evaluation)</option>
                  <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
                  <option value="OFFERED">OFFERED (Compensation Package)</option>
                  <option value="REJECTED">REJECTED (Candidate Notified)</option>
                </select>
              </div>

              {newStatus === 'INTERVIEW_SCHEDULED' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Meeting URL (Google Meet / Zoom)</label>
                    <input
                      type="url"
                      className="input-field"
                      placeholder="https://meet.google.com/..."
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Interview Timestamp</label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Internal Recruiter Dossier Note</label>
                <textarea
                  className="textarea-field"
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Notes on candidate technical review or interview instructions..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setStatusModalApp(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-cobalt btn-sm"
                  disabled={statusUpdating}
                >
                  {statusUpdating ? 'Updating Pipeline...' : 'Confirm Pipeline Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
