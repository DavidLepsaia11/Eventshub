// src/pages/ResetPasswordPage.tsx

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  KeyRound, ShieldCheck, Lock, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff,
} from 'lucide-react';
import { resetPassword } from '@/api/auth';

interface ResetForm {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Strip token and email from URL on mount to prevent them persisting in browser history
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token && email) {
      window.history.replaceState({}, '', '/reset-password');
    }
  }, []);

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({ defaultValues: { newPassword: '', confirmPassword: '' } });

  if (!token || !email) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 px-5 py-10">
        <div className="max-w-[420px] w-full bg-white rounded-xl shadow-xl border border-slate-200 p-[52px_44px] text-center">
          <div className="w-11 h-11 rounded-[10px] bg-red-50 border border-red-200 flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-[22px] h-[22px] text-red-500" />
          </div>
          <h3 className="text-[20px] font-extrabold text-slate-900 tracking-[-0.4px] mb-2">
            Invalid reset link
          </h3>
          <p className="text-[14px] text-slate-500 leading-[1.7] mb-8">
            This password reset link is missing required information. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="text-[13px] text-brand-600 hover:underline font-medium"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(data: ResetForm) {
    setServerError(null);
    try {
      await resetPassword({ email: email!, token: token!, newPassword: data.newPassword });
      setSuccess(true);
    } catch {
      setServerError('Invalid or expired reset link. Please request a new one.');
    }
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 px-5 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[900px] w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">

        <div className="relative bg-brand-deep p-[52px_44px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(circle at 80% 20%,rgba(255,255,255,.12) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(255,255,255,.08) 0%,transparent 40%)' }} />

          <div className="relative z-10">
            <div className="w-11 h-11 rounded-[10px] bg-white/15 border border-white/20 flex items-center justify-center mb-7">
              <KeyRound className="w-[22px] h-[22px] text-white" />
            </div>
            <h2 className="text-[28px] font-black text-white tracking-[-0.6px] leading-[1.3] mb-3">
              Set a new<br />password.
            </h2>
            <p className="text-[14px] text-white/65 leading-[1.7]">
              Choose a strong password to keep your EventHub account secure.
            </p>
          </div>

          <div className="relative z-10">
            {[
              { icon: ShieldCheck, label: 'Use a mix of letters, numbers and symbols' },
              { icon: Lock,        label: 'Minimum 6 characters required' },
              { icon: KeyRound,    label: 'Never share your password with anyone' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 py-3 border-t border-white/10">
                <Icon className="w-4 h-4 text-brand-300 flex-shrink-0" />
                <span className="text-[13px] text-white/75 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-[52px_44px]">
          {success ? (
            <div className="flex flex-col items-start h-full justify-center">
              <div className="w-11 h-11 rounded-[10px] bg-green-50 border border-green-200 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-[22px] h-[22px] text-green-600" />
              </div>
              <h3 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] mb-2">
                Password reset
              </h3>
              <p className="text-[14px] text-slate-500 leading-[1.7] mb-8">
                Password reset successfully. You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="text-[13px] text-brand-600 hover:underline font-medium"
              >
                Go to sign in
              </Link>
            </div>
          ) : (
            <>
              <h3 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] mb-1.5">
                Choose a new password
              </h3>
              <p className="text-[14px] text-slate-500 mb-8">
                Enter your new password below to complete the reset
              </p>

              {serverError && (
                <div className="flex items-start gap-2 px-3.5 py-[11px] bg-red-50 border border-red-200 rounded-[10px] text-[13px] text-red-600 mb-[18px]">
                  <AlertCircle className="w-[15px] h-[15px] flex-shrink-0 mt-px" />
                  <span>
                    {serverError}{' '}
                    <Link to="/forgot-password" className="underline font-medium">
                      Request a new one.
                    </Link>
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-[18px]">
                  <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
                    <Lock className="w-[13px] h-[13px] text-slate-400" />
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      className={[
                        'w-full px-3.5 py-[10px] pr-10 border-[1.5px] rounded-[10px] text-[14px] text-slate-800 outline-none transition-all duration-150 bg-white placeholder:text-slate-300',
                        errors.newPassword
                          ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,.1)]'
                          : 'border-slate-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]',
                      ].join(' ')}
                      {...register('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-[11.5px] text-red-500 mt-1.5">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
                    <Lock className="w-[13px] h-[13px] text-slate-400" />
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your new password"
                      className={[
                        'w-full px-3.5 py-[10px] pr-10 border-[1.5px] rounded-[10px] text-[14px] text-slate-800 outline-none transition-all duration-150 bg-white placeholder:text-slate-300',
                        errors.confirmPassword
                          ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,.1)]'
                          : 'border-slate-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,.1)]',
                      ].join(' ')}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (val) => val === watch('newPassword') || 'Passwords do not match',
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
                    : <KeyRound className="w-4 h-4" />}
                  {isSubmitting ? 'Resetting…' : 'Reset password'}
                </button>
              </form>

              <p className="text-center text-[13.5px] text-slate-500">
                <Link to="/login" className="text-brand-600 font-bold hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
