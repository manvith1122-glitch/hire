import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { JobCard } from '../components/JobCard';
import { ReferralUniverse3D } from '../components/ReferralUniverse3D';
import { 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Layers, 
  Compass,
  Briefcase,
  FileText,
  Clock,
  Lock
} from 'lucide-react';

export const LandingPage = ({ 
  onExploreJobs, 
  onExploreReferrers, 
  onOpenSkillUniverse, 
  onOpenCopilot, 
  onRequestReferral, 
  onApplyDirect, 
  onViewJobDetails,
  onOpenMatchIntelligence,
  onOpenAuth,
  savedJobIds = [],
  onToggleSaveJob
}) => {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState('ALL');

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (workMode) params.workMode = workMode;

      const res = await api.getJobs(params);
      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load featured jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [workMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      {/* =========================================================================
          HERO SECTION: ASYMMETRICAL EDITORIAL ARCHITECTURE & 3D NETWORK
          ========================================================================= */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
        gap: '3.5rem',
        alignItems: 'center',
        paddingTop: '1rem',
        minHeight: '540px'
      }} className="hero-grid">
        {/* Left Column: Editorial Headline & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div className="editorial-kicker">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-cobalt)' }} />
            PROFESSIONAL REFERRAL MARKETPLACE
          </div>

          <h1 className="editorial-title" style={{
            fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            lineHeight: 1.12
          }}>
            Good opportunities start with the <span style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--color-cobalt)' }}>right people.</span>
          </h1>

          <p className="editorial-lead" style={{ maxWidth: '540px' }}>
            Find roles that fit your skills, connect with relevant employees at leading technology teams, and navigate your referral journey with complete transparency.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={onExploreJobs}
            >
              Explore Opportunities <ArrowRight size={17} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={onExploreReferrers}
            >
              Find a Referrer
            </button>
          </div>

          {/* Quick Platform Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '0.5rem'
          }}>
            <div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Verified Referrers
              </div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                &lt; 48 hrs
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Median Response
              </div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Transparent
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Skill Compatibility
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Signature 3D Spatial Canvas */}
        <div style={{ width: '100%' }}>
          <ReferralUniverse3D 
            onSelectJob={onViewJobDetails}
            onExploreReferrers={onExploreReferrers}
            onExploreJobs={onExploreJobs}
          />
        </div>
      </section>

      {/* =========================================================================
          INTEGRATED SEARCH & FILTER BAR
          ========================================================================= */}
      <section className="surface-card" style={{ padding: '1.75rem 2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Find Open Positions
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Search across live engineering requisitions with direct internal referral support.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
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
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <label htmlFor="landing-search-input" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                Search Open Positions
              </label>
              <input
                id="landing-search-input"
                type="text"
                className="input-field"
                placeholder="Search by role, company, or key skills (e.g. React, Node.js, MERN)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn btn-cobalt" style={{ padding: '0 1.5rem' }}>
              Search Positions
            </button>
          </div>
        </form>
      </section>

      {/* =========================================================================
          FEATURED OPPORTUNITIES: EDITORIAL LISTING GRID
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="editorial-kicker">
              <Briefcase size={14} /> LIVE REQUISITIONS
            </div>
            <h2 className="editorial-title" style={{ fontSize: '1.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
              Featured Opportunities
            </h2>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onExploreJobs}
          >
            Browse All Requisitions <ArrowRight size={14} />
          </button>
        </div>

        {loadingJobs ? (
          <div className="surface-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            Retrieving verified opportunities from application database...
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid-3">
            {jobs.slice(0, 6).map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobIds.includes(job._id)}
                onToggleSave={onToggleSaveJob}
                onApply={onApplyDirect}
                onRequestReferral={onRequestReferral}
                onViewDetails={onViewJobDetails}
                onOpenMatchIntelligence={onOpenMatchIntelligence}
              />
            ))}
          </div>
        ) : (
          <div className="surface-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No open positions matched your filter.</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Try adjusting your search criteria or resetting filters.
            </p>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearch(''); setWorkMode(''); fetchJobs(); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          HOW IT WORKS: 3-STAGE EDITORIAL WORKFLOW
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <div className="editorial-kicker">
            <Compass size={14} /> THE REFERRAL WORKFLOW
          </div>
          <h2 className="editorial-title" style={{ fontSize: '1.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
            How ReferHire Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            A structured, merit-focused pathway from skill discovery to internal submission.
          </p>
        </div>

        <div className="grid-3">
          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-cobalt)' }}>
              01
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Discover & Align
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Explore open positions with complete visibility into required technical skills, experience bands, compensation ranges, and match percentages.
            </p>
          </div>

          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--emerald-success)' }}>
              02
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Connect with Insiders
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Identify employees at your target companies who have verified corporate emails. Review their referral criteria and background before reaching out.
            </p>
          </div>

          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              03
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Submit & Track
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Send personalized referral requests with project highlights and resume context. Receive transparent updates as referrers review and submit your profile.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRUST & VERIFICATION PROTOCOL
          ========================================================================= */}
      <section className="surface-card" style={{ padding: '2.5rem', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '820px' }}>
          <div className="editorial-kicker" style={{ color: 'var(--emerald-success)' }}>
            <ShieldCheck size={14} /> VERIFICATION PROTOCOL
          </div>
          <h2 className="editorial-title" style={{ fontSize: '1.75rem', fontWeight: 600, margin: '0.35rem 0 0.85rem' }}>
            Built on Institutional Trust
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Every referrer on ReferHire is authenticated through corporate email verification (@google.com, @microsoft.com, etc.). ReferHire enforces strict anti-spam guidelines: referrers endorse candidates based on verified skill alignment, not monetary transactions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <CheckCircle2 size={18} color="var(--emerald-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Corporate Domain Checks</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Referrers must prove active employment before reviewing requests.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <Lock size={18} color="var(--color-cobalt)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Privacy First</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Candidate contact information is shared only upon explicit mutual acceptance.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <TrendingUp size={18} color="var(--amber-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Transparent Match Metrics</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Compatibility percentages explain which skills overlap and which are missing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL EDITORIAL CTA
          ========================================================================= */}
      <section style={{
        background: 'var(--text-primary)',
        color: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 className="editorial-title" style={{ fontSize: '2rem', color: 'var(--bg-surface)', fontWeight: 600 }}>
            Ready to advance your referral journey?
          </h2>
          <p style={{ color: 'var(--text-on-dark-muted)', fontSize: '1rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Browse verified opportunities, explore insider referrers, and receive transparent status updates on every application.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-cobalt btn-lg"
            onClick={onExploreJobs}
          >
            Explore Requisitions <ArrowRight size={16} />
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={onOpenAuth}
            style={{ background: 'transparent', color: 'var(--bg-surface)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            Create Profile
          </button>
        </div>
      </section>
    </div>
  );
};
