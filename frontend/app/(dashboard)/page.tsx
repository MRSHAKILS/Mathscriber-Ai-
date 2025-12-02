'use client';

import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Conversions', value: '1,234', change: '+12%' },
    { label: 'Success Rate', value: '98.5%', change: '+2.3%' },
    { label: 'Processing Time', value: '1.2s', change: '-0.3s' },
    { label: 'Storage Used', value: '4.2 GB', change: '+0.8 GB' },
  ];

  const recentConversions = [
    { id: 1, name: 'calculus_problem.jpg', status: 'Completed', date: '2 mins ago' },
    { id: 2, name: 'algebra_equations.png', status: 'Completed', date: '15 mins ago' },
    { id: 3, name: 'geometry_diagram.jpg', status: 'Processing', date: '1 hour ago' },
    { id: 4, name: 'statistics_chart.png', status: 'Completed', date: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-green-600 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/upload"
            className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <h3 className="text-xl font-semibold mb-2">Upload & Convert</h3>
            <p className="text-blue-100">Convert images to LaTeX</p>
          </Link>
          <Link
            href="/playground"
            className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            <h3 className="text-xl font-semibold mb-2">Playground</h3>
            <p className="text-purple-100">Interactive editor</p>
          </Link>
          <Link
            href="/templates"
            className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <h3 className="text-xl font-semibold mb-2">Templates</h3>
            <p className="text-green-100">Browse template library</p>
          </Link>
        </div>

        {/* Recent Conversions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Conversions</h2>
            <Link href="/results" className="text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentConversions.map((conversion) => (
              <div
                key={conversion.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{conversion.name}</p>
                  <p className="text-sm text-gray-600">{conversion.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    conversion.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {conversion.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
