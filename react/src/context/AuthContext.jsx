import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loginMember } from '../api/login';
import { registerMember } from '../api/register';
import { getProfile } from '../api/profile';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'auth_token';

const readStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

const persistTokenValue = (value) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (value) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, value);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const extractErrorMessage = (error) => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      return data.join(' ');
    }
    if (data.detail) {
      return data.detail;
    }
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const value = data[keys[0]];
      if (Array.isArray(value)) {
        return value.join(' ');
      }
      if (typeof value === 'string') {
        return value;
      }
    }
  }
  if (error?.message) {
    return error.message;
  }
  return 'Произошла ошибка. Попробуйте снова.';
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readStoredToken());
  const [member, setMember] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const persistToken = useCallback((value) => {
    setToken(value);
    persistTokenValue(value);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      if (!token) {
        setMember(null);
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      try {
        const profile = await getProfile(token);
        if (isActive) {
          setMember(profile);
        }
      } catch (error) {
        if (isActive) {
          persistToken(null);
          setMember(null);
        }
      } finally {
        if (isActive) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [token, persistToken]);

  const login = useCallback(
    async (credentials) => {
      try {
        const result = await loginMember(credentials);
        persistToken(result.token);
        setMember(result.member);
        return result.member;
      } catch (error) {
        throw new Error(extractErrorMessage(error));
      }
    },
    [persistToken]
  );

  const register = useCallback(
    async (payload) => {
      try {
        const result = await registerMember(payload);
        persistToken(result.token);
        setMember(result.member);
        return result.member;
      } catch (error) {
        throw new Error(extractErrorMessage(error));
      }
    },
    [persistToken]
  );

  const logout = useCallback(() => {
    persistToken(null);
    setMember(null);
  }, [persistToken]);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      return null;
    }
    try {
      const profile = await getProfile(token);
      setMember(profile);
      return profile;
    } catch (error) {
      persistToken(null);
      setMember(null);
      throw new Error(extractErrorMessage(error));
    }
  }, [token, persistToken]);

  const value = useMemo(
    () => ({
      token,
      member,
      loadingProfile,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [token, member, loadingProfile, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
