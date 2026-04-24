// src/pages/RegisterPage.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  UserPlus, ShieldCheck, Zap, Gift,
  User, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff,
} from 'lucide-react';
import { register as registerApi } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import type { RegisterDto } from '@/types/auth';

interface RegisterForm extends RegisterDto {
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate    = useNavigate();
  const { login }   = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ defaultValues: { userName: '', email: '', password: '', confirmPassword: '' } });

  async function onSubmit({ confirmPassword: _confirm, ...data }: RegisterForm) {
    setServerError(null);
    try {
      const response = await registerApi(data);
      login(response);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 px-5 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[900px] w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">

        {/* ── Left panel ── */}
        <div className="relative bg-brand-deep p-[52px_44px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(circle at 80% 20%,rgba(255,255,255,.12) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(255,255,255,.08) 0%,transparent 40%)' }} />

          <div className="relative z-10">
            <div className="w-11 h-11 rounded-[10px] bg-white/15 border border-white/20 flex items-center justify-center mb-7">
              <UserPlus className="w-[22px] h-[22px] text-white" />
            </div>
            <h2 className="text-[28px] font-black text-white tracking-[-0.6px] leading-[1.3] mb-3">
              Join 48,000+<br />event lovers.
            </h2>
            <p className="text-[14px] text-white/65 leading-[1.7]">
              Create a free account and start discovering events that match your passions — music, sports, culture and more.
            </p>
          </div>

          <div className="relative z-10">
            {[
              { icon: ShieldCheck, label: 'Secure account — your data stays private' },
              { icon: Zap,         label: 'Instant access after registration' },
              { icon: Gift,        label: 'Free forever — no credit card needed' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 py-3 border-t border-white/10">
                <Icon className="w-4 h-4 text-brand-300 flex-shrink-0" />
                <span className="text-[13px] text-white/75 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="p-[52px_44px]">
          <h3 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] mb-1.5">
            Create your account
          </h3>
          <p className="text-[14px] text-slate-500 mb-8">
            Fill in the details below to get started for free
          </p>

          {/* Server error */}
          {serverError && (
            <div className="flex items-center gap-2 px-3.5 py-[11px] bg-red-50 border border-red-200 rounded-[10px] text-[13px] text-red-600 mb-[18px]">
              <AlertCircle className="w-[15px] h-[15px] flex-shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* Username */}
            <div className="mb-[18px]">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
                <User className="w-[13px] h-[13px] text-slate-400" />
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a display name"
                className={[
                  'w-full px-3.5 py-[10px] border-[1.5px] rounded-[10px] text-[14px] text-slate-800 outline-none transition-all duration-150 bg-white placeholder:text-slate-300',
                  errors.userName
                    ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,.1)]'
                    : 'border-slate-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]',
                ].join(' ')}
                {...register('userName', {
                  required: 'Username is required',
                  maxLength: { value: 50, message: 'Max 50 characters' },
                })}
              />
              {errors.userName && (
                <p className="text-[11.5px] text-red-500 mt-1.5">{errors.userName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-[18px]">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
                <Mail className="w-[13px] h-[13px] text-slate-400" />
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={[
                  'w-full px-3.5 py-[10px] border-[1.5px] rounded-[10px] text-[14px] text-slate-800 outline-none transition-all duration-150 bg-white placeholder:text-slate-300',
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,.1)]'
                    : 'border-slate-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]',
                ].join(' ')}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
              />
              {errors.email && (
                <p className="text-[11.5px] text-red-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-[18px]">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
                <Lock className="w-[13px] h-[13px] text-slate-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className={[
                    'w-full px-3.5 py-[10px] pr-10 border-[1.5px] rounded-[10px] text-[14px] text-slate-800 outline-none transition-all duration-150 bg-white placeholder:text-slate-300',
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,.1)]'
                      : 'border-slate-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]',
                  ].join(' ')}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: 'Must contain uppercase, lowercase and a number',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                </button>
              </div>
              {errors.password
                ? <p className="text-[11.5px] text-red-500 mt-1.5">{errors.password.message}</p>
                : <p className="text-[11.5px] text-slate-400 mt-1.5">Use a mix of letters, numbers and symbols for a stronger password.</p>
              }
            </div>

            {/* Confirm password */}
            <div className="mb-6">
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
                <Lock className="w-[13px] h-[13px] text-slate-400" />
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className={[
                    'w-full px-3.5 py-[10px] pr-10 border-[1.5px] rounded-[10px] text-[14px] text-slate-800 outline-none transition-all duration-150 bg-white placeholder:text-slate-300',
                    errors.confirmPassword
                      ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,.1)]'
                      : 'border-slate-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]',
                  ].join(' ')}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11.5px] text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-[13px] bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-[10px] shadow-brand hover:shadow-brand-lg transition-all duration-150 hover:-translate-y-px active:translate-y-0 mb-5"
            >
              {isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <UserPlus className="w-4 h-4" />}
              {isSubmitting ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-[13.5px] text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
