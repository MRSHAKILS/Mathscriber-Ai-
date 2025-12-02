# Napkin AI Visual Generator Integration

## Overview

The `visuals` app integrates Napkin AI's powerful visual generation API into MathScriber, allowing users to transform text content into beautiful, professional visuals, diagrams, and illustrations.

## Features

- **15 Professional Styles**: Choose from colorful, casual, hand-drawn, formal, and monochrome styles
- **Multiple Formats**: Export as PNG, SVG, or PowerPoint (PPT)
- **Async Generation**: Visual requests are processed asynchronously with status polling
- **Visual Management**: Download, duplicate, regenerate, and manage your visuals
- **Gallery View**: Browse all your generated visuals in a responsive gallery
- **REST API**: Full REST API with Django REST Framework

## Installation

The app has been installed and configured. Here's what was added:

### 1. Settings Configuration

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'visuals',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# Napkin API Configuration
NAPKIN_API_KEY = os.getenv('NAPKIN_API_KEY')
NAPKIN_API_URL = os.getenv('NAPKIN_API_URL', 'https://api.napkin.ai/v1')
```

### 2. Environment Variables

Your `.env` file already contains:

```
NAPKIN_API_KEY=sk-7e9fb09c4363d79a6457a8e20fc3d4bb1a0f56b40c8e9b69ab948150ffc1b80b
NAPKIN_API_URL=https://api.napkin.ai/v1
```

### 3. URLs

Visuals app is available at `/visuals/`:

- **Generator Page**: `/visuals/generator/`
- **Gallery**: `/visuals/gallery/`
- **API Endpoints**: `/visuals/api/`

## Usage

### Web Interface

1. **Navigate to Visual Generator**:

   - Click "Visuals" in the navigation bar
   - Or go to: http://127.0.0.1:8000/visuals/generator/

2. **Create a Visual**:

   - Enter your text content (minimum 50 characters)
   - Optionally add context for better results
   - Select a visual style from 15 options
   - Choose output format (PNG, SVG, or PPT)
   - Click "Generate Visual"

3. **View Your Visuals**:
   - Visit the gallery at `/visuals/gallery/`
   - Download, duplicate, or regenerate any visual

### API Endpoints

#### Get Available Styles

```bash
GET /visuals/api/options/
```

Response:

```json
{
  "styles": [
    {
      "id": "CDQPRVVJCSTPRBBCD5Q6AWR",
      "name": "Vibrant Strokes",
      "category": "colorful",
      "description": "A flow of vivid lines for bold notes"
    },
    ...
  ],
  "formats": ["svg", "png", "ppt"],
  "color_modes": ["light", "dark", "both"],
  "orientations": ["auto", "horizontal", "vertical", "square"]
}
```

#### Generate Visual (Simple)

```bash
POST /visuals/api/generate/
Content-Type: application/json

{
  "content": "The software development lifecycle includes planning, design, implementation, testing, and deployment.",
  "context": "This is for a tech presentation",
  "format": "png",
  "style_id": "CDQPRVVJCSTPRBBCD5Q6AWR",
  "color_mode": "light",
  "orientation": "horizontal"
}
```

#### List Visuals

```bash
GET /visuals/api/
```

#### Get Visual Details

```bash
GET /visuals/api/{visual_id}/
```

#### Regenerate Visual

```bash
POST /visuals/api/{visual_id}/regenerate/
Content-Type: application/json

{
  "style_id": "CDGQ6XB1DGPQ6VV6EG",
  "visual_query": "mindmap"
}
```

#### Duplicate Visual

```bash
POST /visuals/api/{visual_id}/duplicate/
```

## Available Styles

### Colorful Styles

- **Vibrant Strokes** (`CDQPRVVJCSTPRBBCD5Q6AWR`) - Vivid lines for bold notes
- **Glowful Breeze** (`CDQPRVVJCSTPRBBKDXK78`) - Cheerful color for laid-back planning
- **Bold Canvas** (`CDQPRVVJCSTPRBB6DHGQ8`) - Vivid shapes for lively notes
- **Radiant Blocks** (`CDQPRVVJCSTPRBB6D5P6RSB4`) - Solid colors for tasks
- **Pragmatic Shades** (`CDQPRVVJCSTPRBB7E9GP8TB5DST0`) - Blended hues

### Casual Styles

- **Carefree Mist** (`CDGQ6XB1DGPQ6VV6EG`) - Calm tones for playful tasks
- **Lively Layers** (`CDGQ6XB1DGPPCTBCDHJP8`) - Soft color for bright ideas

### Hand-drawn Styles

- **Artistic Flair** (`D1GPWS1DCDQPRVVJCSTPR`) - Hand-drawn color for creativity
- **Sketch Notes** (`D1GPWS1DDHMPWSBK`) - Free-flowing ideas

### Formal Styles

- **Elegant Outline** (`CSQQ4VB1DGPP4V31CDNJTVKFBXK6JV3C`) - Professional clarity
- **Subtle Accent** (`CSQQ4VB1DGPPRTB7D1T0`) - Light professional touch
- **Monochrome Pro** (`CSQQ4VB1DGPQ6TBECXP6ABB3DXP6YWG`) - Single-color focus
- **Corporate Clean** (`CSQQ4VB1DGPPTVVEDXHPGWKFDNJJTSKCC5T0`) - Business diagrams

### Monochrome Styles

- **Minimal Contrast** (`DNQPWVV3D1S6YVB55NK6RRBM`) - Clean monochrome
- **Silver Beam** (`CXS62Y9DCSQP6XBK`) - Gray scale ease

## Models

### Visual

Stores generated visuals with configuration:

- `content`: Main text to visualize
- `context`: Additional context
- `style_id`: Napkin style ID
- `format`: Output format (png/svg/ppt)
- `status`: pending/processing/completed/failed
- `file_path`: Path to saved file
- `napkin_request_id`: Napkin API request ID

### VisualStyle

Caches available Napkin styles:

- `style_id`: Unique Napkin style ID
- `name`: Style name
- `category`: Style category
- `description`: Style description

## Management Commands

### Load Napkin Styles

```bash
python manage.py load_napkin_styles
```

Loads/updates all 15 built-in Napkin styles in the database.

## File Structure

```
visuals/
├── __init__.py
├── admin.py              # Admin interface
├── apps.py               # App configuration
├── models.py             # Visual and VisualStyle models
├── serializers.py        # DRF serializers
├── services.py           # Napkin API service layer
├── urls.py               # URL routing
├── views.py              # Views and API endpoints
├── tests.py              # Tests
├── management/
│   └── commands/
│       └── load_napkin_styles.py
└── templates/
    └── visuals/
        ├── generator.html    # Visual generator interface
        ├── gallery.html      # Visual gallery
        └── detail.html       # Visual detail view
```

## How It Works

1. **User Input**: User provides text content and selects style/format
2. **API Request**: Service creates visual generation request with Napkin API
3. **Polling**: Service polls Napkin API for completion status
4. **Download**: Once completed, file is downloaded and saved to media/visuals/
5. **Display**: Visual is displayed and can be downloaded/regenerated

## Dependencies

- `djangorestframework==3.15.2`: REST API framework
- `requests`: HTTP requests to Napkin API
- `python-dotenv`: Environment variable management

## Troubleshooting

### Visual Generation Fails

- Check NAPKIN_API_KEY in `.env`
- Verify API key is valid
- Ensure content is at least 50 characters
- Check network connectivity

### Timeout Errors

- Default timeout is 60 seconds
- Increase `max_wait` parameter in `generate_visual()` if needed

### File Not Found

- Check media/visuals/ directory exists
- Verify file permissions
- Check MEDIA_ROOT setting

## API Rate Limits

Napkin API has rate limits during developer preview:

- Contact api@napkin.ai to request higher limits
- Implement exponential backoff for retries

## Next Steps

1. **Production Setup**:

   - Use Celery for async task processing
   - Add Redis for caching
   - Implement proper queue management

2. **Enhanced Features**:

   - Batch visual generation
   - Custom style creation
   - Visual templates
   - PDF export with multiple visuals

3. **Integration**:
   - Add visual generation to LaTeX editor
   - Integrate with converter workflow
   - Add visuals to project documents

## Resources

- [Napkin AI Documentation](https://api.napkin.ai/)
- [Available Styles](https://api.napkin.ai/docs/styles)
- [API Reference](https://api.napkin.ai/api/create-visual-request)

## Support

For Napkin API issues:

- Email: api@napkin.ai
- Documentation: https://api.napkin.ai/

For MathScriber integration issues:

- Check Django logs
- Review terminal output
- Verify settings configuration
