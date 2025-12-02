'use client';

export default function GraphVisualizer() {
  const graphs = [
    { name: 'Linear', equation: 'y = 2x + 1', color: 'blue' },
    { name: 'Quadratic', equation: 'y = x² - 4', color: 'red' },
    { name: 'Sine', equation: 'y = sin(x)', color: 'green' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Graph Visualizer</h3>
        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          Add Function
        </button>
      </div>

      {/* Graph Canvas */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 h-96 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Graph will be rendered here</p>
            <p className="text-xs text-gray-400 mt-1">Using Plotly.js or D3.js</p>
          </div>
        </div>
      </div>

      {/* Function List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Active Functions:</p>
        {graphs.map((graph, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded bg-${graph.color}-500`}></div>
              <div>
                <p className="font-medium text-sm">{graph.name}</p>
                <p className="text-xs text-gray-600">{graph.equation}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
              <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">X Range</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" className="w-full px-3 py-2 border rounded" defaultValue="-10" />
            <input type="number" placeholder="Max" className="w-full px-3 py-2 border rounded" defaultValue="10" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Y Range</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" className="w-full px-3 py-2 border rounded" defaultValue="-10" />
            <input type="number" placeholder="Max" className="w-full px-3 py-2 border rounded" defaultValue="10" />
          </div>
        </div>
      </div>
    </div>
  );
}
