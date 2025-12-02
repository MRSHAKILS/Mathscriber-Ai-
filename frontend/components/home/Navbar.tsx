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
  Calculator,
  Menu,
  X,
  Zap
} from 'lucide-react';

const features = [
  { name: 'Convert Image', href: '/upload', icon: Upload, description: 'Upload math images to LaTeX' },
  { name: 'Playground', href: '/playground', icon: Sparkles, description: 'Interactive LaTeX editor' },
  { name: 'My Results', href: '/results', icon: History, description: 'View conversion history' },
  { name: 'Templates', href: '/templates', icon: FileText, description: 'Ready-to-use LaTeX templates' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Usage statistics & insights' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFeatureOpen, setIsFeatureOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFeatureOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gradient-to-r from-black/95 via-red-950/80 to-black/95 backdrop-blur-2xl shadow-2xl shadow-red-900/30 border-b border-red-700/40' 
            : 'bg-gradient-to-r from-black/80 via-red-950/50 to-black/80 backdrop-blur-xl'
        }`}
      >
        {/* Animated gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 via-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-tight">
                    <span className="text-white">Math</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 animate-gradient">Scriber</span>
                  </span>
                  <span className="text-[10px] text-gray-500 -mt-0.5">AI LaTeX Converter</span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Overview */}
              <NavLink href="/#overview">Overview</NavLink>
              
              {/* About Us */}
              <NavLink href="/about">About Us</NavLink>
              
              {/* Features Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsFeatureOpen(!isFeatureOpen)}
                  className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-1 group"
                >
                  <span className="relative z-10">Features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFeatureOpen ? 'rotate-180' : ''}`} />
                  
                  {/* Hover underline effect */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-3/4 transition-all duration-300" />
                </button>

                <AnimatePresence>
                  {isFeatureOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-gradient-to-b from-gray-900 via-red-950/30 to-black backdrop-blur-2xl rounded-xl border border-red-700/50 shadow-2xl shadow-red-900/40 py-2 overflow-hidden"
                    >
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
                              className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg hover:bg-gradient-to-r hover:from-red-600/30 hover:via-orange-600/20 hover:to-transparent transition-all duration-200 group/item border border-transparent hover:border-red-700/40"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600/40 to-orange-600/40 flex items-center justify-center group-hover/item:from-red-500 group-hover/item:to-orange-500 transition-all duration-200 shadow-lg group-hover/item:shadow-red-500/50">
                                <Icon className="w-5 h-5 text-orange-300 group-hover/item:text-white transition-colors" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white group-hover/item:text-orange-100 transition-colors">{feature.name}</p>
                                <p className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">{feature.description}</p>
                              </div>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Models */}
              <NavLink href="/#comparison">AI Models</NavLink>
              
              {/* Pricing */}
              <NavLink href="/#pricing">Pricing</NavLink>

              {/* Convert Now - Highlighted */}
              <Link href="http://localhost:8000/editor/projects/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-2 px-5 py-2.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-red-600/40 hover:shadow-red-500/60 hover:from-red-500 hover:via-orange-400 hover:to-red-500 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Convert Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
              </Link>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-gradient-to-b from-red-800/50 to-orange-800/50">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all relative group"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/0 to-orange-600/0 group-hover:from-red-600/10 group-hover:to-orange-600/10 transition-all duration-300" />
                  </motion.button>
                </Link>
                <Link href="http://localhost:8000/editor/projects/">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white text-sm font-bold rounded-lg hover:from-orange-500 hover:via-red-500 hover:to-orange-500 transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-500/50 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gradient-to-b from-black via-red-950/30 to-black backdrop-blur-xl border-t border-red-800/30"
            >
              <div className="px-4 py-4 space-y-1">
                <MobileNavLink href="/#overview" onClick={() => setIsMobileMenuOpen(false)}>Overview</MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</MobileNavLink>
                
                {/* Mobile Features */}
                <div className="py-2">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Features</p>
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <Link
                        key={feature.name}
                        href={feature.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <Icon className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium">{feature.name}</span>
                      </Link>
                    );
                  })}
                </div>
                
                <MobileNavLink href="/#comparison" onClick={() => setIsMobileMenuOpen(false)}>AI Models</MobileNavLink>
                <MobileNavLink href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileNavLink>
                
                {/* Mobile Auth */}
                <div className="pt-4 mt-4 border-t border-red-800/30 space-y-2">
                  <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-lg">
                      Convert Now
                    </button>
                  </Link>
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                      <button className="w-full py-2.5 text-gray-300 hover:text-white border border-red-800/30 rounded-lg transition-colors">
                        Sign In
                      </button>
                    </Link>
                    <Link href="http://localhost:8000/editor/projects/" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                      <button className="w-full py-2.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-500 hover:via-orange-400 hover:to-red-500 transition-all shadow-lg">
                        Get Started
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}

// Desktop Nav Link Component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  
  return (
    <Link href={href} className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 group ${
      isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400' : 'text-gray-300 hover:text-white'
    }`}>
      <span className="relative z-10">{children}</span>
      {/* Active indicator */}
      {isActive && (
        <motion.span 
          layoutId="activeNav"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-full" 
        />
      )}
      {/* Hover underline effect */}
      {!isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
      )}
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-red-900/40 to-orange-900/40 text-white border border-red-700/40' 
          : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-orange-900/20'
      }`}
    >
      {children}
    </Link>
  );
}