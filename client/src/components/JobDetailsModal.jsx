import React from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Check, 
  Sparkles, 
  Send, 
  Bookmark, 
  BookmarkCheck, 
  X, 
  ShieldCheck, 
  Clock,
  ArrowRight
} from 'lucide-react';

export const JobDetailsModal = ({ job, isSaved, onToggleSave, onRequestReferral, onApplyDirect, onOpenMatchIntelligence, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Competitive';
    const minLPA = (salary.min / 100000).toFixed(1);
    const maxLPA = (salary.max / 100000).toFixed(1);
    return `₹${minLPA} - ₹${maxLPA} LPA`;
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px', padding: '2.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem',
              color: 'var(--text-primary)',
              flexShrink: 0
            }}>
              {job.companyName ? job.companyName.charAt(0) : 'C'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</h2>
                {job.allowReferrals && (
                  <span className="badge badge-referrer" style={{ fontSize: '0.725rem' }}>
                    <ShieldCheck size={12} /> Referrals Active
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{job.companyName}</strong>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={13} /> {job.location}
                </span>
                <span>•</span>
                <span className="badge badge-mono">{job.workMode}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onToggleSave && onToggleSave(job._id)}
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              {isSaved ? <BookmarkCheck size={18} color="var(--color-cobalt)" /> : <Bookmark size={18} />}
            </button>
            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Highlight Stats Pill Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          padding: '1rem',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Compensation
            </div>
            <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {formatSalary(job.salary)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Experience
            </div>
            <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {job.experience?.min || 0} - {job.experience?.max || 5} Years
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Requisition Type
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {job.jobType || 'Full-Time'}
            </div>
          </div>
          {job.matchScore !== undefined && (
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Compatibility
              </div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-success)', marginTop: '0.15rem' }}>
                {job.matchScore}% Match
              </div>
            </div>
          )}
        </div>

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Required Technical Competencies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {job.skills.map((s, idx) => (
                <span key={idx} className="skill-chip matched">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Overview */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Role Overview
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Requirements
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              {job.requirements.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '1.5rem'
        }}>
          {onOpenMatchIntelligence && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClose();
                onOpenMatchIntelligence(job);
              }}
            >
              <Sparkles size={14} color="var(--color-cobalt)" /> Match Intelligence
            </button>
          )}

          {job.allowReferrals ? (
            <button
              className="btn btn-referral btn-sm"
              onClick={() => {
                onClose();
                onRequestReferral(job);
              }}
            >
              <Send size={14} /> Request Referral
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                onApplyDirect(job);
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
