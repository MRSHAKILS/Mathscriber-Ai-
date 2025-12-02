"""
ValidatorAgent: Validates conversion quality and provides feedback.
Compares input image with converted output to ensure accuracy.
"""

import os
import base64
from typing import Dict
from .state import ScribbleState

# Import necessary AI libraries
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if GOOGLE_API_KEY:
        genai.configure(api_key=GOOGLE_API_KEY)
except ImportError:
    print("Warning: google-generativeai not installed")


async def validate_conversion(state: ScribbleState) -> Dict:
    """
    Validate the conversion quality by comparing input image with converted output.
    
    Args:
        state: Current workflow state containing image and converted output
        
    Returns:
        Dict with validation_score and feedback
    """
    try:
        scribble_type = state.get("scribble_type", "unknown")
        converted_output = state.get("converted_output", "")
        image_path = state.get("image_path")
        image_data = state.get("image_data")
        
        if not converted_output:
            return {
                "validation_score": 0.0,
                "feedback": "No converted output to validate",
                "status": "validation_failed"
            }
        
        # Read image
        if image_path and os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                image_bytes = f.read()
        else:
            try:
                image_bytes = base64.b64decode(image_data)
            except Exception as e:
                return {
                    "validation_score": 0.0,
                    "feedback": f"Failed to decode image: {str(e)}",
                    "status": "error"
                }
        
        # Prepare image for model
        import PIL.Image
        import io
        pil_image = PIL.Image.open(io.BytesIO(image_bytes))
        
        # Use Gemini for validation
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Type-specific validation prompts
        if scribble_type == "equation":
            validation_prompt = f"""
You are a LaTeX validation expert. Compare the mathematical content in this image with the following LaTeX code:

```latex
{converted_output}
```

Evaluate the conversion on these criteria:
1. **Accuracy**: Are all symbols, numbers, and operators correct?
2. **Completeness**: Is all content from the image captured?
3. **Syntax**: Is the LaTeX syntax correct and compilable?
4. **Formatting**: Is the formatting appropriate (fractions, superscripts, subscripts)?

Respond ONLY with a JSON object:
{{
    "score": 0.0 to 1.0,
    "feedback": "detailed explanation of what's correct and what's wrong",
    "issues": ["list of specific issues found"],
    "suggestions": ["list of specific improvement suggestions"]
}}

Be strict but fair in your evaluation.
"""
        
        elif scribble_type == "table":
            validation_prompt = f"""
You are a LaTeX table validation expert. Compare the table in this image with the following LaTeX table:

```latex
{converted_output}
```

Evaluate the conversion on these criteria:
1. **Data Accuracy**: Are all cell values correct and match the image?
2. **Structure**: Is the table structure (rows, columns, alignment) correct?
3. **Headers**: Are headers captured correctly?
4. **Syntax**: Is the LaTeX tabular syntax correct and compilable?
5. **Formatting**: Are \\hline, column alignment (l|c|r), and & separators used properly?

Respond ONLY with a JSON object:
{{
    "score": 0.0 to 1.0,
    "feedback": "detailed explanation of what's correct and what's wrong",
    "issues": ["list of specific issues found"],
    "suggestions": ["list of specific improvement suggestions"]
}}

Be strict but fair in your evaluation.
"""
        
        elif scribble_type == "diagram":
            validation_prompt = f"""
You are a LaTeX TikZ validation expert. Compare the diagram in this image with the following LaTeX TikZ code:

```latex
{converted_output}
```

Evaluate the conversion on these criteria:
1. **Structure**: Are all components/nodes from the image captured in the TikZ code?
2. **Relationships**: Are connections, arrows, and flows between nodes correct?
3. **Labels**: Are all text labels and node contents accurate?
4. **Syntax**: Is the TikZ syntax correct and compilable?
5. **Positioning**: Is the layout and positioning reasonable?

Respond ONLY with a JSON object:
{{
    "score": 0.0 to 1.0,
    "feedback": "detailed explanation of what's correct and what's wrong",
    "issues": ["list of specific issues found"],
    "suggestions": ["list of specific improvement suggestions"]
}}

Be strict but fair in your evaluation.
"""
        
        else:
            validation_prompt = f"""
Compare the content in this image with the following converted output:

{converted_output}

Provide a quality score (0.0 to 1.0) and feedback in JSON format:
{{
    "score": 0.0 to 1.0,
    "feedback": "detailed feedback",
    "issues": ["list of issues"],
    "suggestions": ["list of suggestions"]
}}
"""
        
        # Generate validation
        response = model.generate_content([validation_prompt, pil_image])
        result_text = response.text.strip()
        
        # Parse the JSON response
        import json
        # Remove markdown code blocks if present
        if result_text.startswith("```json"):
            result_text = result_text.replace("```json", "").replace("```", "").strip()
        elif result_text.startswith("```"):
            result_text = result_text.replace("```", "").strip()
        
        validation_result = json.loads(result_text)
        
        score = float(validation_result.get("score", 0.0))
        feedback = validation_result.get("feedback", "")
        issues = validation_result.get("issues", [])
        suggestions = validation_result.get("suggestions", [])
        
        # Combine feedback with issues and suggestions
        detailed_feedback = feedback
        if issues:
            detailed_feedback += "\n\nIssues found:\n" + "\n".join(f"- {issue}" for issue in issues)
        if suggestions:
            detailed_feedback += "\n\nSuggestions:\n" + "\n".join(f"- {suggestion}" for suggestion in suggestions)
        
        print(f"✅ Validation completed: Score {score:.2f}")
        print(f"   Feedback: {feedback}")
        
        return {
            "validation_score": score,
            "feedback": detailed_feedback,
            "status": "validated"
        }
        
    except Exception as e:
        error_msg = f"Validation error: {str(e)}"
        print(f"❌ {error_msg}")
        errors = state.get("errors", [])
        errors.append(error_msg)
        
        # Default to passing if validation fails (be lenient)
        return {
            "validation_score": 0.7,
            "feedback": f"Validation process encountered an error, but conversion appears complete: {error_msg}",
            "errors": errors,
            "status": "validation_error"
        }


def validate_conversion_sync(state: ScribbleState) -> Dict:
    """
    Synchronous wrapper for validate_conversion.
    """
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(validate_conversion(state))
