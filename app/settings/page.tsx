'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  // const { data: session, update } = useSession();
  const session = { user: { name: 'Demo User', email: 'user@example.com' } };
  const update = async (data: any) => { console.log('Mock update', data); };
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    role: '',
    createdAt: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData(prev => ({
          ...prev,
          name: data.name,
          email: data.email
        }));
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      const mockUser = {
        name: 'Demo User',
        email: 'user@example.com',
        role: 'User',
        createdAt: new Date().toISOString()
      };
      setProfile(mockUser);
      setFormData({
        name: mockUser.name,
        email: mockUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        await update({ name: formData.name });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please verify your current password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-6 h-6" />
              Account Settings
            </h1>
            <p className="text-green-100 mt-1">Manage your profile and security preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-green-500 text-green-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4 inline-block mr-2" />
              Change Password
            </button>
          </div>

          {/* Alert Messages */}
          {message && (
            <div className={`mx-6 mt-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-green-900/50 rounded-full flex items-center justify-center border border-green-800">
                  <User className="w-10 h-10 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{profile.name || 'User'}</h3>
                  <p className="text-sm text-slate-400 capitalize">{profile.role}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-slate-800 text-slate-100 placeholder-slate-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-slate-800 text-slate-100 placeholder-slate-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-400">Password Requirements</h4>
                    <ul className="text-xs text-yellow-300/80 mt-1 list-disc list-inside">
                      <li>Minimum 6 characters</li>
                      <li>Include at least one number or special character</li>
                      <li>Cannot be the same as your current password</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-slate-800 text-slate-100 placeholder-slate-500"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-slate-800 text-slate-100 placeholder-slate-500"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-slate-800 text-slate-100 placeholder-slate-500"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}