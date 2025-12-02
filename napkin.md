# NapkinFlow Integration Guide for Existing Django Project
## Adding Visual Generation Service to Your Django + HTML/CSS Project

---

## 📋 Overview

This guide helps you integrate NapkinFlow's AI visual generation as a Django app into your existing project that uses raw HTML/CSS (no React required).

**What you'll get:**
- AI-powered text-to-visual generation
- 15 professional visual styles
- Visual management (download, duplicate, regenerate, delete)
- PDF export functionality
- Works with your existing HTML templates

---

## 🚀 Quick Start Integration

### Step 1: Copy the Django Apps

```bash
# Navigate to your Django project root
cd /path/to/your/project

# Copy the visuals app
cp -r /path/to/napkinflow/backend/visuals/ ./

# Optional: Copy documents app if you want document management
cp -r /path/to/napkinflow/backend/documents/ ./
```

### Step 2: Update Your `settings.py`

```python
# settings.py

INSTALLED_APPS = [
    # ... your existing apps
    'visuals',  # Add this
    # 'documents',  # Optional: only if you need document management
]

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Environment variables (you already have these in .env)
import environ
env = environ.Env()
environ.Env.read_env()  # reads the .env file

NAPKIN_API_KEY = env('NAPKIN_API_KEY')
NAPKIN_API_URL = env('NAPKIN_API_URL', default='https://api.napkin.ai/v1')

# CORS (if needed for AJAX calls)
# If you're making AJAX calls from your frontend:
CORS_ALLOWED_ORIGINS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    # Add your production domain
]
```

### Step 3: Update Your `urls.py`

```python
# your_project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... your existing URLs
    path('admin/', admin.site.urls),
    
    # Add NapkinFlow URLs
    path('api/visuals/', include('visuals.urls')),
    # path('api/documents/', include('documents.urls')),  # Optional
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Step 4: Install Backend Dependencies

```bash
pip install reportlab==4.4.5 pypdf==6.4.0 Pillow requests
```

### Step 5: Run Migrations

```bash
python manage.py makemigrations visuals
# python manage.py makemigrations documents  # If using documents app
python manage.py migrate
```

### Step 6: Test the Installation

```bash
# Start your Django server
python manage.py runserver

# Test the API endpoint
curl http://localhost:8000/api/visuals/options/
```

---

## 🎨 Frontend Integration (HTML/CSS/Vanilla JS)

Since you're using raw HTML/CSS, here's how to integrate without React:

### Option A: Create a Visual Generation Page

Create a new HTML template in your Django templates directory:

```html
<!-- templates/visual_generator.html -->
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        textarea {
            width: 100%;
            min-height: 200px;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .style-selector {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .style-option {
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            transition: all 0.3s;
        }
        .style-option:hover {
            border-color: #4CAF50;
            background-color: #f0f8f0;
        }
        .style-option.selected {
            border-color: #4CAF50;
            background-color: #e8f5e9;
        }
        .btn {
            padding: 12px 30px;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-primary {
            background-color: #4CAF50;
            color: white;
        }
        .btn-primary:hover {
            background-color: #45a049;
        }
        .btn-primary:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .loading {
            display: none;
            text-align: center;
            margin: 20px 0;
        }
        .loading.active {
            display: block;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4CAF50;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .visual-result {
            display: none;
            margin-top: 30px;
        }
        .visual-result.active {
            display: block;
        }
        .visual-result img {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .visual-actions {
            margin-top: 15px;
            display: flex;
            gap: 10px;
        }
        .error-message {
            display: none;
            padding: 15px;
            background-color: #ffebee;
            color: #c62828;
            border-radius: 4px;
            margin: 20px 0;
        }
        .error-message.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Visual Generator</h1>
        <p>Select text (minimum 50 characters) and generate professional visuals</p>
        
        <textarea id="textInput" placeholder="Enter your text here (minimum 50 characters)..."></textarea>
        
        <div id="styleSelector" class="style-selector">
            <!-- Styles will be loaded dynamically -->
        </div>
        
        <button id="generateBtn" class="btn btn-primary" disabled>Generate Visual</button>
        
        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Generating your visual... This may take 10-30 seconds</p>
        </div>
        
        <div id="errorMessage" class="error-message"></div>
        
        <div id="visualResult" class="visual-result">
            <h2>Generated Visual</h2>
            <img id="visualImage" src="" alt="Generated Visual">
            <div class="visual-actions">
                <button id="downloadBtn" class="btn btn-primary">Download</button>
                <button id="duplicateBtn" class="btn btn-primary">Duplicate</button>
                <button id="regenerateBtn" class="btn btn-primary">Regenerate</button>
                <button id="exportPdfBtn" class="btn btn-primary">Export PDF</button>
            </div>
        </div>
    </div>

    <script>
        // CSRF token for Django
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        const csrftoken = getCookie('csrftoken');

        // State
        let selectedStyle = null;
        let currentVisualId = null;
        let availableStyles = [];

        // DOM Elements
        const textInput = document.getElementById('textInput');
        const styleSelector = document.getElementById('styleSelector');
        const generateBtn = document.getElementById('generateBtn');
        const loading = document.getElementById('loading');
        const visualResult = document.getElementById('visualResult');
        const visualImage = document.getElementById('visualImage');
        const errorMessage = document.getElementById('errorMessage');

        // Load available styles
        async function loadStyles() {
            try {
                const response = await fetch('/api/visuals/options/');
                const data = await response.json();
                availableStyles = data.styles;
                
                styleSelector.innerHTML = availableStyles.map(style => `
                    <div class="style-option" data-style-id="${style.id}">
                        <strong>${style.name}</strong>
                        <div style="font-size: 12px; color: #666;">${style.category}</div>
                    </div>
                `).join('');

                // Add click handlers
                document.querySelectorAll('.style-option').forEach(option => {
                    option.addEventListener('click', () => {
                        document.querySelectorAll('.style-option').forEach(o => 
                            o.classList.remove('selected')
                        );
                        option.classList.add('selected');
                        selectedStyle = option.dataset.styleId;
                        checkGenerateButton();
                    });
                });

                // Select first style by default
                if (availableStyles.length > 0) {
                    document.querySelector('.style-option').click();
                }
            } catch (error) {
                showError('Failed to load visual styles');
                console.error(error);
            }
        }

        // Check if generate button should be enabled
        function checkGenerateButton() {
            const text = textInput.value.trim();
            generateBtn.disabled = !(text.length >= 50 && selectedStyle);
        }

        // Show error message
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.classList.add('active');
            setTimeout(() => {
                errorMessage.classList.remove('active');
            }, 5000);
        }

        // Generate visual
        async function generateVisual() {
            const text = textInput.value.trim();
            
            if (text.length < 50) {
                showError('Text must be at least 50 characters');
                return;
            }

            generateBtn.disabled = true;
            loading.classList.add('active');
            visualResult.classList.remove('active');

            try {
                const response = await fetch('/api/visuals/generate/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        document_id: 1, // You can make this dynamic based on your needs
                        selected_text: text,
                        format: 'png',
                        style_id: selectedStyle
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    currentVisualId = data.id;
                    visualImage.src = '/media/' + data.file_path;
                    visualResult.classList.add('active');
                } else {
                    showError(data.error || 'Failed to generate visual');
                }
            } catch (error) {
                showError('Network error. Please try again.');
                console.error(error);
            } finally {
                loading.classList.remove('active');
                generateBtn.disabled = false;
            }
        }

        // Download visual
        async function downloadVisual() {
            if (!currentVisualId) return;
            
            const link = document.createElement('a');
            link.href = visualImage.src;
            link.download = `visual_${currentVisualId}.png`;
            link.click();
        }

        // Duplicate visual
        async function duplicateVisual() {
            if (!currentVisualId) return;
            
            try {
                const response = await fetch(`/api/visuals/${currentVisualId}/duplicate/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Visual duplicated successfully!');
                    currentVisualId = data.id;
                    visualImage.src = '/media/' + data.file_path;
                } else {
                    showError('Failed to duplicate visual');
                }
            } catch (error) {
                showError('Network error');
            }
        }

        // Regenerate visual
        async function regenerateVisual() {
            if (!currentVisualId) return;
            
            loading.classList.add('active');
            
            try {
                const response = await fetch(`/api/visuals/${currentVisualId}/regenerate/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        style_id: selectedStyle
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    visualImage.src = '/media/' + data.file_path;
                } else {
                    showError('Failed to regenerate visual');
                }
            } catch (error) {
                showError('Network error');
            } finally {
                loading.classList.remove('active');
            }
        }

        // Export PDF
        async function exportPdf() {
            if (!currentVisualId) return;
            
            try {
                const response = await fetch(`/api/visuals/${currentVisualId}/export/pdf/`);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `visual_${currentVisualId}.pdf`;
                link.click();
            } catch (error) {
                showError('Failed to export PDF');
            }
        }

        // Event listeners
        textInput.addEventListener('input', checkGenerateButton);
        generateBtn.addEventListener('click', generateVisual);
        document.getElementById('downloadBtn').addEventListener('click', downloadVisual);
        document.getElementById('duplicateBtn').addEventListener('click', duplicateVisual);
        document.getElementById('regenerateBtn').addEventListener('click', regenerateVisual);
        document.getElementById('exportPdfBtn').addEventListener('click', exportPdf);

        // Initialize
        loadStyles();
    </script>
</body>
</html>
```

### Option B: Add to Existing Pages with AJAX

If you want to add visual generation to your existing pages:

```html
<!-- Add this to any existing template -->
<div id="visualGeneratorWidget">
    <button id="openVisualGenerator" class="btn">Generate Visual from Selected Text</button>
</div>

<!-- Modal -->
<div id="visualModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
    <div style="background: white; max-width: 800px; margin: 50px auto; padding: 30px; border-radius: 8px; max-height: 90vh; overflow-y: auto;">
        <h2>Generate Visual</h2>
        <div id="selectedTextDisplay" style="padding: 15px; background: #f5f5f5; margin: 15px 0; border-radius: 4px;"></div>
        
        <div id="modalStyles" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;"></div>
        
        <button id="generateFromModal" class="btn btn-primary">Generate</button>
        <button id="closeModal" class="btn">Cancel</button>
    </div>
</div>

<script>
    let selectedModalStyle = null;
    
    document.getElementById('openVisualGenerator').addEventListener('click', async () => {
        const selectedText = window.getSelection().toString().trim();
        
        if (selectedText.length < 50) {
            alert('Please select at least 50 characters');
            return;
        }
        
        document.getElementById('selectedTextDisplay').textContent = selectedText;
        
        // Load styles
        const response = await fetch('/api/visuals/options/');
        const data = await response.json();
        
        document.getElementById('modalStyles').innerHTML = data.styles.map(style => `
            <div class="modal-style-option" data-style-id="${style.id}" style="padding: 10px; border: 2px solid #ddd; cursor: pointer; text-align: center;">
                ${style.name}
            </div>
        `).join('');
        
        // Style selection
        document.querySelectorAll('.modal-style-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.modal-style-option').forEach(o => 
                    o.style.borderColor = '#ddd'
                );
                option.style.borderColor = '#4CAF50';
                selectedModalStyle = option.dataset.styleId;
            });
        });
        
        // Select first by default
        document.querySelector('.modal-style-option')?.click();
        
        document.getElementById('visualModal').style.display = 'block';
    });
    
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('visualModal').style.display = 'none';
    });
    
    document.getElementById('generateFromModal').addEventListener('click', async () => {
        const selectedText = document.getElementById('selectedTextDisplay').textContent;
        
        try {
            const response = await fetch('/api/visuals/generate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    document_id: 1, // Make dynamic
                    selected_text: selectedText,
                    format: 'png',
                    style_id: selectedModalStyle
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                alert('Visual generated successfully!');
                // You can display the visual or redirect to a page showing it
                window.location.href = `/visuals/${data.id}/`;
            }
        } catch (error) {
            alert('Failed to generate visual');
        }
        
        document.getElementById('visualModal').style.display = 'none';
    });
</script>
```

---

## 🔧 Django Views Integration

Create a view to serve the visual generator page:

```python
# your_app/views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required  # If you want authentication
def visual_generator(request):
    """Visual generator page"""
    return render(request, 'visual_generator.html')

# Optional: List visuals for a user
@login_required
def my_visuals(request):
    """Display user's generated visuals"""
    from visuals.models import Visual
    
    visuals = Visual.objects.filter(
        document__owner=request.user  # Adjust based on your model structure
    ).order_by('-created_at')
    
    return render(request, 'my_visuals.html', {'visuals': visuals})
```

Add URL patterns:

```python
# your_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # ... your existing URLs
    path('visual-generator/', views.visual_generator, name='visual_generator'),
    path('my-visuals/', views.my_visuals, name='my_visuals'),
]
```

---

## 🔌 Connecting to Your Existing Models

If you want to attach visuals to your existing content models:

```python
# visuals/models.py - Modify the Visual model

from django.db import models
from django.conf import settings
# Import your existing model
from your_app.models import YourContentModel

class Visual(models.Model):
    # Change this line:
    # document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='visuals')
    
    # To this (pointing to your model):
    content = models.ForeignKey(
        YourContentModel, 
        on_delete=models.CASCADE, 
        related_name='visuals'
    )
    
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_visuals'
    )
    
    # ... rest of the fields remain the same
```

Update the serializer:

```python
# visuals/serializers.py

class VisualSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visual
        fields = [
            'id', 'content', 'owner',  # Changed from 'document'
            'file_path', 'format', 'status',
            'selected_text', 'napkin_request_id',
            'style_id', 'visual_type',
            'created_at', 'updated_at'
        ]
```

---

## 📊 Display Visuals in Your Templates

Create a template to display visuals:

```html
<!-- templates/my_visuals.html -->
{% load static %}
<!DOCTYPE html>
<html>
<head>
    <title>My Visuals</title>
    <style>
        .visual-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .visual-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: white;
        }
        .visual-card img {
            width: 100%;
            border-radius: 4px;
        }
        .visual-meta {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
        .visual-actions {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }
        .btn-small {
            padding: 5px 10px;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #4CAF50;
            color: white;
        }
    </style>
</head>
<body>
    <h1>My Generated Visuals</h1>
    
    <div class="visual-grid">
        {% for visual in visuals %}
        <div class="visual-card">
            <img src="{{ MEDIA_URL }}{{ visual.file_path }}" alt="Visual">
            <div class="visual-meta">
                <div>Created: {{ visual.created_at|date:"M d, Y" }}</div>
                <div>Format: {{ visual.format|upper }}</div>
                <div>Status: {{ visual.status }}</div>
            </div>
            <div class="visual-actions">
                <a href="{{ MEDIA_URL }}{{ visual.file_path }}" download class="btn-small">Download</a>
                <button onclick="duplicateVisual({{ visual.id }})" class="btn-small">Duplicate</button>
                <button onclick="deleteVisual({{ visual.id }})" class="btn-small" style="background: #f44336;">Delete</button>
            </div>
        </div>
        {% empty %}
        <p>No visuals generated yet. <a href="{% url 'visual_generator' %}">Generate your first visual</a></p>
        {% endfor %}
    </div>

    <script>
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        async function duplicateVisual(visualId) {
            try {
                const response = await fetch(`/api/visuals/${visualId}/duplicate/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });
                if (response.ok) {
                    alert('Visual duplicated!');
                    location.reload();
                }
            } catch (error) {
                alert('Failed to duplicate');
            }
        }

        async function deleteVisual(visualId) {
            if (!confirm('Delete this visual?')) return;
            
            try {
                const response = await fetch(`/api/visuals/${visualId}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });
                if (response.ok) {
                    location.reload();
                }
            } catch (error) {
                alert('Failed to delete');
            }
        }
    </script>
</body>
</html>
```

---

## ✅ Testing Checklist

- [ ] Django server starts without errors
- [ ] `/api/visuals/options/` returns 15 styles
- [ ] Can access visual generator page
- [ ] Text selection works (50+ characters)
- [ ] Style selection works
- [ ] Visual generation completes (10-30 seconds)
- [ ] Generated image displays correctly
- [ ] Download button works
- [ ] Duplicate button creates new visual
- [ ] Regenerate button works with different styles
- [ ] PDF export downloads file
- [ ] Delete button removes visual
- [ ] Media files serve correctly

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Module not found: visuals` | Make sure you copied the visuals folder correctly and added it to INSTALLED_APPS |
| `NAPKIN_API_KEY not found` | Check your .env file is in the right location and loaded properly |
| `CSRF verification failed` | Make sure you're including the CSRF token in POST requests |
| `404 on media files` | Check MEDIA_URL and MEDIA_ROOT settings, ensure urlpatterns includes static() |
| `IntegrityError on Visual creation` | Check if you've run migrations: `python manage.py migrate` |
| Images not displaying | Check file permissions on media folder: `chmod -R 755 media/` |

---

## 🎯 Next Steps

1. **Customize the UI**: Modify the HTML/CSS to match your project's design
2. **Add Authentication**: Protect endpoints with `@login_required` or DRF permissions
3. **Connect to Your Models**: Update the Visual model to reference your content models
4. **Add to Navigation**: Add links to visual generator in your main navigation
5. **Optimize**: Add caching, compression, and CDN for production

---

## 📚 API Reference Quick Guide

```bash
# Get available styles and types
GET /api/visuals/options/

# Generate a visual
POST /api/visuals/generate/
{
    "document_id": 1,
    "selected_text": "Your text here (50+ chars)",
    "format": "png",
    "style_id": "CDQPRVVJCSTPRBBCD5Q6AWR"
}

# List visuals
GET /api/visuals/?document=1

# Duplicate visual
POST /api/visuals/{id}/duplicate/

# Regenerate with different style
POST /api/visuals/{id}/regenerate/
{"style_id": "CDC6VV6DST10"}

# Export as PDF
GET /api/visuals/{id}/export/pdf/

# Delete visual
DELETE /api/visuals/{id}/
```

---

## 🎉 You're All Set!

Your Django project now has AI-powered visual generation capabilities! The visuals app integrates seamlessly with your existing HTML/CSS frontend without requiring React.

**Questions?** Check the troubleshooting section or refer to the full NapkinFlow documentation.