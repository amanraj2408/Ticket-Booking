import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <nav style={{
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            fontSize: '24px',
            fontWeight: '800',
            textDecoration: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎟️ Ticket Booking
          </Link>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <Link to="/login" style={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: '500',
              transition: 'opacity 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Sign In
            </Link>
            <Link to="/register" style={{
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          fontSize: '24px',
          fontWeight: '800',
          textDecoration: 'none',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🎟️ Ticket Booking
        </Link>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <span>👤</span>
            <span>{user?.email}</span>
          </div>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{
              textDecoration: 'none',
              background: '#8b5cf6',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#a78bfa';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#8b5cf6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              ⚙️ Admin
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
