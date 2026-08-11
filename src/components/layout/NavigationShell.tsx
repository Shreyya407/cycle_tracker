import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrivacyNotice from './PrivacyNotice';

interface NavigationShellProps {
  children: React.ReactNode;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({ children }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide nav shell on auth & landing pages if requested
  const isAuthPage = location.pathname === '/login' || location.pathname === '/join';

  if (isAuthPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Calendar', path: '/calendar', icon: 'calendar_today' },
    { name: 'Analytics', path: '/analytics', icon: 'insights' },
    { name: 'Insights', path: '/insights', icon: 'lightbulb' },
    { name: 'Journal', path: '/journal', icon: 'menu_book' },
  ];

  return (
    <div className="min-h-screen flex bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">spa</span>
          </div>
          <span className="font-serif text-[22px] font-bold text-primary">CycleCare</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/reminders')}
            className="p-2 text-on-surface-variant hover:text-primary rounded-full"
            aria-label="Reminders"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div 
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-full overflow-hidden border border-surface-container shadow-sm cursor-pointer"
          >
            <img
              src={profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuASSGSAVOeN5OnaxdNq9Ghc8A1eVagyeo_4dF4M3WaqUIop34KkDyc1vm36n6TW9JedrL_-k2SKngEXOl9_ovvxwZgZWYSMTjIHe1u5WsG9UizGfdN17p2NvUpzdzV-UBm0Dd2K_CrrK746V3_jn42EwP0sJebaht4IRgWmoEmcpPDpzwh4gXcUg5YTe1E9KQI6h-XJTkQ0yoC2DTOHDWuC_QNpz-TWwUgYwG2Cs8UI9pNVKFAWavk'}
              alt={profile?.full_name || 'Profile'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Desktop SideNavBar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 p-md gap-xs bg-surface-container-low shadow-md z-50 border-r border-outline-variant/20">
        <div className="mb-lg px-xs cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <h1 className="font-serif text-[26px] font-bold text-primary leading-none">CycleCare</h1>
          </div>
          <p className="font-sans text-label-sm text-on-surface-variant pl-11">Premium Wellness</p>
        </div>

        {/* Primary Nav Links */}
        <nav className="flex-1 flex flex-col gap-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-sm px-4 py-3 rounded-xl font-label-md transition-all active:scale-[0.98] ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Action CTA */}
        <button
          onClick={() => navigate('/check-in')}
          className="w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-all shadow-tier-1 active:scale-[0.98] flex items-center justify-center gap-2 mb-md"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Daily Check-in</span>
        </button>

        {/* Footer Nav Links */}
        <div className="border-t border-outline-variant/30 pt-sm flex flex-col gap-xs">
          <NavLink
            to="/reminders"
            className={({ isActive }) =>
              `flex items-center gap-sm px-4 py-2.5 rounded-xl font-label-md transition-colors ${
                isActive ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span>Reminders</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-sm px-4 py-2.5 rounded-xl font-label-md transition-colors ${
                isActive ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <PrivacyNotice />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-surface/90 backdrop-blur-md border-t border-outline-variant/20 flex justify-around items-center py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-sans text-[11px] mt-0.5">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default NavigationShell;
