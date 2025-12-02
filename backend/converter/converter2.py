"""
Advanced Gemini API integration with Agentic Workflow for converting images to LaTeX
Uses multiple specialized agents for identification, conversion, and validation
"""
import google.generativeai as genai
from django.conf import settings
from PIL import Image
import io
import re


class AgenticGeminiConverter:
    """Multi-agent system for robust image to LaTeX conversion"""
    
    def __init__(self):
        """Initialize Gemini API with API key and create specialized agents"""
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        
        # Initialize three specialized agent models
        self.identifier_agent = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.converter_agent = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.validator_agent = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    def _identify_content(self, image):
        """
        Agent 1: Identify and analyze the content type in the image
        
        Args:
            image: PIL Image object
            
        Returns:
            dict: Content analysis with type, complexity, and elements
        """
        prompt = """
        You are a Content Identification Agent. Your job is to analyze this image and identify what type of mathematical or scientific content it contains.
        
        Analyze the image and provide a structured response in the following format:
        
        CONTENT_TYPE: [equation/diagram/table/mixed/text]
        COMPLEXITY: [simple/medium/complex]
        ELEMENTS: [list the main mathematical elements you see, e.g., fractions, integrals, matrices, etc.]
        SPECIAL_NOTATION: [any special notation like summation, limits, Greek letters, etc.]
        STRUCTURE: [describe the overall structure and layout]
        
        Be precise and thorough in your analysis.
        """
        
        try:
            response = self.identifier_agent.generate_content([prompt, image])
            analysis = response.text.strip()
            
            # Parse the response
            content_info = {
                'raw_analysis': analysis,
                'content_type': self._extract_field(analysis, 'CONTENT_TYPE'),
                'complexity': self._extract_field(analysis, 'COMPLEXITY'),
                'elements': self._extract_field(analysis, 'ELEMENTS'),
                'special_notation': self._extract_field(analysis, 'SPECIAL_NOTATION'),
                'structure': self._extract_field(analysis, 'STRUCTURE')
            }
            
            return content_info
            
        except Exception as e:
            raise Exception(f"Content identification failed: {str(e)}")
    
    def _convert_to_latex(self, image, content_info):
        """
        Agent 2: Convert the image to LaTeX based on identified content
        
        Args:
            image: PIL Image object
            content_info: Analysis from identifier agent
            
        Returns:
            str: Generated LaTeX code
        """
        # Build context-aware prompt based on content analysis
        content_type = content_info.get('content_type', 'unknown')
        complexity = content_info.get('complexity', 'medium')
        elements = content_info.get('elements', '')
        special_notation = content_info.get('special_notation', '')
        
        prompt = f"""
        You are a LaTeX Conversion Agent. You have received analysis from the Identification Agent:
        
        Content Type: {content_type}
        Complexity: {complexity}
        Elements Present: {elements}
        Special Notation: {special_notation}
        
        Your task is to convert this image into PERFECT LaTeX code following these STRICT rules:
        
        1. For EQUATIONS:
           - Use $...$ for inline math
           - Use $$...$$ for display math
           - Ensure ALL brackets are properly matched: (), [], {{}}, \\left( \\right), etc.
        
        2. For DIAGRAMS:
           - Use TikZ package
           - Include \\usepackage{{tikz}} comment at top
           - Provide complete, compilable TikZ code
        
        3. For TABLES:
           - Use tabular or array environment
           - Ensure proper alignment markers
           - Include all necessary & and \\\\ symbols
        
        4. CRITICAL OUTPUT REQUIREMENTS:
           - Return ONLY pure LaTeX code
           - NO markdown formatting (no ```latex blocks)
           - NO explanatory text before or after
           - NO extra words or descriptions
           - Start directly with LaTeX code
           - Ensure every opening bracket has a closing bracket
           - Double-check all mathematical delimiters
        
        5. ACCURACY:
           - Preserve exact mathematical meaning
           - Match subscripts and superscripts precisely
           - Maintain correct operator spacing
           - Use proper mathematical symbols
        
        Convert this image to LaTeX now:
        """
        
        try:
            response = self.converter_agent.generate_content([prompt, image])
            latex_code = response.text.strip()
            
            # Remove markdown code blocks if present
            latex_code = self._clean_latex_output(latex_code)
            
            return latex_code
            
        except Exception as e:
            raise Exception(f"LaTeX conversion failed: {str(e)}")
    
    def _validate_latex(self, latex_code, image, content_info):
        """
        Agent 3: Validate, verify, and correct the generated LaTeX code
        
        Args:
            latex_code: Generated LaTeX code
            image: Original PIL Image object
            content_info: Analysis from identifier agent
            
        Returns:
            dict: Validation results and corrected code
        """
        prompt = f"""
        You are a LaTeX Validation Agent. You must verify that the generated LaTeX code is correct and matches the original image.
        
        Original Content Analysis:
        {content_info.get('raw_analysis', '')}
        
        Generated LaTeX Code:
        {latex_code}
        
        Your validation tasks:
        
        1. BRACKET MATCHING:
           - Check that every opening bracket has a closing bracket: (), [], {{}}, \\left(\\right), \\left[\\right], \\left\\{{\\right\\}}
           - Verify mathematical delimiters are balanced: $ $, $$ $$
           - Count and verify: {{ must equal }}, \\left must equal \\right
        
        2. SYNTAX VALIDATION:
           - Verify all LaTeX commands are properly formed
           - Check for missing backslashes
           - Ensure proper environment usage (\\begin{{...}} \\end{{...}})
        
        3. CONTENT ACCURACY (compare with image):
           - Verify all mathematical symbols are present
           - Check subscripts and superscripts match
           - Confirm operators and relations are correct
           - Ensure no extra text or words are added
        
        4. CLEANLINESS:
           - Confirm no markdown formatting (```latex)
           - Verify no explanatory text
           - Check that output starts directly with LaTeX
        
        Provide your response in this format:
        
        VALIDATION_STATUS: [PASS/FAIL]
        BRACKET_CHECK: [PASS/FAIL - details]
        SYNTAX_CHECK: [PASS/FAIL - details]
        CONTENT_CHECK: [PASS/FAIL - details]
        CLEANLINESS_CHECK: [PASS/FAIL - details]
        ISSUES_FOUND: [list any issues]
        CORRECTED_CODE: [provide corrected LaTeX code if needed, or NONE if no corrections needed]
        
        Be thorough and precise.
        """
        
        try:
            response = self.validator_agent.generate_content([prompt, image])
            validation_result = response.text.strip()
            
            # Parse validation results
            validation_status = self._extract_field(validation_result, 'VALIDATION_STATUS')
            bracket_check = self._extract_field(validation_result, 'BRACKET_CHECK')
            syntax_check = self._extract_field(validation_result, 'SYNTAX_CHECK')
            content_check = self._extract_field(validation_result, 'CONTENT_CHECK')
            cleanliness_check = self._extract_field(validation_result, 'CLEANLINESS_CHECK')
            issues = self._extract_field(validation_result, 'ISSUES_FOUND')
            corrected_code = self._extract_field(validation_result, 'CORRECTED_CODE')
            
            # Additional programmatic validation
            programmatic_checks = self._programmatic_validation(latex_code)
            
            # Determine final code
            if corrected_code and corrected_code.upper() != 'NONE':
                final_code = self._clean_latex_output(corrected_code)
            else:
                final_code = latex_code
            
            # Apply programmatic fixes if needed
            if not programmatic_checks['all_passed']:
                final_code = self._apply_fixes(final_code, programmatic_checks)
            
            return {
                'validation_status': validation_status,
                'bracket_check': bracket_check,
                'syntax_check': syntax_check,
                'content_check': content_check,
                'cleanliness_check': cleanliness_check,
                'issues': issues,
                'programmatic_checks': programmatic_checks,
                'original_code': latex_code,
                'final_code': final_code,
                'was_corrected': corrected_code and corrected_code.upper() != 'NONE',
                'validation_report': validation_result
            }
            
        except Exception as e:
            raise Exception(f"LaTeX validation failed: {str(e)}")
    
    def _programmatic_validation(self, latex_code):
        """
        Perform programmatic validation checks on LaTeX code
        
        Args:
            latex_code: LaTeX code to validate
            
        Returns:
            dict: Validation results
        """
        checks = {
            'bracket_balance': True,
            'delimiter_balance': True,
            'no_markdown': True,
            'no_extra_text': True,
            'all_passed': True,
            'issues': []
        }
        
        # Check bracket balance
        bracket_pairs = [('(', ')'), ('[', ']'), ('{', '}')]
        for open_br, close_br in bracket_pairs:
            open_count = latex_code.count(open_br)
            close_count = latex_code.count(close_br)
            if open_count != close_count:
                checks['bracket_balance'] = False
                checks['issues'].append(f"Unbalanced {open_br}{close_br}: {open_count} open, {close_count} close")
        
        # Check LaTeX delimiters
        single_dollar = latex_code.count('$')
        if single_dollar % 2 != 0:
            checks['delimiter_balance'] = False
            checks['issues'].append(f"Unbalanced $ delimiters: {single_dollar} found")
        
        # Check for \\left and \\right balance
        left_count = len(re.findall(r'\\left', latex_code))
        right_count = len(re.findall(r'\\right', latex_code))
        if left_count != right_count:
            checks['bracket_balance'] = False
            checks['issues'].append(f"Unbalanced \\left\\right: {left_count} left, {right_count} right")
        
        # Check for markdown formatting
        if '```' in latex_code:
            checks['no_markdown'] = False
            checks['issues'].append("Contains markdown code blocks")
        
        # Check for common extra text patterns
        extra_text_patterns = [
            r'^Here is',
            r'^The LaTeX code',
            r'^This is',
            r'```latex',
            r'```'
        ]
        for pattern in extra_text_patterns:
            if re.search(pattern, latex_code, re.IGNORECASE | re.MULTILINE):
                checks['no_extra_text'] = False
                checks['issues'].append(f"Contains extra text matching pattern: {pattern}")
        
        # Update all_passed
        checks['all_passed'] = all([
            checks['bracket_balance'],
            checks['delimiter_balance'],
            checks['no_markdown'],
            checks['no_extra_text']
        ])
        
        return checks
    
    def _apply_fixes(self, latex_code, checks):
        """
        Apply automatic fixes based on validation results
        
        Args:
            latex_code: LaTeX code to fix
            checks: Validation check results
            
        Returns:
            str: Fixed LaTeX code
        """
        fixed_code = latex_code
        
        # Remove markdown code blocks
        if not checks['no_markdown']:
            fixed_code = re.sub(r'```latex\n?', '', fixed_code)
            fixed_code = re.sub(r'```\n?', '', fixed_code)
        
        # Remove common extra text at the beginning
        lines = fixed_code.split('\n')
        cleaned_lines = []
        started = False
        
        for line in lines:
            # Skip lines that look like explanatory text
            if not started:
                if (line.strip().startswith('$') or 
                    line.strip().startswith('\\') or
                    line.strip().startswith('{') or
                    '\\begin' in line or
                    '\\usepackage' in line):
                    started = True
                    cleaned_lines.append(line)
                elif re.match(r'^[A-Z][a-z]+\s+', line):
                    # Skip lines starting with capitalized words (likely explanation)
                    continue
                else:
                    cleaned_lines.append(line)
            else:
                cleaned_lines.append(line)
        
        fixed_code = '\n'.join(cleaned_lines)
        
        return fixed_code.strip()
    
    def _clean_latex_output(self, latex_code):
        """
        Clean LaTeX output by removing markdown and extra text
        
        Args:
            latex_code: Raw LaTeX code
            
        Returns:
            str: Cleaned LaTeX code
        """
        # Remove markdown code blocks
        latex_code = re.sub(r'```latex\n?', '', latex_code)
        latex_code = re.sub(r'```\n?', '', latex_code)
        
        # Remove common prefixes
        latex_code = re.sub(r'^(Here is the LaTeX code:?|The LaTeX code is:?)\s*\n?', '', latex_code, flags=re.IGNORECASE)
        
        return latex_code.strip()
    
    def _extract_field(self, text, field_name):
        """
        Extract a field value from structured agent response
        
        Args:
            text: Full response text
            field_name: Field name to extract
            
        Returns:
            str: Extracted field value or empty string
        """
        pattern = rf'{field_name}:\s*(.+?)(?=\n[A-Z_]+:|$)'
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            return match.group(1).strip()
        return ''
    
    def convert_image_to_latex(self, image_file):
        """
        Main method: Convert image to LaTeX using multi-agent workflow
        
        Args:
            image_file: Django UploadedFile object
            
        Returns:
            dict: Complete conversion results including all agent outputs
        """
        try:
            # Open image using PIL
            image = Image.open(image_file)
            
            # Agent 1: Identify content
            print("Agent 1: Identifying content...")
            content_info = self._identify_content(image)
            
            # Agent 2: Convert to LaTeX
            print("Agent 2: Converting to LaTeX...")
            latex_code = self._convert_to_latex(image, content_info)
            
            # Agent 3: Validate and correct
            print("Agent 3: Validating and correcting...")
            validation_results = self._validate_latex(latex_code, image, content_info)
            
            # Compile complete results
            results = {
                'success': True,
                'latex_code': validation_results['final_code'],
                'content_analysis': content_info,
                'validation': validation_results,
                'workflow': {
                    'agent_1_identification': 'completed',
                    'agent_2_conversion': 'completed',
                    'agent_3_validation': 'completed'
                }
            }
            
            return results
            
        except Exception as e:
            raise Exception(f"Multi-agent conversion failed: {str(e)}")
