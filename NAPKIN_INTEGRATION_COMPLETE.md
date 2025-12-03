# Napkin AI Integration - Quick Start

## ✅ Integration Complete!

The Napkin AI visual generation service has been successfully integrated into MathScriber.

## 🚀 What's Been Added

### 1. New App: `visuals`

- Full Django app for visual generation
- REST API with Django REST Framework
- Web interface for creating and managing visuals
- 15 professional visual styles from Napkin AI

### 2. Navigation Updates

- Added "Visuals" link in main navigation
- Desktop and mobile navigation updated
- Direct access from any page

### 3. Database Setup

- Created `Visual` model for storing generated visuals
- Created `VisualStyle` model for caching available styles
- Migrations applied successfully
- 15 Napkin styles loaded into database

### 4. Configuration

- Environment variables: NAPKIN_API_KEY and NAPKIN_API_URL
- REST Framework configured
- Media directory created: `media/visuals/`

## 🎨 How to Use

### Web Interface

1. **Access the Visual Generator**:

   ```
   http://127.0.0.1:8000/visuals/generator/
   ```

   OR click "Visuals" in the navigation bar

2. **Create Your First Visual**:

   - Enter text content (minimum 50 characters)
   - Select a visual style (15 options available)
   - Choose format: PNG, SVG, or PowerPoint
   - Click "Generate Visual"
   - Wait 10-30 seconds for generation

3. **View Your Visuals**:
   ```
   http://127.0.0.1:8000/visuals/gallery/
   ```

### API Usage

#### Example: Generate Visual via API

```python
import requests

url = "http://127.0.0.1:8000/visuals/api/generate/"
data = {
    "content": "Machine learning involves training algorithms on data to make predictions and decisions without explicit programming.",
    "context": "For a technical presentation on AI",
    "format": "png",
    "style_id": "CDQPRVVJCSTPRBBCD5Q6AWR",  # Vibrant Strokes
    "color_mode": "light",
    "orientation": "horizontal"
}

response = requests.post(url, json=data)
visual = response.json()

print(f"Visual ID: {visual['id']}")
print(f"Status: {visual['status']}")
print(f"File: {visual['file_path']}")
```

#### Example: Get Available Styles

```python
import requests

url = "http://127.0.0.1:8000/visuals/api/options/"
response = requests.get(url)
options = response.json()

print(f"Available styles: {len(options['styles'])}")
for style in options['styles']:
    print(f"- {style['name']} ({style['category']}): {style['id']}")
```

## 📁 Project Structure

```
D:\HP\D\Mathscriber AI\
├── visuals/                      # New app
│   ├── models.py                 # Visual, VisualStyle models
│   ├── views.py                  # API + template views
│   ├── services.py               # Napkin API integration
│   ├── urls.py                   # URL routing
│   ├── admin.py                  # Admin interface
│   ├── serializers.py            # REST serializers
│   ├── templates/visuals/        # HTML templates
│   │   ├── generator.html        # Main generator interface
│   │   ├── gallery.html          # Visual gallery
│   │   └── detail.html           # Visual detail view
│   ├── management/commands/      # Management commands
│   │   └── load_napkin_styles.py # Load Napkin styles
│   └── README.md                 # Comprehensive documentation
├── media/visuals/                # Generated visuals storage
├── MathScriber/
│   ├── settings.py               # Updated with REST + Napkin config
│   └── urls.py                   # Updated with visuals routes
├── templates/base.html           # Updated navigation
└── requirements.txt              # Added djangorestframework
```

## 🎨 Available Visual Styles

### Colorful (5 styles)

- Vibrant Strokes
- Glowful Breeze
- Bold Canvas
- Radiant Blocks
- Pragmatic Shades

### Casual (2 styles)

- Carefree Mist
- Lively Layers

### Hand-drawn (2 styles)

- Artistic Flair
- Sketch Notes

### Formal (4 styles)

- Elegant Outline
- Subtle Accent
- Monochrome Pro
- Corporate Clean

### Monochrome (2 styles)

- Minimal Contrast
- Silver Beam

## 📋 API Endpoints

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| GET    | `/visuals/api/options/`         | Get available styles and formats |
| POST   | `/visuals/api/generate/`        | Generate new visual (simple)     |
| GET    | `/visuals/api/`                 | List all visuals                 |
| GET    | `/visuals/api/{id}/`            | Get visual details               |
| POST   | `/visuals/api/{id}/regenerate/` | Regenerate with new style        |
| POST   | `/visuals/api/{id}/duplicate/`  | Duplicate visual                 |
| DELETE | `/visuals/api/{id}/`            | Delete visual                    |

## 🔧 Management Commands

```bash
# Load/update Napkin AI styles
python manage.py load_napkin_styles

# Create migrations (if needed)
python manage.py makemigrations visuals

# Apply migrations
python manage.py migrate visuals
```

## ⚙️ Configuration Files Modified

1. **MathScriber/settings.py**:

   - Added `rest_framework` to INSTALLED_APPS
   - Added `visuals` to INSTALLED_APPS
   - Added REST_FRAMEWORK configuration
   - Added Napkin API settings

2. **MathScriber/urls.py**:

   - Added `path("visuals/", include('visuals.urls'))`

3. **templates/base.html**:

   - Added "Visuals" link in desktop navigation
   - Added "Visual Generator" link in mobile navigation

4. **requirements.txt**:

   - Added `djangorestframework==3.15.2`

5. **.env** (already had):
   - NAPKIN_API_KEY
   - NAPKIN_API_URL

## 🎯 Next Steps

### Immediate Testing

1. Visit http://127.0.0.1:8000/visuals/generator/
2. Enter sample text (50+ characters)
3. Select a style
4. Generate your first visual!

### Integration Ideas

1. **LaTeX Editor Integration**:

   - Add "Generate Diagram" button in editor
   - Convert LaTeX equations to visual diagrams
   - Insert generated visuals into documents

2. **Converter Workflow**:

   - Generate visuals from OCR results
   - Create visual explanations of equations
   - Diagram generation from table data

3. **Batch Processing**:
   - Generate multiple visuals at once
   - Create visual sets for presentations
   - Automated diagram creation

### Production Enhancements

1. **Async Processing**:

   - Add Celery for background tasks
   - Use Redis for job queue
   - Implement proper task monitoring

2. **Caching**:

   - Cache API responses
   - Store frequently used styles
   - Optimize file serving

3. **User Management**:
   - Add authentication to API
   - Per-user visual limits
   - Usage analytics

## 🐛 Troubleshooting

### Server Not Starting

```bash
# Kill existing Python processes
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force

# Restart server
python manage.py runserver
```

### Migrations Issues

```bash
# Reset migrations
python manage.py migrate visuals zero
python manage.py makemigrations visuals
python manage.py migrate visuals
```

### API Key Issues

Check `.env` file:

```
NAPKIN_API_KEY=sk-7e9fb09c4363d79a6457a8e20fc3d4bb1a0f56b40c8e9b69ab948150ffc1b80b
NAPKIN_API_URL=https://api.napkin.ai/v1
```

### Visual Not Generating

1. Check terminal output for errors
2. Verify API key is valid
3. Ensure content is 50+ characters
4. Check internet connectivity
5. Review Django logs

## 📚 Documentation

- **Full Documentation**: `visuals/README.md`
- **Napkin API Docs**: https://api.napkin.ai/
- **Style Reference**: https://api.napkin.ai/docs/styles
- **Integration Guide**: `napkin.md`

## ✨ Features Summary

✅ 15 professional visual styles
✅ Multiple export formats (PNG, SVG, PPT)
✅ REST API with full CRUD operations
✅ Web interface for easy visual creation
✅ Gallery view for browsing visuals
✅ Regenerate with different styles
✅ Duplicate existing visuals
✅ Responsive design (mobile + desktop)
✅ Admin interface for management
✅ Async status polling
✅ File download capability
✅ Context-aware generation

## 🎉 Success!

Your MathScriber application now has AI-powered visual generation capabilities!

**Test it now:**

1. Server is running at http://127.0.0.1:8000/
2. Click "Visuals" in navigation
3. Create your first AI-generated visual!

For questions or issues, refer to:

- `visuals/README.md` - Comprehensive documentation
- `napkin.md` - Integration guide
- Napkin API support: api@napkin.ai
