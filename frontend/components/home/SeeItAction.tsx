"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SeeItAction() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-red-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
              See MathScriber In Action
            </h2>
            <p className="text-gray-300 mb-6">
              Watch a quick demo of our conversion pipeline — upload, AI processing, and clean LaTeX output. Smooth animations and real-time preview make it effortless.
            </p>

            <div className="flex gap-4">
              <Link href="/upload">
                <a className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                  Try Live Demo
                </a>
              </Link>
              <Link href="#how">
                <a className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 rounded-lg text-white/90 hover:bg-white/5 transition">
                  Learn How It Works
                </a>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-red-800">
              {/* Mock demo player - replace with real video or interactive demo later */}
              <div className="aspect-video bg-gradient-to-tr from-red-900 to-black flex items-center justify-center">
                <div className="w-4/5 h-4/5 rounded-lg bg-gradient-to-br from-black/40 to-black/30 border border-white/10 p-6 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-xl">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 3v18l15-9L5 3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold">Live Conversion Preview</h3>
                    <p className="text-sm text-gray-300/80 mt-2">Play the demo to see handwriting converted to LaTeX in real time.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
