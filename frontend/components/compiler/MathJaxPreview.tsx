'use client';

import { useEffect, useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface MathJaxPreviewProps {
  content: string;
  isCompiling: boolean;
  error: string | null;
}

export default function MathJaxPreview({ content, isCompiling, error }: MathJaxPreviewProps) {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    // Extract content between \begin{document} and \end{document}
    const documentMatch = content.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    let bodyContent = documentMatch ? documentMatch[1] : content;

    // Basic cleanup for MathJax
    // Remove preamble if not extracted
    if (!documentMatch) {
      bodyContent = bodyContent.replace(/\\documentclass[\s\S]*?\\begin{document}/, '');
      bodyContent = bodyContent.replace(/\\end{document}/, '');
    }

    // Replace some common LaTeX commands that MathJax might not handle well in text mode
    // This is a basic approximation
    bodyContent = bodyContent
      .replace(/\\section\*?{(.*?)}/g, '<h3>$1</h3>')
      .replace(/\\subsection\*?{(.*?)}/g, '<h4>$1</h4>')
      .replace(/\\subsubsection\*?{(.*?)}/g, '<h5>$1</h5>')
      .replace(/\\textbf{(.*?)}/g, '<b>$1</b>')
      .replace(/\\textit{(.*?)}/g, '<i>$1</i>')
      .replace(/\\underline{(.*?)}/g, '<u>$1</u>')
      .replace(/\\\\/g, '<br/>')
      .replace(/\\par/g, '<br/><br/>');

    setProcessedContent(bodyContent);
  }, [content]);

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ]
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full border-l border-neutral-200">
      {/* Header */}
      <div className="h-12 border-b border-neutral-200 flex items-center justify-between px-4 bg-white">
        <span className="text-sm font-medium text-neutral-600">Preview (MathJax)</span>
        {isCompiling && (
          <span className="text-xs text-primary-500 flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mr-2"></div>
            Rendering...
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 bg-white">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 font-mono whitespace-pre-wrap">
            {error}
          </div>
        ) : (
          <MathJaxContext config={config}>
            <div className="prose max-w-none">
              <MathJax>
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              </MathJax>
            </div>
          </MathJaxContext>
        )}
      </div>
    </div>
  );
}
