# 📝 Portfolio Customization Guide

## 🎯 Quick Start - Update Your Information

All your personal information is now centralized in **ONE FILE**: `lib/data.ts`

This makes it super easy to manage your portfolio! Just edit this one file and all changes will automatically reflect across your entire site.

---

## 📁 File Structure

```
lib/
├── data.ts          ← 🎯 UPDATE THIS FILE! (Your personal info)
└── projects-data.ts ← Your projects (keep this separate for organization)
```

---

## 🔧 What to Update in `lib/data.ts`

### 1. **Personal Information** (Lines 8-18)

```typescript
export const personalInfo = {
  name: "Your Full Name",           // Change this
  title: "Your Job Title",          // e.g., "Frontend Developer"
  tagline: "Your tagline",          // Short catchy phrase
  bio: "Your short bio",            // 1-2 sentences
  
  // ... more fields below
}
```

### 2. **About Section** (Lines 20-40)

Update your detailed about description, highlights, and interests:

```typescript
about: {
  description: `Write your full story here...
  
  Multiple paragraphs are fine!`,
  
  highlights: [
    "Your key achievement 1",
    "Your key achievement 2",
    // Add more
  ],
  
  interests: [
    "Your interest 1",
    "Your interest 2",
    // Add more
  ],
}
```

### 3. **Contact Information** (Lines 42-48)

```typescript
contact: {
  email: "your.email@example.com",     // Your real email
  phone: "+1 (555) 123-4567",          // Optional
  location: "Your City, State",
  availability: "Your status",         // e.g., "Open to opportunities"
}
```

### 4. **Social Media Links** (Lines 50-65)

```typescript
social: {
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  twitter: "https://twitter.com/yourusername",
  // Optional: instagram, facebook, youtube, medium, devto
}
```

### 5. **Work Experience** (Lines 80-165)

Add your actual work history. You can add/remove entries:

```typescript
export const experience = [
  {
    id: "exp-1",
    company: "Company Name",
    position: "Your Position",
    location: "City, State",
    type: "Full-time",              // Full-time, Part-time, Contract, Freelance
    startDate: "Jan 2022",
    endDate: "Present",
    current: true,
    description: "Brief description",
    responsibilities: [
      "What you did",
      "Another responsibility",
    ],
    technologies: ["React", "Node.js"],
    achievements: [
      "Your achievement",
    ],
  },
  // Add more experience entries
]
```

### 6. **Education** (Lines 170-200)

```typescript
export const education = [
  {
    id: "edu-1",
    institution: "University Name",
    degree: "Bachelor of Science",
    field: "Computer Science",
    location: "City, State",
    startDate: "2015",
    endDate: "2019",
    gpa: "3.8/4.0",              // Optional
    achievements: [
      "Dean's List",
      // Add more
    ],
  },
  // Add more education entries
]
```

### 7. **Skills** (Lines 205-260)

Update your actual skill levels (0-100):

```typescript
export const skills = {
  languages: [
    { name: "JavaScript", level: 95, years: 5 },
    // Add/modify your languages
  ],
  
  frameworks: [
    { name: "React", level: 90, years: 4 },
    // Add/modify your frameworks
  ],
  
  tools: [
    { name: "Git", level: 95, years: 5 },
    // Add/modify your tools
  ],
  
  soft: [
    "Problem Solving",
    "Team Collaboration",
    // Add your soft skills
  ],
}
```

### 8. **Testimonials** (Lines 265-305)

Add real client testimonials:

```typescript
export const testimonials = [
  {
    id: "test-1",
    name: "Client Name",
    role: "Their Role",
    company: "Their Company",
    image: "/placeholder-user.jpg",
    quote: "What they said about you...",
    rating: 5,
    date: "2024",
  },
  // Add more testimonials
]
```

### 9. **Certifications & Awards** (Lines 310-350)

```typescript
export const certifications = [
  {
    id: "cert-1",
    name: "Certification Name",
    issuer: "Issuing Organization",
    date: "2023",
    credentialId: "ID123",
    url: "certification-url",
  },
]

export const awards = [
  {
    id: "award-1",
    title: "Award Title",
    issuer: "Who gave it",
    date: "2023",
    description: "Why you got it",
  },
]
```

### 10. **Stats** (Lines 375-385)

Update your metrics:

```typescript
export const stats = {
  yearsOfExperience: 5,
  projectsCompleted: 50,
  happyClients: 30,
  linesOfCode: "100k+",
}
```

---

## 📊 Projects

Projects are still in `lib/projects-data.ts` - this keeps them organized separately.

Update each project with:
- Your project details
- Real screenshots (add to `/public`)
- Actual GitHub URLs
- Live demo links

---

## 🖼️ Images to Replace

### In `/public` folder:

1. **Your Photos:**
   - `user.png` - Your main profile photo (used as favicon too)
   - `hero-portrait.jpg` - Large hero image
   - `professional-*-headshot.png` - Replace or delete team photos

2. **Project Screenshots:**
   - Replace all project images with your actual project screenshots
   - Keep the same filenames or update them in `projects-data.ts`

3. **Other Images:**
   - `placeholder-*.jpg/svg` - Can keep or replace
   - Add `resume.pdf` if you want a downloadable resume

---

## ✅ Checklist

After updating `lib/data.ts`, verify these pages:

- [ ] **Homepage** - Shows your name, title, bio
- [ ] **About Page** - Shows your about section, highlights, interests
- [ ] **Skills Page** - Shows your skills from data.ts
- [ ] **Projects Page** - Shows projects from projects-data.ts
- [ ] **Contact Page** - Shows your email and social links
- [ ] **Browser Tab** - Shows your name (from metadata)
- [ ] **Social Share** - Preview looks good (og tags)

---

## 🚀 Testing Your Changes

1. **Start the dev server:**
   ```bash
   pnpm dev
   ```

2. **Visit:** http://localhost:3000

3. **Check each page** to ensure your data appears correctly

4. **Test on mobile** - Resize browser or use device toolbar

---

## 💡 Pro Tips

### Tip 1: Keep it Updated
Update `lib/data.ts` whenever you:
- Get a new job
- Complete a new project
- Learn a new skill
- Receive a testimonial

### Tip 2: Be Honest
Don't inflate your skill levels. Be realistic:
- 90-100: Expert level
- 70-89: Proficient
- 50-69: Intermediate
- 30-49: Beginner

### Tip 3: Use Real Testimonials
- Reach out to past clients/colleagues
- Ask for specific feedback
- Include their real names and roles (with permission)

### Tip 4: Professional Photos
- Use high-quality images
- Professional headshot recommended
- Consistent style across all photos

---

## 🎨 Optional: Blog Integration

If you have a blog, enable it in `lib/data.ts`:

```typescript
export const blog = {
  enabled: true,  // Change to true
  posts: [
    {
      title: "Your Blog Post Title",
      excerpt: "Short description...",
      date: "2024-01-15",
      url: "https://yourblog.com/post",
    },
  ],
}
```

---

## 📞 Need Help?

If you get stuck:
1. Check the console for errors (`F12` in browser)
2. Make sure all fields in `lib/data.ts` are filled correctly
3. Verify no typos in your social media URLs
4. Ensure images exist in the `/public` folder

---

## 🎉 You're All Set!

Your portfolio is now personalized! Remember:
- **One file to rule them all:** `lib/data.ts`
- Update it regularly
- Keep it professional
- Showcase your best work

Good luck with your portfolio! 🚀
