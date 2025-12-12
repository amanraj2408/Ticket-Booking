import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
    async (values: { email: string; password: string; confirmPassword: string; role: string }) => {
      if (values.password !== values.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        setError('');
        await register(values.email, values.password, values.role);
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Registration failed');
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
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
        padding: '40px',
        transition: 'transform 0.3s, box-shadow 0.3s'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Create Account
          </h2>
          <p style={{
            color: '#666',
            fontSize: '14px'
          }}>Join our ticket booking platform</p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              color: '#333',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              📧 Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              color: '#333',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              🔐 Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={{
              display: 'block',
              color: '#333',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              ✓ Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="role" style={{
              display: 'block',
              color: '#333',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              👥 Account Type
            </label>
            <select
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="user">👤 Regular User</option>
              <option value="admin">👨‍💼 Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: isSubmitting ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: '700',
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.3s',
              marginTop: '12px'
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
            {isSubmitting ? '⏳ Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#666',
            fontSize: '13px'
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#667eea',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
