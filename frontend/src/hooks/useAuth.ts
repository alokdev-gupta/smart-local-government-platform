import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook that wraps useAuthContext for convenience.
 * Provides access to: user, token, isAuthenticated, isLoading,
 * login, register, logout, updateUser
 */
export const useAuth = () => {
  return useAuthContext();
};
