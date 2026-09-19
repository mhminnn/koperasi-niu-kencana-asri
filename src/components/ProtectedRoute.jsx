import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    // Verify token with backend
    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        // If network error, allow access if token exists or fail safe
        setIsAuthenticated(true);
      });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Memverifikasi keamanan admin...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
