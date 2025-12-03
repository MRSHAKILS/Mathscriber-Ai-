{
  "task": "Integrate LangGraph multi-agent workflow into existing Django project for scribble conversion",
  "context": {
    "project_type": "Django with raw HTML/CSS",
    "existing_setup": "Already has other models integrated",
    "goal": "Convert scribbles (equations, tables, diagrams) using multi-agent workflow"
  },
  "requirements": {
    "framework": "LangGraph with LangChain",
    "workflow": "Classification → Conversion → Validation → Retry Loop",
    "agents": [
      {
        "name": "ClassifierAgent",
        "purpose": "Determine scribble type from uploaded image",
        "output": "equation|table|diagram with confidence score"
      },
      {
        "name": "ConverterAgent",
        "purpose": "Convert image to appropriate format based on type",
        "outputs": {
          "equation": "LaTeX format",
          "table": "Markdown or HTML table",
          "diagram": "Mermaid diagram or SVG"
        }
      },
      {
        "name": "ValidatorAgent",
        "purpose": "Compare input/output and provide quality feedback",
        "output": "validation score (0-1) and detailed feedback"
      }
    ],
    "retry_logic": "If validation score < 0.7 and retry_count < 3, loop back to converter with feedback"
  },
  "implementation_specs": {
    "file_structure": {
      "agents_app": {
        "path": "agents/",
        "files": [
          "__init__.py",
          "classifier.py - ClassifierAgent implementation",
          "converter.py - ConverterAgent with type-specific conversion",
          "validator.py - ValidatorAgent for quality checking",
          "graph.py - LangGraph StateGraph workflow definition",
          "state.py - TypedDict for shared state between agents"
        ]
      },
      "integration_files": [
        "views.py - Add view to handle image upload and trigger workflow",
        "urls.py - Add route for scribble conversion endpoint",
        "models.py - Add ScribbleConversion model to track conversions",
        "tasks.py - Celery task for async workflow execution (optional)"
      ]
    },
    "state_schema": {
      "image_data": "base64 encoded string of uploaded image",
      "image_path": "file path if stored locally",
      "scribble_type": "classified type: equation|table|diagram",
      "type_confidence": "float 0-1",
      "converted_output": "string output in appropriate format",
      "validation_score": "float 0-1",
      "feedback": "string with detailed validation feedback",
      "retry_count": "int tracking conversion attempts",
      "max_retries": "int default 3",
      "errors": "list of any errors encountered"
    },
    "langgraph_workflow": {
      "nodes": [
        "classify - Run ClassifierAgent",
        "convert - Run ConverterAgent with type-specific logic",
        "validate - Run ValidatorAgent",
        "end - Terminal node"
      ],
      "edges": [
        "START → classify",
        "classify → convert",
        "convert → validate",
        "validate → convert (conditional: if score < threshold and retries < max)",
        "validate → end (conditional: if score >= threshold or retries >= max)"
      ]
    },
    "django_integration": {
      "view_function": "scribble_convert_view - accepts POST with image file",
      "model_fields": [
        "image - ImageField",
        "scribble_type - CharField",
        "converted_output - TextField",
        "validation_score - FloatField",
        "status - CharField (pending|processing|completed|failed)",
        "created_at - DateTimeField",
        "updated_at - DateTimeField"
      ],
      "response": "Return JSON with conversion_id for status polling or result if sync"
    }
  },
  "code_generation_instructions": {
    "step1": "Create agents/state.py with TypedDict for ScribbleState",
    "step2": "Create agents/classifier.py with classify_scribble function using vision model",
    "step3": "Create agents/converter.py with convert_scribble function with type-specific prompts",
    "step4": "Create agents/validator.py with validate_conversion function",
    "step5": "Create agents/graph.py with StateGraph workflow connecting all agents with conditional edges",
    "step6": "Create Django model ScribbleConversion in models.py",
    "step7": "Create view function in views.py to handle upload and trigger graph",
    "step8": "Add URL pattern in urls.py",
    "step9": "Create HTML form for image upload (if not exists)",
    "style": "Use async/await where possible, add proper error handling, include type hints, add docstrings"
  },
  "dependencies_to_add": [
    "langchain",
    "langgraph",
    "langchain-google-genai",
    "google-generativeai",
    "pillow - for image processing",
    "celery - optional for async tasks",
    "redis - optional for celery broker"
  ],
  "environment_variables": [
    "GOOGLE_API_KEY - Gemini API key",
    "CELERY_BROKER_URL (if using celery)"
  ],
  "gemini_setup": {
    "model_to_use": "gemini-2.0-flash",
    "vision_capability": "Gemini supports native vision, perfect for scribble analysis",
    "initialization": "from langchain_google_genai import ChatGoogleGenerativeAI",
    "image_format": "Gemini accepts images as PIL Image objects or base64",
    "advantages": [
      "Native multimodal support",
      "Good at OCR and handwriting recognition",
      "Free tier available",
      "Fast response times with Flash model"
    ]
  },
  "special_considerations": {
    "vision_model": "Use Gemini 2.0 Flash for image analysis in classifier and converter",
    "prompts": "Create detailed system prompts for each agent specifying their role and output format",
    "validation_threshold": "Set to 0.7 by default, make configurable",
    "file_handling": "Handle base64 encoding for API calls, store original files in media directory",
    "async_processing": "Consider using Celery for long-running conversions to avoid blocking Django views"
  },
  "example_workflow": "User uploads image → Django view saves to model → Trigger LangGraph → Classify (equation) → Convert to LaTeX → Validate (score 0.6) → Retry with feedback → Convert again → Validate (score 0.85) → Return result to user"
}