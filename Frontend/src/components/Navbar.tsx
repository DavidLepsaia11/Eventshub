// src/components/Navbar.tsx

import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, LayoutDashboard, Zap, Shield, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-[13.5px] font-medium transition-all duration-150 border-none bg-transparent',
      isActive
        ? 'text-brand-600 bg-brand-50 font-semibold'
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 h-[60px] bg-white/92 backdrop-blur-nav border-b border-slate-200 flex items-center px-7">
      <div className="max-w-[1300px] w-full mx-auto flex items-center gap-0">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 mr-9 cursor-pointer">
          <div className="w-8 h-8 rounded-[8px] bg-brand-gradient flex items-center justify-center shadow-brand">
            <Zap className="w-[17px] h-[17px] text-white" />
          </div>
          <span className="text-[17px] font-extrabold text-slate-900 tracking-[-0.4px]">
            EventHub
          </span>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1">
          <NavLink to="/" end className={linkClass}>
            <Calendar className="w-[15px] h-[15px]" />
            Events
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              <LayoutDashboard className="w-[15px] h-[15px]" />
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5 ml-auto">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-50 to-brand-50 border border-violet-200 text-[11.5px] font-semibold text-violet-600">
                  <Shield className="w-[11px] h-[11px]" />
                  Admin
                </div>
              )}

              {/* Avatar + username */}
              <div className="flex items-center gap-2">
                <div className="w-[34px] h-[34px] rounded-full bg-brand-gradient flex items-center justify-center text-white text-[13px] font-bold shadow-sm select-none">
                  {user!.userName.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[13px] font-semibold text-slate-700 max-w-[100px] truncate hidden sm:block">
                  {user!.userName}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-[13px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
              >
                <LogOut className="w-[14px] h-[14px]" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-[13.5px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-150"
              >
                <LogIn className="w-[15px] h-[15px]" />
                Sign in
              </NavLink>
              <NavLink
                to="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs text-[13.5px] font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-brand transition-all duration-150 hover:-translate-y-px"
              >
                <UserPlus className="w-[15px] h-[15px]" />
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
