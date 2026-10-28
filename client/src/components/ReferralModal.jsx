import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  ShieldCheck,
  FileText 
} from 'lucide-react';
import { ReferralMessageBuilder } from './ReferralMessageBuilder';

export const ReferralModal = ({ job, onClose, onSuccess }) => {
  const { user, profile } = useAuth();
  const [referrers, setReferrers] = useState([]);
  const [selectedReferrerId, setSelectedReferrerId] = useState('');
  const [showAiBuilder, setShowAiBuilder] = useState(false);
  const [pitchMessage, setPitchMessage] = useState(
    `Hi! I noticed this open role at ${job?.companyName || 'your company'} and believe my experience with ${(job?.skills || ['React', 'Node.js']).slice(0, 3).join(', ')} aligns well. I would appreciate your referral consideration!`
  );
  const [resumeUrl, setResumeUrl] = useState(profile?.resume?.url || 'https://example.com/my-resume.pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchReferrers = async () => {
      try {
        const res = await api.getActiveReferrers(job.companyName);
        if (res.success && res.data?.length > 0) {
          setReferrers(res.data);
          setSelectedReferrerId(res.data[0].userId._id);
        } else {
          // If no specific company referrer, fetch all active referrers
          const allRes = await api.getActiveReferrers();
          if (allRes.success && allRes.data?.length > 0) {
            setReferrers(allRes.data);
            setSelectedReferrerId(allRes.data[0].userId._id);
          }
        }
      } catch (err) {
        console.error('Failed to load referrers', err);
      }
    };

    if (job) {
      fetchReferrers();
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReferrerId) {
      setError('Please select an active company referrer.');
      return;
    }
    if (!pitchMessage.trim()) {
      setError('Please compose a personalized message for the referrer.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.requestReferral({
        jobId: job._id,
        referrerId: selectedReferrerId,
        pitchMessage,
        resumeUrl
      });

      if (res.success) {
        onSuccess(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit referral request.');
    } finally {
      setLoading(false);
    }
  };

  const selectedReferrerObj = referrers.find(r => r.userId?._id === selectedReferrerId);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '2.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
          <div>
            <div className="editorial-kicker">
              <ShieldCheck size={13} /> DIRECT REFERRAL REQUEST
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Request Referral: {job?.title}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Target Organization: <strong style={{ color: 'var(--text-primary)' }}>{job?.companyName}</strong>
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Referrer Selection Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="referral-select-referrer">Select Verified Employee Referrer:</label>
            {referrers.length > 0 ? (
              <select
                id="referral-select-referrer"
                className="select-field"
                value={selectedReferrerId}
                onChange={(e) => setSelectedReferrerId(e.target.value)}
              >
                {referrers.map((ref) => (
                  <option key={ref._id} value={ref.userId?._id}>
                    {ref.userId?.name} — {ref.role} ({ref.companyName}) ★ {ref.rating || '4.9'}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', padding: '0.5rem 0' }}>
                Loading verified referrers for {job?.companyName}...
              </div>
            )}
          </div>

          {/* Referrer Profile Summary Snippet */}
          {selectedReferrerObj && (
            <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedReferrerObj.userId?.name}</strong> • {selectedReferrerObj.role} ({selectedReferrerObj.department || 'Engineering'})
              </div>
              {selectedReferrerObj.referralCriteria?.customNotes && (
                <div style={{ marginTop: '0.25rem', fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                  "{selectedReferrerObj.referralCriteria.customNotes}"
                </div>
              )}
            </div>
          )}

          {/* AI Message Builder Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="form-label" htmlFor="referral-pitch-textarea" style={{ marginBottom: 0 }}>
              Personalized Introduction & Pitch
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowAiBuilder(!showAiBuilder)}
              style={{ fontSize: '0.775rem', color: 'var(--color-cobalt)' }}
            >
              <Sparkles size={13} /> {showAiBuilder ? 'Hide Pitch Assistant' : 'Use Pitch Assistant'}
            </button>
          </div>

          {showAiBuilder && (
            <ReferralMessageBuilder
              companyName={job?.companyName}
              jobTitle={job?.title}
              referrerName={selectedReferrerObj?.userId?.name}
              candidateSkills={job?.skills}
              onSelectPitch={(generated) => setPitchMessage(generated)}
              onClose={() => setShowAiBuilder(false)}
            />
          )}

          {/* Text Area with Character Counter */}
          <div>
            <textarea
              id="referral-pitch-textarea"
              className="textarea-field"
              rows={4}
              maxLength={600}
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              placeholder="Write a concise note highlighting your skill alignment and experience..."
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>
              <span>Keep messages concise and focused on measurable engineering impact.</span>
              <span className="font-mono">{pitchMessage.length} / 600</span>
            </div>
          </div>

          {/* Resume & Portfolio URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="referral-resume-url">Resume / Portfolio URL</label>
            <input
              id="referral-resume-url"
              type="url"
              className="input-field"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/... or portfolio link"
              required
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-referral btn-sm"
              disabled={loading || !selectedReferrerId}
            >
              <Send size={14} /> {loading ? 'Submitting Request...' : 'Send Referral Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
