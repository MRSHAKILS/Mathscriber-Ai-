from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain_core.runnables import Runnable
from langchain_core.output_parsers import StrOutputParser 
from typing import Dict, Any, Optional
import json
import os 
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class LatexGenerator:
    chain: Runnable
    def __init__(self):
        # 1. Use ChatGoogleGenerativeAI
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-pro", 
            # ChatGoogleGenerativeAI automatically looks for GEMINI_API_KEY or GOOGLE_API_KEY
            temperature=0.1
        )
        
        self.latex_template = PromptTemplate(
            input_variables=["diagram_analysis"],
            template="""
            Based on the following diagram analysis, generate complete LaTeX TikZ code:
            
            {diagram_analysis}
            
            Requirements:
            1. Use tikz package with shapes.geometric and arrows libraries
            2. Create proper node positioning and connections
            3. Include all necessary LaTeX document structure
            4. Use appropriate colors and styles for different components
            5. Ensure the code is compilable and well-commented
            
            Return ONLY the LaTeX code without any explanations:
            """
        )
        
        # LCEL Chain: Prompt | LLM | OutputParser
        self.chain = self.latex_template | self.llm | StrOutputParser()
    
    def generate_latex(self, diagram_analysis: Dict) -> str:
        """Generate LaTeX code from diagram analysis"""
        analysis_str = json.dumps(diagram_analysis, ensure_ascii=False)

        return self.chain.invoke({"diagram_analysis": analysis_str})
    
# --- The Fixed Class ---
class CodeValidator:
    def __init__(self, api_key: Optional[str] = None):
        
        # 2. Use ChatGoogleGenerativeAI
        llm_kwargs = {"model": "gemini-2.5-pro"} 
        llm_kwargs["temperature"] = 0.1 
        
        # NOTE: If you pass an API key directly, you should use the correct
        # parameter name for the Google class, which is 'google_api_key'
        if api_key:
            llm_kwargs["google_api_key"] = api_key
            
        self.llm = ChatGoogleGenerativeAI(**llm_kwargs)
        
        # 🌟 Define the validation chain using LCEL 🌟
        self.validation_prompt = PromptTemplate.from_template(
            """
            Validate this LaTeX TikZ code and fix any issues. Focus on correctness and best practices:
            
            CODE TO VALIDATE:
            ---
            {latex_code}
            ---
            
            Check for:
            1. Syntax errors
            2. Missing packages (especially tikz libraries like shapes.geometric)
            3. Node positioning issues
            4. Arrow connections
            5. Compilation readiness
            
            First, provide a brief (1-2 sentence) summary of changes. 
            Then, return the *COMPLETE* fixed code, ensuring it is a compilable LaTeX document.
            """
        )
        
        # The chain pipes the input to the prompt, then to the LLM, then extracts the string
        self.validation_chain = self.validation_prompt | self.llm | StrOutputParser()
    
    def validate_latex(self, latex_code: str) -> Dict:
        """Validate and refine LaTeX code"""
        
        response = self.validation_chain.invoke({"latex_code": latex_code})
        
        # Pass the full string response to the extraction method
        return self._extract_improved_code(response)
    
    def _extract_improved_code(self, response: str) -> Dict:
        # Extract the complete document structure from the response.
        code_match = re.search(r'(\\documentclass.*\\end\{document\})', response, re.DOTALL)
        
        # Extract a summary of changes, which is typically the text before the code block.
        summary_match = re.split(r'\\documentclass', response, 1)
        changes_summary = summary_match[0].strip() if summary_match else "No specific changes summary was extracted."

        return {
            "improved_code": code_match.group(1).strip() if code_match else "Could not extract complete LaTeX code.",
            "changes": changes_summary
        }