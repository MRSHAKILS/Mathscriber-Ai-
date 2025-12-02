# Napkin AI Visual Generator - Quick Reference Guide

## 🎯 What's New

### Diagram Types (NEW!)

Choose from 9 diagram types or let AI auto-detect:

| Type         | Best For                                 | Icon |
| ------------ | ---------------------------------------- | ---- |
| Flowchart    | Process flows, workflows, decision trees | 📊   |
| Mind Map     | Hierarchical ideas, brainstorming        | 🧠   |
| Timeline     | Events, milestones, chronology           | ⏱️   |
| Funnel       | Conversion flows, stages                 | 🔻   |
| Venn Diagram | Overlapping concepts                     | ⭕   |
| Matrix       | 2x2 comparisons, quadrants               | 📐   |
| Pyramid      | Hierarchical structures                  | 🔺   |
| Cycle        | Circular processes                       | 🔄   |
| Comparison   | Side-by-side analysis                    | ⚖️   |

### Samples Gallery (NEW!)

- **View Samples** button shows example prompts
- Click "Use This" to auto-fill content
- See all style categories and diagram examples

## 🎨 Available Styles

### Colorful (5 styles)

Bold, vibrant visuals for presentations

- Vibrant Strokes
- Glowful Breeze
- Bold Canvas
- Radiant Blocks
- Pragmatic Shades

### Hand-drawn (2 styles)

Artistic, sketch-like for brainstorming

- Artistic Flair
- Sketch Notes

### Formal (4 styles)

Professional for business reports

- Elegant Outline
- Subtle Accent
- Monochrome Pro
- Corporate Clean

### Monochrome (2 styles)

Minimalist for print

- Minimal Contrast
- Silver Beam

## 📋 How to Use

### Generate a Visual

1. Go to `/visuals/generator/`
2. Enter content (minimum 50 characters)
3. (Optional) Add context for better results
4. Select diagram type or leave as "Auto-detect"
5. Choose a visual style
6. Select format: PNG, SVG, or PPT
7. Click "Generate Visual"
8. Wait 10-30 seconds for processing

### View History

- Click "History" button in generator header
- See all your generated visuals in gallery
- Filter by status, diagram type, or format

### Export to PDF

1. Go to Gallery page
2. Check boxes for visuals to export
3. Click "Export PDF"
4. Download multi-page PDF with all selected visuals

## 🔍 Where to Find Features

### Generator Page

- **Content input** - Main text (min 50 chars)
- **Context input** - Optional additional info
- **Diagram type selector** - Choose visual type
- **Style grid** - 15 professional styles
- **Format radios** - PNG, SVG, or PPT
- **Samples button** - View examples (purple, top right)
- **History button** - View all visuals (teal, top right)

### Gallery Page

- **Visual cards** - All generated visuals
- **Status badges** - Green (completed), yellow (pending), red (failed)
- **Diagram badges** - Teal badges show diagram type
- **Export PDF** - Purple button, top right
- **Create New** - Generate another visual

### Detail Page

- **Image display** - Full-size visual
- **Metadata grid** - Format, status, color mode, created date, diagram type
- **Action buttons** - Download, duplicate, delete
- **Content section** - Original text used

## 💡 Pro Tips

### Choose the Right Diagram Type

- **Process/workflow?** → Flowchart
- **Ideas/concepts?** → Mind Map
- **Events over time?** → Timeline
- **Conversion stages?** → Funnel
- **Compare 4 items?** → Matrix
- **Show relationships?** → Venn Diagram

### Get Better Results

- Write clear, structured content (min 50 chars)
- Use bullet points or numbered lists
- Add context for complex topics
- Try different styles for same content
- Use formal styles for business, colorful for creative

### Optimize Your Workflow

1. Use samples to learn what works
2. Save successful prompts for reuse
3. Export multiple visuals to PDF for presentations
4. Duplicate and regenerate with different styles
5. Delete failed attempts to keep gallery clean

## 🚀 Keyboard Shortcuts

None currently, but features are accessible via:

- Buttons (mobile-friendly)
- Links (semantic navigation)
- Forms (standard input)

## ❓ Troubleshooting

### Visual generation fails

- Check content is at least 50 characters
- Verify NAPKIN_API_KEY is set in .env
- Check server logs for detailed errors

### Images don't display

- Ensure MEDIA_URL and MEDIA_ROOT configured
- Check file permissions in media/ folder
- Verify file_path in database matches actual file

### Diagram type not working

- Make sure content matches diagram type
- Try "Auto-detect" if unsure
- Some diagram types need specific content structure

## 📊 API Usage

### Generate Visual

```bash
POST /visuals/api/generate/
{
  "content": "Your text here (min 50 chars)",
  "context": "Optional context",
  "format": "png",
  "style_id": "CDQPRVVJCSTPRBBCD5Q6AWR",
  "visual_query": "flowchart"
}
```

### Check Status

```bash
GET /visuals/api/status/{visual-id}/
```

### Get Options

```bash
GET /visuals/api/options/
```

## 🎓 Example Use Cases

### Business Presentation

- **Content:** Company growth strategy
- **Diagram:** Funnel or Timeline
- **Style:** Corporate Clean (formal)
- **Format:** PPT

### Educational Material

- **Content:** Biological classification
- **Diagram:** Pyramid or Mind Map
- **Style:** Sketch Notes (hand-drawn)
- **Format:** PNG

### Technical Documentation

- **Content:** Software architecture
- **Diagram:** Flowchart
- **Style:** Elegant Outline (formal)
- **Format:** SVG (scalable)

### Marketing Campaign

- **Content:** Customer journey
- **Diagram:** Timeline or Funnel
- **Style:** Vibrant Strokes (colorful)
- **Format:** PNG

## 📱 Mobile Usage

All features are fully responsive:

- **Generator** - Stacked form on mobile, compact buttons
- **Gallery** - 1 column on mobile, 2 on tablet, 3 on desktop
- **Detail** - 2 columns for metadata on mobile
- **Samples modal** - Full-screen on mobile, centered on desktop

Touch targets optimized for 44x44px minimum size.

---

**Need help?** Check the samples gallery for examples or refer to NAPKIN_FEATURES_COMPLETE.md for detailed technical documentation.
