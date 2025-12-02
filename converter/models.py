from django.db import models

class UploadedImage(models.Model):
    TASK_CHOICES = [
        ('equation', 'Equation (LaTeX OCR)'),
        ('table', 'Table (Tesseract)'),
        ('table_gemini', 'Table/Equation (Gemini AI)'),
        ('groq', 'Table/Equation (Groq AI)'),
        ('grok2', 'Table/Equation (Grok 2 AI)'),
        ('mistral', 'Table/Equation (Mistral AI)'),
        ('gemini_universal', 'Universal: Equation/Table/Diagram (Gemini AI - Auto-Detect)'),
        ('deepseek_diagram', 'Diagram Template (TikZ)'),
        ('deepseek_diagram_ai', 'Diagram AI-Powered (DeepSeek - Requires Credits)'),
        ('huggingface_diagram', 'Diagram Intelligent Template (HuggingFace Analysis)'),
        ('openai_diagram', 'Diagram AI-Powered (OpenAI GPT-4o)'),
        ('gemini_diagram', 'Diagram AI-Powered (Gemini 2.0 Flash)'),
    ]

    image = models.ImageField(upload_to='uploads/')
    task = models.CharField(max_length=20, choices=TASK_CHOICES)
    # Name of the AI/engine used to generate the LaTeX (e.g., gemini-2.5-pro, meta-llama/llama-4-scout-17b-16e-instruct)
    model_used = models.CharField(max_length=100, blank=True, null=True)
    latex_output = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.task} - {self.image.name}"
