# Napkin AI Visual Generator - Setup & Usage Guide

## Overview

The Napkin AI Visual Generator allows you to transform text content into beautiful visuals using AI. It supports multiple styles, formats, and customization options.

## Prerequisites

1. Napkin AI API Key (Get yours at: https://app.napkin.ai/settings/api-keys)
2. Python 3.8+ with Django 5.2+
3. Django REST Framework installed

## Installation Steps

### 1. Add API Key to Environment

Add the following to your `.env` file (create one from `.env.example` if it doesn't exist):

```env
NAPKIN_API_KEY=your_actual_api_key_here
NAPKIN_API_URL=https://api.napkin.ai/v1
```

**Important:** Replace `your_actual_api_key_here` with your real API key from Napkin AI.

### 2. Verify Installation

The visuals app should already be installed. Verify by checking:

- `visuals` is in `INSTALLED_APPS` in `MathScriber/settings.py`
- Migrations are applied: `python manage.py migrate`
- Styles are loaded: `python manage.py load_napkin_styles`

## Using the Visual Generator

### Web Interface

1. Start the server: `python manage.py runserver`
2. Navigate to: http://127.0.0.1:8000/visuals/generator/
3. Enter your content (minimum 50 characters)
4. Select a visual style (colorful, casual, hand-drawn, formal, or monochrome)
5. Choose output format:
   - **PNG**: Raster image, supports custom dimensions
   - **SVG**: Scalable vector graphic
   - **PPT**: PowerPoint slide format
6. Click "Generate Visual"
7. Wait 10-30 seconds for processing
8. Download or regenerate your visual

### Available Styles

#### Colorful (Bold & Vibrant)

- Vibrant Strokes
- Glowful Breeze
- Bold Canvas
- Radiant Blocks
- Pragmatic Shades

#### Casual (Relaxed & Friendly)

- Carefree Mist
- Lively Layers

#### Hand-drawn (Creative & Artistic)

- Artistic Flair
- Sketch Notes

#### Formal (Professional & Clean)

- Elegant Outline
- Subtle Accent
- Monochrome Pro
- Corporate Clean

#### Monochrome (Minimalist)

- Minimal Contrast
- Silver Beam

## API Endpoints

### Generate Visual

```http
POST /visuals/api/generate/
Content-Type: application/json

{
  "content": "Your text content here (min 50 chars)",
  "context": "Optional additional context",
  "format": "png|svg|ppt",
  "style_id": "CDQPRVVJCSTPRBBCD5Q6AWR",
  "color_mode": "light|dark|both",
  "transparent_background": false,
  "width": 1024,
  "height": 768
}
```

Response:

```json
{
  "id": "uuid-here",
  "status": "processing",
  "napkin_request_id": "request-id",
  "content": "...",
  "format": "png",
  "created_at": "2025-12-03T03:50:00Z"
}
```

### Check Status

```http
GET /visuals/api/status/<visual-id>/
```

Response when completed:

```json
{
  "id": "uuid-here",
  "status": "completed",
  "file_path": "visuals/visual_uuid.png",
  "file_url": "https://napkin.ai/download/...",
  "created_at": "2025-12-03T03:50:00Z"
}
```

### Get Available Options

```http
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
    }
  ],
  "formats": ["svg", "png", "ppt"],
  "color_modes": ["light", "dark", "both"],
  "orientations": ["auto", "horizontal", "vertical", "square"]
}
```

## Troubleshooting

### Error: "NAPKIN_API_KEY environment variable is not set"

**Solution:** Add your API key to the `.env` file as shown above.

### Error: "Failed to create visual request"

**Possible causes:**

1. Invalid API key
2. Network connectivity issues
3. Napkin API rate limits reached

**Solution:**

- Verify your API key is correct
- Check your internet connection
- Wait a few minutes if rate limited

### Visual Generation Takes Too Long

**Normal behavior:** Visual generation typically takes 10-30 seconds.

**If it times out:**

- Check the Napkin AI status page: https://status.napkin.ai/
- Try again with a shorter content text
- Check your API key validity

### Generated Visual Not Appearing

**Check:**

1. `media/visuals/` directory exists and is writable
2. Visual status is "completed" (check in admin or via API)
3. File path is correct in the database

## Tips for Best Results

### Content Guidelines

- **Minimum length:** 50 characters
- **Optimal length:** 100-500 characters
- **Best for:** Processes, concepts, timelines, relationships
- **Examples:**
  - "The software development lifecycle includes planning, design, implementation, testing, and deployment phases."
  - "Customer journey: Awareness → Consideration → Purchase → Retention → Advocacy"
  - "Project management triangle: Scope, Time, Cost - balance all three for success"

### Style Selection

- **Presentations:** Use Formal styles (Elegant Outline, Corporate Clean)
- **Social Media:** Use Colorful or Hand-drawn styles
- **Documentation:** Use Monochrome or Formal styles
- **Brainstorming:** Use Casual or Hand-drawn styles

### Format Selection

- **PNG:** Best for embedding in documents, websites
  - Customize dimensions (e.g., 1920×1080 for presentations)
  - Supports transparent backgrounds
- **SVG:** Best for scaling without quality loss
  - Perfect for logos, icons, diagrams
  - Can be edited in design tools
- **PPT:** Best for direct PowerPoint use
  - One visual per slide
  - Ready to present

## Advanced Options

### Visual Query Hints

Add hints to guide the visual style:

- `visual_query: "mindmap"` - Generate a mind map layout
- `visual_query: "flowchart"` - Generate a flowchart
- `visual_query: "timeline"` - Generate a timeline
- `visual_query: "comparison"` - Generate a comparison chart

### Color Modes

- `light`: Light background visuals
- `dark`: Dark background visuals
- `both`: Generate both light and dark versions

### Orientation

- `auto`: Let AI decide (default)
- `horizontal`: Wide format (16:9 aspect ratio)
- `vertical`: Tall format (9:16 aspect ratio)
- `square`: 1:1 aspect ratio

## File Management

Generated visuals are stored in:

- **Path:** `media/visuals/visual_<uuid>.<format>`
- **Naming:** Automatic based on visual ID and format
- **URL Expiration:** Download URLs from Napkin expire after 30 minutes
- **Local Copy:** Files are downloaded and stored locally automatically

## Gallery & Management

Access your visual gallery at: http://127.0.0.1:8000/visuals/gallery/

Features:

- View all generated visuals
- Filter by status, format, or date
- Regenerate with different styles
- Duplicate and modify
- Download in original format

## Support & Resources

- **Napkin AI Documentation:** https://docs.napkin.ai/
- **API Reference:** https://docs.napkin.ai/api-reference
- **Get API Key:** https://app.napkin.ai/settings/api-keys
- **Status Page:** https://status.napkin.ai/

## Rate Limits

Napkin AI applies rate limits to API usage. If you exceed limits:

- Wait a few minutes before retrying
- Consider upgrading your Napkin AI plan
- Batch your requests efficiently

## Security Notes

- **Never commit** your `.env` file with real API keys
- Keep your API key confidential
- Rotate keys if compromised
- Use environment-specific keys (dev/staging/prod)
