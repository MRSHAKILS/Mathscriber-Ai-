'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Key, 
  Bell, 
  Shield, 
  Save, 
  CheckCircle,
  Loader2,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  AlertCircle,
  Palette,
  Globe,
  Database
} from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/home/Footer';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

interface FormErrors {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });

  useEffect(() => {
    if (!authLoading && user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
      }));
    }
  }, [user, authLoading]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (activeTab === 'profile') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (activeTab === 'security') {
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          newErrors.currentPassword = 'Current password is required';
        }
        if (formData.newPassword.length < 8) {
          newErrors.newPassword = 'Password must be at least 8 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (activeTab === 'profile') {
        console.log('Updating profile:', { name: formData.name, email: formData.email });
      } else if (activeTab === 'security') {
        console.log('Updating password');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/10 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'preferences' as const, label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/10 to-gray-950 flex flex-col">
      <Navbar />
      {user && <Sidebar />}
      
      <div className={`flex-1 ${user ? 'ml-0 lg:ml-64' : ''}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-600/20 rounded-xl">
                <SettingsIcon size={32} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="flex gap-2 border-b border-gray-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <User size={24} className="text-purple-400" />
                      Profile Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2 font-medium">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gray-800 border ${
                            errors.name ? 'border-red-500' : 'border-gray-700'
                          } text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2 font-medium">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gray-800 border ${
                            errors.email ? 'border-red-500' : 'border-gray-700'
                          } text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Key size={24} className="text-purple-400" />
                      Change Password
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2 font-medium">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gray-800 border ${
                              errors.currentPassword ? 'border-red-500' : 'border-gray-700'
                            } text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2 font-medium">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gray-800 border ${
                              errors.newPassword ? 'border-red-500' : 'border-gray-700'
                            } text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.newPassword}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          Must be at least 8 characters long
                        </p>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2 font-medium">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gray-800 border ${
                              errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                            } text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Bell size={24} className="text-purple-400" />
                      Notifications
                    </h3>
                    
                    <div className="space-y-4">
                      {Object.entries({
                        email: 'Email Notifications',
                        push: 'Push Notifications',
                        updates: 'Product Updates',
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-800">
                          <span className="text-gray-300">{label}</span>
                          <button
                            onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                            className={`relative w-14 h-7 rounded-full transition-all ${
                              notifications[key as keyof typeof notifications]
                                ? 'bg-purple-600'
                                : 'bg-gray-700'
                            }`}
                          >
                            <span
                              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                notifications[key as keyof typeof notifications]
                                  ? 'translate-x-7'
                                  : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Palette size={24} className="text-purple-400" />
                      Appearance
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {['Light', 'Dark', 'Auto'].map((theme) => (
                        <button
                          key={theme}
                          className="p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-purple-500 transition-all"
                        >
                          <div className="text-white font-medium">{theme}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                    saved
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle size={20} />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
}
