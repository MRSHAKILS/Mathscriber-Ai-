# Agentic Converter Documentation

## Overview

The **Agentic Converter** (`converter2.py`) implements a sophisticated multi-agent workflow for converting images to LaTeX code. Unlike the simple converter, it uses three specialized AI agents that work together to ensure accurate, validated, and clean LaTeX output.

## Architecture

### Three Specialized Agents

1. **Agent 1: Content Identifier**
   - **Model**: Gemini 2.0 Flash Exp
   - **Purpose**: Analyzes and identifies the content type in the uploaded image
   - **Output**: Structured analysis including:
     - Content type (equation/diagram/table/mixed/text)
     - Complexity level (simple/medium/complex)
     - Mathematical elements present
     - Special notation used
     - Overall structure

2. **Agent 2: LaTeX Converter**
   - **Model**: Gemini 2.0 Flash Exp
   - **Purpose**: Converts the image to LaTeX using insights from Agent 1
   - **Features**:
     - Context-aware conversion based on content analysis
     - Specialized handling for equations, diagrams, and tables
     - Strict formatting rules
     - Clean output without explanations

3. **Agent 3: Validator & Corrector**
   - **Model**: Gemini 2.0 Flash Exp
   - **Purpose**: Validates and corrects the generated LaTeX code
   - **Validation Checks**:
     - Bracket matching (all types: (), [], {}, \left\right)
     - Syntax validation
     - Content accuracy (compared with original image)
     - Cleanliness (no markdown, no extra text)
   - **Programmatic Checks**:
     - Automated bracket balance verification
     - Math delimiter balance
     - Markdown removal
     - Extra text detection and removal

## Workflow Process

```
Image Upload
    ↓
[Agent 1: Identifier]
    → Analyzes content type
    → Identifies complexity
    → Lists mathematical elements
    ↓
[Agent 2: Converter]
    → Uses Agent 1's analysis
    → Converts to LaTeX
    → Applies context-specific rules
    ↓
[Agent 3: Validator]
    → Validates brackets & syntax
    → Checks content accuracy
    → Applies corrections if needed
    → Performs programmatic fixes
    ↓
Final LaTeX Output
```

## API Endpoints

### 1. Standard Conversion (with option)
```
POST /api/convert/upload
POST /api/convert/capture
POST /api/convert/canvas
```

**Parameters:**
- `image`: Image file (required)
- `use_agentic`: Boolean string ("true"/"false"), default: "true"

**Response:**
```json
{
  "input": "base64_encoded_image",
  "latex": "generated_latex_code",
  "convertedOutput": "generated_latex_code",
  "timestamp": "2025-12-02T...",
  "id": 123,
  "converter_type": "agentic",
  "workflow": {
    "content_analysis": {
      "type": "equation",
      "complexity": "medium",
      "elements": "fractions, integrals"
    },
    "validation": {
      "status": "PASS",
      "bracket_check": "PASS",
      "syntax_check": "PASS",
      "content_check": "PASS",
      "was_corrected": false
    }
  }
}
```

### 2. Dedicated Agentic Endpoint
```
POST /api/convert/agentic
```

**Parameters:**
- `image`: Image file (required)

**Response:**
```json
{
  "success": true,
  "input": "base64_encoded_image",
  "latex": "generated_latex_code",
  "convertedOutput": "generated_latex_code",
  "timestamp": "2025-12-02T...",
  "id": 123,
  "converter_type": "agentic_workflow",
  "workflow": {
    "agents_used": ["identifier", "converter", "validator"],
    "agent_status": {
      "agent_1_identification": "completed",
      "agent_2_conversion": "completed",
      "agent_3_validation": "completed"
    },
    "content_analysis": {
      "type": "equation",
      "complexity": "medium",
      "elements": "fractions, integrals, summation",
      "special_notation": "Greek letters, subscripts",
      "structure": "Multi-line equation with alignment"
    },
    "validation": {
      "status": "PASS",
      "bracket_check": "PASS - All brackets balanced",
      "syntax_check": "PASS - Valid LaTeX syntax",
      "content_check": "PASS - Matches source image",
      "cleanliness_check": "PASS - No extra text",
      "was_corrected": false,
      "issues": "None",
      "programmatic_checks": {
        "bracket_balance": true,
        "delimiter_balance": true,
        "no_markdown": true,
        "no_extra_text": true,
        "all_passed": true,
        "issues": []
      }
    }
  }
}
```

## Key Features

### 1. Content-Aware Conversion
The converter adapts its approach based on the identified content type:
- **Equations**: Uses appropriate math delimiters ($ or $$)
- **Diagrams**: Generates TikZ code with package imports
- **Tables**: Creates proper tabular/array environments
- **Mixed**: Handles complex documents with multiple content types

### 2. Comprehensive Validation
- **AI Validation**: Agent 3 reviews the LaTeX against the original image
- **Programmatic Validation**: Automated checks for common issues
- **Auto-Correction**: Fixes issues automatically when possible

### 3. Quality Assurance
- Ensures all brackets are matched
- Verifies math delimiters are balanced
- Removes markdown formatting
- Eliminates explanatory text
- Validates syntax correctness

### 4. Detailed Reporting
Provides comprehensive workflow information:
- Agent execution status
- Content analysis results
- Validation results
- Any corrections made
- Programmatic check results

## Usage Examples

### Frontend Implementation

```typescript
// Use agentic converter (default)
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('/api/convert/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('LaTeX:', result.latex);
console.log('Content Type:', result.workflow.content_analysis.type);
console.log('Validation:', result.workflow.validation.status);
```

```typescript
// Use dedicated agentic endpoint
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('/api/convert/agentic', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Agents Used:', result.workflow.agents_used);
console.log('All Checks Passed:', result.workflow.validation.programmatic_checks.all_passed);
```

```typescript
// Use simple converter (opt-out of agentic)
const formData = new FormData();
formData.append('image', imageFile);
formData.append('use_agentic', 'false');

const response = await fetch('/api/convert/upload', {
  method: 'POST',
  body: formData
});
```

### Python Implementation

```python
from converter.converter2 import AgenticGeminiConverter

# Initialize converter
converter = AgenticGeminiConverter()

# Convert image
with open('equation.png', 'rb') as f:
    results = converter.convert_image_to_latex(f)

# Access results
latex_code = results['latex_code']
content_type = results['content_analysis']['content_type']
validation_status = results['validation']['validation_status']
was_corrected = results['validation']['was_corrected']

print(f"LaTeX: {latex_code}")
print(f"Content Type: {content_type}")
print(f"Validation: {validation_status}")
print(f"Corrected: {was_corrected}")
```

## Benefits Over Simple Converter

| Feature | Simple Converter | Agentic Converter |
|---------|-----------------|-------------------|
| Content Analysis | ❌ | ✅ Detailed analysis |
| Context-Aware Conversion | ❌ | ✅ Adaptive approach |
| Validation | ❌ | ✅ AI + Programmatic |
| Auto-Correction | ❌ | ✅ Multiple correction passes |
| Bracket Verification | ❌ | ✅ Comprehensive checks |
| Quality Reporting | ❌ | ✅ Detailed workflow status |
| Accuracy | Good | Excellent |
| Output Cleanliness | Good | Guaranteed |

## Performance Considerations

- **Processing Time**: ~2-3x longer than simple converter (3 agent calls)
- **Accuracy**: Significantly higher due to validation and correction
- **Reliability**: More robust for complex content
- **Use Cases**: 
  - Use **Agentic** for: Complex equations, important documents, production use
  - Use **Simple** for: Quick tests, simple equations, development

## Error Handling

The agentic converter includes comprehensive error handling:
- Graceful fallbacks if any agent fails
- Detailed error messages
- Debug logging for troubleshooting
- Automatic retry logic in validation

## Future Enhancements

Potential improvements:
1. Add Agent 4 for LaTeX compilation testing
2. Implement learning from user corrections
3. Add support for more specialized content types
4. Cache successful conversions for similar images
5. Parallel agent execution for faster processing

## Configuration

The agentic converter uses these settings:
- **Model**: `gemini-2.0-flash-exp` (can be changed in code)
- **API Key**: From `settings.GEMINI_API_KEY`
- **Validation Strictness**: High (can be adjusted)

## Debugging

Enable detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Debug output includes:
- Agent initialization status
- Content identification results
- Conversion progress
- Validation checks
- Correction attempts
- Final output status
