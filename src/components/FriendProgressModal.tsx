import React from 'react';
import { FriendProgressView } from './FriendProgressView';
import type { FriendProgressData } from '../lib/supabase';

interface FriendProgressModalProps {
  friendId: string | null;
  friendUsername?: string;
  isOpen: boolean;
  onClose: () => void;
  fetchFriendProgress: (friendId: string) => Promise<FriendProgressData>;
}

export const FriendProgressModal: React.FC<FriendProgressModalProps> = ({
  friendId,
  friendUsername,
  isOpen,
  onClose,
  fetchFriendProgress,
}) => {
  if (!isOpen || !friendId) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-8 bg-[#0D1B2A]/75 dark:bg-black/85 backdrop-blur-[4px] overflow-y-auto animate-fadeIn"
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-5xl z-10 py-4">
        <FriendProgressView
          friendId={friendId}
          friendUsername={friendUsername}
          onBack={onClose}
          fetchFriendProgress={fetchFriendProgress}
        />
      </div>
    </div>
  );
};

export { FriendProgressView };
