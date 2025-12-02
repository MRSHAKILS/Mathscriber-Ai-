"""
ClassifierAgent: Determines scribble type from uploaded image.
Uses vision models (Gemini) to classify images as equation, table, or diagram.
"""

import os
import base64
from typing import Dict
from pathlib import Path
from .state import ScribbleState

# Import Google Generative AI
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if GOOGLE_API_KEY:
        genai.configure(api_key=GOOGLE_API_KEY)
except ImportError:
    print("Warning: google-generativeai not installed")


async def classify_scribble(state: ScribbleState) -> Dict:
    """
    Classify the scribble image into one of three types: equation, table, or diagram.
    
    Args:
        state: Current workflow state containing image data
        
    Returns:
        Dict with scribble_type and type_confidence
    """
    try:
        # Get image path or data
        image_path = state.get("image_path")
        image_data = state.get("image_data")
        
        if not image_path and not image_data:
            return {
                "scribble_type": "unknown",
                "type_confidence": 0.0,
                "errors": ["No image data provided"],
                "status": "error"
            }
        
        # Read image if we have a path
        if image_path and os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                image_bytes = f.read()
        else:
            # Decode base64 if provided
            try:
                image_bytes = base64.b64decode(image_data)
            except Exception as e:
                return {
                    "scribble_type": "unknown",
                    "type_confidence": 0.0,
                    "errors": [f"Failed to decode image: {str(e)}"],
                    "status": "error"
                }
        
        # Use Gemini Vision for classification
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        classification_prompt = """
Analyze this image and classify it into ONE of these three categories:

1. **equation**: Mathematical equations, formulas, expressions (e.g., algebraic, calculus, physics formulas)
2. **table**: Tabular data, spreadsheets, data tables with rows and columns
3. **diagram**: Flowcharts, diagrams, charts, graphs, visual representations

Respond ONLY with a JSON object in this exact format:
{
    "type": "equation" or "table" or "diagram",
    "confidence": 0.0 to 1.0,
    "reasoning": "brief explanation of why you classified it this way"
}

Be precise and choose the most appropriate category. If it contains multiple types, choose the dominant one.
"""
        
        # Upload image and generate classification
        import PIL.Image
        import io
        pil_image = PIL.Image.open(io.BytesIO(image_bytes))
        
        response = model.generate_content([classification_prompt, pil_image])
        result_text = response.text.strip()
        
        # Parse the JSON response
        import json
        # Remove markdown code blocks if present
        if result_text.startswith("```json"):
            result_text = result_text.replace("```json", "").replace("```", "").strip()
        elif result_text.startswith("```"):
            result_text = result_text.replace("```", "").strip()
        
        classification = json.loads(result_text)
        
        scribble_type = classification.get("type", "unknown")
        confidence = float(classification.get("confidence", 0.5))
        reasoning = classification.get("reasoning", "")
        
        print(f"✅ Classification: {scribble_type} (confidence: {confidence:.2f})")
        print(f"   Reasoning: {reasoning}")
        
        return {
            "scribble_type": scribble_type,
            "type_confidence": confidence,
            "status": "classified",
            "model_used": "gemini-2.0-flash (Classifier)"
        }
        
    except Exception as e:
        error_msg = f"Classification error: {str(e)}"
        print(f"❌ {error_msg}")
        errors = state.get("errors", [])
        errors.append(error_msg)
        
        return {
            "scribble_type": "unknown",
            "type_confidence": 0.0,
            "errors": errors,
            "status": "error"
        }


def classify_scribble_sync(state: ScribbleState) -> Dict:
    """
    Synchronous wrapper for classify_scribble.
    """
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(classify_scribble(state))
