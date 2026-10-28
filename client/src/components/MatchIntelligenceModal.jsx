import React from 'react';
import { 
  Sparkles, 
  Check, 
  AlertCircle, 
  Briefcase, 
  MapPin, 
  Clock, 
  X, 
  Send, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const MatchIntelligenceModal = ({ job, candidateProfile, onClose, onRequestReferral, onApplyDirect }) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const candidateSkills = (candidateProfile?.skills || []).map(s => s.toLowerCase().trim());
  const jobSkills = (job.skills || []).map(s => s.toLowerCase().trim());

  const matchedSkills = jobSkills.filter(s => candidateSkills.some(cs => cs === s || cs.includes(s) || s.includes(cs)));
  const missingSkills = jobSkills.filter(s => !candidateSkills.some(cs => cs === s || cs.includes(s) || s.includes(cs)));

  const candidateExp = candidateProfile?.experienceYears || 2;
  const expMet = candidateExp >= (job.experience?.min || 0);

  const matchPercentage = job.matchScore !== undefined
    ? job.matchScore
    : Math.round((matchedSkills.length / Math.max(1, jobSkills.length)) * 100);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '2.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
          <div>
            <div className="editorial-kicker">
              <Sparkles size={13} /> TRANSPARENT MATCH INTELLIGENCE
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {job.title}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {job.companyName} • {job.location} ({job.workMode})
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Big Overall Score Card */}
        <div style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Skill Compatibility Score
            </div>
            <div className="font-mono" style={{ fontSize: '2.25rem', fontWeight: 800, color: matchPercentage >= 70 ? 'var(--emerald-success)' : 'var(--amber-warning)', lineHeight: 1.1 }}>
              {matchPercentage}% Fit
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              {matchedSkills.length} of {jobSkills.length} required competencies matched
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
            <span className={`badge ${expMet ? 'badge-referrer' : 'badge-admin'}`} style={{ fontSize: '0.75rem' }}>
              {expMet ? '✓ Experience Requirement Met' : '○ Under Experience Bar'}
            </span>
            <span className="badge badge-mono">
              ✓ Work Mode: {job.workMode}
            </span>
          </div>
        </div>

        {/* Detailed Competency Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Matched Skills */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--emerald-success)', fontWeight: 700, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Check size={14} /> YOUR MATCHED SKILLS ({matchedSkills.length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {matchedSkills.length > 0 ? (
                matchedSkills.map(skill => (
                  <span key={skill} className="skill-chip matched">
                    <Check size={11} /> {skill}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>No exact matches detected in your profile skills.</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={14} /> REQUISITION SKILL GAPS ({missingSkills.length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {missingSkills.length > 0 ? (
                missingSkills.map(skill => (
                  <span key={skill} className="skill-chip missing">
                    ○ {skill}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.825rem', color: 'var(--emerald-success)', fontWeight: 600 }}>100% full skill coverage!</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Close Audit
          </button>

          {job.allowReferrals ? (
            <button
              type="button"
              className="btn btn-referral btn-sm"
              onClick={() => {
                onClose();
                if (onRequestReferral) onRequestReferral(job);
              }}
            >
              <Send size={13} /> Proceed to Request Referral
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                if (onApplyDirect) onApplyDirect(job);
              }}
            >
              Apply Direct
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
