import React from 'react';
import { 
  X, 
  CheckCheck, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';

export const NotificationDrawer = ({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllRead }) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIconForType = (type) => {
    switch (type) {
      case 'REFERRAL_ACCEPTED':
      case 'APPLICATION_STATUS_CHANGED':
        return <CheckCircle2 size={16} color="var(--emerald-success)" />;
      case 'INTERVIEW_SCHEDULED':
        return <Calendar size={16} color="var(--color-cobalt)" />;
      case 'REFERRAL_REQUEST_RECEIVED':
      case 'NEW_APPLICATION':
        return <Sparkles size={16} color="var(--amber-warning)" />;
      default:
        return <Bell size={16} color="var(--text-tertiary)" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }} role="dialog" aria-modal="true">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          height: '100vh',
          maxHeight: '100vh',
          maxWidth: '420px',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--color-cobalt)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onMarkAllRead}
              title="Mark all as read"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              <CheckCheck size={13} /> Mark All Read
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n._id}
                onClick={() => onMarkAsRead(n._id)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: n.isRead ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                  border: n.isRead ? '1px solid var(--border-subtle)' : '1px solid var(--border-medium)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{ marginTop: '0.15rem' }}>
                    {getIconForType(n.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: n.isRead ? 'var(--text-primary)' : 'var(--color-cobalt)' }}>
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-cobalt)' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.45 }}>
                      {n.message}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Bell size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No recent notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
