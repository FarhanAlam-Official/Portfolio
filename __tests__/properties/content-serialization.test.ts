import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { PortfolioContentSchema } from '@/lib/schemas/content-schema'

/**
 * Feature: database-free-cms-admin-panel
 * Property 9: Content Serialization Round-Trip
 * 
 * For any valid portfolio content object, serializing to JSON then 
 * deserializing SHALL produce an equivalent object with all data preserved.
 * 
 * Validates: Requirements 3.7
 */
describe('Property 9: Content Serialization Round-Trip', () => {
  it('should preserve all data through serialize-deserialize cycle', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryPortfolioContent(),
        async (content) => {
          // Serialize to JSON
          const json = JSON.stringify(content, null, 2)
          
          // Deserialize from JSON
          const parsed = JSON.parse(json)
          
          // Validate against schema
          const validation = PortfolioContentSchema.safeParse(parsed)
          expect(validation.success).toBe(true)
          
          // Check equivalence - all data preserved
          expect(parsed).toEqual(content)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Arbitrary generator for portfolio content
function arbitraryPortfolioContent() {
  // Helper to generate alphanumeric strings (always valid)
  const alphaString = (minLength: number, maxLength: number) =>
    fc.stringMatching(/^[a-zA-Z0-9]+$/).filter(s => s.length >= minLength && s.length <= maxLength)
  
  return fc.record({
    personalInfo: fc.record({
      name: alphaString(1, 100),
      title: alphaString(1, 100),
      tagline: alphaString(1, 200),
      bio: alphaString(1, 1000),
      about: fc.record({
        description: alphaString(1, 1000),
        highlights: fc.array(alphaString(1, 200), { minLength: 0, maxLength: 10 }),
        interests: fc.array(alphaString(1, 100), { minLength: 0, maxLength: 10 }),
      }),
      contact: fc.record({
        email: fc.emailAddress(),
        phone: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
        location: alphaString(1, 100),
        availability: alphaString(1, 100),
      }),
      social: fc.record({
        github: fc.option(fc.webUrl()),
        linkedin: fc.option(fc.webUrl()),
        twitter: fc.option(fc.webUrl()),
        instagram: fc.option(fc.webUrl()),
        facebook: fc.option(fc.webUrl()),
        youtube: fc.option(fc.webUrl()),
        medium: fc.option(fc.webUrl()),
        devto: fc.option(fc.webUrl()),
        portfolio: fc.option(fc.webUrl()),
      }),
      seo: fc.record({
        keywords: fc.array(alphaString(1, 50), { minLength: 0, maxLength: 20 }),
        ogImage: alphaString(1, 200),
      }),
      resume: alphaString(1, 200),
    }),
    experience: fc.array(
      fc.record({
        id: alphaString(1, 50),
        company: alphaString(1, 100),
        position: alphaString(1, 100),
        location: alphaString(1, 100),
        type: fc.constantFrom('Full-time', 'Part-time', 'Contract', 'Freelance'),
        startDate: alphaString(1, 50),
        endDate: alphaString(1, 50),
        current: fc.boolean(),
        description: alphaString(1, 1000),
        responsibilities: fc.array(alphaString(1, 200), { minLength: 0, maxLength: 10 }),
        technologies: fc.array(alphaString(1, 50), { minLength: 0, maxLength: 20 }),
        achievements: fc.array(alphaString(1, 200), { minLength: 0, maxLength: 10 }),
      }),
      { minLength: 0, maxLength: 5 }
    ),
    education: fc.array(
      fc.record({
        id: alphaString(1, 50),
        institution: alphaString(1, 100),
        degree: alphaString(1, 100),
        field: alphaString(1, 100),
        location: alphaString(1, 100),
        startDate: alphaString(1, 50),
        endDate: alphaString(1, 50),
        gpa: fc.option(fc.string({ minLength: 1, maxLength: 10 })),
        description: alphaString(1, 1000),
        achievements: fc.array(alphaString(1, 200), { minLength: 0, maxLength: 10 }),
        coursework: fc.array(alphaString(1, 100), { minLength: 0, maxLength: 20 }),
      }),
      { minLength: 0, maxLength: 5 }
    ),
    skills: fc.record({
      languages: fc.array(
        fc.record({
          name: alphaString(1, 50),
          level: fc.integer({ min: 0, max: 100 }),
          years: fc.integer({ min: 0, max: 50 }),
        }),
        { minLength: 0, maxLength: 20 }
      ),
      frameworks: fc.array(
        fc.record({
          name: alphaString(1, 50),
          level: fc.integer({ min: 0, max: 100 }),
          years: fc.integer({ min: 0, max: 50 }),
        }),
        { minLength: 0, maxLength: 20 }
      ),
      tools: fc.array(
        fc.record({
          name: alphaString(1, 50),
          level: fc.integer({ min: 0, max: 100 }),
          years: fc.integer({ min: 0, max: 50 }),
        }),
        { minLength: 0, maxLength: 20 }
      ),
      soft: fc.array(alphaString(1, 100), { minLength: 0, maxLength: 20 }),
    }),
    testimonials: fc.array(
      fc.record({
        id: alphaString(1, 50),
        name: alphaString(1, 100),
        role: alphaString(1, 100),
        company: alphaString(1, 100),
        image: alphaString(1, 200),
        quote: alphaString(1, 500),
        rating: fc.integer({ min: 1, max: 5 }),
        date: alphaString(1, 50),
      }),
      { minLength: 0, maxLength: 10 }
    ),
    certifications: fc.array(
      fc.record({
        id: alphaString(1, 50),
        name: alphaString(1, 100),
        issuer: alphaString(1, 100),
        date: alphaString(1, 50),
        credentialId: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
        url: fc.option(fc.webUrl()),
      }),
      { minLength: 0, maxLength: 10 }
    ),
    awards: fc.array(
      fc.record({
        id: alphaString(1, 50),
        title: alphaString(1, 100),
        issuer: alphaString(1, 100),
        date: alphaString(1, 50),
        description: alphaString(1, 500),
      }),
      { minLength: 0, maxLength: 10 }
    ),
    projects: fc.array(
      fc.record({
        id: alphaString(1, 50),
        title: alphaString(1, 100),
        subtitle: alphaString(1, 200),
        description: alphaString(1, 500),
        longDescription: alphaString(1, 2000),
        image: alphaString(1, 200),
        category: alphaString(1, 50),
        tags: fc.array(alphaString(1, 50), { minLength: 1, maxLength: 10 }),
        liveUrl: fc.option(fc.webUrl()),
        githubUrl: fc.option(fc.webUrl()),
        featured: fc.boolean(),
        metrics: fc.option(
          fc.record({
            users: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            performance: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            satisfaction: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            stars: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            forks: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            contributors: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
          })
        ),
        year: alphaString(1, 10),
        role: alphaString(1, 100),
        duration: alphaString(1, 50),
        challenges: fc.option(fc.array(alphaString(1, 200), { minLength: 0, maxLength: 10 })),
        solutions: fc.option(fc.array(alphaString(1, 200), { minLength: 0, maxLength: 10 })),
        testimonial: fc.option(
          fc.record({
            quote: alphaString(1, 500),
            author: alphaString(1, 100),
            role: alphaString(1, 100),
          })
        ),
      }),
      { minLength: 0, maxLength: 10 }
    ),
    blog: fc.record({
      enabled: fc.boolean(),
      posts: fc.array(
        fc.record({
          id: alphaString(1, 50),
          title: alphaString(1, 200),
          excerpt: alphaString(1, 500),
          date: alphaString(1, 50),
          readTime: alphaString(1, 20),
          url: fc.webUrl(),
          tags: fc.array(alphaString(1, 50), { minLength: 0, maxLength: 10 }),
        }),
        { minLength: 0, maxLength: 20 }
      ),
    }),
    stats: fc.record({
      yearsOfExperience: fc.integer({ min: 0, max: 50 }),
      projectsCompleted: fc.integer({ min: 0, max: 1000 }),
      happyClients: fc.integer({ min: 0, max: 1000 }),
      linesOfCode: alphaString(1, 20),
      cupsOfCoffee: alphaString(1, 20),
    }),
    theme: fc.record({
      primaryColor: alphaString(1, 50),
      accentColor: alphaString(1, 50),
    }),
  })
}
