'use client';

import Navbar from '@/components/home/NavbarNew';
import Footer from '@/components/home/Footer';

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      title: 'Quadratic Equations',
      description: 'Template for solving quadratic equations',
      category: 'Algebra',
      uses: 1234,
    },
    {
      id: 2,
      title: 'Calculus Derivatives',
      description: 'Common derivative formulas and rules',
      category: 'Calculus',
      uses: 890,
    },
    {
      id: 3,
      title: 'Trigonometry',
      description: 'Trigonometric identities and formulas',
      category: 'Trigonometry',
      uses: 756,
    },
    {
      id: 4,
      title: 'Linear Algebra',
      description: 'Matrix operations and transformations',
      category: 'Linear Algebra',
      uses: 543,
    },
    {
      id: 5,
      title: 'Statistics',
      description: 'Statistical formulas and distributions',
      category: 'Statistics',
      uses: 432,
    },
    {
      id: 6,
      title: 'Geometry',
      description: 'Geometric shapes and theorems',
      category: 'Geometry',
      uses: 321,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Template Library</h1>
          <p className="text-gray-600 mt-2">Browse and use pre-built LaTeX templates</p>
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">All</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Algebra</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Calculus</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Geometry</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Statistics</button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {template.category}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{template.uses} uses</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
