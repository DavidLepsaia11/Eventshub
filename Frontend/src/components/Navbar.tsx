// src/components/Navbar.tsx

import { NavLink } from 'react-router-dom';
import { Calendar, LayoutDashboard, Zap, Shield } from 'lucide-react';

export default function Navbar() {
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
          <NavLink to="/admin" className={linkClass}>
            <LayoutDashboard className="w-[15px] h-[15px]" />
            Admin
          </NavLink>
        </nav>

        {/* Right side — admin chip */}
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-50 to-brand-50 border border-violet-200 text-[11.5px] font-semibold text-violet-600">
            <Shield className="w-[11px] h-[11px]" />
            Admin
          </div>
          <div className="w-[34px] h-[34px] rounded-full bg-brand-gradient flex items-center justify-center text-white text-[13px] font-bold shadow-sm select-none">
            EH
          </div>
        </div>
      </div>
    </header>
  );
}
