'use client';

import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-2">Track your usage and performance metrics</p>
          </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-400">Total Conversions</p>
            <p className="text-3xl font-bold text-white mt-2">1,234</p>
            <p className="text-sm text-green-400 mt-2">+12% from last month</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-400">Average Accuracy</p>
            <p className="text-3xl font-bold text-white mt-2">97.8%</p>
            <p className="text-sm text-green-400 mt-2">+1.2% from last month</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-400">Processing Time</p>
            <p className="text-3xl font-bold text-white mt-2">1.3s</p>
            <p className="text-sm text-red-400 mt-2">+0.2s from last month</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-400">API Calls</p>
            <p className="text-3xl font-bold text-white mt-2">45,678</p>
            <p className="text-sm text-green-400 mt-2">+23% from last month</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Conversion Trend</h2>
            <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Line chart will render here</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Accuracy Distribution</h2>
            <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Bar chart will render here</p>
            </div>
          </div>
        </div>

        {/* Usage by Category */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Usage by Category</h2>
          <div className="space-y-4">
            {['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry'].map((category, index) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-white">{category}</span>
                  <span className="text-sm text-gray-400">{(5 - index) * 20}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full"
                    style={{ width: `${(5 - index) * 20}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
