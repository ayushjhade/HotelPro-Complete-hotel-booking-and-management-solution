import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      if (result.user.type === 'admin') {
        navigate('/adminhome');
      } else {
        navigate('/userhome');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  // Quick fill helper for testing
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@hotelpro.com');
      setPassword('admin123');
    } else {
      setEmail('john@example.com');
      setPassword('password123');
    }
    setErrorMsg('');
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card border-0 rounded-4 shadow-xl overflow-hidden">
              <div className="p-4 p-sm-5 bg-white">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-flex mb-3">
                    <LogIn size={28} />
                  </div>
                  <h3 className="fw-bold mb-1 text-dark">Welcome Back</h3>
                  <p className="text-muted small">Sign in to manage bookings and hotel services</p>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 small mb-4">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-muted" /></span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-hotelpro w-100 py-2.5 mb-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    ) : (
                      <>
                        <LogIn size={18} />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Quick Fills */}
                <div className="mt-4 pt-3 border-top">
                  <div className="small text-muted text-center mb-2 fw-medium">Quick Demo Credentials:</div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('customer')}
                      className="btn btn-outline-primary btn-sm w-50 rounded-3 d-flex align-items-center justify-content-center gap-1"
                    >
                      <UserCheck size={14} />
                      <span>Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('admin')}
                      className="btn btn-outline-dark btn-sm w-50 rounded-3 d-flex align-items-center justify-content-center gap-1"
                    >
                      <ShieldCheck size={14} className="text-warning" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>

                <div className="text-center mt-4 pt-2">
                  <span className="text-muted small">Don't have an account yet? </span>
                  <Link to="/signup" className="text-primary fw-semibold small text-decoration-none">
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
