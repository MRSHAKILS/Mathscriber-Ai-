'use client';

import { useState } from 'react';

interface LaTeXEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function LaTeXEditor({ initialValue = '', onChange }: LaTeXEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  const insertSymbol = (symbol: string) => {
    const newValue = value + symbol;
    handleChange(newValue);
  };

  const symbols = [
    { label: 'Fraction', symbol: '\\frac{}{}' },
    { label: 'Square Root', symbol: '\\sqrt{}' },
    { label: 'Sum', symbol: '\\sum_{}^{}' },
    { label: 'Integral', symbol: '\\int_{}^{}' },
    { label: 'Limit', symbol: '\\lim_{}' },
    { label: 'Subscript', symbol: '_{}' },
    { label: 'Superscript', symbol: '^{}' },
    { label: 'Greek α', symbol: '\\alpha' },
    { label: 'Greek β', symbol: '\\beta' },
    { label: 'Greek θ', symbol: '\\theta' },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-gray-100 p-3 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">Quick Insert:</p>
        <div className="flex flex-wrap gap-2">
          {symbols.map((item) => (
            <button
              key={item.label}
              onClick={() => insertSymbol(item.symbol)}
              className="px-3 py-1 bg-white text-sm rounded hover:bg-blue-50 hover:text-blue-600 border border-gray-300 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LaTeX Code</label>
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full h-64 font-mono text-sm p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter LaTeX code here..."
        />
      </div>

      {/* Character Count */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{value.length} characters</span>
        <span>{value.split('\n').length} lines</span>
      </div>
    </div>
  );
}
