import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { 
  UserCheck, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  Send, 
  Search, 
  CheckCircle2, 
  Star, 
  Award, 
  Check, 
  Clock, 
  Info,
  ArrowRight,
  Filter
} from 'lucide-react';

export const ReferrersDirectory = ({ onRequestReferralForCompany }) => {
  const [referrers, setReferrers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');

  const fetchReferrers = async () => {
    setLoading(true);
    try {
      const res = await api.getActiveReferrers(search);
      if (res.success) {
        setReferrers(res.data);
      }
    } catch (err) {
      console.error('Failed to load active referrers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReferrers();
  };

  // Distinct company list
  const companyList = useMemo(() => {
    const set = new Set();
    referrers.forEach(r => {
      if (r.companyName) set.add(r.companyName);
    });
    return Array.from(set);
  }, [referrers]);

  // Filtered referrers
  const filteredReferrers = useMemo(() => {
    return referrers.filter(r => {
      const matchesCompany = selectedCompany === 'ALL' || r.companyName === selectedCompany;
      const matchesSearch = !search || 
        r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        r.role?.toLowerCase().includes(search.toLowerCase()) ||
        r.department?.toLowerCase().includes(search.toLowerCase());
      return matchesCompany && matchesSearch;
    });
  }, [referrers, selectedCompany, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <div className="editorial-kicker">
          <ShieldCheck size={14} /> VERIFIED EMPLOYEE DIRECTORY
        </div>
        <h1 className="editorial-title" style={{ fontSize: '2.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
          Find Corporate Referrers
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Connect with active engineers and engineering leads verified through corporate domain emails. Review their specific referral criteria before requesting an internal endorsement.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="surface-card" style={{ padding: '1.25rem 1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <label htmlFor="referrer-search-input" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
              Search Referrers
            </label>
            <input 
              id="referrer-search-input"
              type="text" 
              className="input-field" 
              placeholder="Search by engineer name, target company, role, or department..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem', paddingRight: search ? '2rem' : '0.95rem' }}
            />
            <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); fetchReferrers(); }}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.2rem' }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-bar">
            <button
              type="button"
              className={`filter-pill ${selectedCompany === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCompany('ALL')}
            >
              All Companies
            </button>
            {companyList.map(comp => (
              <button
                key={comp}
                type="button"
                className={`filter-pill ${selectedCompany === comp ? 'active' : ''}`}
                onClick={() => setSelectedCompany(comp)}
              >
                {comp}
              </button>
            ))}
          </div>

          <button type="submit" className="btn btn-cobalt btn-sm" style={{ padding: '0.7rem 1.25rem' }}>
            Filter
          </button>
        </form>
      </div>

      {/* Verification Standards Callout */}
      <div style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <Info size={16} color="var(--color-cobalt)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Referral Transparency:</strong> Referrers only review candidates whose experience matches their stated preferred criteria. Private personal contact information is never disclosed without mutual authorization.
        </span>
      </div>

      {/* Referrers Directory Grid */}
      {loading ? (
        <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Loading verified corporate referrers...
        </div>
      ) : filteredReferrers.length > 0 ? (
        <div className="grid-2">
          {filteredReferrers.map((ref) => (
            <article 
              key={ref._id} 
              className="surface-card surface-card-hover" 
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}
            >
              <div>
                {/* Referrer Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <img 
                      src={ref.userId?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${ref.userId?.name}`} 
                      alt={ref.userId?.name}
                      style={{ 
                        width: '52px', 
                        height: '52px', 
                        borderRadius: 'var(--radius-full)', 
                        objectFit: 'cover', 
                        border: '2px solid var(--emerald-success)' 
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {ref.userId?.name}
                        </h2>
                        {ref.isCompanyVerified && (
                          <span title="Corporate Domain Verified">
                            <CheckCircle2 size={16} color="var(--emerald-success)" />
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{ref.companyName}</strong>
                        <span>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{ref.role}</span>
                      </div>

                      {ref.department && (
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>
                          {ref.department}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="badge badge-referrer" style={{ flexShrink: 0 }}>
                    <ShieldCheck size={12} /> Verified Insider
                  </span>
                </div>

                {/* Reputation & Activity Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ★ {ref.rating || '4.9'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      Rating
                    </div>
                  </div>
                  <div>
                    <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ref.totalReferralsProvided || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      Endorsed
                    </div>
                  </div>
                  <div>
                    <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-success)' }}>
                      {ref.successfulHires || 0}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      Hired
                    </div>
                  </div>
                </div>

                {/* Stated Referral Criteria */}
                {ref.referralCriteria && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                      Referrer Criteria:
                    </div>

                    {ref.referralCriteria.customNotes && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.65rem', fontStyle: 'italic' }}>
                        "{ref.referralCriteria.customNotes}"
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-mono">
                        Min. {ref.referralCriteria.minimumExperienceYears || 1} yrs experience
                      </span>
                      {ref.referralCriteria.preferredSkills?.map((skill, sIdx) => (
                        <span key={sIdx} className="skill-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '0.5rem'
              }}>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>
                  Accepting verified requests
                </span>

                <button
                  className="btn btn-referral btn-sm"
                  onClick={() => {
                    if (onRequestReferralForCompany) {
                      onRequestReferralForCompany(ref.companyName);
                    }
                  }}
                >
                  <Send size={13} /> View {ref.companyName} Requisitions
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="surface-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <Briefcase size={32} color="var(--text-tertiary)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>No referrers found</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            No verified employees match the current filter.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => { setSearch(''); setSelectedCompany('ALL'); fetchReferrers(); }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
