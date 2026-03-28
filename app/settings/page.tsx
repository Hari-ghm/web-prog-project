'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Settings updated successfully. If email changed, sign in again.');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setError('Network error occurred');
    }
    setLoading(false);
  };

  if (authLoading) return <div className="flex justify-center py-20 text-secondary">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-500 rounded-xl">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass rounded-2xl border border-border/50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>
          <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                   <label className="block text-sm font-medium text-secondary mb-1.5">Full Name</label>
                   <input 
                     type="text" 
                     name="name" 
                     required 
                     value={formData.name} 
                     onChange={handleChange} 
                     className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:border-blue-500 transition-colors" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-secondary mb-1.5">Email Address</label>
                   <input 
                     type="email" 
                     name="email" 
                     required 
                     value={formData.email} 
                     onChange={handleChange} 
                     className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:border-blue-500 transition-colors" 
                   />
                </div>
              </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-border/50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">Change Password</h2>
          <p className="text-sm text-secondary mb-6">Leave blank if you do not want to change your password.</p>
          <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-secondary mb-1.5">Current Password</label>
                 <input 
                   type="password" 
                   name="currentPassword" 
                   value={formData.currentPassword} 
                   onChange={handleChange} 
                   placeholder="••••••••" 
                   className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:border-blue-500 transition-colors max-w-md" 
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-secondary mb-1.5">New Password</label>
                 <input 
                   type="password" 
                   name="newPassword" 
                   value={formData.newPassword} 
                   onChange={handleChange} 
                   placeholder="••••••••" 
                   className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:border-blue-500 transition-colors max-w-md" 
                 />
              </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
}
