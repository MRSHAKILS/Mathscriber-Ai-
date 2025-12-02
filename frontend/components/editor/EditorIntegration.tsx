'use client';

import { useState, useCallback } from 'react';
import FloatingButtonsPanel from './FloatingButtonsPanel';
import UploadPopup from './UploadPopup';
import CapturePopup from './CapturePopup';
import CanvasPopup from './CanvasPopup';
import ResultPage from './ResultPage';
import HistoryPage from './HistoryPage';

interface ConversionResult {
  input: string;
  latex: string;
  convertedOutput: string;
  timestamp: string;
}

interface EditorIntegrationProps {
  editorId?: string;
}

export default function EditorIntegration({ editorId = 'editor' }: EditorIntegrationProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<ConversionResult | null>(null);

  const handleConversionComplete = useCallback((result: ConversionResult) => {
    setCurrentResult(result);
    setResultOpen(true);
  }, []);

  const handleInsertAtCursor = useCallback(async (latex: string) => {
    try {
      // Get the Ace Editor instance from the global window object
      const editor = (window as any).aceEditor;
      
      if (!editor) {
        console.error('Ace Editor not found');
        return;
      }

      // Get current content and cursor position
      const currentContent = editor.getValue();
      const cursorPosition = editor.getCursorPosition();
      const cursorIndex = editor.session.doc.positionToIndex(cursorPosition);

      // Call backend API to intelligently merge
      const response = await fetch('http://localhost:8000/api/editor/insert-at-cursor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latexSnippet: latex,
          currentContent: currentContent,
          cursorPosition: cursorIndex,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update editor with merged content
        editor.setValue(data.updatedContent, -1);
        
        // Show success notification
        showNotification('LaTeX code inserted successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to insert');
      }
    } catch (error) {
      console.error('Failed to insert at cursor:', error);
      showNotification('Failed to insert LaTeX code', 'error');
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    // You can implement a toast notification system here
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success'
        ? 'bg-green-600 text-white'
        : 'bg-red-600 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Floating Buttons */}
      <FloatingButtonsPanel
        onUploadClick={() => setUploadOpen(true)}
        onCaptureClick={() => setCaptureOpen(true)}
        onCanvasClick={() => setCanvasOpen(true)}
        onHistoryClick={() => setHistoryOpen(true)}
      />

      {/* Popups */}
      <UploadPopup
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onConversionComplete={handleConversionComplete}
      />

      <CapturePopup
        isOpen={captureOpen}
        onClose={() => setCaptureOpen(false)}
        onConversionComplete={handleConversionComplete}
      />

      <CanvasPopup
        isOpen={canvasOpen}
        onClose={() => setCanvasOpen(false)}
        onConversionComplete={handleConversionComplete}
      />

      {/* Result Page */}
      <ResultPage
        isOpen={resultOpen}
        onClose={() => setResultOpen(false)}
        result={currentResult}
        onInsertAtCursor={handleInsertAtCursor}
      />

      {/* History Page */}
      <HistoryPage
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onInsertAtCursor={handleInsertAtCursor}
      />
    </div>
  );
}
