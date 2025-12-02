'use client';

interface ResultViewerProps {
  latex?: string;
  confidence?: number;
  processingTime?: number;
}

export default function ResultViewer({
  latex = '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
  confidence = 0.98,
  processingTime = 1.2,
}: ResultViewerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    alert('LaTeX copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'equation.tex';
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">Confidence</p>
          <p className="text-2xl font-bold text-blue-900">{(confidence * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Processing Time</p>
          <p className="text-2xl font-bold text-green-900">{processingTime}s</p>
        </div>
      </div>

      {/* LaTeX Output */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">LaTeX Output</label>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 hover:text-blue-600 transition"
              title="Copy to clipboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-green-600 transition"
              title="Download"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
        </div>
        <pre className="bg-white p-3 rounded border border-gray-300 overflow-x-auto">
          <code className="text-sm font-mono text-gray-800">{latex}</code>
        </pre>
      </div>

      {/* Preview */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <label className="text-sm font-medium text-gray-700 block mb-3">Rendered Preview</label>
        <div className="min-h-[100px] flex items-center justify-center bg-gray-50 rounded p-4">
          <p className="text-gray-500 text-sm">Preview will render here using MathJax/KaTeX</p>
        </div>
      </div>
    </div>
  );
}
