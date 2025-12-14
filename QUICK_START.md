# 🚀 Quick Reference - Portfolio Updates

## 📍 Where to Update What

| What You Want to Change | File to Edit | Lines |
|------------------------|-------------|-------|
| **Your name & title** | `lib/data.ts` | 8-10 |
| **Email address** | `lib/data.ts` | 44 |
| **GitHub/LinkedIn** | `lib/data.ts` | 51-53 |
| **About me text** | `lib/data.ts` | 22-30 |
| **Work experience** | `lib/data.ts` | 80-165 |
| **Skills & levels** | `lib/data.ts` | 205-255 |
| **Education** | `lib/data.ts` | 170-200 |
| **Projects** | `lib/projects-data.ts` | Entire file |
| **Profile photo** | `/public/user.png` | Replace file |
| **Project images** | `/public/*.jpg` | Replace files |

## 🎯 Essential Updates (Must Do!)

### 1. Personal Info (5 minutes)

```typescript
// lib/data.ts - Lines 8-18
export const personalInfo = {
  name: "YOUR NAME HERE",
  title: "YOUR JOB TITLE",
  bio: "YOUR SHORT BIO",
  // ...
}
```

### 2. Contact (2 minutes)

```typescript
// lib/data.ts - Lines 43-48
contact: {
  email: "YOUR_EMAIL@example.com",
  location: "Your City, State",
}
```

### 3. Social Links (3 minutes)

```typescript
// lib/data.ts - Lines 51-65
social: {
  github: "https://github.com/YOUR_USERNAME",
  linkedin: "https://linkedin.com/in/YOUR_USERNAME",
}
```

### 4. Replace Profile Photo (1 minute)

- Replace `/public/user.png` with your photo
- Recommended size: 400x400px
- Format: PNG or JPG

## 📝 Recommended Updates (Should Do)

### 5. Work Experience (15 minutes)

```typescript
// lib/data.ts - Lines 80-165
export const experience = [
  {
    company: "YOUR COMPANY",
    position: "YOUR POSITION",
    startDate: "Jan 2022",
    endDate: "Present",
    // ... more details
  },
]
```

### 6. Skills (10 minutes)

```typescript
// lib/data.ts - Lines 205-255
languages: [
  { name: "JavaScript", level: 95, years: 5 },
  // Add your skills with honest levels
]
```

### 7. Projects (30 minutes)

```typescript
// lib/projects-data.ts
{
  title: "Your Project Name",
  description: "What it does",
  image: "/your-project-image.jpg",
  githubUrl: "https://github.com/you/project",
  // ... more details
}
```

## 🎨 Optional Updates (Nice to Have)

### 8. Education

- `lib/data.ts` - Lines 170-200

### 9. Testimonials

- `lib/data.ts` - Lines 265-305

### 10. Certifications

- `lib/data.ts` - Lines 310-350

## ⚡ Quick Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

## 🔍 Testing Checklist

After making changes, check:

- [ ] Homepage shows your name
- [ ] About page has your bio
- [ ] Contact page has your email
- [ ] Projects page shows your projects
- [ ] All social links work
- [ ] Images load correctly
- [ ] Mobile view looks good

## 💡 Common Issues

**Problem:** Changes don't appear

- **Solution:** Restart dev server (`Ctrl+C` then `pnpm dev`)

**Problem:** TypeScript errors

- **Solution:** Check for typos in `lib/data.ts`

**Problem:** Images not showing

- **Solution:** Verify images exist in `/public` folder

**Problem:** Broken links

- **Solution:** Check URLs have `https://` prefix

## 📱 Before Going Live

- [ ] Update all text from template
- [ ] Replace all placeholder images
- [ ] Add real project screenshots
- [ ] Test all external links
- [ ] Check mobile responsiveness
- [ ] Verify email works
- [ ] Test contact form
- [ ] Check SEO meta tags
- [ ] Add resume.pdf (optional)
- [ ] Remove COMMIT_PLAN.md
- [ ] Update README.md

## 🎉 You're Done When

✅ Your name appears everywhere (not "Farhan Alam")
✅ All social links point to YOUR profiles
✅ Projects are YOUR actual projects
✅ Email is YOUR real email
✅ Photos are YOUR actual photos
✅ No placeholder/template text remains
✅ Everything works on mobile

---

**Need more help?** Check [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) for detailed instructions!
