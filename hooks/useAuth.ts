
import { useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { API_URL } from '../constants';

export const useAuth = (isBackendAvailable: boolean) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const storedUser = localStorage.getItem('pinclone_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Retroactive fix for existing xyz user stored without role
      if (parsedUser.username === 'xyz' && parsedUser.role !== 'admin') {
        parsedUser.role = 'admin';
        localStorage.setItem('pinclone_user', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isBackendAvailable) {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        const data: AuthResponse = await res.json();
        setUser(data.user);
        localStorage.setItem('pinclone_user', JSON.stringify(data.user));
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    } else {
      // Local simulation
      const usersStr = localStorage.getItem('pinclone_users_db');
      let users: any[] = usersStr ? JSON.parse(usersStr) : [];
      
      // SEED DEFAULT ADMIN if 'xyz' doesn't exist
      // This ensures the user can always login with admin@admin.com / admin
      if (!users.find(u => u.username === 'xyz')) {
          const defaultAdmin = {
              id: 'default-admin',
              username: 'xyz',
              email: 'admin@admin.com',
              password: 'admin',
              role: 'admin'
          };
          users.push(defaultAdmin);
          localStorage.setItem('pinclone_users_db', JSON.stringify(users));
      }

      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...safeUser } = foundUser;
        
        // Enforce admin role for xyz
        if (safeUser.username === 'xyz') {
            safeUser.role = 'admin';
        } else if (!safeUser.role) {
            safeUser.role = 'user';
        }

        setUser(safeUser);
        localStorage.setItem('pinclone_user', JSON.stringify(safeUser));
        return true;
      }
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const role: 'admin' | 'user' = username === 'xyz' ? 'admin' : 'user';

    if (isBackendAvailable) {
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        if (!res.ok) throw new Error('Registration failed');
        const data: AuthResponse = await res.json();
        setUser(data.user);
        localStorage.setItem('pinclone_user', JSON.stringify(data.user));
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    } else {
      // Local simulation
      const usersStr = localStorage.getItem('pinclone_users_db');
      const users: any[] = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.find(u => u.email === email)) return false; // Exists

      const newUser = { 
          id: Date.now().toString(), 
          username, 
          email, 
          password,
          role 
      };
      users.push(newUser);
      localStorage.setItem('pinclone_users_db', JSON.stringify(users));
      
      const { password: _, ...safeUser } = newUser;
      setUser(safeUser as User);
      localStorage.setItem('pinclone_user', JSON.stringify(safeUser));
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pinclone_user');
  };

  return { user, login, register, logout, loading };
};
