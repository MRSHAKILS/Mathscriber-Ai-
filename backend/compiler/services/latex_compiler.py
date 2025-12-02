"""
LaTeX Compiler Service
Handles LaTeX to PDF compilation with comprehensive error handling
"""
import os
import subprocess
import tempfile
import shutil
import time
from pathlib import Path
from django.conf import settings
from django.core.files.base import ContentFile


class LatexCompiler:
    """Service for compiling LaTeX documents to PDF"""
    
    def __init__(self):
        self.temp_dir = None
        self.compilation_errors = []
        self.compilation_warnings = []
        self._refresh_path()
    
    def _refresh_path(self):
        """Refresh PATH environment variable on Windows to include user PATH changes"""
        if os.name == 'nt':  # Windows only
            try:
                import winreg
                
                # Get Machine PATH
                with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r'SYSTEM\CurrentControlSet\Control\Session Manager\Environment') as key:
                    machine_path = winreg.QueryValueEx(key, 'Path')[0]
                
                # Get User PATH
                with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Environment') as key:
                    try:
                        user_path = winreg.QueryValueEx(key, 'Path')[0]
                    except FileNotFoundError:
                        user_path = ''
                
                # Combine and update current process PATH
                combined_path = machine_path + ';' + user_path if user_path else machine_path
                os.environ['PATH'] = combined_path
                
            except Exception as e:
                # If registry read fails, just continue with existing PATH
                pass
    
    def compile(self, latex_content, file_name='document'):
        """
        Compile LaTeX content to PDF
        
        Args:
            latex_content (str): LaTeX source code
            file_name (str): Name for the output file
        
        Returns:
            tuple: (success: bool, pdf_bytes: bytes, error_log: str, compile_time: float)
        """
        start_time = time.time()
        self.compilation_errors = []
        self.compilation_warnings = []
        
        try:
            # Create temporary directory
            self.temp_dir = tempfile.mkdtemp(prefix='latex_compile_')
            
            # Write LaTeX content to file
            tex_file_path = os.path.join(self.temp_dir, f'{file_name}.tex')
            with open(tex_file_path, 'w', encoding='utf-8') as f:
                f.write(latex_content)
            
            # Try to compile with pdflatex (2 passes for references)
            success = self._compile_with_pdflatex(file_name)
            
            if not success:
                # Fallback: Try with xelatex
                success = self._compile_with_xelatex(file_name)
            
            compile_time = time.time() - start_time
            
            if success:
                # Read the generated PDF
                pdf_path = os.path.join(self.temp_dir, f'{file_name}.pdf')
                if os.path.exists(pdf_path):
                    with open(pdf_path, 'rb') as pdf_file:
                        pdf_bytes = pdf_file.read()
                    
                    error_log = self._format_log()
                    return True, pdf_bytes, error_log, compile_time
                else:
                    self.compilation_errors.append("PDF file was not generated")
                    return False, None, self._format_log(), compile_time
            else:
                return False, None, self._format_log(), compile_time
        
        except Exception as e:
            compile_time = time.time() - start_time
            self.compilation_errors.append(f"Compilation exception: {str(e)}")
            return False, None, self._format_log(), compile_time
        
        finally:
            # Cleanup temporary directory
            if self.temp_dir and os.path.exists(self.temp_dir):
                try:
                    shutil.rmtree(self.temp_dir)
                except Exception:
                    pass
    
    def _compile_with_pdflatex(self, file_name):
        """Compile using pdflatex"""
        try:
            # Find pdflatex executable
            pdflatex_path = shutil.which("pdflatex")
            if pdflatex_path is None:
                self.compilation_errors.append("pdflatex not found. Please install TeX Live or MiKTeX.")
                return False
            
            # First pass
            result = subprocess.run(
                [
                    pdflatex_path,
                    '-interaction=nonstopmode',
                    '-halt-on-error',
                    '-output-directory', self.temp_dir,
                    f'{file_name}.tex'
                ],
                cwd=self.temp_dir,
                capture_output=True,
                text=True,
                timeout=120  # Increased to 120 seconds (2 minutes)
            )
            
            self._parse_latex_output(result.stdout, result.stderr)
            
            if result.returncode != 0:
                return False
            
            # Second pass (for references, table of contents, etc.)
            result = subprocess.run(
                [
                    pdflatex_path,
                    '-interaction=nonstopmode',
                    '-halt-on-error',
                    '-output-directory', self.temp_dir,
                    f'{file_name}.tex'
                ],
                cwd=self.temp_dir,
                capture_output=True,
                text=True,
                timeout=120  # Increased to 120 seconds (2 minutes)
            )
            
            self._parse_latex_output(result.stdout, result.stderr)
            
            return result.returncode == 0
        
        except FileNotFoundError:
            self.compilation_errors.append("pdflatex not found. Please install TeX Live or MiKTeX.")
            return False
        except subprocess.TimeoutExpired:
            self.compilation_errors.append("Compilation timeout (120 seconds exceeded)")
            self.compilation_errors.append("This may be due to:")
            self.compilation_errors.append("- MiKTeX installing packages for the first time (try compiling again)")
            self.compilation_errors.append("- Very complex document")
            self.compilation_errors.append("- Infinite loop in LaTeX code")
            return False
        except Exception as e:
            self.compilation_errors.append(f"pdflatex error: {str(e)}")
            return False
    
    def _compile_with_xelatex(self, file_name):
        """Compile using xelatex (fallback)"""
        try:
            # Find xelatex executable
            xelatex_path = shutil.which("xelatex")
            if xelatex_path is None:
                self.compilation_errors.append("xelatex not found")
                return False
            
            result = subprocess.run(
                [
                    xelatex_path,
                    '-interaction=nonstopmode',
                    '-halt-on-error',
                    '-output-directory', self.temp_dir,
                    f'{file_name}.tex'
                ],
                cwd=self.temp_dir,
                capture_output=True,
                text=True,
                timeout=120  # Increased to 120 seconds (2 minutes)
            )
            
            self._parse_latex_output(result.stdout, result.stderr)
            
            return result.returncode == 0
        
        except FileNotFoundError:
            self.compilation_errors.append("xelatex not found")
            return False
        except subprocess.TimeoutExpired:
            self.compilation_errors.append("XeLaTeX compilation timeout (120 seconds exceeded)")
            self.compilation_errors.append("This may be due to MiKTeX installing packages - try compiling again")
            return False
        except Exception as e:
            self.compilation_errors.append(f"xelatex error: {str(e)}")
            return False
    
    def _parse_latex_output(self, stdout, stderr):
        """Parse LaTeX compiler output for errors and warnings"""
        lines = stdout.split('\n') if stdout else []
        
        for line in lines:
            line = line.strip()
            if line.startswith('!'):
                self.compilation_errors.append(line)
            elif 'Error' in line or 'error' in line:
                self.compilation_errors.append(line)
            elif 'Warning' in line or 'warning' in line:
                self.compilation_warnings.append(line)
        
        if stderr:
            self.compilation_errors.append(f"STDERR: {stderr}")
    
    def _format_log(self):
        """Format compilation log"""
        log_parts = []
        
        if self.compilation_errors:
            log_parts.append("=== ERRORS ===")
            log_parts.extend(self.compilation_errors)
        
        if self.compilation_warnings:
            log_parts.append("\n=== WARNINGS ===")
            log_parts.extend(self.compilation_warnings[:10])  # Limit warnings
            if len(self.compilation_warnings) > 10:
                log_parts.append(f"... and {len(self.compilation_warnings) - 10} more warnings")
        
        if not log_parts:
            log_parts.append("Compilation successful with no errors or warnings")
        
        return '\n'.join(log_parts)
    
    @staticmethod
    def validate_latex(content):
        """
        Basic LaTeX validation
        
        Returns:
            tuple: (is_valid: bool, errors: list)
        """
        errors = []
        
        # Check for basic document structure
        if '\\documentclass' not in content:
            errors.append("Missing \\documentclass declaration")
        
        if '\\begin{document}' not in content:
            errors.append("Missing \\begin{document}")
        
        if '\\end{document}' not in content:
            errors.append("Missing \\end{document}")
        
        # Check for balanced braces
        open_braces = content.count('{')
        close_braces = content.count('}')
        if open_braces != close_braces:
            errors.append(f"Unbalanced braces: {open_braces} open, {close_braces} close")
        
        # Check for balanced begin/end environments
        begin_count = content.count('\\begin{')
        end_count = content.count('\\end{')
        if begin_count != end_count:
            errors.append(f"Unbalanced environments: {begin_count} \\begin, {end_count} \\end")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def get_default_template():
        """Return a basic LaTeX template"""
        return r"""\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}
\usepackage{amsfonts}
\usepackage{amssymb}
\usepackage{graphicx}
\usepackage{hyperref}

\title{New LaTeX Document}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}

Write your content here.

\subsection{Example Equation}

Here's an inline equation: $E = mc^2$

And a display equation:
\begin{equation}
    \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\end{equation}

\section{Conclusion}

Your conclusion here.

\end{document}
"""
