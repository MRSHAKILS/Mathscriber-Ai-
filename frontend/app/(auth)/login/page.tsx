'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Github,
  CheckCircle,
  Zap,
  Shield,
  Brain,
  Rocket,
  Star,
  Sparkles,
  User,
  Key,
  AlertCircle,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Globe,
  ShieldCheck,
  Cpu,
  Database,
  Cloud
} from 'lucide-react';

// Floating particle component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: [null, 100, 100, -20],
        x: [null, 20, -20, 0],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrors({ general: error.message });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Redirect to upload page after successful login
        router.push('/upload');
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred during login' });
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setIsLoading(true);
    setErrors({});
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrors({ general: error.message });
        setIsLoading(false);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Social login failed' });
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950/30 pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-[100px]"
          />
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.2} />
          ))}
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 min-h-[calc(100vh-5rem)]">
            
            {/* Left Content - 5 columns */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 flex flex-col justify-center py-12 lg:py-24"
            >
              {/* Logo & Brand */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <Link href="/" className="inline-flex items-center gap-4 group mb-8">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="relative"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-red-500/40">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 rounded-2xl border-2 border-red-400/30 border-t-transparent"
                    />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight">
                      <span className="text-white">Math</span>
                      <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Scriber</span>
                    </h1>
                    <p className="text-sm text-gray-400 font-medium mt-1">Intelligent Math-to-LaTeX Conversion</p>
                  </div>
                </Link>

                <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  Welcome Back to
                  <span className="block bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Your Math Workspace
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
                  Sign in to continue transforming complex equations into perfect LaTeX with our advanced AI engine.
                </p>
              </motion.div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 h-full hover:border-red-500/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                        <Cpu className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">AI-Powered</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Advanced neural networks for precise mathematical recognition</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 h-full hover:border-orange-500/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Lightning Fast</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Convert complex equations in under 3 seconds</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 h-full hover:border-amber-500/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 shadow-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Secure</h3>
                    </div>
                    <p className="text-gray-400 text-sm">Enterprise-grade encryption for your data</p>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">50K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">97.3%</div>
                  <div className="text-sm text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Form - 5 columns */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex items-center justify-center py-12"
            >
              <div className="w-full max-w-lg">
                {/* Form Container */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/10 to-transparent rounded-3xl blur-xl" />
                  
                  <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-red-500/20">
                    {/* Form Header */}
                    <div className="text-center mb-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6"
                      >
                        <div className="relative">
                          <User className="w-10 h-10 text-red-400" />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-2 rounded-full bg-red-500/20 blur-md"
                          />
                        </div>
                      </motion.div>
                      <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
                      <p className="text-gray-400">
                        Sign in to access your workspace
                      </p>
                    </div>

                    {/* General Error Display */}
                    <AnimatePresence>
                      {errors.general && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                        >
                          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-red-400 font-medium mb-1">Authentication Error</p>
                            <p className="text-red-300/80 text-sm">{errors.general}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Social Login */}
                    <div className="space-y-4 mb-10">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSocialLogin('google')}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 rounded-xl text-white font-medium transition-all group"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                          <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                          <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                          <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                        </svg>
                        <span>Continue with Google</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSocialLogin('github')}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 rounded-xl text-white font-medium transition-all group"
                      >
                        <Github className="w-6 h-6" />
                        <span>Continue with GitHub</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </motion.button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-10">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-black/60 text-gray-400 text-sm font-medium">Or sign in with email</span>
                      </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Email Field */}
                      <div className="space-y-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-red-400" />
                            Email Address
                          </div>
                        </label>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          onHoverStart={() => setHoveredField('email')}
                          onHoverEnd={() => setHoveredField(null)}
                          className="relative"
                        >
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 bg-gradient-to-r from-white/5 to-white/10 border ${errors.email ? 'border-red-500/50' : hoveredField === 'email' ? 'border-red-400/50' : 'border-white/10'} rounded-xl text-white text-base placeholder-gray-400/50 focus:outline-none focus:border-red-400/70 focus:ring-4 focus:ring-red-500/20 transition-all duration-300`}
                            placeholder="name@university.edu"
                          />
                          {!errors.email && formData.email && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            </motion.div>
                          )}
                        </motion.div>
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-400 flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {errors.email}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Lock className="w-4 h-4 text-red-400" />
                              Password
                            </div>
                          </label>
                          <Link 
                            href="/forgot-password" 
                            className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                          >
                            <Key className="w-4 h-4" />
                            Forgot password?
                          </Link>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          onHoverStart={() => setHoveredField('password')}
                          onHoverEnd={() => setHoveredField(null)}
                          className="relative"
                        >
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 bg-gradient-to-r from-white/5 to-white/10 border ${errors.password ? 'border-red-500/50' : hoveredField === 'password' ? 'border-red-400/50' : 'border-white/10'} rounded-xl text-white text-base placeholder-gray-400/50 focus:outline-none focus:border-red-400/70 focus:ring-4 focus:ring-red-500/20 transition-all duration-300`}
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-2"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </motion.div>
                        <AnimatePresence>
                          {errors.password && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-red-400 flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {errors.password}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Remember Me */}
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <motion.div
                              animate={{ 
                                scale: formData.rememberMe ? 1 : 0.8,
                                backgroundColor: formData.rememberMe ? 'rgb(239 68 68)' : 'rgba(255,255,255,0.05)',
                                borderColor: formData.rememberMe ? 'rgb(239 68 68)' : 'rgba(255,255,255,0.2)'
                              }}
                              transition={{ duration: 0.2 }}
                              className="w-6 h-6 rounded-lg border-2 flex items-center justify-center group-hover:border-red-400/50"
                            >
                              {formData.rememberMe && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </motion.div>
                          </div>
                          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            Remember me for 30 days
                          </span>
                        </label>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:via-orange-400 hover:to-amber-400 text-white font-bold rounded-xl shadow-2xl shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                      >
                        {/* Shine effect */}
                        <motion.div
                          animate={{ x: ['100%', '-100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                        
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span className="relative">Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <span className="relative">Sign In to Workspace</span>
                            <ArrowRight className="w-5 h-5 relative group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                      <p className="text-center text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link 
                          href="/register" 
                          className="text-red-400 hover:text-red-300 font-bold transition-colors inline-flex items-center gap-2 group"
                        >
                          <span>Join MathScriber</span>
                          <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </p>
                    </div>

                    {/* Security Note */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 p-4 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-xl border border-red-500/20"
                    >
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-300">Secure & Encrypted</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Your credentials are protected with 256-bit SSL encryption. We never store plain text passwords.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}