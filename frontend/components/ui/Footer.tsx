"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black via-red-950 to-black text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold">MS</div>
              <div>
                <div className="font-bold text-white text-lg">MathScriber</div>
                <div className="text-sm text-gray-400">Convert scribbles to LaTeX effortlessly</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Made for researchers, students and professionals. © {new Date().getFullYear()} MathScriber</p>
          </div>

          <div className="flex justify-between md:justify-center">
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/upload"><a>Convert</a></Link></li>
                <li><Link href="/playground"><a>Playground</a></Link></li>
                <li><Link href="/templates"><a>Templates</a></Link></li>
              </ul>
            </div>
            <div className="ml-8">
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about"><a>About</a></Link></li>
                <li><Link href="/pricing"><a>Pricing</a></Link></li>
                <li><Link href="/report"><a>Report</a></Link></li>
              </ul>
            </div>
          </div>

          <div className="md:text-right">
            <h4 className="text-sm font-semibold text-white mb-3">Get in touch</h4>
            <p className="text-sm text-gray-400 mb-4">Email us at <a className="underline" href="mailto:support@mathscriber.ai">support@mathscriber.ai</a></p>
            <div className="flex items-center justify-end gap-3">
              <a className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition" href="#"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.42 2.87 8.16 6.84 9.49.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.115 2.51.34 1.9-1.3 2.74-1.02 2.74-1.02.55 1.39.2 2.41.1 2.67.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.59.69.49C19.13 20.16 22 16.42 22 12z"/></svg></a>
              <a className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition" href="#"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.28 4.28 0 001.88-2.36 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.15 12.15 0 013 4.79a4.28 4.28 0 001.33 5.71 4.18 4.18 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.19c-.46.13-.95.2-1.45.08a4.28 4.28 0 003.99 2.97A8.6 8.6 0 012 19.54a12.12 12.12 0 006.57 1.92c7.89 0 12.21-6.54 12.21-12.21v-.56A8.68 8.68 0 0022.46 6z"/></svg></a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/6 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} MathScriber. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy"><a className="hover:underline">Privacy</a></Link>
            <Link href="/terms"><a className="hover:underline">Terms</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
