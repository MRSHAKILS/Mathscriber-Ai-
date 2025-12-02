'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home,
  Upload, 
  History, 
  FileText,
  BarChart3,
  Menu,
  X,
  Rocket,
  Pencil,
  ChevronDown,
  Sparkles,
  Info,
  Brain,
  Play
} from 'lucide-react';

const featureItems = [
  { name: 'Upload', href: '/upload', icon: Upload, description: 'Convert images to LaTeX', color: 'from-red-500 to-orange-500' },
  { name: 'Draw', href: '/playground', icon: Pencil, description: 'Handwrite & convert', color: 'from-orange-500 to-yellow-500' },
  { name: 'Results', href: '/results', icon: History, description: 'View conversion history', color: 'from-pink-500 to-red-500' },
  { name: 'Templates', href: '/templates', icon: FileText, description: 'LaTeX templates', color: 'from-red-600 to-pink-500' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Usage statistics', color: 'from-orange-600 to-red-500' },
];

const scrollLinks = [
  { name: 'How It Works', href: '/#how-it-works', icon: Play, description: 'See the workflow' },
];

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeatureOpen, setIsFeatureOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  // Handle smooth scroll for anchor links
  const handleScrollLink = (href: string) => {
    const hash = href.split('#')[1];
    if (hash) {
      if (pathname === '/') {
        // Already on home page, just scroll
        smoothScrollTo(hash);
      } else {
        // Navigate to home first, then scroll
        router.push('/');
        setTimeout(() => smoothScrollTo(hash), 100);
      }
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(239,68,68,0.12)] border-b border-red-500/10' 
            : 'bg-black/60 backdrop-blur-xl border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="relative group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-all duration-500 animate-pulse" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-orange-600 flex items-center justify-center shadow-2xl">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 10h10M7 14h10M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                      <path d="M12 8v8" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg lg:text-xl font-black tracking-tight leading-none">
                    <span className="text-white">Math</span>
                    <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">Scriber</span>
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink href="/" icon={Home}>Home</NavLink>
              
              {/* Features Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsFeatureOpen(!isFeatureOpen)}
                  className={`group relative px-4 py-2 flex items-center gap-1.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isFeatureOpen ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
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
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-red-500/10 overflow-hidden"
                    >
                      <div className="p-2">
                        {featureItems.map((feature, index) => {
                          const Icon = feature.icon;
                          const isActive = pathname.startsWith(feature.href);
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
                                className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                                  isActive ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20' : 'hover:bg-white/5'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-semibold transition-all ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400' : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400'}`}>
                                    {feature.name}
                                  </p>
                                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                    {feature.description}
                                  </p>
                                </div>
                                {isActive && (
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400 shadow-lg shadow-red-500/50" />
                                )}
                              </motion.div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scroll Links - AI Models & How It Works */}
              {scrollLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <ScrollNavLink 
                    key={link.name} 
                    href={link.href} 
                    icon={Icon}
                    onClick={() => handleScrollLink(link.href)}
                  >
                    {link.name}
                  </ScrollNavLink>
                );
              })}

              <NavLink href="/about" icon={Info}>About</NavLink>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/upload">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:via-orange-500 hover:to-orange-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all duration-300 flex items-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Get Started
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-black/98 backdrop-blur-2xl border-l border-white/10 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 10h10M7 14h10M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-white">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 mb-6">
                  <MobileNavLink href="/" icon={Home} onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                </div>

                {/* Features Section */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Features</p>
                  <div className="space-y-1">
                    {featureItems.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <MobileNavLink 
                          key={feature.name}
                          href={feature.href} 
                          icon={Icon} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          gradient={feature.color}
                        >
                          {feature.name}
                        </MobileNavLink>
                      );
                    })}
                  </div>
                </div>

                {/* Scroll Links */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Explore</p>
                  <div className="space-y-1">
                    {scrollLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <MobileScrollNavLink 
                          key={link.name}
                          href={link.href} 
                          icon={Icon} 
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleScrollLink(link.href);
                          }}
                        >
                          {link.name}
                        </MobileScrollNavLink>
                      );
                    })}
                  </div>
                </div>

                {/* Other Links */}
                <div className="space-y-2 mb-8">
                  <MobileNavLink href="/about" icon={Info} onClick={() => setIsMobileMenuOpen(false)}>About</MobileNavLink>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <button className="w-full py-3 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-all">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <button className="w-full py-3.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Get Started Free
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
}

// NavLink Component with active indicator
function NavLink({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link href={href} className="group relative px-4 py-2 flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200">
      <Icon className="w-4 h-4" />
      <span>{children}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg shadow-red-500/50"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

// Mobile NavLink Component
function MobileNavLink({ href, icon: Icon, children, onClick, gradient }: { href: string; icon: any; children: React.ReactNode; onClick: () => void; gradient?: string }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link href={href} onClick={onClick} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-red-500/15 to-orange-500/15' : 'hover:bg-white/5'}`}>
      <div className={`w-9 h-9 rounded-lg ${gradient ? `bg-gradient-to-br ${gradient}` : 'bg-white/10'} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${gradient ? 'text-white' : isActive ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
      <span className={`font-medium ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400' : 'text-white'}`}>{children}</span>
      {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400 shadow-lg shadow-red-500/50" />}
    </Link>
  );
}

// ScrollNavLink Component for smooth scroll links
function ScrollNavLink({ href, icon: Icon, children, onClick }: { href: string; icon: any; children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group relative px-4 py-2 flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </button>
  );
}

// Mobile ScrollNavLink Component for smooth scroll links on mobile
function MobileScrollNavLink({ href, icon: Icon, children, onClick }: { href: string; icon: any; children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-white/5"
    >
      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <span className="font-medium text-white">{children}</span>
    </button>
  );
}
