import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    {
      email: '',
      password: '',
    },
    async (values: { email: string; password: string }) => {
      try {
        setError('');
        await login(values.email, values.password);
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Login failed');
      }
    }
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '48px',
        animation: 'slideUp 0.5s ease-out'
      }}>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          input, select {
            font-family: 'Inter', sans-serif;
          }
          
          input:focus, select:focus {
            outline: none;
          }
        `}</style>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '8px'
          }}>Welcome Back</h1>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '8px'
          }}>Sign in to your account to continue</p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#991b1b', fontSize: '14px', fontWeight: '500' }}>❌ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isSubmitting ? '🔄 Signing in...' : '🔑 Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Create one now
            </Link>
          </p>
        </div>

        <div style={{
          background: '#f3f4f6',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '28px'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '12px'
          }}>📝 Demo Accounts:</h3>
          <div style={{ gap: '12px' }}>
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>👨‍💼 Admin Account</p>
              <p style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>admin@example.com / admin123</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>👤 User Account</p>
              <p style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>user@example.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
