# 🚀 Quick Start Guide - Agent Workflow

## ✅ Installation Complete!

The LangGraph multi-agent workflow has been successfully integrated into your MathScriber AI project.

## 🎯 What's New?

**New Task Option**: "Agent Workflow: Auto-Classify & Convert (Multi-Agent AI)"

This option automatically:

1. **Classifies** your scribble (equation/table/diagram)
2. **Converts** it to the appropriate format
3. **Validates** the quality
4. **Retries** if quality is below threshold (up to 3 times)

## 🏃 Quick Test

### Option 1: Test via Django (Recommended)

```powershell
# Start the server
python manage.py runserver

# Then in browser:
# 1. Go to http://localhost:8000/upload/
# 2. Select "Agent Workflow: Auto-Classify & Convert (Multi-Agent AI)"
# 3. Upload an image
# 4. Watch console for progress logs
```

### Option 2: Test Standalone

```powershell
# Test with a specific image
python test_agent_workflow.py "path/to/your/image.png"

# Or test directly
python agents/graph.py "path/to/your/image.png"
```

## 📋 Console Output Example

When processing, you'll see:

```
===========================================================
🚀 Starting Scribble Conversion Workflow
===========================================================

🔍 Running ClassifierAgent...
✅ Classification: equation (confidence: 0.92)
   Reasoning: The image contains a mathematical expression with fractions and variables

🔄 Running ConverterAgent (attempt 1)...
✅ Converted equation to output
   Output preview: \frac{x^2 + 3x - 4}{x - 1} = x + 4...

✓ Running ValidatorAgent...
✅ Validation completed: Score 0.85
   Feedback: Conversion is accurate. All symbols correctly identified.

✅ Validation score (0.85) meets threshold. Workflow complete!
===========================================================
✅ Workflow Complete!
===========================================================
Type: equation
Confidence: 0.92
Validation Score: 0.85
Total Attempts: 1
===========================================================
```

## 🔍 What Each Agent Does

### ClassifierAgent 🔍

- Uses Gemini Vision to analyze image
- Identifies if it's an equation, table, or diagram
- Returns confidence score

### ConverterAgent 🔄

- Converts based on type:
  - **Equation** → LaTeX code
  - **Table** → Markdown table
  - **Diagram** → Mermaid diagram
- Uses type-specific prompts for best results

### ValidatorAgent ✅

- Compares input image with converted output
- Scores quality 0.0 - 1.0
- Provides detailed feedback
- Triggers retry if score < 0.7

## 📊 Database Fields

New fields in `UploadedImage` model:

| Field              | Type    | Description                     |
| ------------------ | ------- | ------------------------------- |
| `scribble_type`    | String  | equation/table/diagram          |
| `type_confidence`  | Float   | Classification confidence (0-1) |
| `validation_score` | Float   | Quality score (0-1)             |
| `feedback`         | Text    | Validator's detailed feedback   |
| `retry_count`      | Integer | Number of conversion attempts   |

## 🛠️ Configuration

### Change Retry Threshold

Edit `agents/graph.py`, line ~45:

```python
threshold = 0.7  # Change this value (0.0 - 1.0)
```

### Change Max Retries

When calling `process_scribble()`:

```python
result = process_scribble(image_path, max_retries=5)  # Default is 3
```

### Change AI Model

Edit agent files (`classifier.py`, `converter.py`, `validator.py`):

```python
model = genai.GenerativeModel('gemini-2.0-flash-exp')  # Change model here
```

## 🎨 Example Use Cases

### Equation Recognition

```
Input: Photo of handwritten equation
↓
Classification: equation (0.95)
↓
Output: LaTeX code
↓
Validation: 0.88 (Good quality)
```

### Table Extraction

```
Input: Photo of data table
↓
Classification: table (0.89)
↓
Output: Markdown table
↓
Validation: 0.82 (Good quality)
```

### Diagram Conversion

```
Input: Flowchart photo
↓
Classification: diagram (0.91)
↓
Output: Mermaid diagram
↓
Validation: 0.76 (Acceptable)
```

## ⚠️ Troubleshooting

### "No module named 'agents'"

```powershell
# Make sure you're in the project root
cd "d:\HP\D\Mathscriber AI"
# Try running again
python test_agent_workflow.py
```

### API Key Errors

```powershell
# Check if API key is set
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('Key exists:', bool(os.getenv('GEMINI_API_KEY')))"
```

### Low Validation Scores

- Try higher quality images
- Ensure good lighting
- Avoid blurry or distorted images
- Check if content is clearly visible

## 📈 Performance Tips

1. **Image Quality**: Higher quality = better results
2. **Clear Content**: Well-lit, focused images work best
3. **Simple First**: Test with simple examples first
4. **Monitor Logs**: Watch console for progress and issues
5. **API Limits**: Be aware of API rate limits

## 🎓 Next Steps

1. ✅ Test with sample images
2. ✅ Try different content types (equations, tables, diagrams)
3. ✅ Check validation scores and feedback
4. ✅ Adjust threshold if needed
5. ✅ Deploy to production

## 📚 Documentation

Full documentation available in:

- `agents/README.md` - Complete architecture guide
- `AGENT_WORKFLOW_INTEGRATION.md` - Integration details
- `agent worrkflow.md` - Original requirements

## 🎉 Success!

Your multi-agent workflow is ready to use! The "Agent" option is now available in all upload forms.

**Happy Converting! 🚀**

---

**Questions?** Check the console logs for detailed workflow progress.

**Issues?** Review the troubleshooting section above.

**Feedback?** The validator provides detailed feedback for improvements.
