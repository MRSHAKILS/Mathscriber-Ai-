"""
Service layer for Napkin AI visual generation
"""
import os
import requests
import time
from django.conf import settings
from .models import Visual


class NapkinAPIService:
    """Service to interact with Napkin AI API"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'NAPKIN_API_KEY', None)
        self.api_url = getattr(settings, 'NAPKIN_API_URL', 'https://api.napkin.ai/v1')
        
        if not self.api_key:
            raise ValueError("NAPKIN_API_KEY environment variable is not set. Please add it to your .env file.")
        
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    
    def create_visual_request(self, visual_obj):
        """
        Create a visual generation request with Napkin AI
        
        Args:
            visual_obj: Visual model instance
            
        Returns:
            dict: Response from Napkin API
        """
        # Validate minimum content length (Napkin requires at least 50 characters)
        if not visual_obj.content or len(visual_obj.content.strip()) < 50:
            raise ValueError("Content must be at least 50 characters long")
        
        # Build required payload
        # Napkin API requires: content, format, and language fields
        payload = {
            'content': visual_obj.content.strip(),
            'format': visual_obj.format if visual_obj.format else 'png',
            'language': visual_obj.language if hasattr(visual_obj, 'language') and visual_obj.language else 'en'
        }
        
        # Add optional parameters only if they have valid values
        if visual_obj.style_id and visual_obj.style_id.strip():
            payload['styleId'] = visual_obj.style_id.strip()
        
        if visual_obj.visual_query and visual_obj.visual_query.strip():
            payload['visualQuery'] = visual_obj.visual_query.strip()
        
        # Boolean options
        if visual_obj.transparent_background:
            payload['transparentBackground'] = True
        
        # Color mode: only include if not default
        if visual_obj.color_mode and visual_obj.color_mode != 'light':
            payload['colorMode'] = visual_obj.color_mode
        
        # Orientation: only include if not auto
        if visual_obj.orientation and visual_obj.orientation != 'auto':
            payload['orientation'] = visual_obj.orientation
        
        # Dimensions: only for PNG format
        if visual_obj.format == 'png':
            if visual_obj.width and visual_obj.width > 0:
                payload['width'] = int(visual_obj.width)
            if visual_obj.height and visual_obj.height > 0:
                payload['height'] = int(visual_obj.height)
        
        try:
            print(f"Napkin API Request Payload: {payload}")  # Debug logging
            
            response = requests.post(
                f'{self.api_url}/visual',
                json=payload,
                headers=self.headers,
                timeout=30
            )
            
            # Log error details for debugging
            if response.status_code >= 400:
                error_detail = f"Status: {response.status_code}, Body: {response.text}"
                print(f"Napkin API Error: {error_detail}")
                # Include response body in exception for better debugging
                raise Exception(f"Napkin API request failed: {response.status_code} - {response.text}")
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Napkin API request failed: {str(e)}")
    
    def get_request_status(self, request_id):
        """
        Get the status of a visual generation request
        
        Args:
            request_id: Napkin request ID
            
        Returns:
            dict: Status response from Napkin API
        """
        try:
            response = requests.get(
                f'{self.api_url}/visual/{request_id}/status',
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to get request status: {str(e)}")
    
    def download_visual_file(self, file_url, save_path):
        """
        Download the generated visual file
        
        Args:
            file_url: URL of the generated file
            save_path: Local path to save the file
            
        Returns:
            str: Path to saved file
        """
        try:
            response = requests.get(
                file_url,
                headers=self.headers,
                timeout=30,
                stream=True
            )
            response.raise_for_status()
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return save_path
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to download file: {str(e)}")
    
    def generate_visual(self, visual_obj, poll_interval=2, max_wait=60):
        """
        Complete workflow: create request, poll status, download file
        
        Args:
            visual_obj: Visual model instance
            poll_interval: Seconds between status checks
            max_wait: Maximum seconds to wait for completion
            
        Returns:
            Visual: Updated visual object
        """
        # Step 1: Create request
        visual_obj.status = 'processing'
        visual_obj.save()
        
        try:
            response = self.create_visual_request(visual_obj)
            visual_obj.napkin_request_id = response['id']
            visual_obj.save()
        except Exception as e:
            visual_obj.status = 'failed'
            visual_obj.error_message = str(e)
            visual_obj.save()
            raise
        
        # Step 2: Poll for status
        elapsed = 0
        while elapsed < max_wait:
            try:
                status_response = self.get_request_status(visual_obj.napkin_request_id)
                
                if status_response['status'] == 'completed':
                    # Step 3: Download file
                    generated_files = status_response.get('generated_files', [])
                    if generated_files:
                        file_info = generated_files[0]
                        file_url = file_info.get('url')
                        
                        if file_url:
                            # Save to media folder
                            filename = f"visual_{visual_obj.id}.{visual_obj.format}"
                            save_path = os.path.join(settings.MEDIA_ROOT, 'visuals', filename)
                            
                            self.download_visual_file(file_url, save_path)
                            
                            visual_obj.file_path = f'visuals/{filename}'
                            visual_obj.file_url = file_url
                            visual_obj.status = 'completed'
                            visual_obj.save()
                            return visual_obj
                
                elif status_response['status'] == 'failed':
                    visual_obj.status = 'failed'
                    visual_obj.error_message = 'Napkin API processing failed'
                    visual_obj.save()
                    raise Exception('Visual generation failed')
                
                # Still pending or processing
                time.sleep(poll_interval)
                elapsed += poll_interval
                
            except Exception as e:
                visual_obj.status = 'failed'
                visual_obj.error_message = str(e)
                visual_obj.save()
                raise
        
        # Timeout
        visual_obj.status = 'failed'
        visual_obj.error_message = 'Request timeout'
        visual_obj.save()
        raise Exception('Visual generation timed out')


def get_available_styles():
    """
    Get list of available Napkin AI styles
    
    Returns:
        list: List of style dictionaries
    """
    # Built-in styles from Napkin API documentation
    styles = [
        # Colorful Styles
        {'id': 'CDQPRVVJCSTPRBBCD5Q6AWR', 'name': 'Vibrant Strokes', 'category': 'colorful', 'description': 'A flow of vivid lines for bold notes'},
        {'id': 'CDQPRVVJCSTPRBBKDXK78', 'name': 'Glowful Breeze', 'category': 'colorful', 'description': 'A swirl of cheerful color for laid-back planning'},
        {'id': 'CDQPRVVJCSTPRBB6DHGQ8', 'name': 'Bold Canvas', 'category': 'colorful', 'description': 'A vivid field of shapes for lively notes'},
        {'id': 'CDQPRVVJCSTPRBB6D5P6RSB4', 'name': 'Radiant Blocks', 'category': 'colorful', 'description': 'A bright spread of solid color for tasks'},
        {'id': 'CDQPRVVJCSTPRBB7E9GP8TB5DST0', 'name': 'Pragmatic Shades', 'category': 'colorful', 'description': 'A palette of blended hues for bold ideas'},
        
        # Casual Styles
        {'id': 'CDGQ6XB1DGPQ6VV6EG', 'name': 'Carefree Mist', 'category': 'casual', 'description': 'A wisp of calm tones for playful tasks'},
        {'id': 'CDGQ6XB1DGPPCTBCDHJP8', 'name': 'Lively Layers', 'category': 'casual', 'description': 'A breeze of soft color for bright ideas'},
        
        # Hand-drawn Styles
        {'id': 'D1GPWS1DCDQPRVVJCSTPR', 'name': 'Artistic Flair', 'category': 'hand-drawn', 'description': 'A splash of hand-drawn color for creative thinking'},
        {'id': 'D1GPWS1DDHMPWSBK', 'name': 'Sketch Notes', 'category': 'hand-drawn', 'description': 'A hand-drawn style for free-flowing ideas'},
        
        # Formal Styles
        {'id': 'CSQQ4VB1DGPP4V31CDNJTVKFBXK6JV3C', 'name': 'Elegant Outline', 'category': 'formal', 'description': 'A refined black outline for professional clarity'},
        {'id': 'CSQQ4VB1DGPPRTB7D1T0', 'name': 'Subtle Accent', 'category': 'formal', 'description': 'A light touch of color for professional documents'},
        {'id': 'CSQQ4VB1DGPQ6TBECXP6ABB3DXP6YWG', 'name': 'Monochrome Pro', 'category': 'formal', 'description': 'A single-color approach for focused presentations'},
        {'id': 'CSQQ4VB1DGPPTVVEDXHPGWKFDNJJTSKCC5T0', 'name': 'Corporate Clean', 'category': 'formal', 'description': 'A professional flat style for business diagrams'},
        
        # Monochrome Styles
        {'id': 'DNQPWVV3D1S6YVB55NK6RRBM', 'name': 'Minimal Contrast', 'category': 'monochrome', 'description': 'A clean monochrome style for focused work'},
        {'id': 'CXS62Y9DCSQP6XBK', 'name': 'Silver Beam', 'category': 'monochrome', 'description': 'A spotlight of gray scale ease with striking focus'},
    ]
    
    return styles
