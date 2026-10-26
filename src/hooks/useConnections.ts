import { useState, useEffect, useCallback } from 'react';
import { supabase, type FriendProgressData } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface ConnectionUser {
  id: string;
  username: string;
  display_name: string;
  avatar_id: string;
  elo_rating: number;
}

export interface ConnectionItem {
  id: string; // connection id
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  user: ConnectionUser;
  isSender: boolean;
}

export interface SearchResultUser {
  id: string;
  username: string;
  display_name: string;
  avatar_id: string;
  elo_rating: number;
  connection_status: string | null;
  connection_id: string | null;
  is_sender: boolean | null;
}

export function useConnections(currentUser: User | null) {
  const [incomingRequests, setIncomingRequests] = useState<ConnectionItem[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionItem[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    if (!currentUser) {
      setIncomingRequests([]);
      setSentRequests([]);
      setAcceptedConnections([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Fetch incoming requests
      const { data: incomingData, error: incomingErr } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          sender:profiles!sender_id (id, username, display_name, avatar_id, elo_rating)
        `)
        .eq('receiver_id', currentUser.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (incomingErr) throw incomingErr;

      const mappedIncoming: ConnectionItem[] = (incomingData || []).map((row: any) => ({
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        user: row.sender,
        isSender: false,
      }));
      setIncomingRequests(mappedIncoming);

      // 2. Fetch sent requests
      const { data: sentData, error: sentErr } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          receiver:profiles!receiver_id (id, username, display_name, avatar_id, elo_rating)
        `)
        .eq('sender_id', currentUser.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (sentErr) throw sentErr;

      const mappedSent: ConnectionItem[] = (sentData || []).map((row: any) => ({
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        user: row.receiver,
        isSender: true,
      }));
      setSentRequests(mappedSent);

      // 3. Fetch accepted connections
      const { data: acceptedData, error: acceptedErr } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          sender_id,
          receiver_id,
          sender:profiles!sender_id (id, username, display_name, avatar_id, elo_rating),
          receiver:profiles!receiver_id (id, username, display_name, avatar_id, elo_rating)
        `)
        .eq('status', 'accepted')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (acceptedErr) throw acceptedErr;

      const mappedAccepted: ConnectionItem[] = (acceptedData || []).map((row: any) => {
        const isSender = row.sender_id === currentUser.id;
        const otherUser = isSender ? row.receiver : row.sender;
        return {
          id: row.id,
          status: row.status,
          created_at: row.created_at,
          user: otherUser,
          isSender,
        };
      });
      setAcceptedConnections(mappedAccepted);
    } catch (err: any) {
      console.error('Failed to fetch connections:', err);
      setError(err.message || 'Error loading connections');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Username search
  const searchUsers = async (query: string): Promise<SearchResultUser[]> => {
    if (!currentUser || !query.trim()) return [];

    try {
      const { data, error: searchErr } = await supabase.rpc('search_users_for_connections', {
        p_query: query.trim(),
        p_limit: 20,
      });

      if (searchErr) throw searchErr;
      return (data || []) as SearchResultUser[];
    } catch (err) {
      console.error('Search users error:', err);
      return [];
    }
  };

  // Send request
  const sendRequest = async (receiverId: string) => {
    if (!currentUser) throw new Error('Not authenticated');
    if (currentUser.id === receiverId) throw new Error('Cannot send a request to yourself');

    const { data, error: insertErr } = await supabase
      .from('connections')
      .insert({
        sender_id: currentUser.id,
        receiver_id: receiverId,
        status: 'pending',
      })
      .select()
      .single();

    if (insertErr) {
      if (insertErr.code === '23505') {
        throw new Error('A request or connection already exists between you.');
      }
      throw insertErr;
    }

    await fetchConnections();
    return data;
  };

  // Accept request
  const acceptRequest = async (connectionId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    const { error: updateErr } = await supabase
      .from('connections')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', connectionId)
      .eq('receiver_id', currentUser.id);

    if (updateErr) throw updateErr;
    await fetchConnections();
  };

  // Decline request
  const declineRequest = async (connectionId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    // Deleting the pending request frees up future requests
    const { error: delErr } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId)
      .eq('receiver_id', currentUser.id);

    if (delErr) throw delErr;
    await fetchConnections();
  };

  // Cancel outgoing request
  const cancelRequest = async (connectionId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    const { error: delErr } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId)
      .eq('sender_id', currentUser.id);

    if (delErr) throw delErr;
    await fetchConnections();
  };

  // Remove connection
  const removeConnection = async (connectionId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    const { error: delErr } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);

    if (delErr) throw delErr;
    await fetchConnections();
  };

  // Fetch friend's permitted progress
  const fetchFriendProgress = async (friendId: string): Promise<FriendProgressData> => {
    if (!currentUser) throw new Error('Not authenticated');

    const { data, error: rpcErr } = await supabase.rpc('get_friend_progress', {
      p_friend_id: friendId,
    });

    if (rpcErr) {
      console.error('get_friend_progress error:', rpcErr);
      const rawMsg = rpcErr.message || '';
      // Ensure no raw SQL, RPC, aggregate, or Postgres internals reach the UI
      if (
        /aggregate/i.test(rawMsg) ||
        /SQL/i.test(rawMsg) ||
        /relation/i.test(rawMsg) ||
        /PL\/pgSQL/i.test(rawMsg) ||
        /PostgREST/i.test(rawMsg) ||
        /function/i.test(rawMsg)
      ) {
        throw new Error('Unable to load connection progress at this time. Please try again shortly.');
      }
      if (/Access denied/i.test(rawMsg)) {
        throw new Error('You must have an accepted connection to view this user\'s progress.');
      }
      throw new Error(rpcErr.message || 'Unable to load connection progress.');
    }
    return data as FriendProgressData;
  };

  return {
    incomingRequests,
    sentRequests,
    acceptedConnections,
    loading,
    error,
    searchUsers,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
    removeConnection,
    fetchFriendProgress,
    refreshConnections: fetchConnections,
  };
}
