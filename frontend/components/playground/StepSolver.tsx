'use client';

import { useState } from 'react';

export default function StepSolver() {
  const [equation, setEquation] = useState('2x + 5 = 13');
  const [steps, setSteps] = useState([
    { step: 1, description: 'Original equation', content: '2x + 5 = 13' },
    { step: 2, description: 'Subtract 5 from both sides', content: '2x = 8' },
    { step: 3, description: 'Divide both sides by 2', content: 'x = 4' },
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Step-by-Step Solver</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter equation..."
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Solve
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((item) => (
          <div
            key={item.step}
            className="border-l-4 border-blue-500 bg-blue-50 pl-4 pr-4 py-3 rounded-r-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {item.step}
                  </span>
                  <p className="font-medium text-gray-900">{item.description}</p>
                </div>
                <div className="ml-8 bg-white p-3 rounded border border-blue-200 mt-2">
                  <code className="text-sm font-mono text-gray-800">{item.content}</code>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Solution */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <p className="text-sm font-medium text-green-800 mb-2">Final Solution:</p>
        <p className="text-2xl font-bold text-green-900">x = 4</p>
      </div>

      {/* Export Options */}
      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          Copy Steps
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          Download PDF
        </button>
      </div>
    </div>
  );
}
