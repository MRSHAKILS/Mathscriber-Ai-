// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    updateThemeIcons(theme);

    // Theme toggle buttons
    const themeToggles = document.querySelectorAll('[data-theme-toggle]');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(element => {
        observer.observe(element);
    });

    // Copy to clipboard functionality
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Copied to clipboard!', 'success');
        }).catch(function(err) {
            showNotification('Failed to copy', 'error');
        });
    };

    // Show notification
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    function updateThemeIcons(theme) {
        const sunIcons = document.querySelectorAll('[data-theme-icon="sun"]');
        const moonIcons = document.querySelectorAll('[data-theme-icon="moon"]');
        
        if (theme === 'dark') {
            sunIcons.forEach(icon => icon.classList.remove('hidden'));
            moonIcons.forEach(icon => icon.classList.add('hidden'));
        } else {
            sunIcons.forEach(icon => icon.classList.add('hidden'));
            moonIcons.forEach(icon => icon.classList.remove('hidden'));
        }
    }
});

// postMessage communication for iframe integration
window.addEventListener('message', function(event) {
    if (event.data.type === 'latex-code') {
        insertAtCursor(event.data.latex);
        closeConverterModal();
    }
});

function insertAtCursor(latex) {
    if (typeof ace !== 'undefined' && window.editor) {
        const editor = window.editor;
        const session = editor.getSession();
        const cursor = editor.getCursorPosition();
        
        // Add newlines for proper formatting
        const formattedLatex = '\n' + latex + '\n';
        session.insert(cursor, formattedLatex);
        
        // Focus back to editor
        editor.focus();
        
        showNotification('LaTeX code inserted successfully!', 'success');
    }
}

function closeConverterModal() {
    const modal = document.getElementById('converter-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Send LaTeX to parent (when in iframe)
function sendToEditor(latex) {
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'latex-code',
            latex: latex
        }, '*');
    }
}
