'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Upload, 
  History, 
  LayoutDashboard, 
  Sparkles,
  FileText,
  BarChart3,
  ChevronDown,
  Zap
} from 'lucide-react';

const navLinks = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
  },
  { 
    name: 'Convert', 
    href: '/upload', 
    icon: Upload,
    highlight: true 
  },
  { 
    name: 'Playground', 
    href: '/playground', 
    icon: Sparkles,
  },
  { 
    name: 'Results', 
    href: '/results', 
    icon: History,
  },
  { 
    name: 'Templates', 
    href: '/templates', 
    icon: FileText,
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart3,
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-red-900/30 shadow-lg shadow-red-900/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:shadow-red-500/50 transition-shadow duration-300">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-xl tracking-tight">
                  Math<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Scriber</span>
                </span>
                <p className="text-gray-500 text-xs -mt-1">AI LaTeX Converter</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                
                return (
                  <Link key={link.name} href={link.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 group ${
                        link.highlight 
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/25 hover:shadow-red-500/40' 
                          : active 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${link.highlight ? 'text-white' : ''}`} />
                      <span className="font-medium text-sm">{link.name}</span>
                      
                      {/* Active indicator */}
                      {active && !link.highlight && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"
                        />
                      )}
                      
                      {/* Hover glow effect */}
                      {!link.highlight && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 via-red-600/10 to-orange-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-red-900/30"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          link.highlight
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                            : active
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}>
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{link.name}</span>
                          {active && !link.highlight && (
                            <div className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 mt-4 border-t border-red-900/30 space-y-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="w-full py-3 text-gray-400 hover:text-white text-center font-medium rounded-xl hover:bg-white/5 transition-all"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="w-full py-3 bg-white text-black text-center font-semibold rounded-xl hover:bg-gray-100 transition-all"
                    >
                      Get Started Free
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
