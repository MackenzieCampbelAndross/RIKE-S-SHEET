import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, LogIn, X, Loader2, Sparkles } from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';
import type { UserProfileData } from '../lib/supabase';

export type VerificationStatus = 'verifying' | 'success' | 'error';

interface VerificationModalProps {
  isOpen: boolean;
  status: VerificationStatus;
  errorMessage?: string | null;
  profile?: UserProfileData | null;
  userEmail?: string | null;
  onContinue: () => void;
  onOpenLogin: () => void;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  status,
  errorMessage,
  profile,
  userEmail,
  onContinue,
  onOpenLogin,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D1B2A]/75 dark:bg-black/80 backdrop-blur-[4px] animate-fadeIn"
    >
      {/* Click-outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-[480px] rounded-3xl bg-[#FAF8F5] dark:bg-[#202020] border border-[#E7E2D6] dark:border-[#383838] shadow-2xl p-6 sm:p-8 text-[#091424] dark:text-[#F3F3F0] font-sans z-10 space-y-6 transition-all">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D6] dark:border-[#333333]">
          <div className="flex items-center space-x-2">
            {status === 'success' ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-heading font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EMAIL VERIFIED</span>
              </span>
            ) : status === 'error' ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-[10px] font-heading font-bold uppercase tracking-widest">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>VERIFICATION NOTICE</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#1f1f1f] border border-[#E7E2D6] dark:border-[#383838] text-[#64748B] dark:text-[#9E9E96] text-[10px] font-heading font-bold uppercase tracking-widest">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#112E52] dark:text-[#F4D875]" />
                <span>CONFIRMING</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#091424] dark:text-[#9E9E96] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Content based on status */}
        {status === 'verifying' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#091424] dark:text-[#F4D875]" />
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-bold text-[#091424] dark:text-white">
                Verifying your credentials...
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                Establishing your authenticated session with RIKE'S SHEET.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <h3
                  id="verification-modal-title"
                  className="text-2xl font-heading font-black tracking-tight text-[#091424] dark:text-white"
                >
                  Welcome to RIKE'S SHEET
                </h3>
                <Sparkles className="w-5 h-5 text-[#F4D875]" />
              </div>
              <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] leading-relaxed">
                Your email has been successfully confirmed. Your preparation profile is fully activated and ready.
              </p>
            </div>

            {/* Profile Confirmation Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#282828] border border-[#E7E2D6] dark:border-[#383838] flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#091424] dark:bg-[#141414] text-white flex items-center justify-center p-3 flex-shrink-0 shadow-sm">
                  <AvatarIcon id={profile?.avatar_id || 'lion'} className="w-full h-full text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-heading font-bold text-[#091424] dark:text-white truncate">
                    {profile?.display_name || userEmail || 'Placement Candidate'}
                  </h4>
                  <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] truncate">
                    @{profile?.username || 'candidate'}
                  </p>
                </div>
              </div>

              {/* Starting ELO Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-1.5 flex-shrink-0">
                <span className="text-[10px] font-heading font-bold text-[#64748B] dark:text-[#9E9E96]">
                  ELO
                </span>
                <span className="text-sm font-heading font-black text-[#091424] dark:text-[#F4D875]">
                  {profile?.elo_rating || 1000}
                </span>
              </div>
            </div>

            {/* Next Step Info */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E7E2D6] dark:border-[#333333] text-xs font-heading text-[#64748B] dark:text-[#9E9E96]">
              Choose your target technical curriculum (C++, Java, or Python) to begin your structured 180-day roadmap.
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#091424] hover:bg-[#112E52] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#091424] font-heading font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              <span>Choose Curriculum Track</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <h3
                id="verification-modal-title"
                className="text-xl font-heading font-black tracking-tight text-[#091424] dark:text-white"
              >
                Verification Link Expired or Invalid
              </h3>
              <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] leading-relaxed">
                {errorMessage ||
                  'This verification link has expired or has already been used. If you have already confirmed your account, you can sign in directly.'}
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#091424] hover:bg-[#112E52] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#091424] font-heading font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Your Account</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-heading font-semibold text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white transition-colors cursor-pointer text-center"
              >
                Return to Landing Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
