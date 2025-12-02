'use client';

export default function FormatToolbar() {
  const formatButtons = [
    { icon: 'B', label: 'Bold', action: 'bold' },
    { icon: 'I', label: 'Italic', action: 'italic' },
    { icon: 'U', label: 'Underline', action: 'underline' },
    { icon: '∫', label: 'Integral', action: 'integral' },
    { icon: '∑', label: 'Sum', action: 'sum' },
    { icon: '√', label: 'Square Root', action: 'sqrt' },
    { icon: 'x²', label: 'Superscript', action: 'superscript' },
    { icon: 'xₙ', label: 'Subscript', action: 'subscript' },
  ];

  const handleFormat = (action: string) => {
    console.log('Format action:', action);
    // TODO: Implement formatting logic
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-2">
      <div className="flex flex-wrap gap-1">
        {/* Formatting Buttons */}
        {formatButtons.map((button) => (
          <button
            key={button.action}
            onClick={() => handleFormat(button.action)}
            className="p-2 hover:bg-gray-100 rounded transition"
            title={button.label}
          >
            <span className="text-sm font-semibold text-gray-700">{button.icon}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Color Picker */}
        <button className="p-2 hover:bg-gray-100 rounded transition" title="Text Color">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </button>

        {/* Alignment */}
        <button className="p-2 hover:bg-gray-100 rounded transition" title="Align Left">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Undo/Redo */}
        <button className="p-2 hover:bg-gray-100 rounded transition" title="Undo">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded transition" title="Redo">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
