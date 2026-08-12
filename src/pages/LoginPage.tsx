import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans bg-background text-on-background p-4">
      {/* Background Glows */}
      <div className="absolute w-[500px] h-[500px] bg-primary-fixed/40 rounded-full blur-[80px] -top-20 -right-20 pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-secondary-container/50 rounded-full blur-[80px] -bottom-20 -left-20 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-container-lowest rounded-2xl shadow-tier-2 p-8 md:p-10 flex flex-col gap-6 border border-outline-variant/10">
          {/* Header */}
          <div className="text-center flex flex-col gap-2">
            <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">CycleCare</h1>
            <p className="font-sans text-body-md text-on-surface-variant">Welcome back to your personal wellness tracker.</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-sm font-label-md border border-error/20">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-3 pl-11 pr-4 font-sans text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="password">
                  Password
                </label>
                <a href="#" className="font-label-sm text-xs text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-3 pl-11 pr-4 font-sans text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary font-label-md py-3.5 px-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-[0.98] mt-2 shadow-tier-1"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant/30"></div>
            <span className="font-sans text-[11px] text-outline uppercase tracking-wider">Fast Access</span>
            <div className="flex-1 h-px bg-outline-variant/30"></div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-surface-container-low border border-outline-variant/40 text-on-surface font-label-md py-3 px-4 rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Enter Demo Mode</span>
          </button>

          {/* Footer Link */}
          <div className="text-center pt-3 border-t border-outline-variant/20">
            <p className="font-sans text-body-md text-on-surface-variant text-sm">
              Don't have an account?{' '}
              <Link to="/join" className="font-bold text-primary hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
