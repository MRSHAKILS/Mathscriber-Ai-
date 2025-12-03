{
  "project_name": "LaTeX Live Editor with Realtime Compilation",
  "description": "Complete integration guide for a Django-based LaTeX editor with live compilation, file management, and PDF generation",
  "technology_stack": {
    "backend": {
      "framework": "Django 5.2.6",
      "python_version": "3.13",
      "key_packages": [
        "django==5.2.6",
        "pillow==11.3.0",
        "python-dotenv==1.1.1"
      ]
    },
    "frontend": {
      "editor": "Ace Editor 1.x",
      "styling": "Tailwind CSS 3.x with DaisyUI",
      "icons": "Bootstrap Icons 1.11.x",
      "javascript": "Vanilla JS (ES6+)",
      "ajax": "Fetch API"
    },
    "latex_compilation": {
      "compiler": "pdflatex (MiKTeX 25.4 or TeX Live)",
      "required_commands": ["pdflatex"],
      "compilation_passes": 2,
      "timeout": "120 seconds"
    }
  },
  
  "core_features": {
    "1_project_management": {
      "description": "Multi-project workspace with hierarchical file structure",
      "capabilities": [
        "Create/delete projects",
        "Project ownership and collaboration system",
        "Project metadata (name, description, timestamps)"
      ]
    },
    "2_file_management": {
      "description": "Hierarchical folder structure with multiple file types",
      "file_types": {
        "documents": ".tex files with LaTeX source code",
        "folders": "Organize files in nested directories",
        "binary_files": "Images, PDFs, and other assets (for \\includegraphics)"
      },
      "operations": [
        "Create folders (nested)",
        "Create LaTeX documents",
        "Upload binary files (images, etc.)",
        "Move/reorganize files via drag-and-drop",
        "Unique naming enforcement within same folder"
      ]
    },
    "3_live_editor": {
      "description": "Real-time LaTeX editing with syntax highlighting",
      "editor_configuration": {
        "library": "Ace Editor",
        "mode": "ace/mode/latex",
        "theme": "ace/theme/monokai",
        "features": [
          "Syntax highlighting for LaTeX",
          "Line numbers",
          "Code folding",
          "Auto-indentation",
          "Find/replace",
          "Keyboard shortcuts"
        ]
      },
      "auto_save": {
        "enabled": true,
        "method": "Auto-save to database on content change",
        "debounce_delay": "500ms"
      }
    },
    "4_live_compilation": {
      "description": "Real-time PDF compilation with instant preview",
      "workflow": [
        "1. User edits LaTeX in Ace Editor",
        "2. On change or manual trigger, send content via AJAX",
        "3. Django saves content to database",
        "4. Create CompileRun record (status: queued)",
        "5. Write all project files to temp directory",
        "6. Run pdflatex twice (for references/cross-refs)",
        "7. Capture logs and PDF output",
        "8. Save PDF to media storage",
        "9. Return HTML snippet with PDF iframe or error log",
        "10. Update preview pane without page reload"
      ],
      "modes": {
        "auto_compile": "Compile on every change (debounced 500ms)",
        "manual_compile": "Compile only when button clicked"
      },
      "error_handling": [
        "Capture pdflatex stdout/stderr",
        "Parse .log file for detailed errors",
        "Display errors with line numbers",
        "Provide context-specific error messages",
        "Gracefully handle missing files/packages"
      ]
    },
    "5_pdf_preview": {
      "description": "Embedded PDF viewer with error display",
      "implementation": {
        "method": "iframe with PDF URL + cache-busting timestamp",
        "updates": "Replace iframe src on each compilation",
        "error_display": "Show compilation log in preview pane if PDF fails"
      },
      "download": {
        "format": "PDF",
        "naming": "project_name.pdf",
        "method": "Django FileResponse"
      }
    },
    "6_converter_integration": {
      "description": "Accept LaTeX code from external converter/OCR system",
      "integration_points": {
        "from_results_page": {
          "method": "POST request with LaTeX code",
          "url": "/editor/projects/new/",
          "parameters": {
            "name": "Project name (auto-generated or user-provided)",
            "latex_code": "LaTeX source code to insert",
            "latex_filename": "Filename for document (e.g., 'equation.tex')"
          },
          "workflow": [
            "1. User clicks 'Realtime Editor' button on results page",
            "2. Modal shows: Create new project or add to existing",
            "3. If new: POST to project_create with LaTeX code",
            "4. Backend creates project and document with LaTeX",
            "5. Redirect to document editor with auto-loaded code",
            "6. User can immediately compile and see PDF"
          ]
        },
        "from_url_parameters": {
          "method": "GET request with query params",
          "url": "/editor/projects/new/?latex=...&filename=...&name=...",
          "parameters": {
            "latex": "URL-encoded LaTeX code",
            "filename": "Document filename",
            "name": "Project name suggestion"
          },
          "use_case": "Direct link from converter results"
        }
      }
    }
  },

  "database_schema": {
    "models": {
      "Project": {
        "fields": {
          "id": "AutoField (primary key)",
          "owner": "ForeignKey(User) - project creator",
          "name": "CharField(max_length=200) - project title",
          "description": "TextField(blank=True) - optional description",
          "created_at": "DateTimeField(default=now) - creation timestamp"
        },
        "relationships": {
          "documents": "One-to-Many with Document",
          "folders": "One-to-Many with Folder",
          "binaries": "One-to-Many with BinaryFile",
          "compiles": "One-to-Many with CompileRun",
          "collaborators": "Many-to-Many through Collaborator"
        }
      },
      "Document": {
        "fields": {
          "id": "AutoField (primary key)",
          "project": "ForeignKey(Project, on_delete=CASCADE)",
          "folder": "ForeignKey(Folder, null=True, blank=True) - parent folder",
          "name": "CharField(max_length=200) - filename (e.g., 'main.tex')",
          "content": "TextField(default='') - LaTeX source code",
          "is_main": "BooleanField(default=False) - entry point for compilation",
          "updated_at": "DateTimeField(auto_now=True) - last edit timestamp"
        },
        "constraints": {
          "unique_together": ["project", "folder", "name"]
        },
        "properties": {
          "path": "Returns full path including folder structure"
        }
      },
      "Folder": {
        "fields": {
          "id": "AutoField (primary key)",
          "project": "ForeignKey(Project, on_delete=CASCADE)",
          "parent": "ForeignKey('self', null=True, blank=True) - parent folder for nesting",
          "name": "CharField(max_length=200) - folder name"
        },
        "constraints": {
          "unique_together": ["project", "parent", "name"]
        },
        "purpose": "Create hierarchical directory structure"
      },
      "BinaryFile": {
        "fields": {
          "id": "AutoField (primary key)",
          "project": "ForeignKey(Project, on_delete=CASCADE)",
          "folder": "ForeignKey(Folder, null=True, blank=True)",
          "file": "FileField(upload_to='project_files/') - actual file storage",
          "uploaded_at": "DateTimeField(auto_now_add=True)"
        },
        "constraints": {
          "unique_together": ["project", "folder", "file"]
        },
        "purpose": "Store images and other assets referenced in LaTeX"
      },
      "CompileRun": {
        "fields": {
          "id": "AutoField (primary key)",
          "project": "ForeignKey(Project, on_delete=CASCADE)",
          "status": "CharField - queued|running|success|error",
          "log": "TextField(blank=True) - compilation output and errors",
          "pdf": "FileField(upload_to='project_pdfs/', blank=True) - generated PDF",
          "finished_at": "DateTimeField(null=True) - completion time",
          "created_at": "DateTimeField(default=now) - start time"
        },
        "purpose": "Track each compilation attempt with output"
      },
      "Collaborator": {
        "fields": {
          "id": "AutoField (primary key)",
          "project": "ForeignKey(Project, on_delete=CASCADE)",
          "user": "ForeignKey(User, on_delete=CASCADE)",
          "role": "CharField - owner|editor|viewer"
        },
        "constraints": {
          "unique_together": ["project", "user"]
        },
        "purpose": "Multi-user collaboration with role-based permissions"
      },
      "Version": {
        "fields": {
          "id": "AutoField (primary key)",
          "document": "ForeignKey(Document, on_delete=CASCADE)",
          "content": "TextField - snapshot of document content",
          "message": "CharField(max_length=255) - commit message",
          "created_at": "DateTimeField(default=now)",
          "author": "ForeignKey(User, null=True)"
        },
        "purpose": "Version history for documents (optional feature)"
      }
    }
  },

  "api_endpoints": {
    "project_management": {
      "list_projects": {
        "url": "/editor/projects/",
        "method": "GET",
        "authentication": "login_required",
        "response": "HTML page with project list"
      },
      "create_project": {
        "url": "/editor/projects/new/",
        "methods": ["GET", "POST"],
        "authentication": "login_required",
        "GET": "Display project creation form (can pre-fill with LaTeX)",
        "POST": {
          "form_data": {
            "name": "Project name (required)",
            "description": "Project description (optional)",
            "latex_code": "LaTeX to insert (optional)",
            "latex_filename": "Document filename (optional)"
          },
          "success": "Redirect to project editor",
          "error": "Return form with validation errors"
        }
      },
      "delete_project": {
        "url": "/editor/projects/<int:pk>/delete/",
        "method": "POST",
        "authentication": "login_required + owner check",
        "action": "Delete project and all files",
        "success": "Redirect to project list"
      }
    },
    "editor_endpoints": {
      "document_editor": {
        "url": "/editor/projects/<int:pk>/docs/<int:doc_id>/",
        "method": "GET",
        "authentication": "login_required",
        "response": {
          "template": "editor/document_editor.html",
          "context": {
            "project": "Project object",
            "doc": "Current document",
            "form": "DocumentForm instance",
            "file_tree": "Hierarchical file structure",
            "new_doc_form": "NewDocumentForm (for modal)",
            "new_folder_form": "NewFolderForm (for modal)",
            "upload_binary_form": "UploadBinaryFileForm (for modal)",
            "latest_run": "Most recent successful CompileRun"
          }
        }
      },
      "live_compile": {
        "url": "/editor/projects/<int:pk>/docs/<int:doc_id>/live_compile/",
        "method": "POST",
        "authentication": "login_required",
        "content_type": "application/json",
        "request_body": {
          "content": "LaTeX source code (string)",
          "is_main": "Boolean - mark as main document"
        },
        "workflow": [
          "1. Parse JSON request body",
          "2. Update document content in database",
          "3. Update is_main flag (unset other docs if true)",
          "4. Create CompileRun record",
          "5. Call compile_latex_pdf service function",
          "6. Render pdf_frame.html with results",
          "7. Return JSON with HTML snippet"
        ],
        "response_success": {
          "html": "HTML string with iframe showing PDF or error log"
        },
        "response_error": {
          "error": "Error message",
          "status": 400
        }
      }
    },
    "file_management_ajax": {
      "create_folder": {
        "url": "/editor/projects/<int:pk>/ajax/create_folder/",
        "method": "POST",
        "authentication": "login_required + edit permission",
        "form_data": {
          "name": "Folder name",
          "folder_id": "Parent folder ID (null for root)"
        },
        "response_success": {
          "success": true
        },
        "response_error": {
          "error": "Error message (e.g., duplicate name)"
        }
      },
      "create_document": {
        "url": "/editor/projects/<int:pk>/ajax/create_document/",
        "method": "POST",
        "authentication": "login_required + edit permission",
        "form_data": {
          "name": "Document filename (e.g., 'chapter1.tex')",
          "folder_id": "Parent folder ID (null for root)"
        },
        "response_success": {
          "success": true,
          "url": "URL to new document editor"
        },
        "response_error": {
          "error": "Error message"
        }
      },
      "upload_binary": {
        "url": "/editor/projects/<int:pk>/ajax/upload_binary/",
        "method": "POST",
        "authentication": "login_required + edit permission",
        "content_type": "multipart/form-data",
        "form_data": {
          "file": "One or more files (images, PDFs, etc.)",
          "folder_id": "Parent folder ID (null for root)"
        },
        "response_success": {
          "success": true
        },
        "response_error": {
          "success": false,
          "error": "Error message(s)"
        }
      },
      "move_item": {
        "url": "/editor/projects/<int:pk>/ajax/move_item/",
        "method": "POST",
        "authentication": "login_required + edit permission",
        "content_type": "application/json",
        "request_body": {
          "item_type": "folder|document|binary",
          "item_id": "ID of item to move",
          "target_folder_id": "Destination folder ID (null for root)"
        },
        "response_success": {
          "success": true
        },
        "response_error": {
          "error": "Error message"
        }
      }
    },
    "file_serving": {
      "download_binary": {
        "url": "/editor/projects/<int:pk>/files/<int:file_id>/",
        "method": "GET",
        "authentication": "login_required + view permission",
        "purpose": "Serve binary files (used by LaTeX \\includegraphics)",
        "response": "FileResponse with appropriate MIME type"
      },
      "download_pdf": {
        "url": "/editor/projects/<int:pk>/compile/<int:run_id>/pdf/",
        "method": "GET",
        "authentication": "login_required",
        "parameters": {
          "t": "Timestamp (cache-busting for iframe)"
        },
        "response": "PDF file (inline for iframe, attachment for download)"
      },
      "pdf_frame": {
        "url": "/editor/projects/<int:pk>/pdf_frame/",
        "method": "GET",
        "authentication": "login_required",
        "purpose": "Render HTML snippet for PDF preview iframe",
        "response": "HTML with iframe or error message"
      }
    }
  },

  "compilation_service": {
    "function": "compile_latex_pdf(project, run)",
    "location": "editor/services.py",
    "workflow": {
      "step_1_validation": {
        "check": "pdflatex command exists",
        "error_if_missing": "Set run.status='error' with installation instructions"
      },
      "step_2_main_document": {
        "check": "Find document with is_main=True",
        "error_if_missing": "No main document error"
      },
      "step_3_temp_directory": {
        "action": "Create temporary directory for compilation",
        "naming": "proj_{project.id}_run_{run.id}_",
        "purpose": "Isolated environment for each compilation"
      },
      "step_4_write_files": {
        "action": "Call write_project_files_to_temp(project, tmpdir)",
        "details": {
          "text_files": "Write all .tex documents with correct paths",
          "binary_files": "Copy all uploaded images/assets",
          "folder_structure": "Recreate folder hierarchy in temp dir"
        }
      },
      "step_5_compile": {
        "command": [
          "pdflatex",
          "-interaction=nonstopmode",
          "-output-directory", "<tmpdir>",
          "<main_document_path>"
        ],
        "runs": 2,
        "reason_for_two_runs": "Resolve cross-references and table of contents",
        "timeout": "120 seconds per run",
        "capture": "stdout, stderr, and .log file"
      },
      "step_6_check_output": {
        "pdf_path": "<tmpdir>/<main_doc_name>.pdf",
        "success_criteria": "returncode == 0 AND PDF file exists",
        "partial_success": "PDF exists but returncode != 0 (warnings)",
        "failure": "No PDF file created"
      },
      "step_7_save_results": {
        "pdf": "Save to media storage as {project_id}_{run_id}.pdf",
        "log": "Save concatenated output (run 1 + run 2 + .log file)",
        "status": "success|error",
        "finished_at": "Set timestamp"
      },
      "step_8_cleanup": {
        "action": "Delete temporary directory",
        "purpose": "Free disk space"
      }
    },
    "error_handling": {
      "timeout": "120 second timeout with descriptive error",
      "missing_packages": "Detect package errors in log and suggest installation",
      "missing_images": "Detect file-not-found errors and guide user to upload files",
      "syntax_errors": "Show LaTeX error messages with line numbers",
      "permission_errors": "Handle file system permission issues"
    }
  },

  "frontend_implementation": {
    "ace_editor_setup": {
      "cdn_includes": [
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/ace.js",
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/mode-latex.js",
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/theme-monokai.js"
      ],
      "initialization": {
        "target_element": "#editor",
        "mode": "ace/mode/latex",
        "theme": "ace/theme/monokai",
        "options": {
          "fontSize": "14px",
          "showPrintMargin": false,
          "highlightActiveLine": true,
          "showGutter": true,
          "wrap": true
        }
      },
      "content_sync": {
        "from_textarea": "Load initial content from hidden textarea",
        "to_textarea": "Update textarea on editor change (for form submission)",
        "purpose": "Maintain compatibility with Django forms"
      }
    },
    "live_compile_javascript": {
      "debouncing": {
        "delay": "500ms",
        "purpose": "Avoid excessive API calls during typing",
        "implementation": "setTimeout with clearTimeout"
      },
      "compile_function": {
        "name": "performLiveCompile()",
        "workflow": [
          "1. Get content from Ace Editor",
          "2. Disable compile button (prevent double-click)",
          "3. Send POST to live_compile endpoint",
          "4. Parse JSON response with HTML snippet",
          "5. Update preview pane with new content",
          "6. Re-enable compile button"
        ],
        "fetch_options": {
          "method": "POST",
          "headers": {
            "Content-Type": "application/json",
            "X-CSRFToken": "Django CSRF token from cookie"
          },
          "body": "JSON.stringify({content: editorContent, is_main: true})"
        }
      },
      "auto_compile": {
        "toggle": "Checkbox to enable/disable auto-compile",
        "event_listener": "editor.session.on('change', handler)",
        "handler": "Call debouncedLiveCompile() if toggle is checked"
      }
    },
    "file_tree": {
      "rendering": {
        "method": "Recursive template (_file_tree.html)",
        "structure": "Nested <ul><li> with indent levels",
        "icons": "Bootstrap Icons for folders, documents, images"
      },
      "interactions": {
        "folder_collapse": "Click to toggle child visibility",
        "document_open": "Click to load in editor",
        "drag_and_drop": "Move files/folders (future enhancement)",
        "context_menu": "Right-click for rename/delete (future enhancement)"
      }
    },
    "modals": {
      "new_folder_modal": {
        "trigger": "Click 'New Folder' button",
        "form": "NewFolderForm with name and parent folder",
        "submission": "AJAX POST to folder_create_ajax",
        "success": "Close modal, refresh file tree"
      },
      "new_document_modal": {
        "trigger": "Click 'New File' button",
        "form": "NewDocumentForm with name and parent folder",
        "submission": "AJAX POST to document_create_ajax",
        "success": "Redirect to new document editor"
      },
      "upload_file_modal": {
        "trigger": "Click 'Upload File' button",
        "form": "UploadBinaryFileForm with file input and parent folder",
        "submission": "AJAX POST with FormData (multipart/form-data)",
        "success": "Close modal, refresh file tree"
      }
    }
  },

  "integration_with_converter": {
    "overview": "Allow users to transfer LaTeX code from converter results to live editor",
    "user_flow": {
      "step_1": "User converts image to LaTeX using OCR/AI converter",
      "step_2": "Results page displays LaTeX code with 'Realtime Editor' button",
      "step_3": "User clicks button, modal opens with two options:",
      "option_a": "Create New Project - opens project creation form with pre-filled LaTeX",
      "option_b": "Add to Existing Project - lists user's projects, select one to append",
      "step_4": "Form submission creates/updates project with LaTeX code",
      "step_5": "User redirected to editor with code ready for compilation"
    },
    "implementation_details": {
      "results_page_button": {
        "location": "templates/converter/results.html",
        "html": "<button onclick=\"openInRealtimeEditor(imageId, latexText, filename)\">Realtime Editor</button>",
        "javascript_function": {
          "name": "openInRealtimeEditor(imageId, latexText, filename)",
          "action": "Show modal with project selection options"
        }
      },
      "modal_structure": {
        "title": "Open in Realtime Editor",
        "option_1": {
          "label": "Create New Project",
          "action": "POST to /editor/projects/new/ with latex_code",
          "form_fields": {
            "name": "Auto-generated from filename or user input",
            "latex_code": "LaTeX source from converter",
            "latex_filename": "Document filename (e.g., 'equation_123.tex')"
          }
        },
        "option_2": {
          "label": "Add to Existing Project",
          "action": "Fetch user's projects, let user select",
          "then": "POST to /editor/projects/<pk>/ajax/create_document/ with LaTeX as content"
        }
      },
      "backend_handling": {
        "project_create_view": {
          "check_for_latex": "if 'latex_code' in request.POST",
          "create_project": "Project.objects.create(name=..., owner=request.user)",
          "create_document": "Document.objects.create(project=project, content=latex_code, is_main=True)",
          "redirect": "redirect('editor:document_editor', pk=project.pk, doc_id=doc.pk)"
        }
      }
    }
  },

  "default_latex_template": {
    "description": "Comprehensive template created for new projects",
    "content": "\\documentclass{article}\n\n% Math packages\n\\usepackage{amsmath}\n\\usepackage{amssymb}\n\\usepackage{amsfonts}\n\\usepackage{mathtools}\n\n% Table packages\n\\usepackage{array}\n\\usepackage{tabularx}\n\\usepackage{booktabs}\n\\usepackage{multirow}\n\\usepackage{longtable}\n\n% Graphics\n\\usepackage{graphicx}\n\\usepackage{tikz}\n\\usetikzlibrary{shapes,arrows,positioning}\n\n% Other packages\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage{xcolor}\n\\usepackage{hyperref}\n\n\\title{My Document}\n\\author{Your Name}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section{Introduction}\nYour content here...\n\n\\end{document}",
    "packages_included": [
      "amsmath, amssymb, amsfonts, mathtools - Advanced math",
      "array, tabularx, booktabs, multirow, longtable - Tables",
      "graphicx, tikz - Graphics and diagrams",
      "inputenc, fontenc - Character encoding",
      "xcolor - Colors",
      "hyperref - Clickable links"
    ]
  },

  "security_considerations": {
    "authentication": {
      "all_endpoints": "@login_required decorator",
      "purpose": "Prevent anonymous access"
    },
    "authorization": {
      "project_access": "Check owner or collaborator relationship",
      "edit_permission": "user_can_edit(project, user) function",
      "roles": ["owner", "editor", "viewer"]
    },
    "csrf_protection": {
      "django_middleware": "CSRF token required for all POST requests",
      "ajax_requests": "Include X-CSRFToken header from cookie"
    },
    "file_upload": {
      "validation": "Check file extensions and MIME types",
      "storage": "Store in MEDIA_ROOT with unique paths",
      "serving": "Use Django FileResponse (not direct file system access)"
    },
    "latex_compilation": {
      "isolation": "Use temporary directories (prevents file system pollution)",
      "timeout": "120 second limit (prevents infinite loops/CPU attacks)",
      "shell_injection_prevention": "Use subprocess with list arguments (not shell=True)",
      "cleanup": "Always delete temp directories (prevent disk space exhaustion)"
    }
  },

  "performance_optimizations": {
    "database": {
      "indexes": "Add indexes on project.owner, document.project, compilerun.project",
      "select_related": "Use select_related('project', 'folder') to reduce queries",
      "prefetch_related": "Prefetch documents and folders when loading file tree"
    },
    "compilation": {
      "async_consideration": "Consider Celery for background compilation (future)",
      "caching": "Cache compiled PDFs (current approach)",
      "cleanup": "Delete old CompileRun records periodically"
    },
    "static_files": {
      "cdn": "Use CDN for Ace Editor, Tailwind CSS",
      "compression": "Enable gzip compression in production",
      "collectstatic": "Run python manage.py collectstatic for production"
    }
  },

  "deployment_checklist": {
    "requirements": [
      "Python 3.13+",
      "Django 5.2.6",
      "pdflatex installed (MiKTeX or TeX Live)",
      "LaTeX packages: amsmath, graphicx, tikz, etc.",
      "Storage for media files (local or S3)"
    ],
    "settings": {
      "MEDIA_ROOT": "Path for uploaded files and PDFs",
      "MEDIA_URL": "/media/",
      "LOGIN_URL": "/accounts/login/",
      "INSTALLED_APPS": ["editor", "converter", "django.contrib.auth", ...]
    },
    "urls": {
      "include_editor_urls": "path('editor/', include('editor.urls'))",
      "serve_media": "In development, add urlpattern for serving MEDIA_URL"
    },
    "migrations": {
      "create": "python manage.py makemigrations editor",
      "apply": "python manage.py migrate"
    },
    "static_files": {
      "collect": "python manage.py collectstatic",
      "serve": "Configure nginx/Apache to serve /static/ and /media/"
    }
  },

  "testing_guide": {
    "unit_tests": {
      "models": "Test unique constraints, relationships, properties",
      "services": "Mock pdflatex, test file writing and compilation logic",
      "views": "Test permissions, form validation, AJAX responses"
    },
    "integration_tests": {
      "end_to_end": "Create project → upload LaTeX → compile → verify PDF",
      "converter_integration": "POST LaTeX from converter → verify project creation"
    },
    "manual_testing": {
      "create_project": "Test with and without LaTeX code",
      "edit_document": "Type in editor, verify auto-save",
      "compile": "Test both auto and manual compile modes",
      "errors": "Test with invalid LaTeX, missing packages, missing images",
      "file_management": "Create folders, upload images, move files",
      "multi_user": "Test collaboration with different roles"
    }
  },

  "troubleshooting": {
    "pdflatex_not_found": {
      "error": "'pdflatex' command not found",
      "solution": "Install MiKTeX (Windows) or TeX Live (Linux/Mac)",
      "verification": "Run 'pdflatex --version' in terminal"
    },
    "compilation_timeout": {
      "error": "Compilation timed out after 120 seconds",
      "causes": ["Infinite loop in LaTeX", "Very large document", "Missing \\end{document}"],
      "solution": "Review LaTeX for errors, simplify document, increase timeout"
    },
    "missing_packages": {
      "error": "! LaTeX Error: File `xyz.sty' not found",
      "solution": "Install package using MiKTeX Package Manager or tlmgr",
      "common_packages": ["amsmath", "graphicx", "tikz", "booktabs"]
    },
    "image_not_found": {
      "error": "! LaTeX Error: File `image.jpg' not found",
      "solution": "Upload image to project using 'Upload File' button",
      "note": "Converter-generated LaTeX doesn't include original images"
    },
    "csrf_error": {
      "error": "403 Forbidden (CSRF)",
      "solution": "Ensure CSRF token is included in AJAX requests",
      "implementation": "Add X-CSRFToken header from cookie"
    }
  },

  "future_enhancements": {
    "1_real_time_collaboration": {
      "description": "Multiple users editing simultaneously",
      "technology": "WebSockets (Django Channels) + Operational Transformation",
      "similar_to": "Google Docs"
    },
    "2_git_integration": {
      "description": "Version control for LaTeX projects",
      "features": ["Commit", "Diff", "Branch", "Merge"],
      "implementation": "GitPython library"
    },
    "3_snippet_library": {
      "description": "Reusable LaTeX code snippets",
      "examples": ["Common equations", "Table templates", "TikZ diagrams"],
      "ui": "Drag and drop from sidebar"
    },
    "4_citation_management": {
      "description": "BibTeX integration for references",
      "features": ["Upload .bib files", "Search citations", "Insert \\cite{}"],
      "compilation": "Run bibtex in addition to pdflatex"
    },
    "5_advanced_error_parsing": {
      "description": "Parse LaTeX errors and show in editor",
      "features": ["Highlight error lines", "Clickable error messages", "Suggestions"],
      "implementation": "Regex parsing of .log file"
    },
    "6_template_gallery": {
      "description": "Pre-built templates for common document types",
      "examples": ["Research paper", "Resume", "Presentation (Beamer)", "Book"],
      "implementation": "Template model with preview images"
    },
    "7_ai_assistance": {
      "description": "AI-powered LaTeX help",
      "features": ["Fix syntax errors", "Suggest improvements", "Generate LaTeX from description"],
      "integration": "OpenAI API or similar"
    }
  },

  "file_structure": {
    "app_directory": "editor/",
    "key_files": {
      "models.py": "Database models (Project, Document, Folder, etc.)",
      "views.py": "View functions and API endpoints",
      "services.py": "Compilation service and file management",
      "urls.py": "URL routing for editor app",
      "forms.py": "Django forms for project/document creation",
      "templates/editor/": {
        "document_editor.html": "Main editor interface with Ace Editor",
        "project_list.html": "List of user's projects",
        "project_form.html": "Project creation form",
        "pdf_frame.html": "PDF preview iframe content",
        "_file_tree.html": "Recursive file tree template",
        "_modals.html": "Modal dialogs for file operations"
      },
      "static/editor/": {
        "css/": "Custom styles for editor",
        "js/": "JavaScript for Ace Editor integration"
      }
    }
  },

  "converter_app_integration": {
    "description": "How the converter app passes LaTeX to the editor",
    "results_page": {
      "template": "templates/converter/results.html",
      "latex_display": "Shows converted LaTeX in <pre> tag with copy button",
      "editor_button": {
        "html": "<button onclick=\"openInRealtimeEditor(...)\">Realtime Editor</button>",
        "function": "openInRealtimeEditor(imageId, latexText, filename)",
        "modal": "Shows project selection (new or existing)",
        "form_submission": {
          "method": "POST",
          "url": "/editor/projects/new/",
          "data": {
            "name": "Project name from modal input",
            "latex_code": "LaTeX from converter result",
            "latex_filename": "Filename suggestion (e.g., 'equation_123.tex')"
          }
        }
      }
    },
    "data_flow": {
      "step_1": "User converts image using converter app",
      "step_2": "Converter generates LaTeX, saves to UploadedImage model",
      "step_3": "Results page displays LaTeX with 'Realtime Editor' button",
      "step_4": "User clicks button, JavaScript shows modal",
      "step_5": "User fills project name, clicks submit",
      "step_6": "JavaScript POSTs to /editor/projects/new/",
      "step_7": "Editor view creates Project and Document",
      "step_8": "Redirects to document_editor view",
      "step_9": "Ace Editor loads with LaTeX pre-filled",
      "step_10": "User can immediately compile or edit"
    }
  },

  "complete_implementation_summary": {
    "backend_components": [
      "Django models for projects, documents, folders, binaries, compile runs",
      "Views for project management, editor interface, AJAX endpoints",
      "Compilation service using pdflatex subprocess",
      "File management utilities for temp directories",
      "Authentication and authorization checks",
      "Error handling with detailed user feedback"
    ],
    "frontend_components": [
      "Ace Editor for LaTeX syntax highlighting",
      "Tailwind CSS for responsive UI",
      "AJAX for live compilation without page reload",
      "Debounced auto-compile on editor change",
      "File tree with folders and documents",
      "Modals for creating files/folders",
      "PDF preview iframe with error display",
      "Integration with converter via modal and form POST"
    ],
    "user_experience": [
      "Create projects from scratch or from converter",
      "Edit LaTeX with professional code editor",
      "See PDF preview in real-time (auto-compile or manual)",
      "Organize files in folders",
      "Upload images for \\includegraphics",
      "Download compiled PDFs",
      "View detailed error messages if compilation fails",
      "Seamless transfer from converter results"
    ]
  },

  "quick_start_guide": {
    "step_1_install_dependencies": [
      "pip install django==5.2.6 pillow python-dotenv",
      "Install pdflatex (MiKTeX or TeX Live)"
    ],
    "step_2_create_django_project": [
      "django-admin startproject myproject",
      "cd myproject",
      "python manage.py startapp editor",
      "python manage.py startapp converter"
    ],
    "step_3_copy_models": [
      "Copy models from this prompt to editor/models.py",
      "python manage.py makemigrations",
      "python manage.py migrate"
    ],
    "step_4_copy_views_and_services": [
      "Copy views.py and services.py from this prompt",
      "Update urls.py to include editor.urls",
      "Configure MEDIA_ROOT and MEDIA_URL in settings.py"
    ],
    "step_5_create_templates": [
      "Create templates/editor/ directory",
      "Copy document_editor.html and other templates",
      "Include Ace Editor CDN in template"
    ],
    "step_6_test_locally": [
      "python manage.py createsuperuser",
      "python manage.py runserver",
      "Login and create a project",
      "Test compilation"
    ],
    "step_7_integrate_converter": [
      "Add 'Realtime Editor' button to converter results",
      "Implement openInRealtimeEditor JavaScript function",
      "Test LaTeX transfer from converter to editor"
    ]
  },

  "key_urls_reference": {
    "editor_urls": {
      "project_list": "/editor/projects/",
      "project_create": "/editor/projects/new/",
      "project_detail": "/editor/projects/<pk>/",
      "document_editor": "/editor/projects/<pk>/docs/<doc_id>/",
      "live_compile": "/editor/projects/<pk>/docs/<doc_id>/live_compile/",
      "download_pdf": "/editor/projects/<pk>/compile/<run_id>/pdf/",
      "create_folder_ajax": "/editor/projects/<pk>/ajax/create_folder/",
      "create_document_ajax": "/editor/projects/<pk>/ajax/create_document/",
      "upload_binary_ajax": "/editor/projects/<pk>/ajax/upload_binary/"
    }
  },

  "conclusion": {
    "summary": "This is a complete, production-ready LaTeX live editor with real-time compilation, file management, and seamless integration with an AI-powered LaTeX converter. The system handles complex projects with multiple files, supports hierarchical folder structures, provides instant PDF preview, and offers robust error handling. The integration with the converter allows users to go from images to editable, compilable LaTeX projects in seconds.",
    "production_readiness": "The system is designed for scalability, security, and user-friendliness. With proper deployment (Django in production mode, pdflatex installed, media files properly served), it can handle dozens of concurrent users compiling LaTeX documents in real-time.",
    "extensibility": "The modular design allows easy addition of features like real-time collaboration, version control, citation management, and AI assistance. The clean separation between models, views, services, and templates makes the codebase maintainable and testable."
  }
}
