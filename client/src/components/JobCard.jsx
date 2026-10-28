import React from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck,
  ShieldCheck, 
  ArrowRight,
  Send
} from 'lucide-react';

export const JobCard = ({ 
  job, 
  isSaved, 
  onToggleSave, 
  onApply, 
  onRequestReferral, 
  onViewDetails, 
  onOpenMatchIntelligence,
  userRole 
}) => {
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Competitive';
    const minLPA = (salary.min / 100000).toFixed(1);
    const maxLPA = (salary.max / 100000).toFixed(1);
    return `₹${minLPA} - ₹${maxLPA} LPA`;
  };

  const getMatchScoreClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  return (
    <article 
      className="surface-card surface-card-hover" 
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
    >
      <div>
        {/* Top Header: Company initial mark, Title, Save & Match Score */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              flexShrink: 0
            }}>
              {job.companyName ? job.companyName.charAt(0) : 'C'}
            </div>
            <div>
              <h3 
                tabIndex={0}
                style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: 700,
                  color: 'var(--text-primary)', 
                  cursor: 'pointer', 
                  lineHeight: 1.3
                }}
                onClick={() => onViewDetails && onViewDetails(job)}
                onKeyDown={(e) => e.key === 'Enter' && onViewDetails && onViewDetails(job)}
              >
                {job.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{job.companyName}</strong>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <MapPin size={12} /> {job.location || 'Remote'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            {job.matchScore !== undefined && (
              <div 
                className={`match-score-badge ${getMatchScoreClass(job.matchScore)}`}
                onClick={() => onOpenMatchIntelligence && onOpenMatchIntelligence(job)}
                title="View skill match breakdown"
              >
                <Sparkles size={12} />
                <span>{job.matchScore}% Match</span>
              </div>
            )}

            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.35rem', color: isSaved ? 'var(--color-cobalt)' : 'var(--text-tertiary)' }}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleSave) onToggleSave(job._id);
              }}
              aria-label={isSaved ? "Remove from bookmarks" : "Save opportunity"}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          </div>
        </div>

        {/* Badges: Mode, Experience, Compensation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <span className="badge badge-mono">
            {job.workMode || 'REMOTE'}
          </span>
          <span className="badge badge-mono">
            {job.experience?.min || 0} - {job.experience?.max || 5} yrs exp
          </span>
          <span className="badge badge-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {formatSalary(job.salary)}
          </span>
          {job.allowReferrals && (
            <span className="badge badge-referrer" style={{ fontSize: '0.725rem' }}>
              <ShieldCheck size={12} /> Referrals Active
            </span>
          )}
        </div>

        {/* Skills Snippet */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.15rem' }}>
            {job.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-chip">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="skill-chip" style={{ color: 'var(--text-tertiary)' }}>
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
        gap: '0.5rem'
      }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onViewDetails && onViewDetails(job)}
          style={{ fontSize: '0.825rem', paddingLeft: 0 }}
        >
          View Specifications <ArrowRight size={13} />
        </button>

        <div style={{ display: 'flex', gap: '0.45rem' }}>
          {job.allowReferrals ? (
            <button
              className="btn btn-referral btn-sm"
              onClick={() => onRequestReferral && onRequestReferral(job)}
            >
              <Send size={13} /> Request Referral
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onApply && onApply(job)}
            >
              Direct Apply
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
