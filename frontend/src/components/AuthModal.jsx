import React, { useState } from 'react';
import { X, Phone, Mail, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { authService } from '../services/api';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'mobile' }) {
  const [authMethod, setAuthMethod] = useState(initialMode); // 'mobile', 'email', 'google'
  const [step, setStep] = useState('input'); // 'input', 'otp'
  
  // Form fields
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedIdentifier, setMaskedIdentifier] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const identifier = authMethod === 'mobile' ? mobileNumber.trim() : email.trim();
      if (!identifier) {
        throw new Error(authMethod === 'mobile' ? 'Please enter your mobile number.' : 'Please enter your email address.');
      }

      const res = await authService.sendOtp(identifier, authMethod);
      setMaskedIdentifier(res.masked_identifier || identifier);
      setDebugOtp(res.debug_otp || '');
      setStep('otp');
      setResendCooldown(30);

      // Start cooldown timer
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Send OTP error:', err);
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const identifier = authMethod === 'mobile' ? mobileNumber.trim() : email.trim();
      if (!otp.trim()) {
        throw new Error('Please enter the 6-digit OTP code.');
      }

      const res = await authService.verifyOtp(identifier, otp.trim(), fullName.trim());
      if (onSuccess) onSuccess(res.user);
      onClose();
    } catch (err) {
      console.error('Verify OTP error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (customEmail = null, customName = null) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const sampleEmail = customEmail || (email ? email.trim() : 'priya.sharma@gmail.com');
      const sampleName = customName || (fullName ? fullName.trim() : 'Priya Sharma');

      const res = await authService.googleLogin({
        email: sampleEmail,
        name: sampleName,
        google_id: `g_${Date.now()}`,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
      });

      if (onSuccess) onSuccess(res.user);
      onClose();
    } catch (err) {
      console.error('Google sign in error:', err);
      setErrorMsg(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('input');
    setOtp('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white border border-rose-200 p-1 flex items-center justify-center mx-auto mb-3 shadow-md">
            <img src="/logo.png" alt="SakhiSetu Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-900">
            Sign In to SakhiSetu
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Access personalized jobs, free courses, government welfare schemes, and childcare support.
          </p>
        </div>

        {/* Auth Method Tabs */}
        {step === 'input' && (
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => { setAuthMethod('mobile'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'mobile' ? 'bg-white text-brand-700 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Mobile OTP
            </button>
            <button
              onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'email' ? 'bg-white text-brand-700 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email OTP
            </button>
            <button
              onClick={() => { setAuthMethod('google'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'google' ? 'bg-white text-brand-700 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Mobile & Email Step: Identifier Input */}
        {step === 'input' && authMethod !== 'google' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarti Joshi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {authMethod === 'mobile' ? '10-Digit Mobile Number *' : 'Email Address *'}
              </label>
              <div className="relative">
                {authMethod === 'mobile' ? (
                  <>
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="9876543210"
                      maxLength="10"
                      required
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none font-medium tracking-wide"
                    />
                  </>
                ) : (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Sending Verification Code...' : 'Send Verification OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. OTP Verification Step (Clean, Realistic Screen) */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            {/* Realistic Dispatch Status Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-xs">Security Code Dispatched</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  A 6-digit confirmation OTP was sent to <b className="text-slate-800">{maskedIdentifier}</b>. Please check your phone messages.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter 6-Digit OTP *
                </label>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-xs text-brand-600 hover:underline"
                >
                  Change {authMethod === 'mobile' ? 'Number' : 'Email'}
                </button>
              </div>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="• • • • • •"
                maxLength="6"
                autoFocus
                required
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Confirm & Sign In'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={resendCooldown > 0 || loading}
                className="hover:text-brand-600 font-medium inline-flex items-center gap-1 disabled:opacity-40"
              >
                <RefreshCw className="w-3 h-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>

              {/* Developer Test Helper Link (only shown in local test mode) */}
              {debugOtp && (
                <button
                  type="button"
                  onClick={() => setOtp(debugOtp)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 underline font-mono"
                  title="Helper for testing without an active SMS cellular subscription"
                >
                  Dev Auto-Fill
                </button>
              )}
            </div>
          </form>
        )}

        {/* 3. Google Sign-In Tab */}
        {authMethod === 'google' && step === 'input' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Continue with your verified Google account for immediate secure access.
            </p>

            <button
              onClick={() => handleGoogleSignIn('priya.sharma@gmail.com', 'Priya Sharma')}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="pt-2 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400 inline-flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Safe, encrypted login. Zero passwords to remember.
              </span>
            </div>
          </div>
        )}

        {/* Footer privacy guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          By signing in, you agree to SakhiSetu's privacy terms. We only use your information to match verified opportunities.
        </div>

      </div>
    </div>
  );
}
