import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'login',
}) => {
  const { login, signUp, checkUsernameAvailable, resetPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'
  >('idle');
  const [usernameFeedback, setUsernameFeedback] = useState<string>('');

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage(null);
      setSuccessMessage(null);
      setForgotPasswordMode(false);
    }
  }, [isOpen, initialTab]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live username debounce availability check
  useEffect(() => {
    if (activeTab !== 'signup') return;

    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameStatus('idle');
      setUsernameFeedback('');
      return;
    }

    const clean = trimmed.toLowerCase();
    if (clean.length < 3) {
      setUsernameStatus('invalid');
      setUsernameFeedback('Username must be at least 3 characters');
      return;
    }
    if (clean.length > 30) {
      setUsernameStatus('invalid');
      setUsernameFeedback('Username cannot exceed 30 characters');
      return;
    }
    if (!/^[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(clean)) {
      setUsernameStatus('invalid');
      setUsernameFeedback('Letters, numbers and underscores only (cannot start/end with _)');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailable(clean);
        if (available) {
          setUsernameStatus('available');
          setUsernameFeedback('Username is available');
        } else {
          setUsernameStatus('unavailable');
          setUsernameFeedback('Username is already taken');
        }
      } catch {
        setUsernameStatus('idle');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, activeTab, checkUsernameAvailable]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email or username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
      onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Invalid email, username, or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setErrorMessage('Please choose a username.');
      return;
    }
    if (usernameStatus === 'invalid' || usernameStatus === 'unavailable') {
      setErrorMessage(usernameFeedback || 'Please choose a valid and available username.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp(email, password, trimmedUser, rememberMe);
      // Supabase email confirmation check
      if (res.user && !res.session) {
        setSuccessMessage('Registration successful! Please check your email to verify your account before logging in.');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setErrorMessage(err.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccessMessage('Password reset link sent to your email.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D1B2A]/70 dark:bg-black/75 backdrop-blur-[4px] animate-fadeIn"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Card Surface */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[460px] rounded-2xl bg-[#F2F0E8] dark:bg-[#202020] border border-[#E2DEC9] dark:border-[#333333] shadow-2xl p-6 sm:p-8 text-[#112E52] dark:text-[#F2F2EF] font-sans z-10 transition-colors"
      >
        {/* Top Header: Brand at Left, Close Button at Right */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex flex-col select-none">
            <span className="text-xs sm:text-[13px] font-heading font-black tracking-widest text-[#112E52] dark:text-white uppercase">
              RIKE'S SHEET
            </span>
            <span className="text-[10px] font-heading text-[#64748B] dark:text-[#94A3B8] tracking-wider uppercase">
              Placement Preparation
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#112E52] dark:text-[#94A3B8] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* LOG IN / SIGN UP Tabs */}
        {!forgotPasswordMode && (
          <div className="pt-1">
            <div className="grid grid-cols-2 text-center border-b border-[#D8D4C2] dark:border-[#383838]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                }}
                className={`pb-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === 'login'
                    ? 'text-[#112E52] dark:text-white'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#112E52] dark:hover:text-white'
                }`}
              >
                LOG IN
                {activeTab === 'login' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#112E52] dark:bg-[#F4D875]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                }}
                className={`pb-2.5 text-xs font-heading font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === 'signup'
                    ? 'text-[#112E52] dark:text-white'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#112E52] dark:hover:text-white'
                }`}
              >
                SIGN UP
                {activeTab === 'signup' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#112E52] dark:bg-[#F4D875]" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start space-x-2.5 text-red-700 dark:text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start space-x-2.5 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {forgotPasswordMode ? (
          <form onSubmit={handleForgotPasswordSubmit} className="pt-5 space-y-4">
            <div className="space-y-1">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-heading font-black text-[#112E52] dark:text-white tracking-tight">
                Reset password.
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Enter your email address to receive password recovery instructions.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold text-[#112E52] dark:text-[#F2F2EF]">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D0BC] dark:border-[#404040] bg-white dark:bg-[#181818] text-[#112E52] dark:text-white text-sm focus:outline-none focus:border-[#112E52] dark:focus:border-[#F4D875] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#F4D875] hover:bg-[#F2CE52] text-[#112E52] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>SEND RESET LINK &rarr;</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setForgotPasswordMode(false)}
                className="text-xs font-heading font-semibold text-[#64748B] hover:text-[#112E52] dark:text-[#94A3B8] dark:hover:text-white"
              >
                Back to log in
              </button>
            </div>
          </form>
        ) : activeTab === 'login' ? (
          /* ========================================================= */
          /* LOG IN FORM                                               */
          /* ========================================================= */
          <form onSubmit={handleLoginSubmit} className="pt-5 space-y-4">
            <div className="space-y-0.5">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-heading font-black text-[#112E52] dark:text-white tracking-tight">
                Welcome back.
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Continue your placement journey.
              </p>
            </div>

            {/* Email or Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold text-[#112E52] dark:text-[#F2F2EF]">
                Email address or username
              </label>
              <input
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com or @username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D0BC] dark:border-[#404040] bg-white dark:bg-[#181818] text-[#112E52] dark:text-white text-sm focus:outline-none focus:border-[#112E52] dark:focus:border-[#F4D875] transition-colors"
              />
            </div>

            {/* Password Field with visibility toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-semibold text-[#112E52] dark:text-[#F2F2EF]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(true)}
                  className="text-[11px] font-heading font-medium text-[#64748B] hover:text-[#112E52] dark:text-[#94A3B8] dark:hover:text-[#F4D875] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#D5D0BC] dark:border-[#404040] bg-white dark:bg-[#181818] text-[#112E52] dark:text-white text-sm focus:outline-none focus:border-[#112E52] dark:focus:border-[#F4D875] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#112E52] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Always remember me checkbox */}
            <div className="flex items-center space-x-2 pt-0.5">
              <input
                id="login-remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#D5D0BC] text-[#112E52] focus:ring-[#F4D875] cursor-pointer"
              />
              <label
                htmlFor="login-remember-me"
                className="text-xs font-heading font-medium text-[#112E52] dark:text-[#E0E0DC] cursor-pointer select-none"
              >
                Always remember me on this device
              </label>
            </div>

            {/* Primary Action Button: LOG IN → */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#F4D875] hover:bg-[#F2CE52] text-[#112E52] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>LOG IN &rarr;</span>
              )}
            </button>

            {/* Fine divider containing "or" */}
            <div className="relative py-2 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D8D4C2] dark:border-[#383838]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#F2F0E8] dark:bg-[#202020] px-3 text-[11px] font-heading font-medium text-[#64748B] dark:text-[#94A3B8]">
                  or
                </span>
              </div>
            </div>

            {/* Link to Sign Up */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                }}
                className="text-xs font-heading text-[#64748B] dark:text-[#94A3B8] hover:text-[#112E52] dark:hover:text-white transition-colors"
              >
                New to RIKE'S SHEET?{' '}
                <span className="font-bold underline text-[#112E52] dark:text-white">
                  Create an account
                </span>
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================= */
          /* SIGN UP FORM                                              */
          /* ========================================================= */
          <form onSubmit={handleSignUpSubmit} className="pt-5 space-y-3.5">
            <div className="space-y-0.5">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-heading font-black text-[#112E52] dark:text-white tracking-tight">
                Create your account.
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Your placement journey starts here.
              </p>
            </div>

            {/* Username Field with live validation feedback */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-semibold text-[#112E52] dark:text-[#F2F2EF]">
                  Username
                </label>
                {usernameStatus === 'checking' && (
                  <span className="text-[10px] text-[#64748B] flex items-center space-x-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Checking...</span>
                  </span>
                )}
                {usernameStatus === 'available' && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    &bull; Available
                  </span>
                )}
                {(usernameStatus === 'unavailable' || usernameStatus === 'invalid') && (
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                    &bull; {usernameFeedback}
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. mackenzie"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-[#181818] text-[#112E52] dark:text-white text-sm focus:outline-none transition-colors ${
                  usernameStatus === 'available'
                    ? 'border-emerald-500 dark:border-emerald-500'
                    : usernameStatus === 'unavailable' || usernameStatus === 'invalid'
                    ? 'border-red-400 dark:border-red-500'
                    : 'border-[#D5D0BC] dark:border-[#404040] focus:border-[#112E52] dark:focus:border-[#F4D875]'
                }`}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-heading font-semibold text-[#112E52] dark:text-[#F2F2EF]">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D0BC] dark:border-[#404040] bg-white dark:bg-[#181818] text-[#112E52] dark:text-white text-sm focus:outline-none focus:border-[#112E52] dark:focus:border-[#F4D875] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-heading font-semibold text-[#112E52] dark:text-[#F2F2EF]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#D5D0BC] dark:border-[#404040] bg-white dark:bg-[#181818] text-[#112E52] dark:text-white text-sm focus:outline-none focus:border-[#112E52] dark:focus:border-[#F4D875] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#112E52] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-heading font-semibold text-[#112E52] dark:text-[#F2F2EF]">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#D5D0BC] dark:border-[#404040] bg-white dark:bg-[#181818] text-[#112E52] dark:text-white text-sm focus:outline-none focus:border-[#112E52] dark:focus:border-[#F4D875] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#112E52] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Always remember me checkbox */}
            <div className="flex items-center space-x-2 pt-0.5">
              <input
                id="signup-remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#D5D0BC] text-[#112E52] focus:ring-[#F4D875] cursor-pointer"
              />
              <label
                htmlFor="signup-remember-me"
                className="text-xs font-heading font-medium text-[#112E52] dark:text-[#E0E0DC] cursor-pointer select-none"
              >
                Always remember me on this device
              </label>
            </div>

            {/* Primary Action Button: CREATE ACCOUNT → */}
            <button
              type="submit"
              disabled={isSubmitting || usernameStatus === 'invalid' || usernameStatus === 'unavailable'}
              className="w-full py-3 rounded-xl bg-[#F4D875] hover:bg-[#F2CE52] text-[#112E52] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>CREATE ACCOUNT &rarr;</span>
              )}
            </button>

            {/* Link back to Log In */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                }}
                className="text-xs font-heading text-[#64748B] dark:text-[#94A3B8] hover:text-[#112E52] dark:hover:text-white transition-colors"
              >
                Already have an account?{' '}
                <span className="font-bold underline text-[#112E52] dark:text-white">
                  Log in
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
