import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: 'var(--bg-canvas)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border-medium)',
          borderTopColor: 'var(--color-cobalt)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} color="var(--color-cobalt)" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If user's role is not authorized for this specific dashboard, route to their role dashboard
    let fallbackPath = '/dashboard';
    if (role === 'REFERRER') fallbackPath = '/referrer-dashboard';
    else if (role === 'RECRUITER') fallbackPath = '/recruiter-dashboard';
    else if (role === 'ADMIN') fallbackPath = '/admin-dashboard';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

