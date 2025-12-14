// ============================================
// 🎯 PORTFOLIO CONFIGURATION
// ============================================
// Update all your personal information here!
// This file is the single source of truth for your portfolio.

export const personalInfo = {
  name: "Farhan Alam",
  title: "Full-Stack Developer & Designer",
  tagline: "Crafting beautiful, performant web experiences",
  bio: "A passionate full-stack developer crafting beautiful, performant web experiences.",
  
  // Detailed about information
  about: {
    description: `I'm a passionate full-stack developer with a keen eye for design and a love for creating seamless user experiences. With over 5 years of experience in web development, I specialize in building modern, scalable applications using cutting-edge technologies.

My journey in tech started with a curiosity about how websites work, which evolved into a full-blown passion for creating digital solutions that make a difference. I believe in writing clean, maintainable code and designing intuitive interfaces that users love.

When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and mentoring.`,
    
    highlights: [
      "5+ years of professional development experience",
      "Expert in React, Next.js, and TypeScript",
      "Strong focus on performance and user experience",
      "Open-source contributor and tech blogger",
    ],
    
    interests: [
      "Web Performance Optimization",
      "UI/UX Design",
      "Open Source",
      "AI & Machine Learning",
      "Cloud Architecture",
    ],
  },

  // Contact Information
  contact: {
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567", // Optional
    location: "San Francisco, CA",
    availability: "Available for freelance work",
  },

  // Social Media Links
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    // Optional social links
    instagram: "",
    facebook: "",
    youtube: "",
    medium: "",
    devto: "",
    portfolio: "https://yourportfolio.com",
  },

  // SEO & Metadata
  seo: {
    keywords: [
      "developer",
      "portfolio",
      "full-stack",
      "react",
      "nextjs",
      "typescript",
      "web developer",
      "software engineer",
      "designer",
    ],
    ogImage: "/user.png", // Open Graph image for social sharing
  },

  // Resume/CV link
  resume: "/resume.pdf", // Add your resume to public folder
}

// ============================================
// 💼 WORK EXPERIENCE
// ============================================
export const experience = [
  {
    id: "exp-1",
    company: "Tech Corp",
    position: "Senior Full-Stack Developer",
    location: "San Francisco, CA",
    type: "Full-time", // Full-time, Part-time, Contract, Freelance
    startDate: "Jan 2022",
    endDate: "Present",
    current: true,
    description: "Leading development of scalable web applications and mentoring junior developers.",
    responsibilities: [
      "Architected and developed 5+ production-ready web applications using Next.js and React",
      "Led a team of 4 developers, conducting code reviews and providing technical mentorship",
      "Improved application performance by 40% through optimization and best practices",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    achievements: [
      "Received 'Outstanding Performance' award in 2023",
      "Successfully delivered 3 major projects ahead of schedule",
    ],
  },
  {
    id: "exp-2",
    company: "StartUp Inc",
    position: "Full-Stack Developer",
    location: "Remote",
    type: "Full-time",
    startDate: "Jun 2020",
    endDate: "Dec 2021",
    current: false,
    description: "Built and maintained multiple client-facing applications.",
    responsibilities: [
      "Developed RESTful APIs and microservices using Node.js and Express",
      "Created responsive web applications with React and Redux",
      "Collaborated with designers to implement pixel-perfect UI designs",
      "Wrote comprehensive unit and integration tests (90% coverage)",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Redis", "Docker"],
    achievements: [
      "Reduced API response time by 50% through optimization",
      "Onboarded and trained 3 new team members",
    ],
  },
  {
    id: "exp-3",
    company: "Freelance",
    position: "Web Developer",
    location: "Remote",
    type: "Freelance",
    startDate: "Jan 2019",
    endDate: "May 2020",
    current: false,
    description: "Provided web development services to various clients.",
    responsibilities: [
      "Delivered 15+ websites and web applications for small businesses",
      "Managed client relationships and project timelines",
      "Provided ongoing maintenance and support",
    ],
    technologies: ["JavaScript", "React", "WordPress", "PHP", "MySQL"],
    achievements: [
      "Maintained 100% client satisfaction rate",
      "Generated $50k+ in revenue",
    ],
  },
]

// ============================================
// 🎓 EDUCATION
// ============================================
export const education = [
  {
    id: "edu-1",
    institution: "University of Technology",
    degree: "Bachelor of Science in Computer Science",
    field: "Computer Science",
    location: "San Francisco, CA",
    startDate: "2015",
    endDate: "2019",
    gpa: "3.8/4.0",
    description: "Focused on software engineering, algorithms, and web technologies.",
    achievements: [
      "Dean's List all semesters",
      "President of Computer Science Club",
      "Winner of University Hackathon 2018",
    ],
    coursework: [
      "Data Structures & Algorithms",
      "Web Development",
      "Database Systems",
      "Software Engineering",
      "Machine Learning",
    ],
  },
  // Add more education entries as needed
]

// ============================================
// 🛠️ SKILLS
// ============================================
export const skills = {
  // Programming Languages
  languages: [
    { name: "JavaScript", level: 95, years: 5 },
    { name: "TypeScript", level: 90, years: 4 },
    { name: "Python", level: 80, years: 3 },
    { name: "HTML/CSS", level: 95, years: 6 },
    { name: "SQL", level: 85, years: 4 },
    { name: "Java", level: 70, years: 2 },
  ],

  // Frameworks & Libraries
  frameworks: [
    { name: "React", level: 95, years: 5 },
    { name: "Next.js", level: 90, years: 3 },
    { name: "Node.js", level: 90, years: 4 },
    { name: "Express", level: 85, years: 4 },
    { name: "Tailwind CSS", level: 90, years: 3 },
    { name: "Redux", level: 80, years: 3 },
    { name: "Vue.js", level: 70, years: 2 },
    { name: "React Native", level: 75, years: 2 },
  ],

  // Tools & Technologies
  tools: [
    { name: "Git / GitHub", level: 95, years: 5 },
    { name: "Docker", level: 85, years: 3 },
    { name: "AWS", level: 80, years: 3 },
    { name: "PostgreSQL", level: 85, years: 4 },
    { name: "MongoDB", level: 85, years: 4 },
    { name: "Redis", level: 75, years: 2 },
    { name: "Vercel", level: 90, years: 3 },
    { name: "Figma", level: 80, years: 3 },
    { name: "VS Code", level: 95, years: 5 },
  ],

  // Soft Skills
  soft: [
    "Problem Solving",
    "Team Collaboration",
    "Communication",
    "Leadership",
    "Time Management",
    "Agile/Scrum",
    "Code Review",
    "Mentoring",
  ],
}

// ============================================
// 💬 TESTIMONIALS
// ============================================
export const testimonials = [
  {
    id: "test-1",
    name: "John Smith",
    role: "CEO",
    company: "Tech Solutions Inc",
    image: "/placeholder-user.jpg",
    quote: "Working with Farhan was an absolute pleasure. He delivered our project on time and exceeded all expectations. His attention to detail and technical expertise are outstanding.",
    rating: 5,
    date: "2024",
  },
  {
    id: "test-2",
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "StartUp Labs",
    image: "/placeholder-user.jpg",
    quote: "Farhan's ability to transform complex requirements into elegant solutions is remarkable. He's not just a developer, but a true problem solver who cares about the end user.",
    rating: 5,
    date: "2023",
  },
  {
    id: "test-3",
    name: "Michael Chen",
    role: "CTO",
    company: "Digital Innovations",
    image: "/placeholder-user.jpg",
    quote: "One of the most talented developers I've worked with. Farhan brings creativity and technical excellence to every project. Highly recommended!",
    rating: 5,
    date: "2023",
  },
]

// ============================================
// 🏆 CERTIFICATIONS & AWARDS
// ============================================
export const certifications = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "ABC123XYZ",
    url: "https://aws.amazon.com/certification/",
  },
  {
    id: "cert-2",
    name: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    date: "2022",
    credentialId: "GCP456DEF",
    url: "https://cloud.google.com/certification",
  },
  // Add more certifications
]

export const awards = [
  {
    id: "award-1",
    title: "Best Developer of the Year",
    issuer: "Tech Corp",
    date: "2023",
    description: "Recognized for outstanding contributions and technical excellence.",
  },
  {
    id: "award-2",
    title: "Hackathon Winner",
    issuer: "City Tech Hackathon",
    date: "2022",
    description: "First place for building an innovative healthcare solution.",
  },
  // Add more awards
]

// ============================================
// 📝 BLOG / ARTICLES (Optional)
// ============================================
export const blog = {
  enabled: false, // Set to true if you have a blog
  posts: [
    {
      id: "post-1",
      title: "Building Scalable React Applications",
      excerpt: "Learn best practices for building large-scale React applications...",
      date: "2024-01-15",
      readTime: "8 min read",
      url: "https://yourblog.com/post-1",
      tags: ["React", "JavaScript", "Best Practices"],
    },
    // Add more blog posts
  ],
}

// ============================================
// 📊 STATS / METRICS (Optional)
// ============================================
export const stats = {
  yearsOfExperience: 5,
  projectsCompleted: 50,
  happyClients: 30,
  linesOfCode: "100k+",
  cupsOfCoffee: "∞",
}

// ============================================
// 🎨 THEME CONFIGURATION (Optional)
// ============================================
export const theme = {
  primaryColor: "#8b5cf6", // Purple
  accentColor: "#ec4899", // Pink
  // Add more theme customization if needed
}
