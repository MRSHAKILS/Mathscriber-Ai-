'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Upload, 
  History, 
  Sparkles,
  FileText,
  BarChart3,
  Menu,
  X,
  Zap,
  Rocket
} from 'lucide-react';

const features = [
  { name: 'Convert', href: '/upload', icon: Upload, description: 'Upload & Convert Images' },
  { name: 'Playground', href: '/playground', icon: Sparkles, description: 'Interactive Editor' },
  { name: 'Results', href: '/results', icon: History, description: 'Conversion History' },
  { name: 'Templates', href: '/templates', icon: FileText, description: 'LaTeX Templates' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Usage Stats' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFeatureOpen, setIsFeatureOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFeatureOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); []);

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(239,68,68,0.15)] border-b border-white/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3"
              >
                {/* Icon */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500" />
                  <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-orange-600 flex items-center justify-center shadow-2xl group-hover:shadow-red-500/50 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 10h10M7 14h10M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                      <path d="M12 8v8" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                
                {/* Text */}
                <div className="flex flex-col">
                  <span className="text-[22px] font-black tracking-tight leading-none">
                    <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">Math</span>
                    <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">Scriber</span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mt-0.5">AI Powered</span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Features Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsFeatureOpen(!isFeatureOpen)}
                  className="group px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>Features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFeatureOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isFeatureOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        {features.map((feature, index) => {
                          const Icon = feature.icon;
                          return (
                            <Link
                              key={feature.name}
                              href={feature.href}
                              onClick={() => setIsFeatureOpen(false)}
                            >
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-200 cursor-pointer"
                              >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 group-hover:from-red-500 group-hover:to-orange-500 flex items-center justify-center transition-all duration-300">
                                  <Icon className="w-5 h-5 text-red-400 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400 transition-all">
                                    {feature.name}
                                  </p>
                                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                    {feature.description}
                                  </p>
                                </div>
                              </motion.div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink href="/#pricing">Pricing</NavLink>
              <NavLink href="/about">About</NavLink>

              {/* CTA Button */}
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-3 px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  Try Now Free
                </motion.button>
              </Link>

              {/* Auth Section */}
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
                {isAuthenticated ? (
                  <div className="relative" ref={profileRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
              {/* Auth Buttons */}
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 bg-white text-black font-bold text-sm rounded-xl hover:bg-gray-100 shadow-lg transition-all duration-200"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>ileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-0 right-0 z-40 lg:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.name}
                    href={feature.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all"
                  >
                    <Icon className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">{feature.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl">
                    Try Now Free
                  </button>
                </Link>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white truncate">{user?.email || user?.username}</span>
                    </div>
                    <Link href="/history" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-2.5 text-white border border-white/20 rounded-xl font-medium flex items-center justify-center gap-2">
                        <History className="w-4 h-4" />
                        History
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-2.5 text-white border border-white/20 rounded-xl font-medium">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-2.5 bg-white text-black font-bold rounded-xl">
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
                <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl">
                    Try Now Free
                  </button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-2.5 text-white border border-white/20 rounded-xl font-medium">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-2.5 bg-white text-black font-bold rounded-xl">
                      Get Started
                    </button>
                  </Link>
                </div>