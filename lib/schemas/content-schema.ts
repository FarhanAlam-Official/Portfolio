import { z } from 'zod'

// Personal Information Schema
export const PersonalInfoSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  bio: z.string().min(1),
  about: z.object({
    description: z.string().min(1),
    highlights: z.array(z.string()),
    interests: z.array(z.string()),
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string(),
    availability: z.string(),
  }),
  social: z.object({
    github: z.union([z.string().url(), z.literal('')]).optional(),
    linkedin: z.union([z.string().url(), z.literal('')]).optional(),
    twitter: z.union([z.string().url(), z.literal('')]).optional(),
    instagram: z.union([z.string().url(), z.literal('')]).optional(),
    facebook: z.union([z.string().url(), z.literal('')]).optional(),
    youtube: z.union([z.string().url(), z.literal('')]).optional(),
    medium: z.union([z.string().url(), z.literal('')]).optional(),
    devto: z.union([z.string().url(), z.literal('')]).optional(),
    portfolio: z.union([z.string().url(), z.literal('')]).optional(),
  }),
  seo: z.object({
    keywords: z.array(z.string()),
    ogImage: z.string(),
  }),
  resume: z.string(),
})

// Experience Schema
export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string(),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance']),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string(),
  responsibilities: z.array(z.string()),
  technologies: z.array(z.string()),
  achievements: z.array(z.string()),
})

export const ExperienceSchema = z.array(ExperienceItemSchema)

// Education Schema
export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional(),
  description: z.string(),
  achievements: z.array(z.string()),
  coursework: z.array(z.string()),
})

export const EducationSchema = z.array(EducationItemSchema)

// Skills Schema
export const SkillItemSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(0).max(100),
  years: z.number().min(0),
})

export const SkillsSchema = z.object({
  languages: z.array(SkillItemSchema),
  frameworks: z.array(SkillItemSchema),
  tools: z.array(SkillItemSchema),
  soft: z.array(z.string()),
})

// Testimonials Schema
export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  role: z.string(),
  company: z.string(),
  image: z.string(),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5),
  date: z.string(),
})

export const TestimonialsSchema = z.array(TestimonialSchema)

// Certifications Schema
export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string(),
  date: z.string(),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
})

export const CertificationsSchema = z.array(CertificationSchema)

// Awards Schema
export const AwardSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  issuer: z.string(),
  date: z.string(),
  description: z.string(),
})

export const AwardsSchema = z.array(AwardSchema)

// Projects Schema
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  subtitle: z.string(),
  description: z.string().min(1),
  longDescription: z.string(),
  image: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean(),
  metrics: z.object({
    users: z.string().optional(),
    performance: z.string().optional(),
    satisfaction: z.string().optional(),
    stars: z.string().optional(),
    forks: z.string().optional(),
    contributors: z.string().optional(),
  }).optional(),
  year: z.string(),
  role: z.string(),
  duration: z.string(),
  challenges: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
  testimonial: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
  }).optional(),
})

export const ProjectsSchema = z.array(ProjectSchema)

// Blog Schema
export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  excerpt: z.string(),
  date: z.string(),
  readTime: z.string(),
  url: z.string().url(),
  tags: z.array(z.string()),
})

export const BlogSchema = z.object({
  enabled: z.boolean(),
  posts: z.array(BlogPostSchema),
})

// Stats Schema
export const StatsSchema = z.object({
  yearsOfExperience: z.number(),
  projectsCompleted: z.number(),
  happyClients: z.number(),
  linesOfCode: z.string(),
  cupsOfCoffee: z.string(),
})

// Theme Schema
export const ThemeSchema = z.object({
  primaryColor: z.string(),
  accentColor: z.string(),
})

// Complete Portfolio Content Schema
export const PortfolioContentSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experience: ExperienceSchema,
  education: EducationSchema,
  skills: SkillsSchema,
  testimonials: TestimonialsSchema,
  certifications: CertificationsSchema,
  awards: AwardsSchema,
  projects: ProjectsSchema,
  blog: BlogSchema,
  stats: StatsSchema,
  theme: ThemeSchema,
})

// Export TypeScript types from Zod schemas
export type PortfolioContent = z.infer<typeof PortfolioContentSchema>
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>
export type EducationItem = z.infer<typeof EducationItemSchema>
export type SkillItem = z.infer<typeof SkillItemSchema>
export type Skills = z.infer<typeof SkillsSchema>
export type Testimonial = z.infer<typeof TestimonialSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type Award = z.infer<typeof AwardSchema>
export type Project = z.infer<typeof ProjectSchema>
export type BlogPost = z.infer<typeof BlogPostSchema>
export type Blog = z.infer<typeof BlogSchema>
export type Stats = z.infer<typeof StatsSchema>
export type Theme = z.infer<typeof ThemeSchema>

// schema: zod validation

// fix: schema TS inference
