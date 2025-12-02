'use client';

import { useState } from 'react';

export default function PlaygroundPage() {
  const [latex, setLatex] = useState('\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Playground</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">LaTeX Editor</h2>
            <textarea
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              className="w-full h-96 font-mono p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter LaTeX code..."
            />
            
            {/* Toolbar */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Bold</button>
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Italic</button>
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Fraction</button>
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Square Root</button>
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Integral</button>
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Sum</button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="h-96 border border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">Preview will render here</p>
            </div>

            {/* Graph Visualizer */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Graph Visualizer</h3>
              <div className="h-48 border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Graph will render here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Solver */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Step-by-Step Solver</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">Step 1: Identify the equation</p>
              <p className="text-gray-600 mt-1">ax² + bx + c = 0</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">Step 2: Apply the quadratic formula</p>
              <p className="text-gray-600 mt-1">x = (-b ± √(b²-4ac)) / 2a</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">Step 3: Simplify</p>
              <p className="text-gray-600 mt-1">Calculate the discriminant and solve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
