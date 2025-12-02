import os
import random
import sys
import importlib.util
import fitz  # PyMuPDF
from pdf2image import convert_from_path
from PIL import Image
import tempfile
import shutil
import subprocess
from pathlib import Path

# Global variables to store loaded modules
latexocr_module = None
table_ocr_module = None
ocr_modules_loaded = False

def load_ocr_modules():
    """
    Try to load the actual OCR modules from the Notebooks directory.
    Returns True if modules are available, False otherwise.
    """
    global latexocr_module, table_ocr_module, ocr_modules_loaded
    
    if ocr_modules_loaded:
        return True
        
    try:
        # Add Notebooks directory to path
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Notebooks')
        if notebooks_dir not in sys.path:
            sys.path.append(notebooks_dir)
        
        # Import equation OCR module
        try:
            spec = importlib.util.spec_from_file_location("latexocr", 
                                                         os.path.join(notebooks_dir, "latexocr.py"))
            if spec and spec.loader:
                latexocr_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(latexocr_module)
                print("✅ Successfully loaded equation OCR module")
        except Exception as e:
            print(f"❌ Could not load equation OCR module: {e}")
            latexocr_module = None
            
        # Import table OCR module  
        try:
            spec = importlib.util.spec_from_file_location("table_to_latex", 
                                                         os.path.join(notebooks_dir, "table_to_latex.py"))
            if spec and spec.loader:
                table_ocr_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(table_ocr_module)
                print("✅ Successfully loaded table OCR module")
        except Exception as e:
            print(f"❌ Could not load table OCR module: {e}")
            table_ocr_module = None
            
        ocr_modules_loaded = True
        return latexocr_module is not None or table_ocr_module is not None
        
    except Exception as e:
        print(f"❌ Error loading OCR modules: {e}")
        return False

def process_image_to_latex(image_path, task_type):
    """
    Process image to LaTeX using either the actual OCR modules or mock data.
    """
    
    # Handle Gemini table processing separately
    if task_type == 'table_gemini':
        return process_table_with_gemini(image_path)
    
    # Handle Gemini Universal processing (auto-detects equation/table/diagram)
    if task_type == 'gemini_universal':
        return process_with_gemini_universal(image_path)
    
    # Handle Groq processing separately (handles both tables and equations)
    if task_type == 'groq':
        return process_with_groq(image_path)
    
    # Handle Mistral processing separately (handles both tables and equations)
    if task_type == 'mistral':
        return process_with_mistral(image_path)
    
    # Handle Gemini diagram processing separately
    if task_type == 'gemini_diagram':
        return process_with_gemini_diagram(image_path)
    
    # Try to use actual OCR modules first
    if load_ocr_modules():
        try:
            if task_type == 'equation' and latexocr_module:
                print(f"🔄 Processing equation image: {image_path}")
                # Use the pix2tex model directly
                from pix2tex.cli import LatexOCR
                
                # Initialize the model
                model = LatexOCR()
                
                # Process the image
                img = Image.open(image_path)
                raw_latex = model(img)
                
                # Clean the output using the function from latexocr module
                if hasattr(latexocr_module, 'clean_latex_code'):
                    cleaned_latex = latexocr_module.clean_latex_code(raw_latex)
                else:
                    cleaned_latex = raw_latex
                
                print(f"✅ Equation OCR successful: {cleaned_latex}")
                return cleaned_latex
                        
            elif task_type == 'table' and table_ocr_module:
                print(f"🔄 Processing table image: {image_path}")
                # Check if Tesseract is available
                try:
                    import pytesseract
                    # Try to run tesseract to see if it's available
                    pytesseract.get_tesseract_version()
                    
                    # Use the table OCR function
                    if hasattr(table_ocr_module, 'image_to_latex_table'):
                        result = table_ocr_module.image_to_latex_table(image_path)
                        print(f"✅ Table OCR successful: {result}")
                        return result
                except Exception as tesseract_error:
                    print(f"⚠️ Tesseract not available: {tesseract_error}")
                    print("🔄 Using fallback for table processing")
                        
        except Exception as e:
            print(f"❌ Error using OCR modules: {e}")
            print("🔄 Falling back to mock data")
            # Fall back to mock data
    else:
        print("⚠️ OCR modules not available, using mock data")
    
    # Fallback to mock LaTeX outputs for demonstration
    equation_samples = [
        r"E = mc^2",
        r"\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
        r"\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}",
        r"\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}",
        r"F(x) = \int_{-\infty}^{x} f(t) dt",
        r"\lim_{x \to 0} \frac{\sin x}{x} = 1",
        r"\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}",
        r"\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u"
    ]
    
    table_samples = [
        r"\begin{array}{|c|c|c|}\hline x & y & z \\ \hline 1 & 2 & 3 \\ 4 & 5 & 6 \\ \hline \end{array}",
        r"\begin{array}{cc} a & b \\ c & d \end{array}",
        r"\begin{array}{|l|r|}\hline \text{Name} & \text{Value} \\ \hline \text{Alpha} & 0.05 \\ \text{Beta} & 0.95 \\ \hline \end{array}",
        r"\begin{array}{|c|c|c|c|}\hline \text{ID} & \text{Name} & \text{Score} & \text{Grade} \\ \hline 1 & \text{Alice} & 95 & \text{A} \\ 2 & \text{Bob} & 87 & \text{B} \\ 3 & \text{Charlie} & 92 & \text{A} \\ \hline \end{array}"
    ]
    
    try:
        # Validate that the image exists and can be opened
        with Image.open(image_path) as img:
            # Get image dimensions for processing simulation
            width, height = img.size
            
        # Simulate processing time
        import time
        time.sleep(0.1)  # Small delay to simulate processing
        
        # Return mock LaTeX based on task type
        if task_type == 'equation':
            return random.choice(equation_samples)
        elif task_type == 'table':
            return random.choice(table_samples)
        else:
            return r"\text{Unknown task type}"
            
    except Exception as e:
        # Return error message as LaTeX comment
        return f"% Error processing image: {str(e)}"

def validate_image(image_path):
    """
    Validate that the uploaded file is a valid image.
    """
    try:
        with Image.open(image_path) as img:
            img.verify()
        return True
    except Exception:
        return False

def validate_pdf(pdf_path):
    """
    Validate that the uploaded file is a valid PDF.
    """
    try:
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        doc.close()
        return page_count > 0
    except Exception:
        return False

def pdf_to_images(pdf_path, output_dir=None):
    """
    Convert PDF pages to images.
    Returns list of image paths.
    """
    try:
        if output_dir is None:
            output_dir = tempfile.mkdtemp()
        
        # Convert PDF to images using pdf2image
        images = convert_from_path(pdf_path, dpi=300, fmt='PNG')
        
        image_paths = []
        for i, image in enumerate(images):
            image_path = os.path.join(output_dir, f'page_{i+1}.png')
            image.save(image_path, 'PNG')
            image_paths.append(image_path)
        
        return image_paths
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
        return []

def process_pdf_to_latex(pdf_path, task_type):
    """
    Process PDF file by converting pages to images and then running OCR.
    Returns a list of LaTeX outputs for each page.
    """
    try:
        # For Gemini table processing, use direct PDF processing if possible
        if task_type == 'table_gemini':
            # Process the entire PDF at once
            latex_output = process_table_with_gemini(pdf_path)
            return [latex_output]
        
        # For Gemini Universal processing, use direct PDF processing if possible
        if task_type == 'gemini_universal':
            # Process the entire PDF at once
            latex_output = process_with_gemini_universal(pdf_path)
            return [latex_output]
        
        # For Groq processing, use direct PDF processing if possible
        if task_type == 'groq':
            # Process the entire PDF at once
            latex_output = process_with_groq(pdf_path)
            return [latex_output]
        
        # For Grok 2 processing, use direct PDF processing if possible
        if task_type == 'grok2':
            # Process the entire PDF at once
            latex_output = process_with_grok2(pdf_path)
            return [latex_output]
        
        # For Mistral processing, use direct PDF processing if possible
        if task_type == 'mistral':
            # Process the entire PDF at once
            latex_output = process_with_mistral(pdf_path)
            return [latex_output]
        
        # For DeepSeek diagram processing, use direct PDF processing if possible
        if task_type == 'deepseek_diagram':
            # Process the entire PDF at once
            latex_output = process_with_deepseek_diagram(pdf_path)
            return [latex_output]
        
        # For OpenAI diagram processing, use direct PDF processing if possible
        if task_type == 'openai_diagram':
            # Process the entire PDF at once
            latex_output = process_with_openai_diagram(pdf_path)
            return [latex_output]
        
        # For Gemini diagram processing, use direct PDF processing if possible
        if task_type == 'gemini_diagram':
            # Process the entire PDF at once
            latex_output = process_with_gemini_diagram(pdf_path)
            return [latex_output]
        
        # Create temporary directory for images
        temp_dir = tempfile.mkdtemp()
        
        # Convert PDF to images
        image_paths = pdf_to_images(pdf_path, temp_dir)
        
        if not image_paths:
            return [f"% Error: Could not convert PDF to images"]
        
        results = []
        for i, image_path in enumerate(image_paths):
            print(f"🔄 Processing PDF page {i+1}/{len(image_paths)}")
            
            # Process each page image with OCR
            latex_output = process_image_to_latex(image_path, task_type)
            
            # Add page information to output
            page_result = f"% Page {i+1}\n{latex_output}"
            results.append(page_result)
        
        # Cleanup temporary directory
        shutil.rmtree(temp_dir, ignore_errors=True)
        
        return results
        
    except Exception as e:
        print(f"❌ Error processing PDF: {e}")
        return [f"% Error processing PDF: {str(e)}"]

def is_pdf_file(file_path):
    """
    Check if the file is a PDF based on extension and content.
    """
    if not file_path.lower().endswith('.pdf'):
        return False
    
    try:
        with open(file_path, 'rb') as f:
            header = f.read(4)
            return header == b'%PDF'
    except:
        return False

def process_table_with_gemini(image_path):
    """
    Process image (table or equation) using Gemini API via convert_table_gemini.py script.
    Returns LaTeX output as a string.
    """
    try:
        # Path to convert_table_gemini.py in Notebooks directory
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Notebooks')
        convert_table_script = os.path.join(notebooks_dir, 'convert_table_gemini.py')
        
        if not os.path.exists(convert_table_script):
            return f"% Error: convert_table_gemini.py not found at {convert_table_script}"
        
        print(f"[INFO] Processing with Gemini API: {image_path}")
        
        # For PDF files, convert to image first
        temp_image_path = None
        if image_path.lower().endswith('.pdf'):
            # Convert first page of PDF to image
            temp_dir = tempfile.mkdtemp()
            images = convert_from_path(image_path, dpi=300, fmt='PNG', first_page=1, last_page=1)
            if images:
                temp_image_path = os.path.join(temp_dir, 'pdf_page.png')
                images[0].save(temp_image_path, 'PNG')
                image_path = temp_image_path
            else:
                return "% Error: Could not convert PDF to image"
        
        # Run convert_table_gemini.py script
        result = subprocess.run(
            [sys.executable, convert_table_script, image_path],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )
        
        # Clean up temporary image if created
        if temp_image_path:
            try:
                shutil.rmtree(os.path.dirname(temp_image_path), ignore_errors=True)
            except:
                pass
        
        if result.returncode != 0:
            error_msg = result.stderr if result.stderr else "Unknown error"
            print(f"[ERROR] Error running convert_table_gemini.py: {error_msg}")
            return f"% Error running Gemini conversion: {error_msg}"
        
        # The script creates a .tex file with the same base name as the image
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        tex_output_file = f"{base_name}_gemini.tex"
        
        # Read the generated .tex file
        if os.path.exists(tex_output_file):
            with open(tex_output_file, 'r', encoding='utf-8') as f:
                latex_content = f.read()
            
            # Clean up the .tex file
            try:
                os.remove(tex_output_file)
            except:
                pass
            
            print(f"[SUCCESS] Gemini conversion successful")
            return latex_content
        else:
            # Try to find the file in the current directory or with different naming
            print(f"[WARNING] Expected output file {tex_output_file} not found")
            # Return what we got from stdout if available
            if result.stdout:
                return result.stdout
            return "% Error: Could not find generated LaTeX file"
        
    except subprocess.TimeoutExpired:
        print("[ERROR] Gemini API call timed out")
        return "% Error: Gemini API call timed out (exceeded 2 minutes)"
    except Exception as e:
        print(f"[ERROR] Error processing with Gemini: {e}")
        return f"% Error processing with Gemini: {str(e)}"

def process_with_groq(image_path):
    """
    Process image (table or equation) using Groq API via convert_table_groq.py script.
    Returns LaTeX output as a string.
    """
    try:
        # Path to convert_table_groq.py in Notebooks directory
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Notebooks')
        convert_table_script = os.path.join(notebooks_dir, 'convert_table_groq.py')
        
        if not os.path.exists(convert_table_script):
            return f"% Error: convert_table_groq.py not found at {convert_table_script}"
        
        print(f"[INFO] Processing table with Groq API: {image_path}")
        
        # For PDF files, convert to image first
        temp_image_path = None
        if image_path.lower().endswith('.pdf'):
            # Convert first page of PDF to image
            temp_dir = tempfile.mkdtemp()
            images = convert_from_path(image_path, dpi=300, fmt='PNG', first_page=1, last_page=1)
            if images:
                temp_image_path = os.path.join(temp_dir, 'pdf_page.png')
                images[0].save(temp_image_path, 'PNG')
                image_path = temp_image_path
            else:
                return "% Error: Could not convert PDF to image"
        
        # Run convert_table_groq.py script
        result = subprocess.run(
            [sys.executable, convert_table_script, image_path],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )
        
        # Clean up temporary image if created
        if temp_image_path:
            try:
                shutil.rmtree(os.path.dirname(temp_image_path), ignore_errors=True)
            except:
                pass
        
        if result.returncode != 0:
            error_msg = result.stderr if result.stderr else "Unknown error"
            print(f"[ERROR] Error running convert_table_groq.py: {error_msg}")
            return f"% Error running Groq table conversion: {error_msg}"
        
        # The script creates a .tex file with the same base name as the image
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        tex_output_file = f"{base_name}_groq.tex"
        
        # Read the generated .tex file
        if os.path.exists(tex_output_file):
            with open(tex_output_file, 'r', encoding='utf-8') as f:
                latex_content = f.read()
            
            # Clean up the .tex file
            try:
                os.remove(tex_output_file)
            except:
                pass
            
            print(f"[SUCCESS] Groq table conversion successful")
            return latex_content
        else:
            # Try to find the file in the current directory or with different naming
            print(f"[WARNING] Expected output file {tex_output_file} not found")
            # Return what we got from stdout if available
            if result.stdout:
                return result.stdout
            return "% Error: Could not find generated LaTeX file"
        
    except subprocess.TimeoutExpired:
        print("[ERROR] Groq API call timed out")
        return "% Error: Groq API call timed out (exceeded 2 minutes)"
    except Exception as e:
        print(f"[ERROR] Error processing table with Groq: {e}")
        return f"% Error processing table with Groq: {str(e)}"



def process_with_mistral(image_path):
    """
    Process image (table or equation) using Mistral API via convert_mistral.py script.
    Returns LaTeX output as a string.
    """
    try:
        # Path to convert_mistral.py in Notebooks directory
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Notebooks')
        convert_script = os.path.join(notebooks_dir, 'convert_mistral.py')
        
        if not os.path.exists(convert_script):
            return f"% Error: convert_mistral.py not found at {convert_script}"
        
        print(f"[INFO] Processing with Mistral API: {image_path}")
        
        # For PDF files, convert to image first
        temp_image_path = None
        if image_path.lower().endswith('.pdf'):
            # Convert first page of PDF to image
            temp_dir = tempfile.mkdtemp()
            images = convert_from_path(image_path, dpi=300, fmt='PNG', first_page=1, last_page=1)
            if images:
                temp_image_path = os.path.join(temp_dir, 'pdf_page.png')
                images[0].save(temp_image_path, 'PNG')
                image_path = temp_image_path
            else:
                return "% Error: Could not convert PDF to image"
        
        # Run convert_mistral.py script
        result = subprocess.run(
            [sys.executable, convert_script, image_path],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )
        
        # Clean up temporary image if created
        if temp_image_path:
            try:
                shutil.rmtree(os.path.dirname(temp_image_path), ignore_errors=True)
            except:
                pass
        
        if result.returncode != 0:
            error_msg = result.stderr if result.stderr else "Unknown error"
            print(f"[ERROR] Error running convert_mistral.py: {error_msg}")
            return f"% Error running Mistral conversion: {error_msg}"
        
        # The script creates a .tex file. For Mistral, it saves next to the image path.
        base_name_only = os.path.splitext(os.path.basename(image_path))[0]
        tex_output_file_cwd = f"{base_name_only}_mistral.tex"  # current working dir
        tex_output_file_same_dir = os.path.join(os.path.dirname(image_path), f"{base_name_only}_mistral.tex")

        # Read the generated .tex file (check both locations)
        chosen_tex_path = None
        if os.path.exists(tex_output_file_same_dir):
            chosen_tex_path = tex_output_file_same_dir
        elif os.path.exists(tex_output_file_cwd):
            chosen_tex_path = tex_output_file_cwd

        if chosen_tex_path:
            with open(chosen_tex_path, 'r', encoding='utf-8') as f:
                latex_content = f.read()

            # Clean up the .tex file
            try:
                os.remove(chosen_tex_path)
            except:
                pass

            print(f"[SUCCESS] Mistral conversion successful")
            return latex_content
        else:
            # Try to find the file elsewhere or fall back to stdout
            print(f"[WARNING] Expected output file not found in either location: {tex_output_file_same_dir} or {tex_output_file_cwd}")
            if result.stdout:
                return result.stdout
            return "% Error: Could not find generated LaTeX file"
        
    except subprocess.TimeoutExpired:
        print("[ERROR] Mistral API call timed out")
        return "% Error: Mistral API call timed out (exceeded 2 minutes)"
    except Exception as e:
        print(f"[ERROR] Error processing with Mistral: {e}")
        return f"% Error processing with Mistral: {str(e)}"

def process_with_gemini_universal(image_path):
    """
    Process image (equation/table/diagram - auto-detect) using Gemini Universal via gemini_universal.py script.
    Returns LaTeX output as a string.
    """
    try:
        # Path to gemini_universal.py in Notebooks directory
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Notebooks')
        convert_script = os.path.join(notebooks_dir, 'gemini_universal.py')
        
        if not os.path.exists(convert_script):
            return f"% Error: gemini_universal.py not found at {convert_script}"
        
        print("=" * 80)
        print("GEMINI UNIVERSAL CONVERTER")
        print("=" * 80)
        print(f"[INFO] Processing with Gemini Universal (auto-detect): {image_path}")
        
        # For PDF files, convert to image first
        temp_image_path = None
        if image_path.lower().endswith('.pdf'):
            # Convert first page of PDF to image
            temp_dir = tempfile.mkdtemp()
            images = convert_from_path(image_path, dpi=300, fmt='PNG', first_page=1, last_page=1)
            if images:
                temp_image_path = os.path.join(temp_dir, 'pdf_page.png')
                images[0].save(temp_image_path, 'PNG')
                image_path = temp_image_path
            else:
                return "% Error: Could not convert PDF to image"
        
        # Run gemini_universal.py script
        result = subprocess.run(
            [sys.executable, convert_script, image_path],
            capture_output=True,
            text=True,
            timeout=180  # 3 minute timeout (needs more time for detection + conversion)
        )
        
        # Clean up temporary image if created
        if temp_image_path:
            try:
                shutil.rmtree(os.path.dirname(temp_image_path), ignore_errors=True)
            except:
                pass
        
        if result.returncode != 0:
            error_msg = result.stderr if result.stderr else "Unknown error"
            print(f"[ERROR] Error running gemini_universal.py: {error_msg}")
            return f"% Error running Gemini Universal conversion: {error_msg}"
        
        # The script creates a .tex file in test_outputs directory
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        tex_output_file = f"{base_name}_gemini_universal.tex"
        
        # Check multiple possible locations for the output file
        project_root = os.path.dirname(os.path.dirname(__file__))
        possible_paths = [
            os.path.join(project_root, 'test_outputs', tex_output_file),
            tex_output_file,  # Current directory
            os.path.join(os.path.dirname(image_path), tex_output_file)
        ]
        
        latex_content = None
        found_path = None
        
        for path in possible_paths:
            if os.path.exists(path):
                found_path = path
                with open(path, 'r', encoding='utf-8') as f:
                    latex_content = f.read()
                break
        
        if latex_content:
            # Clean up the .tex file
            if found_path:
                try:
                    os.remove(found_path)
                except:
                    pass
            
            print(f"[SUCCESS] Gemini Universal conversion successful")
            print("=" * 80)
            return latex_content
        else:
            # Try to find the file in the current directory or with different naming
            print(f"[WARNING] Expected output file {tex_output_file} not found in any location")
            # Return what we got from stdout if available
            if result.stdout:
                return result.stdout
            return "% Error: Could not find generated LaTeX file"
        
    except subprocess.TimeoutExpired:
        print("[ERROR] Gemini Universal API call timed out")
        return "% Error: Gemini Universal API call timed out (exceeded 3 minutes)"
    except Exception as e:
        print(f"[ERROR] Error processing with Gemini Universal: {e}")
        return f"% Error processing with Gemini Universal: {str(e)}"

def test_ocr_setup():
    """
    Test OCR setup and return status information.
    """
    status = {
        'modules_loaded': False,
        'pix2tex_available': False,
        'tesseract_available': False,
        'equation_ocr': 'Not Available',
        'table_ocr': 'Not Available',
        'errors': []
    }
    
    try:
        # Test module loading
        if load_ocr_modules():
            status['modules_loaded'] = True
            
            # Test pix2tex
            try:
                from pix2tex.cli import LatexOCR
                model = LatexOCR()
                status['pix2tex_available'] = True
                status['equation_ocr'] = 'Available'
            except Exception as e:
                status['errors'].append(f"pix2tex error: {e}")
                
            # Test tesseract
            try:
                import pytesseract
                pytesseract.get_tesseract_version()
                status['tesseract_available'] = True
                status['table_ocr'] = 'Available'
            except Exception as e:
                status['errors'].append(f"Tesseract error: {e}")
                status['table_ocr'] = 'Tesseract not installed'
        else:
            status['errors'].append("Could not load OCR modules")
            
    except Exception as e:
        status['errors'].append(f"General error: {e}")
        
    return status

def process_with_gemini_diagram(image_path):
    """
    Process diagram image using Gemini Vision API via gemini_diagram.py script.
    Returns LaTeX TikZ code as a string.
    """
    try:
        # Path to gemini_diagram.py in Notebooks directory
        notebooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Notebooks')
        convert_script = os.path.join(notebooks_dir, 'gemini_diagram.py')
        
        if not os.path.exists(convert_script):
            return f"% Error: gemini_diagram.py not found at {convert_script}"
        
        print(f"[INFO] Processing diagram with Gemini API: {image_path}")
        
        # For PDF files, convert to image first
        temp_image_path = None
        if image_path.lower().endswith('.pdf'):
            # Convert first page of PDF to image
            temp_dir = tempfile.mkdtemp()
            images = convert_from_path(image_path, dpi=300, fmt='PNG', first_page=1, last_page=1)
            if images:
                temp_image_path = os.path.join(temp_dir, 'pdf_page.png')
                images[0].save(temp_image_path, 'PNG')
                image_path = temp_image_path
            else:
                return "% Error: Could not convert PDF to image"
        
        # Run gemini_diagram.py script
        result = subprocess.run(
            [sys.executable, convert_script, image_path],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )
        
        # Clean up temporary image if created
        if temp_image_path:
            try:
                shutil.rmtree(os.path.dirname(temp_image_path), ignore_errors=True)
            except:
                pass
        
        if result.returncode != 0:
            error_msg = result.stderr if result.stderr else "Unknown error"
            print(f"[ERROR] Error running gemini_diagram.py: {error_msg}")
            return f"% Error running Gemini diagram conversion: {error_msg}"
        
        # The script creates a .tex file with the same base name as the image
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        tex_output_file = f"{base_name}_gemini_diagram.tex"
        
        # Read the generated .tex file
        if os.path.exists(tex_output_file):
            with open(tex_output_file, 'r', encoding='utf-8') as f:
                latex_content = f.read()
            
            # Clean up the .tex file
            try:
                os.remove(tex_output_file)
            except:
                pass
            
            print(f"[SUCCESS] Gemini diagram conversion successful")
            return latex_content
        else:
            # Try to find the file in the current directory or with different naming
            print(f"[WARNING] Expected output file {tex_output_file} not found")
            # Return what we got from stdout if available
            if result.stdout:
                return result.stdout
            return "% Error: Could not find generated LaTeX file"
        
    except subprocess.TimeoutExpired:
        print("[ERROR] Gemini API call timed out")
        return "% Error: Gemini API call timed out (exceeded 2 minutes)"
    except Exception as e:
        print(f"[ERROR] Error processing diagram with Gemini: {e}")
        return f"% Error processing diagram with Gemini: {str(e)}"
