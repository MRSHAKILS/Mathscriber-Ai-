'use client';

import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';

export default function ResultsPage() {
  const results = [
    {
      id: 1,
      name: 'calculus_problem.jpg',
      date: '2024-12-02 10:30 AM',
      status: 'Completed',
      accuracy: '98%',
    },
    {
      id: 2,
      name: 'algebra_equations.png',
      date: '2024-12-02 09:15 AM',
      status: 'Completed',
      accuracy: '95%',
    },
    {
      id: 3,
      name: 'geometry_diagram.jpg',
      date: '2024-12-01 04:20 PM',
      status: 'Completed',
      accuracy: '97%',
    },
    {
      id: 4,
      name: 'statistics_chart.png',
      date: '2024-12-01 02:10 PM',
      status: 'Completed',
      accuracy: '99%',
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Conversion History</h1>
            <p className="text-gray-400 mt-2">View and manage your past conversions</p>
          </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-4 mb-6 flex gap-4">
          <select className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg">
            <option>All Status</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
          <select className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>All Time</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg placeholder-gray-400"
          />
        </div>

        {/* Results Table */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {result.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {result.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-400">
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {result.accuracy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">View</button>
                    <button className="text-green-400 hover:text-green-300 mr-3">Download</button>
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
