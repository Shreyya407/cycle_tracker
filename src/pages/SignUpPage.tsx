import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CycleRegularity } from '../types';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regularity, setRegularity] = useState<CycleRegularity>('regular');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    const { error } = await signUp(email, password, name, regularity);
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-sans min-h-screen flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-container-max mx-auto flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-tier-2 bg-surface-container-lowest min-h-[80vh]">
        {/* Left Visual Panel */}
        <div className="hidden md:flex md:w-1/2 relative bg-surface-container-low flex-col justify-between p-12">
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfXR2m6dJziz_Bd8hqA1kum_zqY7gb1dA03pX10Jq6rEy1oVJAykQu2uYu4ay_GT8HfnpgzHWkdr-HuHhYwc1WjkNy4qRXNcU7nWThkIww1MucZobT1J1ttVCeyiXUbic9zNZ9gbiyNHSBzhAeUk5stT4iPaNHZxmtQhQtW41N3pDxMo1SLk2Ytg9bY2js-uZ6YyOvEMW0tamjrQBWvuDR4g3c5qwfzQIRfPXPIa2njPIo2x6KXBU"
              alt="Serene wellness backdrop"
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            />
          </div>
          <div className="relative z-10">
            <span className="font-serif text-4xl font-bold text-primary tracking-tight">CycleCare</span>
          </div>
          <div className="relative z-10 glass-panel rounded-2xl p-8 max-w-md">
            <h2 className="font-serif text-3xl text-primary mb-3">Understand your body's rhythm.</h2>
            <p className="font-sans text-body-md text-on-surface-variant">
              Join a private community focused on personalized, holistic wellness tracking designed for clarity and peace of mind.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 md:px-16 bg-surface-container-lowest relative z-10">
          <div className="md:hidden mb-8 text-center">
            <span className="font-serif text-3xl font-bold text-primary">CycleCare</span>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl text-primary mb-2">Create your account</h1>
            <p className="font-sans text-body-md text-on-surface-variant">Start your journey to personal wellbeing understanding.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-label-md text-sm border border-error/20">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {/* Full Name */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative rounded-xl border border-primary-fixed-dim/50 bg-surface transition-all">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Doe"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-transparent border-none text-on-surface focus:ring-0 font-sans text-body-md placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative rounded-xl border border-primary-fixed-dim/50 bg-surface transition-all">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-transparent border-none text-on-surface focus:ring-0 font-sans text-body-md placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative rounded-xl border border-primary-fixed-dim/50 bg-surface transition-all">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/50">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-transparent border-none text-on-surface focus:ring-0 font-sans text-body-md placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>

            {/* Cycle Regularity Chips */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Cycle Regularity Baseline</label>
              <div className="grid grid-cols-3 gap-3">
                {(['regular', 'irregular', 'unsure'] as CycleRegularity[]).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setRegularity(reg)}
                    className={`py-2.5 px-3 rounded-xl border text-center font-label-md capitalize transition-all ${
                      regularity === reg
                        ? 'bg-secondary-container text-on-secondary-container border-secondary font-bold shadow-sm'
                        : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl font-label-md text-body-md transition-all hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-2 shadow-tier-1"
            >
              <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col items-center">
            <div className="flex items-center gap-2 text-on-surface-variant/70 mb-4 bg-surface-container-low px-4 py-2 rounded-full text-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Your data is encrypted and strictly private.</span>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant text-sm text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
