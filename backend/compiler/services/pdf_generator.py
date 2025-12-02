"""
PDF Generator Service
Alternative PDF generation using ReportLab for simple LaTeX rendering
"""
import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import re


class PDFGenerator:
    """
    Generate PDF from LaTeX-like content using ReportLab
    This is a fallback when pdflatex is not available
    """
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        # Section style
        self.styles.add(ParagraphStyle(
            name='Section',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=12,
            spaceBefore=12
        ))
        
        # Subsection style
        self.styles.add(ParagraphStyle(
            name='Subsection',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=6,
            spaceBefore=6
        ))
    
    def simple_latex_to_pdf(self, latex_content):
        """
        Convert simple LaTeX to PDF (limited functionality)
        
        Args:
            latex_content (str): LaTeX source
        
        Returns:
            bytes: PDF content
        """
        buffer = io.BytesIO()
        
        # Create PDF document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        
        # Parse LaTeX content
        story = self._parse_latex_content(latex_content)
        
        # Build PDF
        doc.build(story)
        
        # Get PDF bytes
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
    
    def _parse_latex_content(self, latex_content):
        """
        Parse LaTeX commands and convert to ReportLab elements
        This is a simplified parser for basic LaTeX
        """
        story = []
        
        # Extract title
        title_match = re.search(r'\\title\{([^}]+)\}', latex_content)
        if title_match:
            title = title_match.group(1)
            story.append(Paragraph(title, self.styles['CustomTitle']))
            story.append(Spacer(1, 0.2 * inch))
        
        # Extract author
        author_match = re.search(r'\\author\{([^}]+)\}', latex_content)
        if author_match:
            author = author_match.group(1)
            story.append(Paragraph(f"<i>{author}</i>", self.styles['Normal']))
            story.append(Spacer(1, 0.3 * inch))
        
        # Extract document content
        doc_match = re.search(r'\\begin\{document\}(.*?)\\end\{document\}', latex_content, re.DOTALL)
        if doc_match:
            content = doc_match.group(1)
            
            # Process sections
            sections = re.split(r'(\\section\{[^}]+\}|\\subsection\{[^}]+\})', content)
            
            for part in sections:
                part = part.strip()
                if not part:
                    continue
                
                # Section
                section_match = re.match(r'\\section\{([^}]+)\}', part)
                if section_match:
                    story.append(Spacer(1, 0.2 * inch))
                    story.append(Paragraph(section_match.group(1), self.styles['Section']))
                    continue
                
                # Subsection
                subsection_match = re.match(r'\\subsection\{([^}]+)\}', part)
                if subsection_match:
                    story.append(Spacer(1, 0.15 * inch))
                    story.append(Paragraph(subsection_match.group(1), self.styles['Subsection']))
                    continue
                
                # Regular paragraphs
                paragraphs = part.split('\n\n')
                for para in paragraphs:
                    para = para.strip()
                    if para and not para.startswith('\\'):
                        # Clean LaTeX commands (basic)
                        para = self._clean_latex_commands(para)
                        if para:
                            story.append(Paragraph(para, self.styles['Normal']))
                            story.append(Spacer(1, 0.1 * inch))
        
        return story
    
    def _clean_latex_commands(self, text):
        """Remove or convert basic LaTeX commands"""
        # Remove common commands
        text = re.sub(r'\\maketitle', '', text)
        text = re.sub(r'\\tableofcontents', '', text)
        text = re.sub(r'\\newpage', '', text)
        text = re.sub(r'\\pagebreak', '', text)
        
        # Convert text formatting
        text = re.sub(r'\\textbf\{([^}]+)\}', r'<b>\1</b>', text)
        text = re.sub(r'\\textit\{([^}]+)\}', r'<i>\1</i>', text)
        text = re.sub(r'\\emph\{([^}]+)\}', r'<i>\1</i>', text)
        
        # Remove math environments (can't render properly)
        text = re.sub(r'\$[^\$]+\$', '[MATH]', text)
        text = re.sub(r'\\begin\{equation\}.*?\\end\{equation\}', '[EQUATION]', text, flags=re.DOTALL)
        
        # Remove other environments
        text = re.sub(r'\\begin\{[^}]+\}', '', text)
        text = re.sub(r'\\end\{[^}]+\}', '', text)
        
        return text.strip()
    
    @staticmethod
    def add_watermark(pdf_bytes, watermark_text="Generated by MathScriber"):
        """
        Add watermark to PDF (placeholder for future implementation)
        """
        # This would require PyPDF2 or similar library
        return pdf_bytes
