import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, RefreshCw } from 'lucide-react';

export const ReferralMessageBuilder = ({ companyName, jobTitle, referrerName, candidateSkills = [], onSelectPitch, onClose }) => {
  const [selectedStyle, setSelectedStyle] = useState('concise'); // 'concise' | 'respectful' | 'technical'
  const [customPitch, setCustomPitch] = useState('');
  const [copied, setCopied] = useState(false);

  const comp = companyName || 'Google';
  const role = jobTitle || 'Software Engineer';
  const ref = referrerName || 'there';
  const skills = candidateSkills.slice(0, 3).join(', ') || 'React, Node.js, and MongoDB';

  const defaultPitches = {
    concise: `Hi ${ref}, I noticed the ${role} opening at ${comp} and believe my experience architecting applications with ${skills} makes me a strong fit. I would appreciate your consideration for an employee referral! My portfolio & resume: [Link]`,
    respectful: `Hello ${ref}, hope you're doing well! I've been following ${comp}'s engineering milestones with great admiration. With hands-on expertise in ${skills}, I am excited about the ${role} requisition. If you're open to referring, my resume & projects are here: [Link]. Thank you for your time!`,
    technical: `Hi ${ref}, I saw that ${comp} is hiring for the ${role} team. In my recent work, I've engineered production services using ${skills}, focusing on reliability, clean REST APIs, and database performance. I would be honored to submit my credentials for your internal referral queue. Full projects: [Link]`
  };

  const currentPitch = customPitch || defaultPitches[selectedStyle];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyToModal = () => {
    if (onSelectPitch) onSelectPitch(currentPitch);
    if (onClose) onClose();
  };

  return (
    <div className="surface-card" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '1.25rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={16} color="var(--color-cobalt)" />
          <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Referral Pitch Assistant
          </h4>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.2rem' }}>
            <X size={16} />
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
        Select an outreach tone calibrated for {comp} referrers, personalize it, and apply it to your referral request.
      </p>

      {/* Style Toggle Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {[
          { id: 'concise', label: 'Concise' },
          { id: 'respectful', label: 'Respectful' },
          { id: 'technical', label: 'Technical' }
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            className={`filter-pill ${selectedStyle === s.id ? 'active' : ''}`}
            style={{ justifyContent: 'center', fontSize: '0.775rem', padding: '0.35rem 0.5rem' }}
            onClick={() => {
              setSelectedStyle(s.id);
              setCustomPitch(defaultPitches[s.id]);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Editable Pitch Area */}
      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
        <textarea
          className="textarea-field"
          rows={4}
          value={currentPitch}
          onChange={(e) => setCustomPitch(e.target.value)}
          style={{ fontSize: '0.85rem', lineHeight: 1.5 }}
        />
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleCopy}
          style={{ fontSize: '0.775rem' }}
        >
          {copied ? <Check size={13} color="var(--emerald-success)" /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          type="button"
          className="btn btn-cobalt btn-sm"
          onClick={handleApplyToModal}
          style={{ fontSize: '0.775rem' }}
        >
          Apply to Request Form
        </button>
      </div>
    </div>
  );
};
