'use client';

import { useState } from 'react';

interface ModelSelectorProps {
  onModelChange?: (model: string) => void;
}

export default function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState('gemini-pro-vision');

  const models = [
    {
      id: 'gemini-pro-vision',
      name: 'Gemini Pro Vision',
      description: 'Best for mathematical equations',
      speed: 'Fast',
      accuracy: 'High',
    },
    {
      id: 'gpt-4-vision',
      name: 'GPT-4 Vision',
      description: 'General purpose vision model',
      speed: 'Medium',
      accuracy: 'Very High',
    },
    {
      id: 'claude-vision',
      name: 'Claude Vision',
      description: 'Accurate and reliable',
      speed: 'Fast',
      accuracy: 'High',
    },
  ];

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onModelChange?.(modelId);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Select AI Model</label>
      <div className="space-y-3">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => handleModelChange(model.id)}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              selectedModel === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-gray-500">
                    Speed: <span className="font-medium">{model.speed}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    Accuracy: <span className="font-medium">{model.accuracy}</span>
                  </span>
                </div>
              </div>
              {selectedModel === model.id && (
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
