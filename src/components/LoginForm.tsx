import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data: { publicUrl }, error } = supabase
          .storage
          .from('assets')
          .getPublicUrl('da-logo.png');
          
        if (error) throw error;
        setLogoUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'BPD1293' && password === 'BPD1293') {
      setUser({ id: '1', email: username, role: 'admin' });
      navigate('/dashboard');
    } else if (username === 'KIOSK' && password === 'KIOSK') {
      setUser({ id: '2', email: username, role: 'kiosk' });
      navigate('/check-in');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          {logoUrl && (
            <img 
              src={logoUrl}
              alt="District Attorney's Office" 
              className="w-24 h-24"
            />
          )}
        </div>
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          KCDA Subpoena Check-in
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};