// src/pages/ForgotPasswordPage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  KeyRound, ShieldCheck, Clock, Lock,
  Mail, AlertCircle, Loader2, CheckCircle2,
} from 'lucide-react';
import { forgotPassword } from '@/api/auth';

interface ForgotForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ defaultValues: { email: '' } });

  async function onSubmit(data: ForgotForm) {
    setServerError(null);
    try {
      await forgotPassword({ email: data.email.trim() });
    } catch {
      setServerError('Something went wrong. Please check your connection and try again.');
      return;
    }
    setSubmitted(true);
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
              Reset your<br />password.
            </h2>
            <p className="text-[14px] text-white/65 leading-[1.7]">
              Enter your email address and we'll send you a link to reset your password if the account exists.
            </p>
          </div>

          <div className="relative z-10">
            {[
              { icon: ShieldCheck, label: 'Secure reset link sent to your inbox' },
              { icon: Clock,       label: 'Link expires in 1 hour for your safety' },
              { icon: Lock,        label: 'Your account stays protected' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 py-3 border-t border-white/10">
                <Icon className="w-4 h-4 text-brand-300 flex-shrink-0" />
                <span className="text-[13px] text-white/75 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-[52px_44px]">
          {submitted ? (
            <div className="flex flex-col items-start h-full justify-center">
              <div className="w-11 h-11 rounded-[10px] bg-green-50 border border-green-200 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-[22px] h-[22px] text-green-600" />
              </div>
              <h3 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] mb-2">
                Check your inbox
              </h3>
              <p className="text-[14px] text-slate-500 leading-[1.7] mb-8">
                If that email is registered, a reset link has been sent.
              </p>
              <Link
                to="/login"
                className="text-[13px] text-brand-600 hover:underline font-medium"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h3 className="text-[22px] font-extrabold text-slate-900 tracking-[-0.4px] mb-1.5">
                Forgot your password?
              </h3>
              <p className="text-[14px] text-slate-500 mb-8">
                Enter your account email and we'll send you a reset link
              </p>

              {serverError && (
                <div className="flex items-center gap-2 px-3.5 py-[11px] bg-red-50 border border-red-200 rounded-[10px] text-[13px] text-red-600 mb-[18px]">
                  <AlertCircle className="w-[15px] h-[15px] flex-shrink-0" />
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-6">
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
                      maxLength: { value: 254, message: 'Email address is too long' },
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                    })}
                  />
                  {errors.email && (
                    <p className="text-[11.5px] text-red-500 mt-1.5">{errors.email.message}</p>
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
                  {isSubmitting ? 'Sending link…' : 'Send reset link'}
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
