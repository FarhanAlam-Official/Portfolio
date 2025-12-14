# 🌟 Portfolio - Farhan Alam

A stunning, modern portfolio website built with Next.js 16, featuring smooth animations, 3D effects, and a fully responsive design. This portfolio showcases projects, skills, and experience with an engaging user interface.

![Portfolio Preview](public/user.png)

## ✨ Features

- **🎨 Modern Design**: Clean, professional interface with smooth animations
- **📱 Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **🌙 Dark Mode Support**: Built-in theme switching capability
- **⚡ Fast Performance**: Optimized with Next.js 16 and Turbopack
- **🎭 Smooth Animations**: Powered by Framer Motion
- **🎯 3D Interactive Elements**: Engaging hero section with 3D scene
- **♿ Accessible**: Following WCAG guidelines
- **🔍 SEO Optimized**: Meta tags and structured data
- **📊 Analytics Ready**: Vercel Analytics integration

## 🛠️ Tech Stack

### Core

- **[Next.js 16](https://nextjs.org/)** - React framework with Turbopack
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **Custom Animations** - Tailwind-based animations

### Animations & Effects

- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Three.js](https://threejs.org/)** (via Hero3DScene) - 3D graphics

### Tools & Utilities

- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Vercel Analytics](https://vercel.com/analytics)** - Performance monitoring
- **[PNPM](https://pnpm.io/)** - Fast, efficient package manager

## 🎯 Customization

**Want to make this portfolio yours?** 

All your personal information is centralized in **ONE FILE**: `lib/data.ts`

Simply update this file with your:
- Personal info, bio, and contact details
- Work experience and education
- Skills and proficiency levels
- Testimonials and certifications
- Social media links

Then update your projects in `lib/projects-data.ts`

📖 **[Read the Complete Customization Guide →](CUSTOMIZATION_GUIDE.md)**

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PNPM (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Customize your data**

   ```bash
   # Edit lib/data.ts with your personal information
   # Edit lib/projects-data.ts with your projects
   # Replace images in /public folder
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```bash
Portfolio/
├── app/                      # Next.js app directory
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── projects/            # Projects page & detail
│   ├── skills/              # Skills page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── portfolio/           # Portfolio-specific components
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── projects-section.tsx
│   │   └── ...
│   └── ui/                  # shadcn/ui components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
│   ├── projects-data.ts     # Project data
│   └── utils.ts             # Helper functions
├── public/                  # Static assets
│   └── user.png             # Profile image
├── styles/                  # Additional styles
├── components.json          # shadcn/ui config
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🎨 Customization

### Update Profile Information

1. **Personal Details**: Edit the hero section in `components/portfolio/hero-section.tsx`
2. **Profile Image**: Replace `/public/user.png` with your image
3. **Projects**: Update `lib/projects-data.ts` with your projects
4. **Skills**: Modify the skills section in `components/portfolio/skills-section.tsx`

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: "your-color",
      // Add more custom colors
    }
  }
}
```

### Fonts

Fonts are configured in `app/layout.tsx`. Current setup uses:

- **Geist** - Primary font
- **Geist Mono** - Code/monospace font
- **Space Grotesk** - Accent font
- **Source Serif 4** - Serif font

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import repository in Vercel
3. Deploy automatically

### Other Platforms

- **Netlify**: `npm run build` outputs to `.next`
- **Docker**: Create a Dockerfile for containerized deployment
- **Static Export**: Configure `next.config.mjs` for static export

## 📝 Environment Variables

Create a `.env.local` file for local development:

```env
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Farhan Alam

- Portfolio: [Your Website](https://yourwebsite.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [shadcn](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for hosting and analytics
- All open-source contributors

---

⭐ If you like this project, please give it a star on GitHub!
