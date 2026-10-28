import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Sparkles, 
  Check, 
  Plus, 
  Briefcase, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export const CareerSkillUniverse = ({ onSelectJob }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedRoleCluster, setSelectedRoleCluster] = useState('ALL'); // 'ALL' | 'FRONTEND' | 'BACKEND' | 'AI' | 'DEVOPS'
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [candidateSkills, setCandidateSkills] = useState([]);

  useEffect(() => {
    if (profile?.skills) {
      setCandidateSkills(profile.skills.map(s => s.toLowerCase().trim()));
    }
  }, [profile]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.getJobs({ limit: 50 });
        if (res.success) setJobs(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchJobs();
  }, []);

  // Skill Constellation Map Data
  const skillTaxonomy = [
    // Frontend
    { name: 'react', category: 'FRONTEND', desc: 'Component architecture, Hooks, Virtual DOM', demand: 94, related: ['typescript', 'node.js', 'tailwind css'] },
    { name: 'typescript', category: 'FRONTEND', desc: 'Static typing, interfaces, generics for robust apps', demand: 90, related: ['react', 'node.js'] },
    { name: 'tailwind css', category: 'FRONTEND', desc: 'Utility-first modern styling system', demand: 78, related: ['react', 'css'] },
    // Backend
    { name: 'node.js', category: 'BACKEND', desc: 'Asynchronous event-driven server runtime', demand: 92, related: ['express', 'mongodb', 'redis'] },
    { name: 'express', category: 'BACKEND', desc: 'Fast, minimalist REST API routing engine', demand: 86, related: ['node.js', 'mongodb'] },
    { name: 'mongodb', category: 'BACKEND', desc: 'Flexible document NoSQL database with aggregations', demand: 88, related: ['node.js', 'express'] },
    { name: 'redis', category: 'BACKEND', desc: 'In-memory key-value cache and pub/sub broker', demand: 82, related: ['node.js', 'docker'] },
    // DevOps & Cloud
    { name: 'docker', category: 'DEVOPS', desc: 'Containerization, reproducible microservice runtime', demand: 85, related: ['kubernetes', 'node.js'] },
    { name: 'git', category: 'DEVOPS', desc: 'Distributed version control & collaborative branching', demand: 95, related: ['react', 'node.js'] },
    // AI & Advanced
    { name: 'python', category: 'AI', desc: 'Data science, ML model integration, script automation', demand: 91, related: ['fastapi', 'docker'] },
    { name: 'fastapi', category: 'AI', desc: 'High-performance Python API framework for ML models', demand: 76, related: ['python', 'docker'] }
  ];

  const filteredSkills = selectedRoleCluster === 'ALL'
    ? skillTaxonomy
    : skillTaxonomy.filter(s => s.category === selectedRoleCluster);

  const handleToggleProfileSkill = async (skillName) => {
    const isOwned = candidateSkills.includes(skillName);
    const updated = isOwned
      ? candidateSkills.filter(s => s !== skillName)
      : [...candidateSkills, skillName];

    setCandidateSkills(updated);

    try {
      await api.updateCandidateProfile({ skills: updated });
      await refreshProfile();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <div className="editorial-kicker">
          <Layers size={14} /> TECHNICAL SKILL CONSTELLATION
        </div>
        <h1 className="editorial-title" style={{ fontSize: '2.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
          Interactive Competency Graph
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Explore technical skill clusters demanded across active requisitions. Toggle skills to update your candidate matching baseline in real time.
        </p>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
          {[
            { id: 'ALL', label: 'All Clusters' },
            { id: 'FRONTEND', label: 'Frontend' },
            { id: 'BACKEND', label: 'Backend' },
            { id: 'AI', label: 'AI & Data' },
            { id: 'DEVOPS', label: 'DevOps & Cloud' }
          ].map(c => (
            <button
              key={c.id}
              type="button"
              className={`filter-pill ${selectedRoleCluster === c.id ? 'active' : ''}`}
              onClick={() => setSelectedRoleCluster(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        {/* Constellation Nodes Visual Panel */}
        <div className="surface-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Skill Nodes</h2>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--emerald-success)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-success)' }} /> In Profile
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-tertiary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border-strong)' }} /> Unacquired
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
            {filteredSkills.map((s) => {
              const isOwned = candidateSkills.includes(s.name);
              const isSelected = selectedSkill?.name === s.name;

              return (
                <div
                  key={s.name}
                  onClick={() => setSelectedSkill(s)}
                  className="surface-card surface-card-hover"
                  style={{
                    padding: '1rem',
                    borderColor: isSelected ? 'var(--color-cobalt)' : isOwned ? 'rgba(16, 117, 72, 0.4)' : undefined,
                    background: isSelected ? 'var(--color-cobalt-subtle)' : isOwned ? 'var(--emerald-bg)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="badge badge-mono" style={{ fontSize: '0.65rem' }}>
                      {s.category}
                    </span>
                    {isOwned && (
                      <span style={{ color: 'var(--emerald-success)', fontSize: '0.725rem', fontWeight: 700 }}>
                        ✓ Added
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.975rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                    {s.name}
                  </div>

                  <div style={{ marginTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                      <span>Requisition Demand:</span>
                      <strong className="font-mono" style={{ color: 'var(--color-cobalt)' }}>{s.demand}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Skill Detail Inspector Panel */}
        <div className="surface-card" style={{ padding: '1.75rem' }}>
          {selectedSkill ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="badge badge-candidate">
                    {selectedSkill.category} CLUSTER
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-cobalt)', fontWeight: 700 }}>
                    {selectedSkill.demand}% Industry Frequency
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                  {selectedSkill.name}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {selectedSkill.desc}
                </p>
              </div>

              {/* Profile Toggle Button */}
              {user?.role === 'CANDIDATE' && (
                <button
                  type="button"
                  className={`btn ${candidateSkills.includes(selectedSkill.name) ? 'btn-secondary' : 'btn-cobalt'} btn-sm`}
                  onClick={() => handleToggleProfileSkill(selectedSkill.name)}
                >
                  {candidateSkills.includes(selectedSkill.name) ? (
                    <>✓ Active in Your Profile (Click to Remove)</>
                  ) : (
                    <><Plus size={14} /> Add {selectedSkill.name} to Profile</>
                  )}
                </button>
              )}

              {/* Related Technologies */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Frequently Paired Technologies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {selectedSkill.related.map((rel) => (
                    <span key={rel} className="badge badge-mono">
                      + {rel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requisitions Requiring this skill */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
                  Live Requisitions Requiring {selectedSkill.name}
                </h3>
                {jobs.filter(j => j.skills?.some(s => s.toLowerCase().trim() === selectedSkill.name)).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {jobs
                      .filter(j => j.skills?.some(s => s.toLowerCase().trim() === selectedSkill.name))
                      .map((job) => (
                        <div
                          key={job._id}
                          className="surface-card surface-card-hover"
                          onClick={() => onSelectJob && onSelectJob(job)}
                          style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{job.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{job.companyName} • {job.workMode}</div>
                          </div>
                          <ArrowRight size={14} color="var(--color-cobalt)" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
                    No active requisitions currently require this exact skill.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Layers size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Select a Skill Node
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Click any node on the left to inspect market frequency, paired technologies, and open requisitions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
