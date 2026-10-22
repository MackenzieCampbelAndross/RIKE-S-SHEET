import { useState, useEffect, useCallback } from 'react';
import { AVATAR_OPTIONS, type AvatarOption } from '../components/AvatarIcon';

export interface UserProfile {
  name: string;
  avatarId: string;
}

const PROFILE_STORAGE_KEY = 'ad2_profile_v2';

const defaultProfile: UserProfile = {
  name: 'Mackenzie',
  avatarId: 'geometric-mountain',
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name : defaultProfile.name,
          avatarId: typeof parsed.avatarId === 'string' ? parsed.avatarId : defaultProfile.avatarId,
        };
      }
      // Migrate v1 name if exists
      const v1 = localStorage.getItem('ad2_profile_v1');
      if (v1) {
        const parsed = JSON.parse(v1);
        if (typeof parsed.name === 'string' && parsed.name.trim()) {
          return {
            name: parsed.name,
            avatarId: defaultProfile.avatarId,
          };
        }
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
    return defaultProfile;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }, [profile]);

  const updateName = useCallback((name: string) => {
    setProfile((prev) => ({ ...prev, name }));
  }, []);

  const updateAvatar = useCallback((avatarId: string) => {
    setProfile((prev) => ({ ...prev, avatarId }));
  }, []);

  const currentAvatar: AvatarOption =
    AVATAR_OPTIONS.find((a) => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  return {
    profile,
    currentAvatar,
    updateName,
    updateAvatar,
  };
}
