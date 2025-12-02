from django.db import models

class UploadedImage(models.Model):
    TASK_CHOICES = [
        ('agent', 'Agent Workflow: Auto-Classify & Convert (Multi-Agent AI)'),
        ('gemini_universal', 'Universal: Equation/Table/Diagram (Gemini AI - Auto-Detect)'),
        ('mistral_universal', 'Universal: Equation/Table/Diagram (Mistral AI - Auto-Detect)'),
        ('groq_universal', 'Universal: Equation/Table/Diagram (Groq AI - Auto-Detect)'),
        ('equation', 'Equation (LaTeX OCR)'),
        ('table', 'Table (Tesseract)'),
    ]

    image = models.ImageField(upload_to='uploads/')
    task = models.CharField(max_length=20, choices=TASK_CHOICES)
    # Name of the AI/engine used to generate the LaTeX (e.g., gemini-2.5-pro, meta-llama/llama-4-scout-17b-16e-instruct)
    model_used = models.CharField(max_length=100, blank=True, null=True)
    latex_output = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Agent workflow specific fields
    scribble_type = models.CharField(max_length=20, blank=True, null=True, help_text="Classified type: equation/table/diagram")
    type_confidence = models.FloatField(blank=True, null=True, help_text="Classification confidence score 0-1")
    validation_score = models.FloatField(blank=True, null=True, help_text="Validation quality score 0-1")
    feedback = models.TextField(blank=True, null=True, help_text="Validator feedback")
    retry_count = models.IntegerField(default=0, help_text="Number of conversion retry attempts")

    def __str__(self):
        return f"{self.task} - {self.image.name}"
