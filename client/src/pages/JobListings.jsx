import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  ArrowRight,
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  Send, 
  DollarSign, 
  Clock, 
  Check, 
  X,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export const JobListings = ({ 
  onRequestReferral, 
  onApplyDirect, 
  onViewDetails, 
  onOpenMatchIntelligence,
  savedJobIds = [],
  onToggleSave
}) => {
  const { user, profile, role, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'salary' | 'match'
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  
  // Selected Job for Split-View Inspection
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (workMode) params.workMode = workMode;

      const res = await api.getJobs(params);
      if (res.success) {
        setJobs(res.data);
        if (res.data.length > 0 && !selectedJob) {
          setSelectedJob(res.data[0]);
        }
      } else {
        setError(res.message || 'Failed to retrieve jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Network error fetching job requisitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [workMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  // Transparent skill compatibility calculation
  const candidateSkills = useMemo(() => {
    if (!profile?.skills) return [];
    return profile.skills.map(s => s.toLowerCase().trim());
  }, [profile]);

  // Compute enriched jobs with match scores and sorting
  const processedJobs = useMemo(() => {
    let list = [...jobs];

    // Filter saved if toggled
    if (filterSavedOnly) {
      list = list.filter(j => savedJobIds.includes(j._id));
    }

    // Enrich with transparent skill matching if candidate
    list = list.map(job => {
      if (candidateSkills.length > 0 && job.skills && job.skills.length > 0) {
        const required = job.skills.map(s => s.toLowerCase().trim());
        const matched = required.filter(r => candidateSkills.includes(r));
        const score = Math.round((matched.length / required.length) * 100);
        return { ...job, matchScore: score, matchedSkills: matched };
      }
      return job;
    });

    // Sorting
    if (sortBy === 'salary') {
      list.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
    } else if (sortBy === 'match') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return list;
  }, [jobs, candidateSkills, sortBy, filterSavedOnly, savedJobIds]);

  // Keep selected job updated if list changes
  useEffect(() => {
    if (processedJobs.length > 0 && (!selectedJob || !processedJobs.find(j => j._id === selectedJob._id))) {
      setSelectedJob(processedJobs[0]);
    }
  }, [processedJobs]);

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Competitive';
    const minLPA = (salary.min / 100000).toFixed(1);
    const maxLPA = (salary.max / 100000).toFixed(1);
    return `₹${minLPA} - ₹${maxLPA} LPA`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Editorial Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        <div>
          <div className="editorial-kicker">
            <Briefcase size={14} /> OPPORTUNITY DISCOVERY
          </div>
          <h1 className="editorial-title" style={{ fontSize: '2.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
            Open Engineering Requisitions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            Compare technical roles side-by-side with verified employee referral channels and transparent skill breakdowns.
          </p>
        </div>

        {/* Filter Controls Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isAuthenticated && role === 'CANDIDATE' && (
            <button
              className={`filter-pill ${filterSavedOnly ? 'active' : ''}`}
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              style={{ fontSize: '0.8rem' }}
            >
              <Bookmark size={13} /> Saved ({savedJobIds.length})
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <label htmlFor="job-sort-select" className="font-mono">Sort:</label>
            <select
              id="job-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.825rem', width: 'auto' }}
            >
              <option value="newest">Recent Requisitions</option>
              <option value="salary">Compensation (High to Low)</option>
              {candidateSkills.length > 0 && <option value="match">Skill Match %</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Search Input & Mode Filter Bar */}
      <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <label htmlFor="job-search-input" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
              Search Positions
            </label>
            <input
              id="job-search-input"
              type="text"
              className="input-field"
              placeholder="Search roles by title, company, or skills (e.g. React, Node.js, MERN)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem', paddingRight: search ? '2rem' : '0.95rem' }}
            />
            <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); fetchJobs(); }}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.2rem' }}
                aria-label="Clear search text"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-bar">
            {['ALL', 'REMOTE', 'HYBRID', 'ONSITE'].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`filter-pill ${workMode === (mode === 'ALL' ? '' : mode) ? 'active' : ''}`}
                onClick={() => setWorkMode(mode === 'ALL' ? '' : mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <button type="submit" className="btn btn-cobalt btn-sm" style={{ padding: '0.7rem 1.25rem' }}>
            Filter
          </button>
        </form>
      </div>

      {/* Main Split-View Workspace */}
      {loading ? (
        <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Loading active engineering requisitions...
        </div>
      ) : error ? (
        <div className="surface-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--rose-danger)' }}>
          <AlertCircle size={28} style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Unable to load jobs</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchJobs}>
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      ) : processedJobs.length === 0 ? (
        <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <Briefcase size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>No matching opportunities found</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Try broadening your search keywords or switching work mode filters.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => { setSearch(''); setWorkMode(''); setFilterSavedOnly(false); fetchJobs(); }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="split-view-container">
          {/* Left Pane: Scannable List of Requisitions */}
          <div className="split-list-pane" role="region" aria-label="Requisitions List">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0.25rem 0.25rem' }}>
              Showing {processedJobs.length} {processedJobs.length === 1 ? 'position' : 'positions'}
            </div>

            {processedJobs.map((job) => {
              const isSelected = selectedJob?._id === job._id;
              const isSaved = savedJobIds.includes(job._id);

              return (
                <div
                  key={job._id}
                  className={`job-item-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedJob(job)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedJob(job)}
                  aria-selected={isSelected}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {job.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        <strong>{job.companyName}</strong>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>

                    {job.matchScore !== undefined && (
                      <span className={`match-score-badge ${job.matchScore >= 70 ? 'high' : job.matchScore >= 40 ? 'medium' : 'low'}`} style={{ fontSize: '0.725rem' }}>
                        {job.matchScore}%
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                    <span className="badge badge-mono">{job.workMode || 'REMOTE'}</span>
                    <span className="badge badge-mono">{formatSalary(job.salary)}</span>
                    {job.allowReferrals && (
                      <span className="badge badge-referrer" style={{ fontSize: '0.7rem' }}>
                        <ShieldCheck size={11} /> Referral Active
                      </span>
                    )}
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {job.skills.slice(0, 3).map((s, i) => (
                        <span key={i} className={`skill-chip ${candidateSkills.includes(s.toLowerCase().trim()) ? 'matched' : ''}`}>
                          {s}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="skill-chip" style={{ color: 'var(--text-tertiary)' }}>
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Pane: Selected Job Specifications */}
          {selectedJob && (
            <div className="split-details-pane surface-card" style={{ padding: '2rem' }} role="region" aria-label="Requisition Specifications">
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    flexShrink: 0
                  }}>
                    {selectedJob.companyName?.charAt(0) || 'C'}
                  </div>

                  <div>
                    <div className="editorial-kicker">
                      {selectedJob.companyName} • VERIFIED REQUISITION
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {selectedJob.title}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} /> {selectedJob.location}
                      </span>
                      <span>•</span>
                      <span className="badge badge-mono">{selectedJob.workMode}</span>
                      <span>•</span>
                      <span className="badge badge-mono">{selectedJob.jobType || 'FULL_TIME'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onToggleSave && onToggleSave(selectedJob._id)}
                    title={savedJobIds.includes(selectedJob._id) ? "Remove from bookmarks" : "Save requisition"}
                  >
                    {savedJobIds.includes(selectedJob._id) ? <BookmarkCheck size={16} color="var(--color-cobalt)" /> : <Bookmark size={16} />}
                  </button>
                  {onOpenMatchIntelligence && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenMatchIntelligence(selectedJob)}
                      title="Inspect full match intelligence audit"
                    >
                      <Sparkles size={14} color="var(--color-cobalt)" /> Match Audit
                    </button>
                  )}
                </div>
              </div>

              {/* Compensation & Experience Bands */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Annual Compensation
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {formatSalary(selectedJob.salary)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Experience Requirement
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {selectedJob.experience?.min || 0} - {selectedJob.experience?.max || 5} Years
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Referral Status
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: selectedJob.allowReferrals ? 'var(--emerald-success)' : 'var(--text-tertiary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={14} /> {selectedJob.allowReferrals ? 'Referrals Open' : 'Direct Apply Only'}
                  </div>
                </div>
              </div>

              {/* Transparent Skill Compatibility Section */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    Required Technical Competencies
                  </h3>
                  {selectedJob.matchScore !== undefined && (
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--emerald-success)', fontWeight: 600 }}>
                      {selectedJob.matchScore}% Skill Match
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {selectedJob.skills?.map((skill, index) => {
                    const isMatched = candidateSkills.includes(skill.toLowerCase().trim());
                    return (
                      <span 
                        key={index} 
                        className={`skill-chip ${isMatched ? 'matched' : 'missing'}`}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}
                      >
                        {isMatched ? <Check size={12} /> : null}
                        {skill}
                        {isMatched ? ' (Matched)' : ''}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Role Description */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Role Overview
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.925rem' }}>
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements List */}
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                    Key Requisition Requirements
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Company Benefits & Stipends
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {selectedJob.benefits.map((benefit, idx) => (
                      <span key={idx} className="badge badge-mono">
                        ✓ {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                {selectedJob.allowReferrals ? (
                  <button
                    className="btn btn-referral btn-lg"
                    style={{ flex: 1 }}
                    onClick={() => onRequestReferral && onRequestReferral(selectedJob)}
                  >
                    <Send size={15} /> Request Employee Referral
                  </button>
                ) : null}

                <button
                  className="btn btn-secondary btn-lg"
                  style={{ flex: selectedJob.allowReferrals ? 'none' : 1 }}
                  onClick={() => onApplyDirect && onApplyDirect(selectedJob)}
                >
                  Direct Application
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
