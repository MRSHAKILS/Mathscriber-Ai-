from typing import Optional, List, Dict
import base64
import io
from PIL import Image
import cv2
import numpy as np

class DiagramProcessor:
    def __init__(self):
        self.supported_formats = ['.png', '.jpg', '.jpeg', '.bmp']
    
    def preprocess_image(self, image_path: str) -> str:
        """Preprocess image and convert to base64 for LLM consumption"""
        # Image enhancement
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Basic preprocessing
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        _, binary = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
        
        # Convert to base64
        pil_img = Image.fromarray(binary)
        buffered = io.BytesIO()
        pil_img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return img_str