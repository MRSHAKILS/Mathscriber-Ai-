# MathScriber - Complete Project Build Prompt for VS Code Copilot

## 📋 Project Overview

**Project Name**: MathScriber  
**Type**: AI-Powered Math OCR Web Application  
**Framework**: Django 5.2.6 + Tailwind CSS 3.x  
**Purpose**: Transform handwritten math, tables, and diagrams into perfect LaTeX code using multiple AI models

---

## 🎯 Complete Project Specification

```json
{
  "project": {
    "name": "MathScriber",
    "type": "django_web_application",
    "version": "1.0.0",
    "description": "AI-assisted web application that converts images/PDFs of equations, tables, and diagrams into clean, compilable LaTeX code with in-browser preview, quick edit tools, and one-click export",
    "repository": "https://github.com/MRSHAKILS/MathScriber",
    "python_version": "3.13+",
    "django_version": "5.2.6"
  },

  "tech_stack": {
    "backend": {
      "framework": "Django 5.2.6",
      "database": "SQLite3 (dev), PostgreSQL (prod)",
      "python_packages": [
        "Django==5.2.6",
        "Pillow==11.3.0",
        "pix2tex==0.1.4",
        "torch==2.8.0",
        "torchvision==0.23.0",
        "pytesseract==0.3.13",
        "PyMuPDF==1.26.5",
        "pdf2image==1.17.0",
        "langchain==1.0.5",
        "langchain-google-genai==3.0.1",
        "google-generativeai==0.8.5",
        "langchain-huggingface==1.0.1",
        "python-dotenv==1.1.1",
        "groq==0.33.0",
        "mistralai==1.9.11",
        "openai==2.7.1",
        "transformers==4.56.2",
        "numpy==2.2.6",
        "pandas==2.3.3",
        "requests==2.32.5",
        "albumentations==1.4.24",
        "opencv-python-headless==4.12.0.88",
        "langgraph==1.0.2",
        "langsmith==0.4.37"
      ]
    },
    "frontend": {
      "framework": "Tailwind CSS 3.x + DaisyUI",
      "javascript": "Vanilla JS with MathJax 3",
      "icons": "Bootstrap Icons",
      "animations": "GSAP 3.13.0, custom CSS animations",
      "npm_packages": [
        "tailwindcss@4.1.17",
        "daisyui@3.9.4",
        "autoprefixer@10.4.21",
        "postcss@8.5.6",
        "gsap@3.13.0",
        "swiper@12.0.3",
        "tailwindcss-animate@1.0.7"
      ]
    },
    "ai_models": {
      "equations_tables": [
        {
          "name": "Gemini 2.5 Pro",
          "provider": "Google",
          "model": "gemini-2.5-pro",
          "use_case": "Best overall accuracy, FREE tier"
        },
        {
          "name": "Groq",
          "provider": "Groq",
          "model": "meta-llama/llama-4-scout-17b-16e-instruct",
          "use_case": "Lightning fast, FREE"
        },
        {
          "name": "Grok 2",
          "provider": "Grok",
          "model": "meta-llama/llama-4-scout-17b-16e-instruct",
          "use_case": "Alternative implementation"
        },
        {
          "name": "Mistral",
          "provider": "Mistral AI",
          "model": "pixtral-12b",
          "use_case": "European AI, good accuracy"
        },
        {
          "name": "LatexOCR",
          "provider": "pix2tex",
          "model": "pix2tex",
          "use_case": "Specialized for math, FREE"
        },
        {
          "name": "Classic Table OCR",
          "provider": "Tesseract",
          "model": "pytesseract",
          "use_case": "Traditional OCR, FREE"
        }
      ],
      "diagrams": [
        {
          "name": "Gemini Diagram AI",
          "provider": "Google",
          "model": "gemini-2.0-flash-exp",
          "use_case": "AI-Powered TikZ generation, FREE tier, RECOMMENDED"
        },
        {
          "name": "OpenAI Diagram AI",
          "provider": "OpenAI",
          "model": "gpt-4o",
          "use_case": "Most accurate TikZ generation, paid"
        },
        {
          "name": "HuggingFace Intelligent",
          "provider": "HuggingFace",
          "model": "llava-1.5-7b-hf",
          "use_case": "FREE analysis-based templates"
        },
        {
          "name": "DeepSeek AI",
          "provider": "DeepSeek",
          "model": "deepseek-reasoner",
          "use_case": "Paid with smart fallback"
        },
        {
          "name": "Basic Template",
          "provider": "Local",
          "model": "template-generator",
          "use_case": "Simple TikZ starter"
        }
      ],
      "universal": {
        "name": "Gemini Universal",
        "provider": "Google",
        "model": "gemini-2.0-flash-exp",
        "use_case": "Auto-detects content type (equation/table/diagram) and processes accordingly"
      }
    }
  },

  "project_structure": {
    "root_files": [
      "manage.py",
      "requirements.txt",
      "package.json",
      "tailwind.config.js",
      "postcss.config.js",
      "README.md",
      "PROJECT_OVERVIEW.md",
      "progress.md",
      ".env (not in git)",
      ".gitignore",
      "db.sqlite3 (not in git)"
    ],
    "django_apps": {
      "converter": {
        "purpose": "Main OCR conversion app - handles image/PDF uploads and AI processing",
        "models": [
          {
            "name": "UploadedImage",
            "fields": {
              "image": "ImageField - uploaded file (images/PDFs)",
              "task": "CharField - conversion type (equation/table/diagram/etc)",
              "model_used": "CharField - AI model identifier",
              "latex_output": "TextField - generated LaTeX code",
              "created_at": "DateTimeField - timestamp"
            }
          }
        ],
        "views": [
          "dashboard_view - Modern landing page with metrics",
          "upload_view - Multi-file upload with drag-drop",
          "results_view - Display all conversions with edit tools",
          "pricing_view - Three-tier monetization page",
          "stylus_view - Drawing canvas for handwriting",
          "camera_capture - Scanner with overlay guides",
          "delete_upload_view - Remove conversions",
          "update_latex_view - Edit and re-render LaTeX",
          "overleaf_snip_view - Copy to Overleaf snip",
          "overleaf_open_view - Open in Overleaf editor",
          "about_view - Project information"
        ],
        "templates": [
          "dashboard.html - Hero section, stats, feature cards",
          "upload.html - Drag-drop zone, file preview, AI model selector",
          "results.html - LaTeX code display, MathJax preview, edit tools",
          "pricing.html - Free/Pro/Enterprise tiers with FAQ",
          "scanner.html - Large camera view (1200px), overlay guide",
          "stylus.html - Drawing canvas with stylus support",
          "about.html - Project information and team"
        ],
        "utilities": [
          "ocr_utils.py - OCR processing functions for all AI models",
          "forms.py - MultipleImageUploadForm, SingleImageUploadForm"
        ]
      },
      "editor": {
        "purpose": "Professional LaTeX editor with live preview and compilation",
        "models": [
          {
            "name": "Project",
            "fields": {
              "owner": "ForeignKey(User)",
              "name": "CharField - project name",
              "description": "TextField - project description",
              "created_at": "DateTimeField"
            }
          },
          {
            "name": "Document",
            "fields": {
              "project": "ForeignKey(Project)",
              "folder": "ForeignKey(Folder, null=True)",
              "name": "CharField - file name (e.g., main.tex)",
              "content": "TextField - LaTeX code",
              "is_main": "BooleanField - main document flag",
              "updated_at": "DateTimeField"
            }
          },
          {
            "name": "Folder",
            "fields": {
              "project": "ForeignKey(Project)",
              "parent": "ForeignKey(self, null=True)",
              "name": "CharField - folder name"
            }
          },
          {
            "name": "BinaryFile",
            "fields": {
              "project": "ForeignKey(Project)",
              "folder": "ForeignKey(Folder, null=True)",
              "file": "FileField - uploaded binary (images, etc.)"
            }
          },
          {
            "name": "Version",
            "fields": {
              "document": "ForeignKey(Document)",
              "content": "TextField - document snapshot",
              "message": "CharField - commit message",
              "created_at": "DateTimeField",
              "author": "ForeignKey(User, null=True)"
            }
          },
          {
            "name": "CompileRun",
            "fields": {
              "project": "ForeignKey(Project)",
              "status": "CharField - queued/running/success/error",
              "log": "TextField - compilation output",
              "pdf": "FileField - generated PDF",
              "finished_at": "DateTimeField",
              "created_at": "DateTimeField"
            }
          },
          {
            "name": "Collaborator",
            "fields": {
              "project": "ForeignKey(Project)",
              "user": "ForeignKey(User)",
              "role": "CharField - owner/editor/viewer"
            }
          }
        ],
        "views": [
          "project_list - Card-based project gallery",
          "project_create_view - Create with optional converter import",
          "project_detail - Project overview",
          "project_delete - Delete project",
          "document_editor - Three-column layout (files/editor/preview)",
          "document_create - New document creation",
          "document_create_ajax - AJAX file creation",
          "folder_create_ajax - AJAX folder creation",
          "binary_file_upload_ajax - AJAX file upload",
          "move_item_ajax - Drag-drop file organization",
          "live_compile - Real-time compilation with debouncing",
          "compile_project - Full project compilation",
          "compile_status - Check compilation status",
          "download_pdf - Download generated PDF",
          "download_binary - Download uploaded files",
          "pdf_frame - Embedded PDF viewer"
        ],
        "templates": [
          "project_list.html - Modern card grid with hover effects",
          "project_form.html - Create/edit project form",
          "document_editor.html - Three-column IDE-style layout with Ace Editor",
          "pdf_frame.html - PDF preview with error display"
        ],
        "services": [
          "services.py - LaTeX compilation with pdflatex",
          "forms.py - Project/Document/Folder/BinaryFile forms"
        ],
        "features": [
          "Ace Editor integration with LaTeX syntax highlighting",
          "Live auto-compile with debouncing (1.5s delay)",
          "Three-column responsive layout (file browser/editor/preview)",
          "Converter sidebar (Upload/Scanner/Stylus/Template buttons)",
          "Template library (8+ ready-to-use LaTeX snippets)",
          "Insert at cursor functionality with postMessage API",
          "File tree with drag-drop organization",
          "Embedded PDF preview with error handling",
          "Full .log file capture for debugging",
          "Partial PDF display even with errors",
          "Enhanced error hints and categorization",
          "20+ pre-loaded LaTeX packages",
          "Version control and collaboration support"
        ]
      },
      "MathScriber": {
        "purpose": "Main Django project configuration",
        "files": [
          "settings.py - Django settings with media/static config",
          "urls.py - Root URL configuration",
          "wsgi.py - WSGI application",
          "asgi.py - ASGI application"
        ]
      }
    },
    "notebooks": {
      "purpose": "Standalone AI processing scripts (can be imported by converter)",
      "scripts": [
        "gemini_universal.py - Auto-detect content type and convert",
        "convert_table_gemini.py - Table/equation conversion (Gemini)",
        "convert_table_groq.py - Table/equation conversion (Groq)",
        "convert_grok2.py - Table/equation conversion (Grok 2)",
        "convert_mistral.py - Table/equation conversion (Mistral)",
        "latexocr.py - Equation-only OCR (pix2tex)",
        "table_to_latex.py - Classic table OCR (tesseract)",
        "gemini_diagram.py - AI-powered TikZ generation (Gemini)",
        "openai_diagram.py - AI-powered TikZ generation (OpenAI)",
        "huggingface_diagram.py - Intelligent template generation",
        "deepseek_diagram.py - Basic TikZ template",
        "deepseek_diagram_ai.py - AI-powered with fallback (DeepSeek)"
      ]
    },
    "templates": {
      "base": [
        "base.html - Master template with navbar, footer, theme toggle",
        "dashboard.html - Landing page (separate from converter app)"
      ],
      "shared_components": [
        "Navbar - Glass morphism, mobile menu, theme toggle, logo with glow",
        "Footer - 4-column layout (Brand/Product/Resources/Company)",
        "Theme Toggle - Dark/light mode with localStorage persistence",
        "Mobile Menu - Hamburger animation, click-outside-to-close"
      ]
    },
    "static": {
      "css": [
        "input.css - Tailwind source file",
        "output.css - Compiled Tailwind CSS (generated)",
        "custom.css - Additional styles"
      ],
      "js": [
        "main.js - Theme toggle, mobile menu, animations",
        "mathjax-config.js - MathJax configuration",
        "ace-editor.js - Editor initialization and setup"
      ],
      "img": [
        "Logo and branding assets",
        "Feature illustrations",
        "Example outputs"
      ]
    },
    "media": {
      "uploads": "User uploaded images/PDFs",
      "project_files": "LaTeX project binary files",
      "project_pdfs": "Generated PDF outputs"
    }
  },

  "features": {
    "core_functionality": [
      {
        "name": "Multi-Format Input",
        "description": "Upload images (JPG, PNG, BMP, GIF, TIFF) or multi-page PDFs",
        "implementation": "Django FileField with validation, PyMuPDF for PDF extraction"
      },
      {
        "name": "AI Model Selection",
        "description": "Choose from 11 different AI models for optimal accuracy",
        "implementation": "Task dropdown in upload form, routing in ocr_utils.py"
      },
      {
        "name": "LaTeX Generation",
        "description": "Convert visual content to clean, compilable LaTeX code",
        "implementation": "Vision API calls with specialized prompts per content type"
      },
      {
        "name": "Live Preview",
        "description": "Render LaTeX with MathJax 3 in real-time",
        "implementation": "MathJax v3 with tabular→array conversion for tables"
      },
      {
        "name": "Inline Editing",
        "description": "Edit LaTeX code and re-render instantly",
        "implementation": "AJAX updates with update_latex_view"
      },
      {
        "name": "One-Click Export",
        "description": "Copy, download (.tex), or open in Overleaf",
        "implementation": "JavaScript copy, file download, Overleaf API integration"
      }
    ],
    "advanced_features": [
      {
        "name": "LaTeX Editor",
        "description": "Professional IDE-style editor with syntax highlighting",
        "components": [
          "Ace Editor with LaTeX mode",
          "Three-column responsive layout",
          "File tree with drag-drop",
          "Live auto-compile (debounced)",
          "Embedded PDF preview",
          "Version control",
          "Collaboration support"
        ]
      },
      {
        "name": "Converter Integration",
        "description": "Access converter tools from within editor",
        "components": [
          "Sidebar with 4 buttons (Upload/Scan/Draw/Template)",
          "Modal with iframe loader",
          "postMessage communication",
          "Insert at cursor with formatting",
          "Seamless workflow"
        ]
      },
      {
        "name": "Template Library",
        "description": "8+ ready-to-use LaTeX snippets",
        "templates": [
          "Aligned equations",
          "Matrices (2x2, 3x3)",
          "Professional tables (booktabs)",
          "Complex tables (multirow/multicolumn)",
          "TikZ flowcharts",
          "TikZ graphs",
          "Lists (itemize/enumerate/description)",
          "Figures with captions"
        ]
      },
      {
        "name": "Scanner Integration",
        "description": "Large camera view with positioning overlay",
        "implementation": "1200px camera, green dashed guide, capture/retake/process"
      },
      {
        "name": "Drawing Canvas",
        "description": "Stylus support for handwriting input",
        "implementation": "HTML5 Canvas with touch/mouse support"
      },
      {
        "name": "Universal Converter",
        "description": "Auto-detect content type and process",
        "implementation": "Gemini vision analysis → routing → appropriate processing"
      },
      {
        "name": "Enhanced Debugging",
        "description": "Detailed error logs and partial PDF preview",
        "components": [
          "Full .log file display",
          "Error line numbers and descriptions",
          "Partial PDF when available",
          "Helpful hints for common issues",
          "Collapsible log viewer"
        ]
      }
    ],
    "ui_ux_features": [
      {
        "name": "Modern Design",
        "description": "Tailwind CSS with custom animations",
        "details": [
          "Glass morphism effects",
          "Gradient backgrounds (green-emerald for main, teal-blue for editor)",
          "Smooth transitions and hover effects",
          "Responsive breakpoints (sm/md/lg/xl)",
          "Mobile-first approach"
        ]
      },
      {
        "name": "Dark Mode",
        "description": "System-wide theme switching",
        "implementation": [
          "Toggle button in navbar and mobile menu",
          "localStorage persistence",
          "Systematic dark: classes",
          "Icon updates (sun/moon)",
          "Smooth transitions"
        ]
      },
      {
        "name": "Animations",
        "description": "Professional motion design",
        "types": [
          "Fade-in on page load",
          "Slide-up on scroll (Intersection Observer)",
          "Scale on hover",
          "Pulse for status indicators",
          "Smooth page transitions"
        ]
      },
      {
        "name": "Responsive Layout",
        "description": "Perfect on all devices",
        "breakpoints": [
          "Mobile: < 640px",
          "Tablet: 640px - 1024px",
          "Desktop: 1024px+",
          "Large desktop: 1280px+"
        ]
      },
      {
        "name": "Accessibility",
        "description": "WCAG compliant interface",
        "features": [
          "Keyboard navigation with focus states",
          "ARIA labels for screen readers",
          "Color contrast ratios (4.5:1 minimum)",
          "Touch targets 44px minimum",
          "Reduced motion support"
        ]
      }
    ]
  },

  "database_schema": {
    "converter_uploadedimage": {
      "id": "BigAutoField (primary key)",
      "image": "ImageField → media/uploads/",
      "task": "CharField(20) - choices from TASK_CHOICES",
      "model_used": "CharField(100, blank=True) - AI model identifier",
      "latex_output": "TextField(blank=True) - generated LaTeX",
      "created_at": "DateTimeField(auto_now_add=True)"
    },
    "editor_project": {
      "id": "BigAutoField (primary key)",
      "owner_id": "ForeignKey(auth.User)",
      "name": "CharField(200)",
      "description": "TextField(blank=True)",
      "created_at": "DateTimeField(default=now)"
    },
    "editor_document": {
      "id": "BigAutoField (primary key)",
      "project_id": "ForeignKey(Project)",
      "folder_id": "ForeignKey(Folder, null=True)",
      "name": "CharField(200)",
      "content": "TextField(default='')",
      "is_main": "BooleanField(default=False)",
      "updated_at": "DateTimeField(auto_now=True)"
    },
    "editor_folder": {
      "id": "BigAutoField (primary key)",
      "project_id": "ForeignKey(Project)",
      "parent_id": "ForeignKey(self, null=True)",
      "name": "CharField(200)"
    },
    "editor_binaryfile": {
      "id": "BigAutoField (primary key)",
      "project_id": "ForeignKey(Project)",
      "folder_id": "ForeignKey(Folder, null=True)",
      "file": "FileField → media/project_files/"
    },
    "editor_version": {
      "id": "BigAutoField (primary key)",
      "document_id": "ForeignKey(Document)",
      "content": "TextField",
      "message": "CharField(255, blank=True)",
      "created_at": "DateTimeField(default=now)",
      "author_id": "ForeignKey(User, null=True)"
    },
    "editor_compilerun": {
      "id": "BigAutoField (primary key)",
      "project_id": "ForeignKey(Project)",
      "status": "CharField(20) - queued/running/success/error",
      "log": "TextField(blank=True)",
      "pdf": "FileField(blank=True) → media/project_pdfs/",
      "finished_at": "DateTimeField(null=True)",
      "created_at": "DateTimeField(default=now)"
    },
    "editor_collaborator": {
      "id": "BigAutoField (primary key)",
      "project_id": "ForeignKey(Project)",
      "user_id": "ForeignKey(User)",
      "role": "CharField(50) - owner/editor/viewer"
    }
  },

  "url_patterns": {
    "converter": {
      "": "dashboard_view",
      "about/": "about_view",
      "upload/": "upload_view",
      "stylus/": "stylus_view",
      "Scanner/": "camera_capture",
      "results/": "results_view",
      "pricing/": "pricing_view",
      "delete/<int:upload_id>/": "delete_upload_view",
      "update-latex/<int:upload_id>/": "update_latex_view",
      "overleaf/snip/<int:upload_id>/": "overleaf_snip_view",
      "overleaf/open/<int:upload_id>/": "overleaf_open_view"
    },
    "editor": {
      "projects/": "project_list",
      "projects/new/": "project_create_view",
      "projects/<int:pk>/": "project_detail",
      "projects/<int:pk>/delete/": "project_delete",
      "projects/<int:pk>/docs/<int:doc_id>/": "document_editor",
      "projects/<int:pk>/docs/new/": "document_create",
      "projects/<int:pk>/docs/<int:doc_id>/live_compile/": "live_compile",
      "projects/<int:pk>/compile/": "compile_project",
      "projects/<int:pk>/compile/<int:run_id>/": "compile_status",
      "projects/<int:pk>/compile/<int:run_id>/pdf/": "download_pdf",
      "projects/<int:pk>/pdf_frame/": "pdf_frame",
      "projects/<int:pk>/files/<int:file_id>/": "download_binary",
      "projects/<int:pk>/ajax/create_folder/": "folder_create_ajax",
      "projects/<int:pk>/ajax/create_document/": "document_create_ajax",
      "projects/<int:pk>/ajax/upload_binary/": "binary_file_upload_ajax",
      "projects/<int:pk>/ajax/move_item/": "move_item_ajax"
    }
  },

  "environment_variables": {
    "required": [
      "GOOGLE_API_KEY - Google Gemini API key",
      "GROQ_API_KEY - Groq API key",
      "MISTRAL_API_KEY - Mistral AI API key",
      "OPENAI_API_KEY - OpenAI API key",
      "DEEPSEEK_API_KEY - DeepSeek API key",
      "HUGGINGFACE_API_KEY - HuggingFace API key"
    ],
    "optional": [
      "SECRET_KEY - Django secret key (auto-generated)",
      "DEBUG - Debug mode (True for dev)",
      "ALLOWED_HOSTS - Allowed hostnames"
    ]
  },

  "configuration_files": {
    "tailwind.config.js": {
      "content": [
        "./templates/**/*.html",
        "./static/**/*.js",
        "./converter/templates/**/*.html",
        "./editor/templates/**/*.html"
      ],
      "theme": {
        "extend": {}
      },
      "plugins": ["daisyui"],
      "daisyui_themes": [
        "light",
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "black",
        "luxury",
        "dracula",
        "cmyk",
        "autumn",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "winter"
      ]
    },
    "postcss.config.js": {
      "plugins": {
        "tailwindcss": {},
        "autoprefixer": {}
      }
    },
    "package.json": {
      "scripts": {
        "build:css": "tailwindcss -i ./static/css/input.css -o ./static/css/output.css",
        "watch:css": "tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch"
      }
    },
    ".gitignore": [
      "__pycache__/",
      "*.py[cod]",
      "*$py.class",
      "db.sqlite3",
      "db.sqlite3-journal",
      ".env",
      ".venv/",
      "venv/",
      "ENV/",
      "media/uploads/",
      "staticfiles/",
      "*.log",
      ".DS_Store",
      "node_modules/"
    ]
  },

  "setup_instructions": {
    "step1_clone": "git clone https://github.com/MRSHAKILS/MathScriber.git && cd MathScriber",
    "step2_python_env": "python -m venv venv && source venv/bin/activate (or venv\\Scripts\\activate on Windows)",
    "step3_install_python": "pip install -r requirements.txt",
    "step4_install_node": "npm install",
    "step5_env_file": "Create .env file with API keys (see environment_variables section)",
    "step6_migrations": "python manage.py migrate",
    "step7_static": "python manage.py collectstatic --noinput",
    "step8_build_css": "npm run build:css (or npm run watch:css for development)",
    "step9_run": "python manage.py runserver",
    "step10_access": "Open http://127.0.0.1:8000 in browser"
  },

  "key_implementation_details": {
    "ocr_processing": {
      "flow": [
        "1. User uploads image/PDF via upload_view",
        "2. File saved to media/uploads/ via Django ImageField",
        "3. Task type determines which AI model to use",
        "4. ocr_utils.py routes to appropriate processing function",
        "5. Processing function calls external AI API with image",
        "6. LaTeX code extracted from API response",
        "7. Post-processing cleans markdown fences and formatting",
        "8. Result saved to UploadedImage.latex_output",
        "9. User redirected to results page with preview"
      ],
      "error_handling": [
        "API failures: Try-except with user-friendly messages",
        "Invalid files: Validation before processing",
        "Missing API keys: Check .env and display instructions",
        "Rate limits: Implement exponential backoff",
        "Timeout: 30-second timeout per request"
      ]
    },
    "mathjax_rendering": {
      "configuration": {
        "version": "MathJax 3",
        "loader": "tex-mml-chtml",
        "tex": {
          "inlineMath": [
            ["$", "$"],
            ["\\(", "\\)"]
          ],
          "displayMath": [
            ["$$", "$$"],
            ["\\[", "\\]"]
          ],
          "processEscapes": true,
          "processEnvironments": true
        },
        "svg": {
          "fontCache": "global"
        }
      },
      "table_handling": {
        "problem": "MathJax doesn't support tabular/tabularx environments",
        "solution": "JavaScript converts tabular → array before rendering",
        "implementation": "Replace \\begin{tabular} with \\begin{array}, strip \\toprule/\\midrule/\\bottomrule"
      }
    },
    "latex_compilation": {
      "engine": "pdflatex",
      "runs": 2,
      "options": ["-interaction=nonstopmode", "-output-directory"],
      "process": [
        "1. Write all project files to temp directory",
        "2. Run pdflatex on main .tex file (first pass)",
        "3. Run pdflatex again for cross-references (second pass)",
        "4. Capture stdout, stderr, and .log file",
        "5. Check for PDF output and error status",
        "6. Save PDF even if errors (partial compilation)",
        "7. Store full .log content for debugging",
        "8. Update CompileRun status and log",
        "9. Clean up temp directory"
      ],
      "error_display": [
        "Show partial PDF if available",
        "Display full .log file in collapsible section",
        "Highlight lines starting with ! (error markers)",
        "Provide helpful hints for common errors",
        "Categorize errors (missing packages, syntax, undefined commands)"
      ]
    },
    "theme_system": {
      "implementation": [
        "localStorage.getItem('theme') checks saved preference",
        "document.documentElement.classList.add('dark') applies theme",
        "Toggle buttons sync via event listeners",
        "Icons update (sun/moon SVG swap)",
        "Smooth transitions with CSS transition-colors"
      ],
      "classes": [
        "Light mode: default Tailwind classes",
        "Dark mode: dark:bg-gray-900 dark:text-white etc.",
        "Automatic contrast adjustment for readability"
      ]
    },
    "converter_integration": {
      "sidebar": [
        "4 buttons: Upload, Scanner, Stylus, Template",
        "Opens modal with iframe to converter tool",
        "iframe loads full converter page"
      ],
      "communication": [
        "Converter detects if in iframe: window.parent !== window",
        "Shows 'Send to Editor' button when in iframe",
        "Sends LaTeX via postMessage to parent",
        "Parent receives message and calls insertAtCursor()",
        "Modal closes automatically after insertion"
      ],
      "insertion": [
        "Get current cursor position in Ace Editor",
        "Insert LaTeX code at cursor",
        "Add newlines for proper formatting",
        "Maintain indentation context",
        "Focus back to editor after insertion"
      ]
    },
    "template_system": {
      "storage": "JavaScript object with LaTeX snippets",
      "categories": [
        "Equations (inline, display, aligned)",
        "Tables (basic, booktabs, complex)",
        "Diagrams (TikZ flowchart, graph, shapes)",
        "Lists (itemize, enumerate, description)"
      ],
      "insertion": "Same insertAtCursor() function as converter"
    },
    "file_tree": {
      "structure": [
        "Recursive rendering of folders and documents",
        "Folder icons, document icons, binary file icons",
        "Expandable/collapsible folders",
        "Click to open document in editor"
      ],
      "drag_drop": [
        "Draggable items with data-type and data-id",
        "Drop zones on folders",
        "AJAX POST to move_item_ajax",
        "Update UI on success"
      ]
    }
  },

  "testing_checklist": [
    "✅ Upload single image (JPG, PNG)",
    "✅ Upload multi-page PDF",
    "✅ Test all 11 AI models",
    "✅ Verify LaTeX rendering with MathJax",
    "✅ Edit and re-render LaTeX",
    "✅ Copy to clipboard",
    "✅ Download .tex file",
    "✅ Open in Overleaf",
    "✅ Dark mode toggle and persistence",
    "✅ Mobile responsive design",
    "✅ Scanner camera capture",
    "✅ Drawing canvas input",
    "✅ LaTeX editor compilation",
    "✅ Converter sidebar integration",
    "✅ Template insertion",
    "✅ File tree drag-drop",
    "✅ Error handling and partial PDFs",
    "✅ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)",
    "✅ Accessibility (keyboard nav, screen reader)",
    "✅ Performance (load times < 2s)"
  ],

  "deployment_considerations": {
    "production_settings": [
      "DEBUG = False",
      "SECRET_KEY from environment variable",
      "ALLOWED_HOSTS = ['yourdomain.com']",
      "Database: PostgreSQL instead of SQLite",
      "Static files: Serve via CDN or nginx",
      "Media files: S3 or similar cloud storage",
      "HTTPS required for camera and security"
    ],
    "server_requirements": [
      "Python 3.13+",
      "pdflatex (TeX Live or MiKTeX)",
      "Node.js 18+ (for Tailwind build)",
      "Redis (for caching, optional)",
      "Celery (for background tasks, optional)"
    ],
    "scaling_strategies": [
      "Use Celery for OCR processing (async)",
      "Cache LaTeX renders in Redis",
      "Load balancer for multiple servers",
      "CDN for static assets",
      "Database connection pooling",
      "API rate limiting per user"
    ],
    "monitoring": [
      "Application logs (Django logging)",
      "Error tracking (Sentry, Rollbar)",
      "Performance monitoring (New Relic, DataDog)",
      "API usage tracking",
      "User analytics (Google Analytics, Plausible)"
    ]
  },

  "future_enhancements": [
    "User authentication and saved projects",
    "Project sharing and collaboration",
    "Advanced LaTeX templates library",
    "Batch processing of multiple files",
    "API for programmatic access",
    "Mobile native apps (iOS/Android)",
    "LMS integration (Canvas, Moodle)",
    "Chemistry support (mhchem package)",
    "Code listings conversion",
    "Git integration for version control",
    "Team workspaces with permissions",
    "Advanced analytics dashboard",
    "A/B testing for model accuracy",
    "User feedback and corrections system",
    "Dataset generation for model improvement"
  ],

  "documentation_files": [
    "README.md - User-facing documentation with quickstart",
    "PROJECT_OVERVIEW.md - Business and technical overview",
    "progress.md - Complete development history with 24 major milestones",
    "VSCODE_COPILOT_PROMPT.md - This comprehensive build specification"
  ],

  "key_architectural_decisions": [
    {
      "decision": "Multiple AI providers",
      "rationale": "Redundancy, cost optimization, accuracy comparison",
      "tradeoff": "Increased complexity, more API key management"
    },
    {
      "decision": "Tailwind CSS over Bootstrap",
      "rationale": "Modern utility-first approach, better customization, smaller bundle",
      "tradeoff": "Learning curve, requires build step"
    },
    {
      "decision": "MathJax for rendering",
      "rationale": "Industry standard, excellent equation support, client-side",
      "tradeoff": "Limited table support (required workaround)"
    },
    {
      "decision": "SQLite for development",
      "rationale": "Zero configuration, perfect for getting started",
      "tradeoff": "Must migrate to PostgreSQL for production"
    },
    {
      "decision": "pdflatex for compilation",
      "rationale": "Widely available, stable, comprehensive package support",
      "tradeoff": "Slower than LuaLaTeX/XeLaTeX, requires installation"
    },
    {
      "decision": "Ace Editor for LaTeX editing",
      "rationale": "Lightweight, good syntax highlighting, customizable",
      "tradeoff": "Less feature-rich than Monaco or CodeMirror"
    },
    {
      "decision": "postMessage for iframe communication",
      "rationale": "Standard web API, secure cross-origin communication",
      "tradeoff": "Requires message validation, slightly complex"
    }
  ],

  "critical_success_factors": [
    "✅ Accurate LaTeX conversion across all content types",
    "✅ Fast response times (< 5 seconds per conversion)",
    "✅ Intuitive user interface with minimal learning curve",
    "✅ Reliable compilation with helpful error messages",
    "✅ Seamless integration between converter and editor",
    "✅ Mobile-responsive design for on-the-go usage",
    "✅ Comprehensive documentation for users and developers",
    "✅ Robust error handling with graceful degradation"
  ],

  "known_issues_and_limitations": [
    {
      "issue": "Complex diagrams may not convert perfectly",
      "mitigation": "Multiple AI models provide alternatives, manual editing supported"
    },
    {
      "issue": "Large PDFs (50+ pages) can be slow",
      "mitigation": "Consider Celery for async processing in production"
    },
    {
      "issue": "pdflatex must be installed separately",
      "mitigation": "Clear installation instructions in README"
    },
    {
      "issue": "API rate limits on free tiers",
      "mitigation": "Multiple providers, intelligent routing, user messaging"
    },
    {
      "issue": "Handwriting quality affects accuracy",
      "mitigation": "Multiple models for retry, user can edit results"
    }
  ],

  "performance_benchmarks": {
    "page_load": "< 2 seconds on modern devices",
    "conversion_time": "2-15 seconds depending on AI model and content complexity",
    "compilation_time": "3-10 seconds for typical documents",
    "database_queries": "< 50ms for most operations",
    "static_asset_size": "~500KB total (Tailwind CSS optimized)"
  },

  "security_considerations": [
    "CSRF protection enabled (Django default)",
    "SQL injection prevention (Django ORM)",
    "XSS protection (Django template escaping)",
    "File upload validation (image/PDF only)",
    "API key storage in .env (not in code)",
    "HTTPS required for camera access",
    "User authentication for editor access",
    "Input sanitization for LaTeX code",
    "Rate limiting on API endpoints"
  ],

  "code_quality_standards": [
    "PEP 8 for Python code style",
    "ESLint/Prettier for JavaScript",
    "Type hints for Python functions",
    "Comprehensive docstrings",
    "Unit tests for critical functions",
    "Integration tests for workflows",
    "Code comments for complex logic",
    "Git commit messages following conventions"
  ]
}
```

---

## 📝 Step-by-Step Build Instructions for VS Code Copilot

### Phase 1: Project Initialization

1. **Create Django Project**

   ```bash
   django-admin startproject MathScriber
   cd MathScriber
   python manage.py startapp converter
   python manage.py startapp editor
   ```

2. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   npm install
   ```

3. **Configure Settings**

   - Update `MathScriber/settings.py` with all apps
   - Configure media and static file paths
   - Set up database (SQLite for dev)
   - Add X_FRAME_OPTIONS = 'SAMEORIGIN'

4. **Create Environment File**
   - Create `.env` with all API keys
   - Load with python-dotenv in settings

### Phase 2: Converter App

5. **Models**

   - Create `UploadedImage` model with 12 task choices
   - Add migrations and migrate

6. **Forms**

   - `MultipleImageUploadForm` with task selector
   - `SingleImageUploadForm` for individual uploads

7. **OCR Utilities**

   - Implement `process_image_to_latex()` router
   - Create functions for each AI model
   - Add PDF processing with PyMuPDF
   - Implement error handling and validation

8. **Views**

   - `dashboard_view` with metrics and hero section
   - `upload_view` with multi-file support
   - `results_view` with edit/preview/export
   - `pricing_view` with three-tier structure
   - `stylus_view` with drawing canvas
   - `camera_capture` with large view and overlay
   - CRUD operations (delete, update, export)

9. **Templates**
   - Create all converter templates with Tailwind CSS
   - Add MathJax configuration
   - Implement drag-drop upload
   - Add dark mode support

### Phase 3: Editor App

10. **Models**

    - Create all 7 models (Project, Document, Folder, etc.)
    - Set up relationships and constraints
    - Add migrations and migrate

11. **Services**

    - Implement `compile_latex_pdf()` with pdflatex
    - Add `.log` file reading
    - Implement file tree writing
    - Add error handling with partial PDF saves

12. **Forms**

    - Project/Document/Folder forms
    - MultipleFileInput widget for binaries
    - Validation and styling

13. **Views**

    - Project CRUD operations
    - Document editor with Ace integration
    - AJAX endpoints for file operations
    - Compilation endpoints (live and full)
    - PDF viewer and download

14. **Templates**
    - Three-column editor layout
    - Converter sidebar modal
    - Template insertion modal
    - File tree with drag-drop
    - PDF preview with error display

### Phase 4: Frontend

15. **Tailwind Setup**

    - Configure `tailwind.config.js`
    - Create `input.css` with directives
    - Build CSS with npm script
    - Add to templates

16. **Base Template**

    - Create responsive navbar with glass morphism
    - Add footer with 4-column layout
    - Implement theme toggle with localStorage
    - Add mobile menu with animations

17. **JavaScript**

    - Theme toggle logic
    - Mobile menu handling
    - MathJax configuration
    - Ace Editor setup
    - postMessage communication
    - Template insertion
    - Drag-drop file tree

18. **Animations**
    - Fade-in, slide-up, scale effects
    - Hover transformations
    - Smooth transitions
    - Intersection Observer for scroll

### Phase 5: Notebooks

19. **AI Processing Scripts**
    - Create all 12 notebook scripts
    - Implement vision API calls
    - Add prompt engineering for each model
    - Export functions for import by converter

### Phase 6: Integration

20. **URL Configuration**

    - Root URLs including both apps
    - Media URL serving for dev
    - Namespace separation

21. **Static Files**

    - Collect static files
    - Add custom CSS and JS
    - Organize images and assets

22. **Cross-App Integration**
    - Converter → Editor flow with query params
    - postMessage API for iframe communication
    - Shared components and utilities

### Phase 7: Testing & Documentation

23. **Testing**

    - Test all 11 AI models
    - Verify LaTeX rendering
    - Check compilation with errors
    - Test responsive design
    - Validate accessibility
    - Cross-browser testing

24. **Documentation**
    - Update README.md
    - Complete PROJECT_OVERVIEW.md
    - Maintain progress.md
    - Add code comments

### Phase 8: Deployment Preparation

25. **Production Settings**

    - Environment-based configuration
    - Security settings (DEBUG=False)
    - Database migration plan
    - Static file serving strategy

26. **Optimization**
    - Image compression
    - CSS minification
    - JavaScript bundling
    - Database indexing

---

## 🎯 Critical Implementation Notes

### For AI Model Integration

Each AI model requires:

1. **API Key**: Stored in `.env`
2. **Processing Function**: In `ocr_utils.py`
3. **Prompt Engineering**: Specific instructions for content type
4. **Response Parsing**: Extract LaTeX from API response
5. **Error Handling**: Try-except with user messages
6. **Post-Processing**: Clean markdown fences, format code

### For LaTeX Compilation

Critical steps:

1. **Check pdflatex**: Use `shutil.which("pdflatex")`
2. **Write All Files**: Recursive folder structure
3. **Run Twice**: For cross-references
4. **Capture Logs**: Read .log file for errors
5. **Save Partial PDFs**: Even with error status
6. **Error Display**: Show helpful hints

### For Converter-Editor Integration

postMessage flow:

1. **Iframe Detection**: Check `window.parent !== window`
2. **Send Message**: `window.parent.postMessage({type, latex}, "*")`
3. **Receive Message**: `window.addEventListener("message", handler)`
4. **Insert at Cursor**: Get Ace session, insert at position
5. **Close Modal**: After successful insertion

### For Theme System

Implementation:

1. **Check Preference**: `localStorage.getItem('theme')`
2. **Apply Class**: `document.documentElement.classList.add('dark')`
3. **Toggle Function**: Add/remove class, update localStorage
4. **Sync Buttons**: Update both desktop and mobile icons
5. **Smooth Transitions**: Use `transition-colors duration-300`

---

## 📚 Additional Resources

- **Django Docs**: https://docs.djangoproject.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **MathJax**: https://docs.mathjax.org/
- **Ace Editor**: https://ace.c9.io/
- **Google Gemini**: https://ai.google.dev/docs
- **Groq API**: https://console.groq.com/docs
- **pdflatex**: https://www.latex-project.org/

---

## ✅ Final Checklist

Before considering the project complete:

- [ ] All 11 AI models working with API keys
- [ ] LaTeX rendering perfect with MathJax
- [ ] Editor compiling with detailed error logs
- [ ] Converter sidebar integrated with postMessage
- [ ] Template system with 8+ snippets
- [ ] Dark mode with localStorage persistence
- [ ] Mobile responsive on all pages
- [ ] Scanner with large camera view
- [ ] Drawing canvas functional
- [ ] File tree with drag-drop
- [ ] Error handling throughout
- [ ] Documentation complete
- [ ] Git repository clean (no .pyc, db.sqlite3)
- [ ] requirements.txt with pinned versions
- [ ] .gitignore properly configured
- [ ] README.md with quickstart
- [ ] All migrations applied
- [ ] Static files collected
- [ ] Tailwind CSS compiled

---

**This document contains the complete specification to rebuild MathScriber from scratch. Every feature, functionality, component, and configuration is documented here for VS Code Copilot to generate a fully-functional clone of the project.**

**Last Updated**: December 1, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
