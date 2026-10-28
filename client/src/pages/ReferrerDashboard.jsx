import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Building, 
  Send, 
  FileText, 
  MessageSquare,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Clock,
  Briefcase,
  Check,
  X
} from 'lucide-react';

export const ReferrerDashboard = () => {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(profile?.isActive !== false);
  const [activeActionModal, setActiveActionModal] = useState(null); // { request, action: 'ACCEPT' | 'REJECT' }
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING' | 'ACCEPTED'

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getIncomingReferrals();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Error fetching incoming requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeActionModal) {
        setActiveActionModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeActionModal]);

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    try {
      await api.updateReferrerProfile({ isActive: nextVal });
    } catch (e) {
      console.error('Error updating availability:', e);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!activeActionModal) return;

    setActionLoading(true);
    try {
      const { request, action } = activeActionModal;
      const res = await api.updateReferralStatus(request._id, {
        status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
        referrerNotes: action === 'ACCEPT' ? notes : undefined,
        rejectionReason: action === 'REJECT' ? notes : undefined
      });

      if (res.success) {
        setActiveActionModal(null);
        setNotes('');
        await fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    if (filterStatus === 'ALL') return requests;
    if (filterStatus === 'PENDING') return requests.filter(r => r.status === 'PENDING');
    if (filterStatus === 'ACCEPTED') return requests.filter(r => r.status === 'ACCEPTED' || r.status === 'CONVERTED_TO_APPLICATION');
    return requests;
  }, [requests, filterStatus]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner: Referrer Credibility & Control Desk */}
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
              border: '2px solid var(--emerald-success)', 
              boxShadow: 'var(--shadow-sm)' 
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 className="editorial-title" style={{ fontSize: '1.65rem', fontWeight: 600 }}>{user?.name}</h1>
              <span className="badge badge-referrer">
                <ShieldCheck size={12} /> Verified Corporate Referrer
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
              {profile?.role || 'Senior Staff Engineer'} at <strong style={{ color: 'var(--text-primary)' }}>{profile?.companyName || 'Google'}</strong> • Verified Domain: <code className="font-mono" style={{ color: 'var(--emerald-success)', fontSize: '0.825rem' }}>@{profile?.companyName?.toLowerCase() || 'google'}.com</code>
            </p>
          </div>
        </div>

        {/* Status Toggle & Reputation Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleToggleAvailability}
            aria-pressed={isAvailable}
            aria-label={`Toggle referral status: currently ${isAvailable ? 'actively referring' : 'paused'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.85rem' }}
          >
            {isAvailable ? <ToggleRight size={20} color="var(--emerald-success)" /> : <ToggleLeft size={20} color="var(--text-tertiary)" />}
            <span style={{ fontSize: '0.825rem' }}>
              Referral Status: <strong style={{ color: isAvailable ? 'var(--emerald-success)' : 'var(--text-tertiary)' }}>{isAvailable ? 'Actively Referring' : 'Paused'}</strong>
            </span>
          </button>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 0.95rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--emerald-success)' }}>
                {profile?.totalReferralsProvided || 14}
              </div>
              <div style={{ fontSize: '0.685rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Endorsed</div>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 0.95rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-cobalt)' }}>
                {profile?.successfulHires || 4}
              </div>
              <div style={{ fontSize: '0.685rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Hired</div>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 0.95rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--amber-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                <Star size={14} fill="var(--amber-warning)" /> {profile?.rating || 4.9}
              </div>
              <div style={{ fontSize: '0.685rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Triage Queue Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="editorial-kicker">
              <Briefcase size={14} /> REFERRAL TRIAGE QUEUE
            </div>
            <h2 className="editorial-title" style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.2rem' }}>
              Incoming Candidate Endorsements
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Review candidate credentials, match scores, and endorse qualified candidates directly into recruiter pipelines.
            </p>
          </div>

          <div className="filter-bar">
            <button
              className={`filter-pill ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All Requests ({requests.length})
            </button>
            <button
              className={`filter-pill ${filterStatus === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilterStatus('PENDING')}
            >
              Pending ({requests.filter(r => r.status === 'PENDING').length})
            </button>
            <button
              className={`filter-pill ${filterStatus === 'ACCEPTED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ACCEPTED')}
            >
              Approved ({requests.filter(r => r.status === 'ACCEPTED' || r.status === 'CONVERTED_TO_APPLICATION').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            Loading candidate referral queue...
          </div>
        ) : filteredRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredRequests.map((req) => (
              <div key={req._id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img 
                      src={req.candidateId?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${req.candidateId?.name}`}
                      alt={req.candidateId?.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {req.candidateId?.name}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          ({req.candidateId?.email})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        Target Position: <strong style={{ color: 'var(--text-primary)' }}>{req.jobId?.title}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Match Score & Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div className="match-score-badge high">
                      <Sparkles size={13} /> {req.skillsMatchScore}% Skill Fit
                    </div>
                    <span className="badge" style={{
                      background: req.status === 'PENDING' ? 'var(--amber-bg)' : (req.status === 'ACCEPTED' || req.status === 'CONVERTED_TO_APPLICATION' ? 'var(--emerald-bg)' : 'var(--rose-bg)'),
                      color: req.status === 'PENDING' ? 'var(--amber-warning)' : (req.status === 'ACCEPTED' || req.status === 'CONVERTED_TO_APPLICATION' ? 'var(--emerald-success)' : 'var(--rose-danger)')
                    }}>
                      {req.status === 'PENDING' ? 'Action Required' : (req.status === 'ACCEPTED' ? 'Endorsed' : req.status)}
                    </span>
                  </div>
                </div>

                {/* Candidate Personalized Pitch */}
                <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    CANDIDATE PITCH:
                  </div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{req.pitchMessage}"
                  </p>
                </div>

                {/* Referrer notes if already acted upon */}
                {req.referrerNotes && (
                  <div style={{ background: 'var(--emerald-bg)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--emerald-success)' }}>Your Internal Submission Note:</strong>
                    <p style={{ color: 'var(--text-primary)', marginTop: '0.2rem' }}>{req.referrerNotes}</p>
                  </div>
                )}

                {req.rejectionReason && (
                  <div style={{ background: 'var(--rose-bg)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--rose-danger)' }}>Decline Reason:</strong>
                    <p style={{ color: 'var(--text-primary)', marginTop: '0.2rem' }}>{req.rejectionReason}</p>
                  </div>
                )}

                {/* Actions for PENDING request */}
                {req.status === 'PENDING' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setActiveActionModal({ request: req, action: 'REJECT' })}
                    >
                      <X size={14} /> Decline Request
                    </button>
                    <button
                      className="btn btn-referral btn-sm"
                      onClick={() => setActiveActionModal({ request: req, action: 'ACCEPT' })}
                    >
                      <Check size={14} /> Endorse & Submit to Recruiter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <UserCheck size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Triage inbox is clear</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              No incoming referral requests match the selected filter.
            </p>
          </div>
        )}
      </div>

      {/* Action Notes Modal */}
      {activeActionModal && (
        <div className="modal-overlay" onClick={() => setActiveActionModal(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {activeActionModal.action === 'ACCEPT' ? 'Endorse Candidate to Recruiter' : 'Decline Referral Request'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Candidate: <strong>{activeActionModal.request.candidateId?.name}</strong> for role: <strong>{activeActionModal.request.jobId?.title}</strong>
            </p>

            <form onSubmit={handleStatusSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="action-notes-textarea">
                  {activeActionModal.action === 'ACCEPT' 
                    ? 'Internal Submission Endorsement (Included in recruiter dossier)' 
                    : 'Constructive Feedback for Candidate'}
                </label>
                <textarea
                  id="action-notes-textarea"
                  className="textarea-field"
                  rows={4}
                  required
                  placeholder={
                    activeActionModal.action === 'ACCEPT'
                      ? 'e.g. Reviewed Aarav’s GitHub and MERN architecture work. Strong fit for our Cloud tools team.'
                      : 'e.g. The current requisition requires 4+ years of distributed systems experience. Please re-apply once you gain more cloud exposure.'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveActionModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${activeActionModal.action === 'ACCEPT' ? 'btn-referral' : 'btn-danger'} btn-sm`}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : (activeActionModal.action === 'ACCEPT' ? 'Confirm Endorsement' : 'Decline Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
