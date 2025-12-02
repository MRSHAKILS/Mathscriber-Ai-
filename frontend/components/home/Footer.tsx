import Link from 'next/link';
import { Github, Heart, Twitter, Linkedin, Mail, Sparkles, Zap, ArrowRight, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 mt-auto overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-orange-600 flex items-center justify-center shadow-2xl">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 10h10M7 14h10M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    <path d="M12 8v8" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black">
                  <span className="text-white">Math</span>
                  <span className="bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">Scriber</span>
                </span>
                <p className="text-xs text-gray-500 font-medium">AI-Powered LaTeX Converter</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform handwritten mathematical equations into professional LaTeX code instantly with cutting-edge AI technology.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <SocialIcon href="https://github.com" icon={Github} />
              <SocialIcon href="https://twitter.com" icon={Twitter} />
              <SocialIcon href="https://linkedin.com" icon={Linkedin} />
              <SocialIcon href="mailto:contact@mathscriber.ai" icon={Mail} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/upload">Upload Image</FooterLink>
              <FooterLink href="/playground">Draw & Convert</FooterLink>
              <FooterLink href="/results">My Results</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/templates">LaTeX Templates</FooterLink>
              <FooterLink href="/analytics">Analytics</FooterLink>
              <FooterLink href="/#pricing">Pricing Plans</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest updates and features.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <button className="absolute right-1.5 top-1.5 p-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg hover:from-red-500 hover:to-orange-400 transition-all group">
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-gray-500">for</span>
              <span className="font-semibold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Solvio Hackathon</span>
            </div>
            
            <div className="text-gray-500 text-sm">
              © 2024 <span className="text-white font-medium">MathScriber AI</span>. All rights reserved.
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Powered by</span>
              <span className="font-semibold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                Gemini 2.0 Flash
              </span>
              <span>&</span>
              <span className="font-semibold text-white">Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="group-hover:translate-x-1 transition-transform">{children}</span>
      </Link>
    </li>
  );
}
