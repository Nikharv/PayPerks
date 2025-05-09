import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    // TODO: Add password reset logic here
    setIsSubmitted(true);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>Forgot Password</h1>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={error ? 'error' : ''}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button type="submit" className="reset-button">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="success-message">
            <p>If an account exists with this email, you will receive a password reset link shortly.</p>
          </div>
        )}

        <div className="forgot-password-links">
          <Link to="/login" className="back-to-login">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage; 