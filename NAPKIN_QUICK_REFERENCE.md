# 🎨 Napkin AI Visual Generator - Quick Reference

## 🚀 Getting Started (3 Steps)

### 1. Get API Key

Visit: https://app.napkin.ai/settings/api-keys

### 2. Add to .env

```env
NAPKIN_API_KEY=sk-your-actual-key-here
```

### 3. Restart & Go

```bash
python manage.py runserver
```

Open: http://127.0.0.1:8000/visuals/generator/

---

## 📋 Quick Usage

### Minimum Content: 50 characters

✅ Good: "The software development lifecycle includes planning, design, implementation, testing, and deployment phases."

❌ Too short: "Software lifecycle"

### Choose Your Style

- **Colorful** → Presentations, social media
- **Casual** → Informal content, blogs
- **Hand-drawn** → Brainstorming, creative
- **Formal** → Business, documentation
- **Monochrome** → Minimalist, focused

### Pick Format

- **PNG** → Best for images (1024×768 default)
- **SVG** → Best for scaling, logos
- **PPT** → Best for PowerPoint slides

### Generate!

Click "Generate Visual" → Wait 10-30 seconds → Done!

---

## 🎯 Best Practices

### Content Tips

- **Length**: 100-500 characters optimal
- **Structure**: Lists, processes, relationships work best
- **Examples**:
  - "Customer journey: Awareness → Consideration → Purchase"
  - "Project triangle: Scope, Time, Cost"
  - "SWOT Analysis: Strengths, Weaknesses, Opportunities, Threats"

### Style Selection

| Use Case              | Recommended Style                |
| --------------------- | -------------------------------- |
| Business presentation | Elegant Outline, Corporate Clean |
| Social media post     | Vibrant Strokes, Glowful Breeze  |
| Educational content   | Sketch Notes, Artistic Flair     |
| Technical docs        | Monochrome Pro, Minimal Contrast |
| Brainstorming         | Carefree Mist, Lively Layers     |

---

## ⚡ API Quick Reference

### Generate

```bash
POST /visuals/api/generate/
{
  "content": "Your text here",
  "format": "png",
  "style_id": "CDQPRVVJCSTPRBBCD5Q6AWR"
}
```

### Check Status

```bash
GET /visuals/api/status/<visual-id>/
```

### Get Options

```bash
GET /visuals/api/options/
```

---

## 🐛 Troubleshooting

### Error: "Service not configured"

**Fix:** Add `NAPKIN_API_KEY` to `.env` and restart

### Visual not generating

**Check:**

1. API key is correct
2. Content is 50+ characters
3. Internet connection is working
4. Wait full 30 seconds

### Takes too long

**Normal:** 10-30 seconds is expected
**Check:** Napkin status page: https://status.napkin.ai/

---

## 📚 Documentation

- **Full Setup**: `NAPKIN_SETUP_GUIDE.md`
- **Fixes Summary**: `NAPKIN_FIXES_SUMMARY.md`
- **App Docs**: `visuals/README.md`

---

## 🔥 Pro Tips

1. **Use visual hints**: Add `visual_query: "flowchart"` for specific layouts
2. **Test styles**: Try different styles to see what works best
3. **Save favorites**: Duplicate and modify successful visuals
4. **Batch work**: Generate multiple variations, pick the best
5. **Custom sizes**: For PNG, set custom width/height in advanced options

---

## 📞 Support

**Napkin AI:**

- Docs: https://docs.napkin.ai/
- API: https://docs.napkin.ai/api-reference
- Status: https://status.napkin.ai/

**MathScriber:**

- Issues: Check terminal logs
- Config: Review `NAPKIN_SETUP_GUIDE.md`

---

Made with ❤️ for MathScriber AI
