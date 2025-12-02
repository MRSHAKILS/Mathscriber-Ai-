# Integration Testing Guide

## Prerequisites Checklist

### Backend (Django)

- [x] Django server running on http://localhost:8000
- [x] Migrations applied successfully
- [x] Gemini API key configured in environment
- [x] pdflatex installed (MiKTeX/TeX Live)

### Frontend (Next.js)

- [x] Next.js dev server running on http://localhost:3001
- [x] All dependencies installed (including react-syntax-highlighter)
- [x] Components compiled without errors

## Test Plan

### Phase 1: Basic Integration

#### Test 1.1: Verify Floating Buttons Panel

1. Open http://localhost:8000/editor/projects/
2. Navigate to any project and open a document
3. **Expected**: See floating buttons panel on left side with 4 buttons (Upload, Capture, Canvas, History)
4. **Verify**: Buttons have gradient red/orange design with glassmorphism
5. **Action**: Hover over buttons
6. **Expected**: Tooltips appear with button names
7. **Action**: Click toggle button
8. **Expected**: Panel expands/collapses smoothly

**Status**: [ ] Pass / [ ] Fail  
**Notes**: ******\_\_\_******

---

### Phase 2: Upload Conversion

#### Test 2.1: File Upload

1. Click the **Upload** button (first button)
2. **Expected**: Upload popup modal appears
3. **Action**: Drag an image containing math equation into the dropzone
4. **Expected**: Image preview appears
5. **Action**: Click "Convert to LaTeX"
6. **Expected**: Loading spinner appears
7. **Expected**: Result page displays with:
   - Original input image
   - Generated LaTeX code (syntax highlighted)
   - Rendered output
8. **Action**: Click "Copy" button
9. **Expected**: LaTeX code copied to clipboard (check notification)

**Status**: [ ] Pass / [ ] Fail  
**Test Image**: ******\_\_\_******  
**LaTeX Output**: ******\_\_\_******

#### Test 2.2: Upload - Insert at Cursor

1. In the result page, click "Insert at Cursor"
2. **Expected**: API call to /api/editor/insert-at-cursor
3. **Expected**: Editor content updates with merged LaTeX
4. **Verify**: Check for:
   - No duplicate packages
   - Code inserted at appropriate location
   - Document structure maintained
5. **Expected**: Success notification appears

**Status**: [ ] Pass / [ ] Fail  
**Cursor Position**: ******\_\_\_******  
**Merge Quality**: [ ] Good / [ ] Issues

#### Test 2.3: Upload - Download Files

1. In the result page, click "Download .tex"
2. **Expected**: .tex file downloads with LaTeX code
3. **Verify**: Open file and check content
4. **Action**: Click "Download .pdf"
5. **Expected**: PDF compilation starts
6. **Expected**: PDF downloads with rendered output
7. **Verify**: Open PDF and check rendering

**Status**: [ ] Pass / [ ] Fail  
**PDF Quality**: [ ] Good / [ ] Issues

---

### Phase 3: Camera Capture

#### Test 3.1: Camera Access

1. Click the **Capture** button (second button)
2. **Expected**: Browser requests camera permission
3. **Action**: Grant permission
4. **Expected**: Capture popup appears with live camera feed
5. **Action**: Point camera at math equation (printed or on screen)
6. **Action**: Click "Capture"
7. **Expected**: Image captured and preview shown
8. **Action**: Click "Convert"
9. **Expected**: Result page shows conversion

**Status**: [ ] Pass / [ ] Fail  
**Camera Feed Quality**: [ ] Good / [ ] Issues  
**Conversion Accuracy**: ******\_\_\_******

#### Test 3.2: Retake Functionality

1. In capture popup, after capturing
2. **Action**: Click "Retake"
3. **Expected**: Returns to live camera feed
4. **Expected**: Can capture again

**Status**: [ ] Pass / [ ] Fail

---

### Phase 4: Drawing Canvas

#### Test 4.1: Canvas Drawing

1. Click the **Canvas** button (third button)
2. **Expected**: Canvas popup appears
3. **Action**: Draw a simple equation (e.g., x² + 2x + 1)
4. **Verify**: Drawing appears on canvas
5. **Action**: Toggle to Eraser
6. **Verify**: Can erase parts of drawing
7. **Action**: Click "Clear"
8. **Expected**: Canvas clears completely

**Status**: [ ] Pass / [ ] Fail  
**Drawing Responsiveness**: [ ] Good / [ ] Laggy

#### Test 4.2: Canvas Conversion

1. Draw a math equation on canvas
2. **Action**: Click "Convert to LaTeX"
3. **Expected**: Conversion starts
4. **Expected**: Result page shows conversion
5. **Verify**: LaTeX code matches drawn equation

**Status**: [ ] Pass / [ ] Fail  
**Accuracy**: ******\_\_\_******

---

### Phase 5: History Management

#### Test 5.1: View History

1. Perform 3-4 conversions (upload, capture, or canvas)
2. Click the **History** button (fourth button)
3. **Expected**: History page displays
4. **Expected**: All recent conversions shown in grid
5. **Verify**: Each card shows:
   - Thumbnail of input image
   - LaTeX preview
   - Timestamp
   - Action buttons

**Status**: [ ] Pass / [ ] Fail  
**Items Displayed**: ******\_\_\_******

#### Test 5.2: History Search

1. In history page, type search term in search box
2. **Action**: Search for specific LaTeX code (e.g., "frac")
3. **Expected**: Results filter to matching items only
4. **Action**: Clear search
5. **Expected**: All items reappear

**Status**: [ ] Pass / [ ] Fail

#### Test 5.3: History Actions

1. From history, click "Copy" on any item
2. **Expected**: LaTeX copied to clipboard
3. **Action**: Click "Insert" on any item
4. **Expected**: Code inserted into editor at cursor
5. **Action**: Click "Delete" on any item
6. **Expected**: Confirmation dialog appears
7. **Action**: Confirm deletion
8. **Expected**: Item removed from history

**Status**: [ ] Pass / [ ] Fail

#### Test 5.4: History Detail View

1. Click on any history card (not on action buttons)
2. **Expected**: Detail modal opens
3. **Verify**: Shows full resolution input image
4. **Verify**: Shows complete LaTeX code
5. **Action**: Click outside modal or close button
6. **Expected**: Modal closes

**Status**: [ ] Pass / [ ] Fail

---

### Phase 6: Intelligent Code Merging

#### Test 6.1: Simple Merge

1. Clear editor or create new document
2. Add basic LaTeX document:
   ```latex
   \documentclass{article}
   \usepackage{amsmath}
   \begin{document}
   Hello World
   \end{document}
   ```
3. Place cursor after "Hello World"
4. Upload an image and convert
5. Click "Insert at Cursor"
6. **Expected**: New LaTeX inserted at cursor position
7. **Verify**: No duplicate `\usepackage{amsmath}` if present
8. **Verify**: Document structure maintained

**Status**: [ ] Pass / [ ] Fail  
**Merge Result**: ******\_\_\_******

#### Test 6.2: Complex Merge with Packages

1. Create document with multiple packages:
   ```latex
   \documentclass{article}
   \usepackage{amsmath}
   \usepackage{amssymb}
   \usepackage{graphicx}
   \begin{document}
   Content here
   \end{document}
   ```
2. Convert image that uses same packages
3. Click "Insert at Cursor"
4. **Expected**: Gemini detects existing packages
5. **Verify**: No duplicate package declarations
6. **Verify**: Only content inserted (not preamble)

**Status**: [ ] Pass / [ ] Fail  
**Duplicate Packages Avoided**: [ ] Yes / [ ] No

#### Test 6.3: Merge at Different Cursor Positions

1. Test insertion at:
   - Beginning of document (after `\begin{document}`)
   - Middle of content
   - End of document (before `\end{document}`)
2. **Expected**: Code inserted at correct location in all cases
3. **Verify**: Document compiles after each insertion

**Status**: [ ] Pass / [ ] Fail  
**All Positions Work**: [ ] Yes / [ ] No

---

### Phase 7: Error Handling

#### Test 7.1: Invalid Image Upload

1. Try uploading non-image file (e.g., .txt, .pdf)
2. **Expected**: Error message appears
3. **Expected**: Upload rejected

**Status**: [ ] Pass / [ ] Fail

#### Test 7.2: Network Errors

1. Stop Django backend server
2. Try to convert an image
3. **Expected**: Graceful error message
4. **Expected**: UI doesn't crash

**Status**: [ ] Pass / [ ] Fail

#### Test 7.3: Gemini API Errors

1. Temporarily set invalid Gemini API key
2. Try conversion
3. **Expected**: Error message indicates API issue
4. **Expected**: User notified clearly

**Status**: [ ] Pass / [ ] Fail

---

### Phase 8: UI/UX Testing

#### Test 8.1: Theme Consistency

1. Verify all components match red/orange gradient theme
2. **Check**:
   - Floating buttons: Red to orange gradient
   - Popups: Glassmorphism with backdrop blur
   - Borders: Red with opacity
   - Text: White/gray hierarchy
   - Hover effects: Glow and scale

**Status**: [ ] Pass / [ ] Fail

#### Test 8.2: Animations

1. Verify smooth animations on:
   - Button panel expand/collapse
   - Modal open/close
   - Button hover effects
   - History card hover
   - Loading spinners

**Status**: [ ] Pass / [ ] Fail  
**Animation Smoothness**: [ ] Excellent / [ ] Good / [ ] Choppy

#### Test 8.3: Responsiveness

1. Resize browser window
2. **Expected**: All components remain usable
3. Test on different screen sizes:
   - Large desktop (1920x1080)
   - Medium (1366x768)
   - Tablet (768x1024)

**Status**: [ ] Pass / [ ] Fail  
**Works on All Sizes**: [ ] Yes / [ ] No

---

### Phase 9: Performance Testing

#### Test 9.1: Conversion Speed

1. Upload 5 different math images
2. Time each conversion
3. **Expected**: Each conversion completes in < 10 seconds

**Results**:

- Image 1: **\_** seconds
- Image 2: **\_** seconds
- Image 3: **\_** seconds
- Image 4: **\_** seconds
- Image 5: **\_** seconds

**Status**: [ ] Pass / [ ] Fail

#### Test 9.2: History Loading

1. Create 20+ history items
2. Open history page
3. **Expected**: Loads quickly (< 2 seconds)
4. **Expected**: Search responds instantly

**Status**: [ ] Pass / [ ] Fail

#### Test 9.3: Editor Performance

1. Create large document (500+ lines)
2. Insert LaTeX at various positions
3. **Expected**: No lag in editor
4. **Expected**: Insert operation completes quickly

**Status**: [ ] Pass / [ ] Fail

---

### Phase 10: Edge Cases

#### Test 10.1: Empty Document Insertion

1. Start with completely empty editor
2. Convert and insert LaTeX
3. **Expected**: Gemini creates complete document structure
4. **Verify**: Includes preamble, document environment

**Status**: [ ] Pass / [ ] Fail

#### Test 10.2: Large LaTeX Output

1. Upload complex image with many equations
2. **Expected**: Handles large LaTeX code (1000+ characters)
3. **Verify**: Display and insertion work correctly

**Status**: [ ] Pass / [ ] Fail

#### Test 10.3: Special Characters

1. Upload image with special math symbols (∫, ∑, ∏, √)
2. **Expected**: Converts to proper LaTeX commands
3. **Verify**: Symbols render correctly

**Status**: [ ] Pass / [ ] Fail

#### Test 10.4: Multiple Quick Insertions

1. Convert 3 images quickly (one after another)
2. Insert all 3 into document rapidly
3. **Expected**: All insertions complete without errors
4. **Verify**: Document structure maintained

**Status**: [ ] Pass / [ ] Fail

---

## Browser Testing

Test the integration in multiple browsers:

### Chrome/Edge

- Version: ******\_\_\_******
- **Status**: [ ] Pass / [ ] Fail
- **Issues**: ******\_\_\_******

### Firefox

- Version: ******\_\_\_******
- **Status**: [ ] Pass / [ ] Fail
- **Issues**: ******\_\_\_******

### Safari (if available)

- Version: ******\_\_\_******
- **Status**: [ ] Pass / [ ] Fail
- **Issues**: ******\_\_\_******

---

## API Endpoint Testing

Use browser DevTools Network tab to verify:

### Endpoint Checklist

- [ ] POST /api/convert/upload returns 200
- [ ] POST /api/convert/capture returns 200
- [ ] POST /api/convert/canvas returns 200
- [ ] POST /api/download/tex returns file
- [ ] POST /api/download/pdf returns PDF
- [ ] POST /api/editor/insert-at-cursor returns merged content
- [ ] GET /api/history returns array
- [ ] DELETE /api/history/<id> returns success

### Response Time

- Average API response time: **\_** seconds
- Slowest endpoint: ******\_\_\_******

---

## Known Issues Log

| Issue | Severity | Status | Notes |
| ----- | -------- | ------ | ----- |
|       |          |        |       |
|       |          |        |       |
|       |          |        |       |

---

## Final Checklist

### Functionality

- [ ] All 4 floating buttons work
- [ ] Upload conversion works
- [ ] Camera capture works
- [ ] Canvas drawing works
- [ ] Result page displays correctly
- [ ] History page works
- [ ] Insert at cursor with Gemini works
- [ ] Download .tex works
- [ ] Download .pdf works
- [ ] Search history works
- [ ] Delete history works

### UI/UX

- [ ] Theme is consistent
- [ ] Animations are smooth
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Responsive on all screen sizes

### Performance

- [ ] Conversions complete quickly
- [ ] No UI lag
- [ ] History loads fast
- [ ] Editor remains responsive

### Integration

- [ ] Django and Next.js communicate correctly
- [ ] Ace Editor accessible from React
- [ ] CORS configured properly
- [ ] CSRF tokens handled correctly

---

## Overall Status

**Integration Quality**: [ ] Excellent / [ ] Good / [ ] Needs Work  
**Ready for Production**: [ ] Yes / [ ] No  
**Recommended Next Steps**: ******\_\_\_******

---

## Test Conducted By

**Name**: ******\_\_\_******  
**Date**: ******\_\_\_******  
**Environment**:

- OS: Windows
- Python: ******\_\_\_******
- Node: ******\_\_\_******
- Django: 5.0.14
- Next.js: 14

**Signature**: ******\_\_\_******
