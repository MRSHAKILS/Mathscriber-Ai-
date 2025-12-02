from langchain_google_genai import ChatGoogleGenerativeAI
from typing import Dict
from langchain_core.messages.human import HumanMessage
import os

class DiagramAnalyzer:
    def __init__(self, api_key: str = None):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro-vision",
            google_api_key=api_key,
            temperature=0.1,
            max_output_tokens=4096
        )
    
    def extract_diagram_elements(self, image_base64: str) -> Dict:
        """Use multi-modal LLM to analyze diagram and extract components"""
        
        prompt = """
        Analyze this flowchart/ER diagram and identify all components. Return structured JSON with:
        {
            "diagram_type": "flowchart" or "er_diagram",
            "components": [
                {
                    "type": "process/decision/input/output/entity/relationship",
                    "label": "text content",
                    "position": "approximate position",
                    "connections": ["connected_component_ids"]
                }
            ],
            "layout": "vertical/horizontal/grid",
            "metadata": {
                "shape_types": ["rectangle", "diamond", "circle", ...],
                "arrow_directions": ["down", "right", "left", ...]
            }
        }
        """
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{image_base64}"}
                }
            ]
        )
        
        response = self.llm([message])
        return self._parse_response(response.content)
    
    def _parse_response(self, response: str) -> Dict:
        # Extract JSON from LLM response
        import json
        import re
        
        # Try to find JSON in response
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return {"error": "Could not parse response"}