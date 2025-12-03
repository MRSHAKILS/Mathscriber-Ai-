# Napkin API Fix Summary

## Problem

The Napkin AI Visual Generator was failing with a **400 Bad Request** error:

```
Failed to create visual request: Napkin API request failed: 400 Client Error: Bad Request for url: https://api.napkin.ai/v1/visual
```

## Root Cause

The API payload was missing **required fields** that the Napkin API expects:

### What was wrong:

```python
# ❌ Old (incorrect) payload
payload = {
    'text': visual_obj.content  # Wrong field name!
}
# Missing 'format' and 'language' fields
```

### What was needed:

```python
# ✅ New (correct) payload
payload = {
    'content': visual_obj.content,  # Correct field name
    'format': 'png',                 # Required field
    'language': 'en'                 # Required field
}
```

## Changes Made

### 1. Fixed `visuals/services.py`

Updated the `create_visual_request` method in `NapkinAPIService`:

**Key changes:**

- Changed `'text'` to `'content'` field name
- Added required `'format'` field (defaults to 'png')
- Added required `'language'` field (defaults to 'en')
- Improved error logging to show actual API response
- Better validation of input parameters

### 2. Created Test Script

Added `test_napkin_visual.py` to help diagnose API issues:

- Tests minimal API request
- Tests full integration with Django models
- Shows detailed error messages
- Polls for completion and downloads results

## Testing

Run the test to verify everything works:

```bash
python test_napkin_visual.py
```

### Expected output:

```
✅ All tests passed!
```

## API Requirements

The Napkin AI Visual API requires these fields:

### Required Fields:

| Field      | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| `content`  | string | Text content to visualize (min 50 chars) |
| `format`   | string | Output format: 'png', 'svg', or 'ppt'    |
| `language` | string | Language code: 'en', 'es', 'fr', etc.    |

### Optional Fields:

| Field                   | Type    | Description                                         |
| ----------------------- | ------- | --------------------------------------------------- |
| `styleId`               | string  | Visual style ID from available styles               |
| `visualQuery`           | string  | Type hint: 'flowchart', 'mindmap', 'timeline', etc. |
| `transparentBackground` | boolean | Enable transparent background                       |
| `colorMode`             | string  | 'light', 'dark', or 'both'                          |
| `orientation`           | string  | 'auto', 'horizontal', 'vertical', 'square'          |
| `width`                 | integer | Width in pixels (PNG only)                          |
| `height`                | integer | Height in pixels (PNG only)                         |

## Usage Example

```python
from visuals.models import Visual
from visuals.services import NapkinAPIService

# Create visual request
visual = Visual.objects.create(
    content="Your text content here (minimum 50 characters required for Napkin AI)",
    format='png',
    style_id='CDQPRVVJCSTPRBBCD5Q6AWR',  # Optional: Vibrant Strokes style
    visual_query='flowchart',  # Optional: Type hint
    color_mode='light',
    transparent_background=False
)

# Generate visual
service = NapkinAPIService()
response = service.create_visual_request(visual)

# Response includes:
# - id: Napkin request ID for status polling
# - status: 'pending', 'processing', 'completed', or 'failed'
# - request: Echo of your request parameters
```

## Web Interface Usage

1. Navigate to: `http://127.0.0.1:8000/visuals/generator/`
2. Enter at least 50 characters of text
3. Select a visual style (optional)
4. Choose format (PNG, SVG, or PPT)
5. Click "Generate Visual"
6. Wait 10-30 seconds for processing

## Common Issues & Solutions

### Issue: "Content must be at least 50 characters long"

**Solution:** Napkin AI requires a minimum of 50 characters. Add more descriptive text.

### Issue: "NAPKIN_API_KEY not configured"

**Solution:** Add your API key to `.env`:

```env
NAPKIN_API_KEY=your_api_key_here
```

### Issue: "validation failed: format is required"

**Solution:** Always specify a format ('png', 'svg', or 'ppt')

### Issue: "validation failed: language is required"

**Solution:** The service now automatically adds 'en' as default language

## Verification

To verify the fix is working:

1. **Run the test script:**

   ```bash
   python test_napkin_visual.py
   ```

2. **Test via Django shell:**

   ```bash
   python manage.py shell
   ```

   ```python
   from visuals.models import Visual
   from visuals.services import NapkinAPIService

   visual = Visual.objects.create(
       content="The water cycle involves evaporation, condensation, and precipitation. " * 2,
       format='png'
   )

   service = NapkinAPIService()
   response = service.create_visual_request(visual)
   print(response)  # Should show {'id': '...', 'status': 'pending', ...}
   ```

3. **Test via web interface:**
   - Visit `/visuals/generator/`
   - Generate a visual
   - Should complete without errors

## Status

✅ **FIXED** - The Napkin API integration is now working correctly with the proper required fields.

---

**Date Fixed:** December 3, 2025
**Files Modified:**

- `visuals/services.py` - Fixed API payload format
- `test_napkin_visual.py` - Added comprehensive test script
