'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Upload,
  FileText,
  Sparkles,
} from 'lucide-react';

interface LatexToolbarProps {
  onInsertCode: (code: string, cursorOffset?: number) => void;
}

interface LatexCommand {
  name: string;
  icon?: React.ReactNode;
  code: string;
  cursorOffset?: number;
  description?: string;
}

interface LatexCategory {
  name: string;
  commands: LatexCommand[];
}

export default function LatexToolbar({ onInsertCode }: LatexToolbarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Quick Tools'])
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const openInNewWindow = (url: string, title: string) => {
    window.open(url, title, 'width=1200,height=800,resizable=yes,scrollbars=yes');
  };

  const quickTools = [
    {
      name: 'Upload',
      icon: <Upload className="w-5 h-5" />,
      description: 'Upload documents & images',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => openInNewWindow('/upload', 'Upload Files'),
    },
    {
      name: 'Scan',
      icon: <ImageIcon className="w-5 h-5" />,
      description: 'Scan & digitize documents',
      color: 'from-green-500 to-emerald-500',
      onClick: () => openInNewWindow('/scan', 'Scan Document'),
    },
    {
      name: 'Image Converter',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Image to LaTeX AI',
      color: 'from-red-500 to-orange-500',
      onClick: () => openInNewWindow('/upload', 'Image Converter'),
    },
    {
      name: 'Projects',
      icon: <FileText className="w-5 h-5" />,
      description: 'Manage projects',
      color: 'from-purple-500 to-pink-500',
      onClick: () => openInNewWindow('/projects', 'Projects'),
    },
  ];

  const categories: LatexCategory[] = [
    {
      name: 'Math Symbols',
      commands: [
        { name: 'Fraction', code: '\\frac{}{}', cursorOffset: -3, description: 'Fraction' },
        { name: 'Square Root', code: '\\sqrt{}', cursorOffset: -1, description: 'Square root' },
        { name: 'Nth Root', code: '\\sqrt[]{}', cursorOffset: -3, description: 'Nth root' },
        { name: 'Superscript', code: '^{}', cursorOffset: -1, description: 'Superscript x^2' },
        { name: 'Subscript', code: '_{}', cursorOffset: -1, description: 'Subscript x_i' },
        { name: 'Integral', code: '\\int_{}^{} ', cursorOffset: -6, description: 'Integral' },
        { name: 'Sum', code: '\\sum_{i=1}^{n} ', cursorOffset: 0, description: 'Summation' },
        { name: 'Product', code: '\\prod_{i=1}^{n} ', cursorOffset: 0, description: 'Product' },
        { name: 'Limit', code: '\\lim_{x \\to \\infty} ', cursorOffset: 0, description: 'Limit' },
        { name: 'Infinity', code: '\\infty', cursorOffset: 0, description: '∞' },
        { name: 'Alpha', code: '\\alpha', cursorOffset: 0, description: 'α' },
        { name: 'Beta', code: '\\beta', cursorOffset: 0, description: 'β' },
        { name: 'Gamma', code: '\\gamma', cursorOffset: 0, description: 'γ' },
        { name: 'Delta', code: '\\delta', cursorOffset: 0, description: 'δ' },
        { name: 'Theta', code: '\\theta', cursorOffset: 0, description: 'θ' },
        { name: 'Lambda', code: '\\lambda', cursorOffset: 0, description: 'λ' },
        { name: 'Pi', code: '\\pi', cursorOffset: 0, description: 'π' },
        { name: 'Sigma', code: '\\sigma', cursorOffset: 0, description: 'σ' },
      ],
    },
    {
      name: 'Equations',
      commands: [
        { name: 'Inline Math', code: '$ $', cursorOffset: -2, description: 'Inline equation' },
        { name: 'Display Math', code: '\\[ \\]', cursorOffset: -3, description: 'Display equation' },
        { name: 'Equation', code: '\\begin{equation}\n\t\n\\end{equation}', cursorOffset: -15, description: 'Numbered equation' },
        { name: 'Align', code: '\\begin{align}\n\t &= \\\\\n\t &= \n\\end{align}', cursorOffset: -20, description: 'Aligned equations' },
        { name: 'Cases', code: '\\begin{cases}\n\t , & \\text{if } \\\\\n\t , & \\text{if } \n\\end{cases}', cursorOffset: -50, description: 'Piecewise function' },
      ],
    },
    {
      name: 'Matrices',
      commands: [
        { name: 'Matrix', code: '\\begin{matrix}\n\ta & b \\\\\n\tc & d\n\\end{matrix}', cursorOffset: -25, description: 'Matrix without brackets' },
        { name: 'Pmatrix', code: '\\begin{pmatrix}\n\ta & b \\\\\n\tc & d\n\\end{pmatrix}', cursorOffset: -27, description: 'Matrix with ()' },
        { name: 'Bmatrix', code: '\\begin{bmatrix}\n\ta & b \\\\\n\tc & d\n\\end{bmatrix}', cursorOffset: -27, description: 'Matrix with []' },
        { name: 'Vmatrix', code: '\\begin{vmatrix}\n\ta & b \\\\\n\tc & d\n\\end{vmatrix}', cursorOffset: -27, description: 'Determinant with ||' },
      ],
    },
    {
      name: 'Tables',
      commands: [
        { name: 'Simple Table', code: '\\begin{tabular}{|c|c|}\n\t\\hline\n\tHeader 1 & Header 2 \\\\\n\t\\hline\n\tRow 1 & Data \\\\\n\tRow 2 & Data \\\\\n\t\\hline\n\\end{tabular}', cursorOffset: 0, description: '2-column table' },
        { name: 'Table Environment', code: '\\begin{table}[h]\n\t\\centering\n\t\\begin{tabular}{|c|c|}\n\t\t\\hline\n\t\tHeader 1 & Header 2 \\\\\n\t\t\\hline\n\t\tData & Data \\\\\n\t\t\\hline\n\t\\end{tabular}\n\t\\caption{Table caption}\n\t\\label{tab:label}\n\\end{table}', cursorOffset: 0, description: 'Full table with caption' },
      ],
    },
    {
      name: 'Lists',
      commands: [
        { name: 'Itemize', code: '\\begin{itemize}\n\t\\item First item\n\t\\item Second item\n\\end{itemize}', cursorOffset: -26, description: 'Bullet list' },
        { name: 'Enumerate', code: '\\begin{enumerate}\n\t\\item First item\n\t\\item Second item\n\\end{enumerate}', cursorOffset: -28, description: 'Numbered list' },
        { name: 'Description', code: '\\begin{description}\n\t\\item[Term] Description\n\t\\item[Term] Description\n\\end{description}', cursorOffset: -43, description: 'Description list' },
      ],
    },
    {
      name: 'Text Formatting',
      commands: [
        { name: 'Bold', code: '\\textbf{}', cursorOffset: -1, description: 'Bold text' },
        { name: 'Italic', code: '\\textit{}', cursorOffset: -1, description: 'Italic text' },
        { name: 'Underline', code: '\\underline{}', cursorOffset: -1, description: 'Underline' },
        { name: 'Typewriter', code: '\\texttt{}', cursorOffset: -1, description: 'Monospace' },
        { name: 'Small Caps', code: '\\textsc{}', cursorOffset: -1, description: 'Small caps' },
        { name: 'Emphasis', code: '\\emph{}', cursorOffset: -1, description: 'Emphasized' },
      ],
    },
    {
      name: 'Structure',
      commands: [
        { name: 'Section', code: '\\section{}', cursorOffset: -1, description: 'Section heading' },
        { name: 'Subsection', code: '\\subsection{}', cursorOffset: -1, description: 'Subsection heading' },
        { name: 'Subsubsection', code: '\\subsubsection{}', cursorOffset: -1, description: 'Subsubsection heading' },
        { name: 'Paragraph', code: '\\paragraph{}', cursorOffset: -1, description: 'Paragraph heading' },
      ],
    },
    {
      name: 'Figures',
      commands: [
        { name: 'Figure', code: '\\begin{figure}[h]\n\t\\centering\n\t\\includegraphics[width=0.5\\textwidth]{image.png}\n\t\\caption{Caption}\n\t\\label{fig:label}\n\\end{figure}', cursorOffset: 0, description: 'Insert image' },
        { name: 'Subfigures', code: '\\begin{figure}[h]\n\t\\centering\n\t\\begin{subfigure}{0.45\\textwidth}\n\t\t\\includegraphics[width=\\textwidth]{image1.png}\n\t\t\\caption{Caption 1}\n\t\\end{subfigure}\n\t\\hfill\n\t\\begin{subfigure}{0.45\\textwidth}\n\t\t\\includegraphics[width=\\textwidth]{image2.png}\n\t\t\\caption{Caption 2}\n\t\\end{subfigure}\n\t\\caption{Main caption}\n\\end{figure}', cursorOffset: 0, description: 'Side-by-side images' },
      ],
    },
  ];

  return (
    <div className="w-72 bg-black/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10">
        <h3 className="font-bold text-white">LaTeX Tools</h3>
        <p className="text-xs text-gray-500 mt-1">Click to insert at cursor</p>
      </div>

      {/* Quick Tools Section */}
      <div className="p-2 border-b border-white/10">
        <div className="mb-2">
          <button
            onClick={() => toggleCategory('Quick Tools')}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-all group"
          >
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Quick Tools</span>
            </span>
            {expandedCategories.has('Quick Tools') ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {expandedCategories.has('Quick Tools') && (
            <div className="mt-2 space-y-2 ml-2">
              {quickTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={tool.onClick}
                  className="w-full text-left px-3 py-3 rounded-lg transition-all group border border-white/10 hover:border-orange-500/50 bg-gradient-to-br from-white/5 to-white/0 hover:from-orange-500/10 hover:to-red-500/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.color} bg-opacity-20`}>
                      {tool.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-orange-300">
                        {tool.name}
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400">
                        {tool.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LaTeX Categories */}
      <div className="p-2">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.name);
          return (
            <div key={category.name} className="mb-2">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-all group"
              >
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white">
                  {category.name}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-1 space-y-1 ml-2">
                  {category.commands.map((command) => (
                    <button
                      key={command.name}
                      onClick={() => onInsertCode(command.code, command.cursorOffset)}
                      className="w-full text-left px-3 py-2 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 rounded-lg transition-all group border border-transparent hover:border-red-500/30"
                      title={command.description}
                    >
                      <div className="text-xs font-mono text-gray-300 group-hover:text-white">
                        {command.name}
                      </div>
                      {command.description && (
                        <div className="text-xs text-gray-600 group-hover:text-gray-400 mt-0.5">
                          {command.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
