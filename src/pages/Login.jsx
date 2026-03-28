import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide an email and password.');
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-lightPrimary dark:bg-darkPrimary flex items-center justify-center p-4">
      <div className="card-base w-full max-w-md p-8 animate-fade-in shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal to-blue inline-block mb-2">
            EcoDash
          </h1>
          <p className="text-textSecondary dark:text-gray-400">Sign in to access the Dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 text-center border border-red-200 dark:border-red-800/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-borderLight dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal outline-none transition-shadow text-textPrimary dark:text-gray-200"
              placeholder="admin@ecodash.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-borderLight dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal outline-none transition-shadow text-textPrimary dark:text-gray-200"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full btn-primary py-3 font-semibold text-lg shadow-md hover:shadow-lg transition-all"
          >
            Log In
          </button>
        </form>
        
        <p className="mt-6 text-center text-xs text-textSecondary dark:text-gray-500">
          Any email and password will work for this simulation.
        </p>
      </div>
    </div>
  );
};

export default Login;
