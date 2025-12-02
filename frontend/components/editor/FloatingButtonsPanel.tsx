'use client';

import { useState } from 'react';
import { Upload, Camera, Pencil, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingButtonsPanelProps {
  onUploadClick: () => void;
  onCaptureClick: () => void;
  onCanvasClick: () => void;
  onHistoryClick: () => void;
}

export default function FloatingButtonsPanel({
  onUploadClick,
  onCaptureClick,
  onCanvasClick,
  onHistoryClick,
}: FloatingButtonsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const buttons = [
    { id: 'upload', label: 'Upload', icon: Upload, onClick: onUploadClick, color: 'from-red-500 to-orange-500' },
    { id: 'capture', label: 'Capture', icon: Camera, onClick: onCaptureClick, color: 'from-orange-500 to-yellow-500' },
    { id: 'canvas', label: 'Canvas', icon: Pencil, onClick: onCanvasClick, color: 'from-pink-500 to-red-500' },
    { id: 'history', label: 'History', icon: History, onClick: onHistoryClick, color: 'from-red-600 to-pink-600' },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-auto"
    >
      <div className="relative">
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-orange-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? <X size={16} className="text-white" /> : <Upload size={16} className="text-white" />}
          </motion.div>
        </motion.button>

        {/* Buttons Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3 bg-black/95 backdrop-blur-2xl border border-red-500/20 rounded-2xl p-3 shadow-[0_8px_32px_rgba(239,68,68,0.2)]"
            >
              {buttons.map((button, index) => (
                <motion.button
                  key={button.id}
                  onClick={button.onClick}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  className="group relative w-14 h-14 rounded-xl overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${button.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${button.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity`} />
                  
                  {/* Icon */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <button.icon size={24} className="text-white" />
                  </div>

                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 border border-red-500/20 rounded-lg text-sm font-medium text-white whitespace-nowrap pointer-events-none"
                  >
                    {button.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-t border-red-500/20 rotate-45 -mr-[5px]" />
                  </motion.div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
