import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Check,
  X,
  UserX,
  ExternalLink,
  Loader2,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';
import { FriendProgressView } from './FriendProgressView';
import {
  useConnections,
  type SearchResultUser,
} from '../hooks/useConnections';
import type { User } from '@supabase/supabase-js';

interface ConnectionsPageProps {
  onBack: () => void;
  currentUser: User | null;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({
  onBack,
  currentUser,
}) => {
  const {
    incomingRequests,
    sentRequests,
    acceptedConnections,
    loading,
    searchUsers,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
    removeConnection,
    fetchFriendProgress,
    refreshConnections,
  } = useConnections(currentUser);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected friend for progress modal
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedFriendUsername, setSelectedFriendUsername] = useState<string>('');

  // Processing action states
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Debounced search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchUsers(trimmed);
        setSearchResults(results);
        setHasSearched(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSendRequest = async (user: SearchResultUser) => {
    setActionProcessingId(user.id);
    setActionFeedback(null);
    try {
      await sendRequest(user.id);
      setActionFeedback({ type: 'success', msg: `Request sent to @${user.username}` });
      // Update local search result status
      setSearchResults((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, connection_status: 'pending', is_sender: true } : u))
      );
    } catch (err: any) {
      setActionFeedback({ type: 'error', msg: err.message || 'Failed to send request' });
    } finally {
      setActionProcessingId(null);
    }
  };

  const handleAccept = async (connectionId: string, username: string) => {
    setActionProcessingId(connectionId);
    setActionFeedback(null);
    try {
      await acceptRequest(connectionId);
      setActionFeedback({ type: 'success', msg: `Connected with @${username}` });
    } catch (err: any) {
      setActionFeedback({ type: 'error', msg: err.message || 'Failed to accept request' });
    } finally {
      setActionProcessingId(null);
    }
  };

  const handleDecline = async (connectionId: string) => {
    setActionProcessingId(connectionId);
    setActionFeedback(null);
    try {
      await declineRequest(connectionId);
      setActionFeedback({ type: 'success', msg: 'Request declined' });
    } catch (err: any) {
      setActionFeedback({ type: 'error', msg: err.message || 'Failed to decline request' });
    } finally {
      setActionProcessingId(null);
    }
  };

  const handleCancel = async (connectionId: string) => {
    setActionProcessingId(connectionId);
    setActionFeedback(null);
    try {
      await cancelRequest(connectionId);
      setActionFeedback({ type: 'success', msg: 'Request cancelled' });
    } catch (err: any) {
      setActionFeedback({ type: 'error', msg: err.message || 'Failed to cancel request' });
    } finally {
      setActionProcessingId(null);
    }
  };

  const handleRemove = async (connectionId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to remove connection with @${username}?`)) {
      return;
    }
    setActionProcessingId(connectionId);
    setActionFeedback(null);
    try {
      await removeConnection(connectionId);
      setActionFeedback({ type: 'success', msg: `Removed connection with @${username}` });
    } catch (err: any) {
      setActionFeedback({ type: 'error', msg: err.message || 'Failed to remove connection' });
    } finally {
      setActionProcessingId(null);
    }
  };

  if (selectedFriendId) {
    return (
      <FriendProgressView
        friendId={selectedFriendId}
        friendUsername={selectedFriendUsername}
        onBack={() => {
          setSelectedFriendId(null);
          setSelectedFriendUsername('');
        }}
        fetchFriendProgress={fetchFriendProgress}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-6 animate-fadeIn pb-12 font-sans text-[#091424] dark:text-[#F3F3F0]">
      {/* Top Header: "← Return to Workspace" (Left) and "CONNECTIONS" (Right) */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Return to Workspace</span>
        </button>
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
          CONNECTIONS
        </span>
      </div>

      {/* Action Notification Alert */}
      {actionFeedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-heading font-medium flex items-center justify-between transition-all ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300'
          }`}
        >
          <span>{actionFeedback.msg}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="p-1 hover:opacity-75"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-8 transition-colors">
        {/* Section 1: Find People */}
        <section aria-labelledby="find-people-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="find-people-heading"
              className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white flex items-center space-x-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>FIND PEOPLE</span>
            </h2>
            <span className="text-[11px] font-heading text-[#64748B] dark:text-[#9E9E96]">
              Search by unique username
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#9E9E96]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username (e.g. mackenzie)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E0DBD0] dark:border-[#404040] bg-white dark:bg-[#1e1e1e] text-[#091424] dark:text-white text-sm focus:outline-none focus:border-[#091424] dark:focus:border-[#F4D875] transition-colors shadow-sm"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#64748B]" />
            )}
          </div>

          {/* Search Results Display */}
          {hasSearched && (
            <div className="pt-2 space-y-2">
              {searchResults.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-[#DCD7C9] dark:border-[#3d3d3d] text-center text-xs text-[#64748B] dark:text-[#9E9E96] font-heading">
                  No users found matching "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((user) => {
                    const isProcessing = actionProcessingId === user.id;
                    const isAlreadyConnected = user.connection_status === 'accepted';
                    const isPending = user.connection_status === 'pending';

                    return (
                      <div
                        key={user.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#E5E0D5] dark:border-[#383838] flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-[#091424] dark:bg-[#141414] text-white flex items-center justify-center p-2.5 flex-shrink-0">
                            <AvatarIcon id={user.avatar_id} className="w-full h-full text-white" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-heading font-bold text-[#091424] dark:text-white truncate">
                              {user.display_name}
                            </h4>
                            <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] truncate">
                              @{user.username} &bull;{' '}
                              <span className="font-semibold text-[#091424] dark:text-[#F4D875]">
                                {user.elo_rating} ELO
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          {isAlreadyConnected ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                              Connected
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{user.is_sender ? 'Request Sent' : 'Incoming'}</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleSendRequest(user)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#F4D875] hover:bg-[#F2CE52] text-[#112E52] text-xs font-heading font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-60"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserPlus className="w-3.5 h-3.5" />
                              )}
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 2: Incoming Requests */}
        {incomingRequests.length > 0 && (
          <section aria-labelledby="incoming-requests-heading" className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2
                id="incoming-requests-heading"
                className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white flex items-center space-x-2"
              >
                <span>INCOMING REQUESTS</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F4D875] text-[#112E52] text-[10px] font-bold">
                  {incomingRequests.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {incomingRequests.map((req) => {
                const isProcessing = actionProcessingId === req.id;
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#E5E0D5] dark:border-[#383838] flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-[#091424] dark:bg-[#141414] text-white flex items-center justify-center p-2.5 flex-shrink-0">
                        <AvatarIcon id={req.user.avatar_id} className="w-full h-full text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-heading font-bold text-[#091424] dark:text-white truncate">
                          {req.user.display_name}
                        </h4>
                        <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] truncate">
                          @{req.user.username} &bull;{' '}
                          <span className="font-semibold text-[#091424] dark:text-[#F4D875]">
                            {req.user.elo_rating} ELO
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleAccept(req.id, req.user.username)}
                        title="Accept connection"
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleDecline(req.id)}
                        title="Decline connection"
                        className="p-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 3: Sent Requests */}
        {sentRequests.length > 0 && (
          <section aria-labelledby="sent-requests-heading" className="space-y-3 pt-2">
            <h2
              id="sent-requests-heading"
              className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white"
            >
              SENT REQUESTS ({sentRequests.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sentRequests.map((req) => {
                const isProcessing = actionProcessingId === req.id;
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#202020] border border-[#E5E0D5] dark:border-[#383838] flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-[#091424] dark:bg-[#141414] text-white flex items-center justify-center p-2.5 flex-shrink-0">
                        <AvatarIcon id={req.user.avatar_id} className="w-full h-full text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-heading font-bold text-[#091424] dark:text-white truncate">
                          {req.user.display_name}
                        </h4>
                        <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] truncate">
                          @{req.user.username} &bull;{' '}
                          <span className="font-semibold text-[#091424] dark:text-[#F4D875]">
                            {req.user.elo_rating} ELO
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleCancel(req.id)}
                      className="px-3 py-1.5 rounded-xl border border-[#D5D0BC] dark:border-[#404040] text-xs font-heading font-medium text-[#64748B] hover:text-red-600 dark:text-[#9E9E96] dark:hover:text-red-400 transition-colors"
                    >
                      {isProcessing ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 4: Your Connections */}
        <section aria-labelledby="your-connections-heading" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2
              id="your-connections-heading"
              className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white flex items-center space-x-2"
            >
              <Users className="w-3.5 h-3.5" />
              <span>YOUR CONNECTIONS ({acceptedConnections.length})</span>
            </h2>
            <button
              onClick={refreshConnections}
              className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
            >
              Refresh
            </button>
          </div>

          {loading && acceptedConnections.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#112E52] dark:text-[#F4D875]" />
              <span className="text-xs font-heading text-[#64748B]">Loading connections...</span>
            </div>
          ) : acceptedConnections.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-[#DCD7C9] dark:border-[#3d3d3d] text-center space-y-2">
              <Users className="w-8 h-8 mx-auto text-[#64748B] dark:text-[#9E9E96] opacity-60" />
              <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">
                No connections yet
              </h3>
              <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] max-w-sm mx-auto">
                Connect with peers to see each other's placement preparation progress, consistency streaks, and ELO ratings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {acceptedConnections.map((conn) => {
                const isProcessing = actionProcessingId === conn.id;
                return (
                  <div
                    key={conn.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#202020] border border-[#E5E0D5] dark:border-[#383838] flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-[#091424] dark:bg-[#141414] text-white flex items-center justify-center p-3 flex-shrink-0 shadow-sm">
                          <AvatarIcon id={conn.user.avatar_id} className="w-full h-full text-white" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-heading font-bold text-[#091424] dark:text-white truncate">
                            {conn.user.display_name}
                          </h4>
                          <p className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96] truncate">
                            @{conn.user.username}
                          </p>
                        </div>
                      </div>

                      {/* ELO Rating Badge */}
                      <div className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1a1a1a] border border-[#E5E0D5] dark:border-[#383838] flex items-center space-x-1.5 flex-shrink-0">
                        <span className="text-[10px] font-heading font-bold text-[#64748B] dark:text-[#9E9E96]">
                          ELO
                        </span>
                        <span className="text-sm font-heading font-black text-[#091424] dark:text-[#F4D875]">
                          {conn.user.elo_rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE8] dark:border-[#2e2e2e]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFriendId(conn.user.id);
                          setSelectedFriendUsername(conn.user.username);
                        }}
                        className="inline-flex items-center space-x-1.5 text-xs font-heading font-bold text-[#091424] dark:text-[#F4D875] hover:opacity-75 transition-opacity cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Verified Progress</span>
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleRemove(conn.id, conn.user.username)}
                        title="Remove connection"
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-red-600 dark:text-[#9E9E96] dark:hover:text-red-400 transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
