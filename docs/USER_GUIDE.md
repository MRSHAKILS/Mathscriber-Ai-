# 🎨 Mathscriber AI - User Guide

## Welcome to Mathscriber AI! 🚀

This guide will walk you through using Mathscriber AI to convert images containing mathematical equations, diagrams, and tables into LaTeX code.

---

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Method 1: Upload Image](#method-1-upload-image)
3. [Method 2: Canvas Scanner](#method-2-canvas-scanner)
4. [Understanding Results](#understanding-results)
5. [Tips for Best Results](#tips-for-best-results)
6. [Common Use Cases](#common-use-cases)
7. [Troubleshooting](#troubleshooting)

---

## 🏁 Getting Started

### What You Need

- A web browser (Chrome, Firefox, Safari, or Edge)
- An image containing math equations, diagrams, or tables
- OR ability to draw on a digital canvas

### Accessing the App

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You'll see the home page with two options:
   - **Upload Image**
   - **Canvas Scanner**

---

## 📤 Method 1: Upload Image

### Step-by-Step Process

#### 1. Navigate to Upload Page

- Click the **"Upload Image"** card on the home page
- You'll be taken to the upload interface

#### 2. Select Your Image

You have two options:

**Option A: Drag & Drop**

- Drag an image file from your computer
- Drop it into the upload area
- The area will highlight when you hover over it

**Option B: Click to Browse**

- Click anywhere in the upload area
- A file browser will open
- Select your image file
- Click "Open"

#### 3. Preview Your Image

- After selection, you'll see a preview of your image
- File name and size will be displayed
- Review to ensure it's the correct image

#### 4. Convert to LaTeX

- Click the **"Convert to LaTeX"** button
- Wait while the AI processes your image (2-5 seconds)
- A loading indicator will show progress

#### 5. View Results

- You'll be automatically redirected to the results page
- Your LaTeX code will be displayed
- Ready to copy and use!

### Supported File Types

- ✅ JPEG / JPG
- ✅ PNG
- ✅ GIF
- ✅ WebP

### File Size Limit

- Maximum: 10 MB per image
- Recommended: Under 5 MB for faster processing

---

## ✏️ Method 2: Canvas Scanner

### Step-by-Step Process

#### 1. Navigate to Scan Page

- Click the **"Canvas Scanner"** card on the home page
- You'll see a blank white canvas

#### 2. Draw Your Equation

**How to Draw:**

- Click and hold mouse button
- Move to draw
- Release to stop drawing

**Tips:**

- Draw clearly and legibly
- Use consistent stroke width
- Keep symbols distinct
- Write numbers clearly

#### 3. Review Your Drawing

- Step back and review your drawing
- Ensure all symbols are clear
- Make sure nothing is missing

#### 4. Clear if Needed

- Click **"Clear Canvas"** to start over
- Draw again if you made a mistake

#### 5. Convert to LaTeX

- Click **"Convert to LaTeX"** button
- Wait for AI processing (2-5 seconds)

#### 6. View Results

- Redirected to results page
- LaTeX code displayed
- Ready to use!

---

## 📊 Understanding Results

### Results Page Layout

```
┌────────────────────────────────────────┐
│         Conversion Result              │
│         Your LaTeX code is ready!      │
├────────────────────────────────────────┤
│                                        │
│  LaTeX Code                  [Copy]    │
│  ┌──────────────────────────────────┐ │
│  │  E = mc^2                        │ │
│  │                                  │ │
│  │  (Your converted LaTeX code)     │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [Convert Another Image]  [Back Home] │
│                                        │
├────────────────────────────────────────┤
│  How to use this LaTeX code:          │
│  • Copy the code above                │
│  • For inline math: $ ... $           │
│  • For display math: $$ ... $$        │
│  • For documents: use LaTeX env       │
└────────────────────────────────────────┘
```

### Using the LaTeX Code

#### 1. Copy the Code

- Click the **"Copy"** button
- The button will change to **"Copied!"**
- Code is now in your clipboard

#### 2. Paste into Your Document

**For Inline Math:**

```latex
The famous equation is $E = mc^2$ discovered by Einstein.
```

**For Display Math:**

```latex
$$
E = mc^2
$$
```

**For LaTeX Documents:**

```latex
\documentclass{article}
\begin{document}
The equation is:
\[
E = mc^2
\]
\end{document}
```

#### 3. Convert More Images

- Click **"Convert Another Image"** to go back
- Or click **"Back to Home"** to start fresh

---

## 💡 Tips for Best Results

### Image Quality

**DO:**

- ✅ Use clear, high-resolution images
- ✅ Ensure good lighting (no shadows)
- ✅ Capture text straight-on (not angled)
- ✅ Use plain, uncluttered backgrounds
- ✅ Make sure equations are in focus

**DON'T:**

- ❌ Use blurry or pixelated images
- ❌ Include multiple equations in one image
- ❌ Have handwriting that's too small
- ❌ Use images with poor contrast
- ❌ Include irrelevant content

### Drawing on Canvas

**DO:**

- ✅ Draw symbols large and clear
- ✅ Use consistent line thickness
- ✅ Space symbols appropriately
- ✅ Write legibly (like printing)
- ✅ Complete all strokes fully

**DON'T:**

- ❌ Draw too small or cramped
- ❌ Use cursive or connected writing
- ❌ Leave symbols incomplete
- ❌ Overlap symbols
- ❌ Use inconsistent sizes

### Equation Complexity

**Best Results:**

- Simple algebraic equations
- Basic calculus expressions
- Common mathematical symbols
- Standard notation

**May Need Review:**

- Complex multi-line equations
- Custom symbols or notation
- Highly specialized math
- Mixed text and equations

---

## 🎯 Common Use Cases

### 1. Student Homework

**Scenario:** You have a worksheet with equations

**Steps:**

1. Take a photo of the equation
2. Upload to Mathscriber AI
3. Get LaTeX code
4. Include in your LaTeX homework

**Example:**
Photo of: `x = (-b ± √(b²-4ac)) / 2a`

Gets converted to:

```latex
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
```

### 2. Research Papers

**Scenario:** Converting handwritten notes to LaTeX

**Steps:**

1. Scan your handwritten equations
2. Upload each equation separately
3. Collect all LaTeX codes
4. Insert into your paper

### 3. Teaching Materials

**Scenario:** Creating digital worksheets

**Steps:**

1. Draw equations on canvas
2. Convert to LaTeX
3. Use in online course materials
4. Students can easily copy

### 4. Quick Reference

**Scenario:** Need LaTeX code for a symbol

**Steps:**

1. Draw the symbol on canvas
2. Get LaTeX representation
3. Use immediately in your document

---

## 🔧 Troubleshooting

### Problem: Image Won't Upload

**Possible Causes:**

- File is too large (>10MB)
- Wrong file format
- Browser issue

**Solutions:**

1. Check file size and compress if needed
2. Convert to JPEG or PNG format
3. Try a different browser
4. Refresh the page

### Problem: Conversion Takes Too Long

**Possible Causes:**

- Large image file
- Slow internet connection
- Server busy

**Solutions:**

1. Wait a bit longer (up to 30 seconds)
2. Try compressing the image
3. Check your internet connection
4. Try again later

### Problem: Incorrect LaTeX Output

**Possible Causes:**

- Poor image quality
- Handwriting unclear
- Complex notation
- Image has multiple equations

**Solutions:**

1. Retake photo with better quality
2. Try drawing instead of uploading
3. Break complex equations into parts
4. Manually correct the LaTeX code

### Problem: Canvas Not Working

**Possible Causes:**

- Browser compatibility
- JavaScript disabled
- Touchscreen vs mouse

**Solutions:**

1. Try a different browser
2. Enable JavaScript
3. Use mouse instead of touch
4. Clear browser cache

### Problem: "Backend Not Responding"

**Possible Causes:**

- Backend server not running
- Network error
- Wrong API URL

**Solutions:**

1. Check if backend is running (port 8000)
2. Restart backend server
3. Check console for errors
4. Verify .env.local settings

---

## 📱 Mobile Usage

### Mobile Browser Tips

1. **Upload on Mobile:**

   - Tap upload area
   - Choose "Take Photo" or "Choose Photo"
   - Select from gallery or take new photo

2. **Canvas on Mobile:**

   - Use finger to draw
   - May be less precise than mouse
   - Consider using stylus if available

3. **Best Practices:**
   - Use landscape mode for canvas
   - Zoom in if needed
   - Take clear, focused photos

---

## ⌨️ Keyboard Shortcuts

Currently, the app uses standard browser shortcuts:

- `Ctrl+C` / `Cmd+C` - Copy (when text is selected)
- `F5` - Refresh page
- `Ctrl+W` / `Cmd+W` - Close tab

---

## 🎓 Learning Resources

### Understanding LaTeX

If you're new to LaTeX:

- [LaTeX Tutorial for Beginners](https://www.latex-tutorial.com/)
- [Overleaf Learn LaTeX](https://www.overleaf.com/learn)
- [LaTeX Math Symbols](https://www.latex-tutorial.com/symbols/math-symbols/)

### Mathematical Notation

- [Common Math Symbols](https://en.wikipedia.org/wiki/List_of_mathematical_symbols)
- [LaTeX Math Cheatsheet](https://wch.github.io/latexsheet/)

---

## 💬 Feedback & Support

### Getting Help

If you encounter issues:

1. Check this user guide
2. Review the troubleshooting section
3. Check the main README.md
4. Review SETUP.md for configuration issues

### Known Limitations

- Maximum file size: 10 MB
- Supported formats: JPEG, PNG, GIF, WebP
- Best for single equations per image
- Requires internet connection (Gemini API)

---

## 🌟 Pro Tips

1. **Batch Processing:**

   - Open multiple tabs
   - Process several images simultaneously
   - Keep organized with numbered files

2. **Quality Over Speed:**

   - Take time to get clear images
   - Better input = better output
   - Worth retaking a photo if unclear

3. **Verify Results:**

   - Always check the LaTeX output
   - Test in your LaTeX editor
   - Make manual corrections if needed

4. **Keep Originals:**

   - Save original images
   - Keep LaTeX backups
   - Document any corrections made

5. **Build a Library:**
   - Save commonly used equations
   - Create a personal LaTeX snippet library
   - Reuse code when possible

---

## ✅ Quick Reference

### Upload Flow

```
Select Image → Preview → Convert → View LaTeX → Copy
```

### Canvas Flow

```
Draw Equation → Review → Convert → View LaTeX → Copy
```

### Using LaTeX

```
Copy Code → Paste in Document → Wrap with $ or $$ → Compile
```

---

## 🎉 Conclusion

You're now ready to use Mathscriber AI effectively!

**Remember:**

- Clear images = better results
- Canvas works great for simple equations
- Always verify the output
- Don't hesitate to try again

**Happy Converting!** 🚀

---

_For technical documentation, see DEVELOPMENT.md_  
_For setup instructions, see SETUP.md_  
_For complete information, see README.md_
