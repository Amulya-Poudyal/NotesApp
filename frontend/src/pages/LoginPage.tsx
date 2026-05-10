import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ArrowRight, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data.accessToken, data.refreshToken, data.username || username);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-6 text-text-main">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold tracking-tighter uppercase mb-2">Kritim Notes</h1>
          <p className="text-text-secondary mono-text">Authentication Required</p>
        </div>

        <div className="brutalist-card bg-card-bg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-text-secondary mb-2">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-page-bg brutalist-border focus:border-border-heavy outline-none transition-colors"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-page-bg brutalist-border focus:border-border-heavy outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-medium border border-red-100 uppercase tracking-tighter">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-accent text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent/90 transition-all group"
            >
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-text-secondary uppercase font-mono tracking-tighter">
              Don't have an account? <Link to="/register" className="text-text-main font-bold hover:underline">Register</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center mono-text opacity-30">
          ARCHIVE_01 V2.4 — SECURITY_PROTOCOL_ALPHA
        </div>
      </div>
    </div>
  );
};
