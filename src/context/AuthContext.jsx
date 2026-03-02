import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, login, logout, register, updateUserVerification } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const resp = await getCurrentUser();
      if (resp && resp.profile) {
        setUser(resp.profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    await login(email, password);
    await checkUser();
  };

  const registerUser = async (email, password, name, extraData) => {
    await register(email, password, name, extraData);
    await checkUser();
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  const requestVerification = async (file) => {
    // Actually handle file upload in component and just update status here
    // or pass through
    await updateUserVerification(user.userId, 'dummy-file-id');
    await checkUser();
  };

  const syncUser = async () => {
    await checkUser();
  };

  const value = {
    user,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    requestVerification,
    syncUser
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
