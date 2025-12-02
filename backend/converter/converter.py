"""
Gemini API integration for converting images to LaTeX
"""
import google.generativeai as genai
from django.conf import settings
from PIL import Image
import io


class GeminiConverter:
    """Handles conversion of images to LaTeX using Gemini API"""
    
    def __init__(self):
        """Initialize Gemini API with API key"""
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
    
    def convert_image_to_latex(self, image_file):
        """
        Convert an uploaded image to LaTeX code
        
        Args:
            image_file: Django UploadedFile object
            
        Returns:
            str: LaTeX code extracted from the image
        """
        try:
            # Open image using PIL
            image = Image.open(image_file)
            
            # Prepare prompt for Gemini
            prompt = """
            You are an expert at converting mathematical equations, diagrams, and tables from images into LaTeX code.
            
            Analyze this image and convert its contents into clean, properly formatted LaTeX code.
            
            Rules:
            1. If it's a mathematical equation, provide the LaTeX code with appropriate math delimiters ($ or $$)
            2. If it's a diagram, describe how to create it using TikZ or similar LaTeX packages
            3. If it's a table, provide the LaTeX table code
            4. Return ONLY the LaTeX code, no explanations or markdown formatting
            5. Make sure the LaTeX code is clean and ready to use
            
            Image content:
            """
            
            # Generate response using Gemini
            response = self.model.generate_content([prompt, image])
            
            # Extract and return LaTeX code
            latex_code = response.text.strip()
            
            return latex_code
            
        except Exception as e:
            raise Exception(f"Error processing image with Gemini: {str(e)}")
