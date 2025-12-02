'use client';

import { useEffect, useState, useRef } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader } from 'lucide-react';

interface MathJaxPDFPreviewProps {
  content: string;
  isCompiling: boolean;
  error: string | null;
  onPDFGenerated?: (pdfBlob: Blob) => void;
}

export default function MathJaxPDFPreview({ content, isCompiling, error, onPDFGenerated }: MathJaxPDFPreviewProps) {
  const [processedContent, setProcessedContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Convert basic TikZ commands to SVG
  const convertTikzToSVG = (tikzCode: string): string => {
    let elements: string[] = [];
    const scale = 50;
    const offsetX = 200;
    const offsetY = 200;
    
    // Parse options for colors and styles
    const parseOptions = (optStr: string) => {
      const opts: any = { stroke: 'black', fill: 'none', strokeWidth: 2 };
      if (!optStr) return opts;
      
      if (optStr.includes('thick')) opts.strokeWidth = 3;
      if (optStr.includes('very thick')) opts.strokeWidth = 4;
      if (optStr.includes('thin')) opts.strokeWidth = 1;
      if (optStr.includes('dashed')) opts.strokeDasharray = '5,5';
      if (optStr.includes('dotted')) opts.strokeDasharray = '2,2';
      
      const colorMatch = optStr.match(/(?:draw|color)=(\w+)/);
      if (colorMatch) opts.stroke = colorMatch[1];
      
      const fillMatch = optStr.match(/fill=(\w+)/);
      if (fillMatch) opts.fill = fillMatch[1];
      
      return opts;
    };
    
    // Extract and parse all commands
    const allCommands = tikzCode.match(/\\(?:draw|fill|filldraw|node)\s*(?:\[.*?\])?\s*.*?;/gs) || [];
    
    allCommands.forEach(cmd => {
      const optionsMatch = cmd.match(/\[(.*?)\]/);
      const options = optionsMatch ? parseOptions(optionsMatch[1]) : parseOptions('');
      
      // Parse line drawing with multiple segments
      const linePattern = /\((-?\d+\.?\d*),(-?\d+\.?\d*)\)/g;
      const points = [...cmd.matchAll(linePattern)];
      
      if (points.length >= 2 && cmd.includes('--')) {
        for (let i = 0; i < points.length - 1; i++) {
          const x1 = parseFloat(points[i][1]) * scale + offsetX;
          const y1 = offsetY - parseFloat(points[i][2]) * scale;
          const x2 = parseFloat(points[i + 1][1]) * scale + offsetX;
          const y2 = offsetY - parseFloat(points[i + 1][2]) * scale;
          
          elements.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${options.stroke}" stroke-width="${options.strokeWidth}"${options.strokeDasharray ? ` stroke-dasharray="${options.strokeDasharray}"` : ''}/>`);
        }
      }

      // Parse circle drawing
      const circleMatch = cmd.match(/\((-?\d+\.?\d*),(-?\d+\.?\d*)\)\s*circle\s*\(?(\d+\.?\d*)\)?/);
      if (circleMatch) {
        const [, x, y, r] = circleMatch;
        const cx = parseFloat(x) * scale + offsetX;
        const cy = offsetY - parseFloat(y) * scale;
        const radius = parseFloat(r) * scale;
        
        if (cmd.startsWith('\\fill') || options.fill !== 'none') {
          elements.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${options.fill === 'none' ? options.stroke : options.fill}" stroke="none"/>`);
        } else {
          elements.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${options.stroke}" stroke-width="${options.strokeWidth}"/>`);
        }
      }

      // Parse rectangle
      const rectMatch = cmd.match(/\((-?\d+\.?\d*),(-?\d+\.?\d*)\)\s*rectangle\s*\((-?\d+\.?\d*),(-?\d+\.?\d*)\)/);
      if (rectMatch) {
        const [, x1, y1, x2, y2] = rectMatch;
        const rx = Math.min(parseFloat(x1), parseFloat(x2)) * scale + offsetX;
        const ry = offsetY - Math.max(parseFloat(y1), parseFloat(y2)) * scale;
        const width = Math.abs(parseFloat(x2) - parseFloat(x1)) * scale;
        const height = Math.abs(parseFloat(y2) - parseFloat(y1)) * scale;
        
        elements.push(`<rect x="${rx}" y="${ry}" width="${width}" height="${height}" fill="${options.fill}" stroke="${options.stroke}" stroke-width="${options.strokeWidth}"/>`);
      }

      // Parse node (text)
      const nodeMatch = cmd.match(/\\node\s*(?:\[(.*?)\])?\s*(?:at\s*)?\((-?\d+\.?\d*),(-?\d+\.?\d*)\)\s*\{([^}]*)\}/);
      if (nodeMatch) {
        const [, opts, x, y, text] = nodeMatch;
        const tx = parseFloat(x) * scale + offsetX;
        const ty = offsetY - parseFloat(y) * scale;
        const nodeOpts = parseOptions(opts || '');
        
        elements.push(`<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="${nodeOpts.stroke}">${text}</text>`);
      }

      // Parse arrows
      if (cmd.includes('->') || cmd.includes('<-') || cmd.includes('<->')) {
        const arrowPoints = [...cmd.matchAll(linePattern)];
        if (arrowPoints.length >= 2) {
          const hasStart = cmd.includes('<-');
          const hasEnd = cmd.includes('->');
          
          for (let i = 0; i < arrowPoints.length - 1; i++) {
            const x1 = parseFloat(arrowPoints[i][1]) * scale + offsetX;
            const y1 = offsetY - parseFloat(arrowPoints[i][2]) * scale;
            const x2 = parseFloat(arrowPoints[i + 1][1]) * scale + offsetX;
            const y2 = offsetY - parseFloat(arrowPoints[i + 1][2]) * scale;
            
            const markerId = `arrow-${Date.now()}-${i}`;
            elements.push(`
              <defs>
                <marker id="${markerId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="${options.stroke}"/>
                </marker>
              </defs>
            `);
            
            elements.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${options.stroke}" stroke-width="${options.strokeWidth}"${hasEnd ? ` marker-end="url(#${markerId})"` : ''}${hasStart ? ` marker-start="url(#${markerId})"` : ''}/>`);
          }
        }
      }
    });

    // Check if we actually converted anything
    if (elements.length === 0) {
      throw new Error('No supported TikZ commands found');
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" class="max-w-full h-auto my-4 mx-auto border border-gray-200">${elements.join('')}</svg>`;
    return svg;
  };

  useEffect(() => {
    // Extract content between \begin{document} and \end{document}
    const documentMatch = content.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    let bodyContent = documentMatch ? documentMatch[1] : content;

    // Basic cleanup for MathJax
    if (!documentMatch) {
      bodyContent = bodyContent.replace(/\\documentclass[\s\S]*?\\begin{document}/, '');
      bodyContent = bodyContent.replace(/\\end{document}/, '');
    }

    // Convert common TikZ patterns to SVG
    bodyContent = bodyContent.replace(/\\begin\{tikzpicture\}([\s\S]*?)\\end\{tikzpicture\}/g, (match, tikzCode) => {
      try {
        return convertTikzToSVG(tikzCode);
      } catch (error) {
        console.error('TikZ conversion error:', error);
        return `<div class="border-2 border-dashed border-amber-400 bg-amber-50 p-4 my-4 rounded">
          <div class="text-amber-700 font-semibold mb-2">⚠️ TikZ Graphics</div>
          <div class="text-xs text-amber-600">Could not convert TikZ to SVG. Complex TikZ requires LaTeX compilation.</div>
        </div>`;
      }
    });

    // Convert enumerate environments to HTML ordered lists
    bodyContent = bodyContent.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
      const listItems = items
        .split(/\\item\s+/)
        .filter((item: string) => item.trim())
        .map((item: string) => `<li class="mb-2">${item.trim()}</li>`)
        .join('\n');
      return `<ol class="list-decimal list-inside my-4 ml-6">\n${listItems}\n</ol>`;
    });

    // Convert itemize environments to HTML unordered lists
    bodyContent = bodyContent.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
      const listItems = items
        .split(/\\item\s+/)
        .filter((item: string) => item.trim())
        .map((item: string) => `<li class="mb-2">${item.trim()}</li>`)
        .join('\n');
      return `<ul class="list-disc list-inside my-4 ml-6">\n${listItems}\n</ul>`;
    });

    // Remove unsupported preamble commands but keep useful ones
    bodyContent = bodyContent
      .replace(/\\usepackage\{.*?\}/g, '') // Remove package declarations
      .replace(/\\tableofcontents/g, '<div class="border-l-4 border-blue-500 pl-4 my-6 text-gray-600 italic">Table of contents placeholder</div>')
      .replace(/\\title\{(.*?)\}/g, '<h1 class="text-3xl font-bold text-center mb-6">$1</h1>')
      .replace(/\\author\{(.*?)\}/g, '<p class="text-center text-gray-600 mb-2">$1</p>')
      .replace(/\\date\{(.*?)\}/g, '<p class="text-center text-gray-500 mb-6">$1</p>')
      .replace(/\\maketitle/g, '')
      .replace(/\\chapter\*?\{(.*?)\}/g, '<h1 class="text-4xl font-bold mt-8 mb-6 border-b-2 border-gray-300 pb-2">$1</h1>')
      .replace(/\\section\*?\{(.*?)\}/g, '<h2 class="text-2xl font-bold mt-6 mb-4">$1</h2>')
      .replace(/\\subsection\*?\{(.*?)\}/g, '<h3 class="text-xl font-semibold mt-4 mb-3">$1</h3>')
      .replace(/\\subsubsection\*?\{(.*?)\}/g, '<h4 class="text-lg font-medium mt-3 mb-2">$1</h4>')
      .replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>')
      .replace(/\\textit\{(.*?)\}/g, '<em>$1</em>')
      .replace(/\\emph\{(.*?)\}/g, '<em>$1</em>')
      .replace(/\\underline\{(.*?)\}/g, '<u>$1</u>')
      .replace(/\\\\(?!\[)/g, '<br/>') // Line breaks but not \\[
      .replace(/\\par\b/g, '<br/><br/>')
      .replace(/\\noindent\b/g, '');

    setProcessedContent(bodyContent);
  }, [content]);

  useEffect(() => {
    // Generate PDF whenever content changes and is not empty
    if (processedContent && contentRef.current && !isCompiling) {
      const timer = setTimeout(() => {
        generatePDF();
      }, 2000); // Wait longer for MathJax to render
      
      return () => clearTimeout(timer);
    }
  }, [processedContent, isCompiling]);

  const generatePDF = async () => {
    if (!contentRef.current) return;

    setIsGeneratingPDF(true);

    try {
      // Wait for MathJax to finish rendering
      await new Promise(resolve => setTimeout(resolve, 1500));

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      });

      // Verify canvas has content
      if (canvas.width === 0 || canvas.height === 0) {
        console.error('Canvas is empty');
        setIsGeneratingPDF(false);
        return;
      }

      const imgData = canvas.toDataURL('image/png');
      
      // Check if image data is valid
      if (!imgData || imgData === 'data:,' || !imgData.startsWith('data:image/png')) {
        console.error('Invalid image data generated');
        setIsGeneratingPDF(false);
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output('blob');
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      
      // Clean up old URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      setPdfUrl(pdfBlobUrl);
      
      if (onPDFGenerated) {
        onPDFGenerated(pdfBlob);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const config = {
    loader: { 
      load: ['[tex]/html', '[tex]/ams', '[tex]/newcommand', '[tex]/configmacros', '[tex]/action'] 
    },
    tex: {
      packages: { 
        '[+]': ['html', 'ams', 'newcommand', 'configmacros', 'action'] 
      },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ],
      processEnvironments: true,
      processEscapes: true,
      tags: 'ams',
      macros: {
        RR: "{\\mathbb{R}}",
        bold: ["{\\bf #1}", 1]
      }
    },
    svg: {
      fontCache: 'global'
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full border-l border-neutral-200">
      {/* Header */}
      <div className="h-12 border-b border-neutral-200 flex items-center justify-between px-4 bg-white">
        <span className="text-sm font-medium text-neutral-600">PDF Preview (MathJax)</span>
        {(isCompiling || isGeneratingPDF) && (
          <span className="text-xs text-primary-500 flex items-center">
            <Loader className="w-4 h-4 animate-spin mr-2" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Rendering...'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-neutral-100">
        {error ? (
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 font-mono whitespace-pre-wrap">
              {error}
            </div>
          </div>
        ) : (
          <>
            {/* Hidden content for PDF generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              <MathJaxContext config={config}>
                <div
                  ref={contentRef}
                  className="bg-white p-8"
                  style={{ width: '210mm', minHeight: '297mm' }}
                >
                  <MathJax>
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: processedContent }} 
                    />
                  </MathJax>
                </div>
              </MathJaxContext>
            </div>

            {/* PDF Preview */}
            {pdfUrl ? (
              <div className="h-full">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                  <p className="text-neutral-600">Generating PDF preview...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
