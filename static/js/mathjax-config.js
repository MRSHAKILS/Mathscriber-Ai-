// MathJax Configuration
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        packages: {'[+]': ['ams', 'newcommand', 'configmacros']}
    },
    svg: {
        fontCache: 'global'
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            console.log('MathJax is ready');
        }
    }
};

// Convert tabular to array for MathJax compatibility
function convertTabularToArray(latex) {
    // MathJax doesn't support tabular, convert to array
    latex = latex.replace(/\\begin{tabular}/g, '\\begin{array}');
    latex = latex.replace(/\\end{tabular}/g, '\\end{array}');
    latex = latex.replace(/\\begin{tabularx}/g, '\\begin{array}');
    latex = latex.replace(/\\end{tabularx}/g, '\\end{array}');
    
    // Remove table formatting commands
    latex = latex.replace(/\\toprule|\\midrule|\\bottomrule/g, '\\hline');
    latex = latex.replace(/\\cmidrule{.*?}/g, '\\hline');
    
    return latex;
}

// Re-render MathJax
function rerenderMath(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([element]).catch((err) => {
            console.error('MathJax rendering error:', err);
        });
    }
}

// Load MathJax from CDN
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
})();
