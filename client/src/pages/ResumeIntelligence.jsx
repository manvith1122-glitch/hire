import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Upload, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const ResumeIntelligence = ({ onExploreJobs }) => {
  const { profile } = useAuth();
  const [resumeText, setResumeText] = useState(
    `Aarav Sharma — Full-Stack MERN Developer
Location: Bengaluru, India | Email: candidate@referhire.com

PROFESSIONAL EXPERIENCE:
Junior Full Stack Engineer | HyperScale Labs (2023 - Present)
- Engineered customer management dashboards with React, Node.js, and MongoDB serving 40k+ monthly active users.
- Reduced database query latency by 35% through MongoDB compound indexing and Redis caching layers.
- Automated Docker container deployments across AWS staging clusters using Git and CI/CD pipelines.

TECHNICAL SKILLS:
Languages & Frameworks: React, Node.js, Express, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS
Databases & Cloud: MongoDB, Redis, Docker, Git, REST APIs, Microservices Architecture`
  );
  const [targetJobRole, setTargetJobRole] = useState('MERN Stack Developer (Google)');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    try {
      const res = await api.analyzeResume({
        resumeText,
        targetJobSkills: ['react', 'node.js', 'mongodb', 'express', 'git', 'docker', 'typescript', 'kubernetes']
      });

      if (res.success) {
        setAnalysis(res.data);
      }
    } catch (err) {
      alert(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Title */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <div className="editorial-kicker">
          <FileText size={14} /> RESUME & PROFILE BENCHMARK
        </div>
        <h1 className="editorial-title" style={{ fontSize: '2.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
          Referral-Readiness Diagnostic
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Audit your technical resume and profile summary against real engineering requisitions. Identify missing competency keywords before submitting an employee referral request.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        {/* Input Panel */}
        <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Resume Source & Requisition Target
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Paste your resume or experience summary to evaluate technical keyword coverage.
            </p>
          </div>

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="target-role-spec">Target Role Specification</label>
              <input
                id="target-role-spec"
                type="text"
                className="input-field"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" htmlFor="resume-text-input">Resume / Experience Text</label>
              <textarea
                id="resume-text-input"
                className="textarea-field font-mono"
                style={{ flex: 1, minHeight: '280px', fontSize: '0.825rem', lineHeight: 1.5 }}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-cobalt"
              disabled={loading}
              style={{ padding: '0.75rem' }}
            >
              <Sparkles size={15} />
              <span>{loading ? 'Evaluating Competencies...' : 'Run Readiness Audit'}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.75rem' }}>
          {analysis ? (
            <>
              {/* Score Header */}
              <div style={{
                background: 'var(--bg-subtle)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Referral Readiness Score
                  </div>
                  <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: analysis.score >= 80 ? 'var(--emerald-success)' : 'var(--amber-warning)', lineHeight: 1.1 }}>
                    {analysis.score} / 100
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    Readiness: <strong style={{ color: 'var(--text-primary)' }}>{analysis.score >= 80 ? 'Referral Endorsement Recommended' : 'Recommend Polish Before Request'}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {analysis.extractedSkills?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Keywords Detected
                  </div>
                </div>
              </div>

              {/* Matched Competencies */}
              <div>
                <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--emerald-success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={15} /> Validated Technical Skills ({analysis.matchedSkills?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {analysis.matchedSkills?.map((skill) => (
                    <span key={skill} className="skill-chip matched">
                      <Check size={11} /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Competencies */}
              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--amber-warning)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertCircle size={15} /> Recommended Keyword Additions ({analysis.missingSkills.length})
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {analysis.missingSkills.map((skill) => (
                      <span key={skill} className="skill-chip missing">
                        ○ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Feedback */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Actionable Improvements:
                  </h3>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {analysis.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Explore Jobs Action */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={onExploreJobs}
                >
                  Explore Compatible Requisitions <ArrowRight size={13} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <FileText size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Diagnostic Results Will Appear Here
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto' }}>
                Click "Run Readiness Audit" to evaluate your resume text against active engineering benchmarks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
