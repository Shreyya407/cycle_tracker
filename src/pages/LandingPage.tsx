import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-background font-sans antialiased min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center justify-between w-full max-w-container-max mx-auto px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <span className="font-serif text-[26px] font-bold text-primary">CycleCare</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="font-label-md text-label-md text-primary hover:bg-surface-container-high px-4 py-2 rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/join')}
              className="font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-5 py-2.5 rounded-xl transition-all shadow-tier-1 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="pt-28 pb-20 flex-1 max-w-container-max mx-auto px-4 lg:px-8 flex flex-col gap-20">
        <section className="relative flex flex-col md:flex-row items-center gap-12 min-h-[65vh]">
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
            <span className="font-label-md text-label-sm text-tertiary-container uppercase tracking-widest bg-tertiary-fixed/30 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
              Premium Wellness Tracking
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-primary leading-tight">
              Understand your body's natural rhythm with scientific precision.
            </h1>
            <p className="font-sans text-body-lg text-on-surface-variant max-w-xl">
              A serene, privacy-first wellness platform designed to provide data-driven personal observations without clinical stereotypes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center md:justify-start">
              <button
                onClick={() => navigate('/join')}
                className="bg-primary text-on-primary font-label-md text-body-md px-8 py-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-tier-1 active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                <span>Start Your Journey</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-surface-container-low text-primary font-label-md text-body-md px-8 py-4 rounded-xl hover:bg-surface-container-high transition-colors active:scale-95 duration-200 border border-outline-variant/30"
              >
                Sign In to Account
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="relative w-full aspect-[4/3] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-tier-2 bg-surface-container-low border border-outline-variant/20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg0QMn90xgKjKV_rBbsaZXhJ4dnQ6NgTyAlDno1kpPIgrmAHjGP2A0rk9g1Mz8QYC-5KHYTokaFy6dyc659BVX_8Ep3sCig68ndr5jsdjo_SYQu01urCL6LCLIhqzU66tvO3VzWxWyMl5lEefyUdyg28ZESxdk48nrveO_TC9qLUgOjvMeRispBobN6y5Ib2_L7RY7wI7xJPRAhbkGdrAAQDp7C7-RwaFEVRtxTzNAmlfRnp2eCn0"
                alt="Serene wellness design"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl text-primary mb-2">Holistic Wellbeing, Defined</h2>
            <p className="font-sans text-body-md text-on-surface-variant">Built on principles of peace, privacy, and personal data ownership.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-tier-1 border border-outline-variant/20 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary mb-2">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <h3 className="font-serif text-2xl text-primary">Privacy-First Guarantee</h3>
              <p className="font-sans text-body-md text-on-surface-variant">
                Your data is strictly yours. Enforced with Row Level Security (RLS), your data is isolated to your authenticated account.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-tier-1 border border-outline-variant/20 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed/30 flex items-center justify-center text-tertiary-container mb-2">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <h3 className="font-serif text-2xl text-primary">Personal Pattern Discovery</h3>
              <p className="font-sans text-body-md text-on-surface-variant">
                Uncover recurring correlations in your energy, fatigue, sleep, and mood across past cycle phases automatically.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-tier-1 border border-outline-variant/20 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/30 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-[24px]">analytics</span>
              </div>
              <h3 className="font-serif text-2xl text-primary">Prediction Confidence</h3>
              <p className="font-sans text-body-md text-on-surface-variant">
                Clear confidence indicators reflect your cycle consistency without making medical claims or clinical diagnoses.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 border-t border-outline-variant/20 bg-surface text-center md:text-left">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-serif text-xl font-bold text-primary">CycleCare</span>
          <span className="font-sans text-xs text-on-surface-variant">© 2026 CycleCare Wellness. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
