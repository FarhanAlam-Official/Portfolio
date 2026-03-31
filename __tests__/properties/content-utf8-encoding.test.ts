import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { PortfolioContentSchema } from '@/lib/schemas/content-schema'

/**
 * Feature: database-free-cms-admin-panel
 * Property 10: Content UTF-8 Encoding
 * 
 * For any content containing Unicode characters, writing to content.json 
 * then reading SHALL preserve all characters correctly.
 * 
 * Validates: Requirements 3.5
 */
describe('Property 10: Content UTF-8 Encoding', () => {
  it('should preserve Unicode characters through write-read cycle', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryUnicodeContent(),
        async (content) => {
          // Serialize with UTF-8 encoding
          const json = JSON.stringify(content, null, 2)
          const buffer = Buffer.from(json, 'utf-8')
          
          // Deserialize from UTF-8 buffer
          const decoded = buffer.toString('utf-8')
          const parsed = JSON.parse(decoded)
          
          // Validate against schema
          const validation = PortfolioContentSchema.safeParse(parsed)
          expect(validation.success).toBe(true)
          
          // Check all Unicode characters preserved
          expect(parsed).toEqual(content)
          
          // Verify specific Unicode fields
          expect(parsed.personalInfo.name).toBe(content.personalInfo.name)
          expect(parsed.personalInfo.bio).toBe(content.personalInfo.bio)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should handle various Unicode character sets', async () => {
    const unicodeExamples = [
      'Hello 世界', // Chinese
      'Привет мир', // Russian
      'مرحبا بالعالم', // Arabic
      'こんにちは世界', // Japanese
      '안녕하세요 세계', // Korean
      'Héllo Wörld 🌍', // Accents and emoji
      '¡Hola! ¿Cómo estás?', // Spanish
      'Γειά σου κόσμε', // Greek
    ]
    
    for (const text of unicodeExamples) {
      const content = {
        personalInfo: {
          name: text,
          title: text,
          tagline: text,
          bio: text,
          about: {
            description: text,
            highlights: [text],
            interests: [text],
          },
          contact: {
            email: 'test@example.com',
            location: text,
            availability: text,
          },
          social: {},
          seo: {
            keywords: [text],
            ogImage: '/image.png',
          },
          resume: '/resume.pdf',
        },
        experience: [],
        education: [],
        skills: { languages: [], frameworks: [], tools: [], soft: [] },
        testimonials: [],
        certifications: [],
        awards: [],
        projects: [],
        blog: { enabled: false, posts: [] },
        stats: {
          yearsOfExperience: 5,
          projectsCompleted: 10,
          happyClients: 20,
          linesOfCode: '100k',
          cupsOfCoffee: '1000',
        },
        theme: {
          primaryColor: '#000000',
          accentColor: '#ffffff',
        },
      }
      
      // Serialize and deserialize
      const json = JSON.stringify(content, null, 2)
      const buffer = Buffer.from(json, 'utf-8')
      const decoded = buffer.toString('utf-8')
      const parsed = JSON.parse(decoded)
      
      // Verify Unicode preserved
      expect(parsed.personalInfo.name).toBe(text)
      expect(parsed.personalInfo.bio).toBe(text)
      expect(parsed.personalInfo.about.description).toBe(text)
    }
  })
})

// Arbitrary generator for content with Unicode characters
function arbitraryUnicodeContent() {
  const unicodeString = fc.constantFrom(
    'Hello 世界',
    'Привет мир',
    'مرحبا بالعالم',
    'こんにちは世界',
    '안녕하세요 세계',
    'Héllo Wörld 🌍',
    '¡Hola! ¿Cómo estás?',
    'Γειά σου κόσμε',
    'Test123'
  )
  
  return fc.record({
    personalInfo: fc.record({
      name: unicodeString,
      title: unicodeString,
      tagline: unicodeString,
      bio: unicodeString,
      about: fc.record({
        description: unicodeString,
        highlights: fc.array(unicodeString, { minLength: 0, maxLength: 5 }),
        interests: fc.array(unicodeString, { minLength: 0, maxLength: 5 }),
      }),
      contact: fc.record({
        email: fc.emailAddress(),
        phone: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
        location: unicodeString,
        availability: unicodeString,
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
        keywords: fc.array(unicodeString, { minLength: 0, maxLength: 10 }),
        ogImage: fc.string({ minLength: 1, maxLength: 200 }),
      }),
      resume: fc.string({ minLength: 1, maxLength: 200 }),
    }),
    experience: fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        company: unicodeString,
        position: unicodeString,
        location: unicodeString,
        type: fc.constantFrom('Full-time', 'Part-time', 'Contract', 'Freelance'),
        startDate: fc.string({ minLength: 1, maxLength: 50 }),
        endDate: fc.string({ minLength: 1, maxLength: 50 }),
        current: fc.boolean(),
        description: unicodeString,
        responsibilities: fc.array(unicodeString, { minLength: 0, maxLength: 5 }),
        technologies: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 10 }),
        achievements: fc.array(unicodeString, { minLength: 0, maxLength: 5 }),
      }),
      { minLength: 0, maxLength: 3 }
    ),
    education: fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        institution: unicodeString,
        degree: unicodeString,
        field: unicodeString,
        location: unicodeString,
        startDate: fc.string({ minLength: 1, maxLength: 50 }),
        endDate: fc.string({ minLength: 1, maxLength: 50 }),
        gpa: fc.option(fc.string({ minLength: 1, maxLength: 10 })),
        description: unicodeString,
        achievements: fc.array(unicodeString, { minLength: 0, maxLength: 5 }),
        coursework: fc.array(unicodeString, { minLength: 0, maxLength: 10 }),
      }),
      { minLength: 0, maxLength: 3 }
    ),
    skills: fc.record({
      languages: fc.array(
        fc.record({
          name: unicodeString,
          level: fc.integer({ min: 0, max: 100 }),
          years: fc.integer({ min: 0, max: 50 }),
        }),
        { minLength: 0, maxLength: 10 }
      ),
      frameworks: fc.array(
        fc.record({
          name: unicodeString,
          level: fc.integer({ min: 0, max: 100 }),
          years: fc.integer({ min: 0, max: 50 }),
        }),
        { minLength: 0, maxLength: 10 }
      ),
      tools: fc.array(
        fc.record({
          name: unicodeString,
          level: fc.integer({ min: 0, max: 100 }),
          years: fc.integer({ min: 0, max: 50 }),
        }),
        { minLength: 0, maxLength: 10 }
      ),
      soft: fc.array(unicodeString, { minLength: 0, maxLength: 10 }),
    }),
    testimonials: fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: unicodeString,
        role: unicodeString,
        company: unicodeString,
        image: fc.string({ minLength: 1, maxLength: 200 }),
        quote: unicodeString,
        rating: fc.integer({ min: 1, max: 5 }),
        date: fc.string({ minLength: 1, maxLength: 50 }),
      }),
      { minLength: 0, maxLength: 5 }
    ),
    certifications: fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: unicodeString,
        issuer: unicodeString,
        date: fc.string({ minLength: 1, maxLength: 50 }),
        credentialId: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
        url: fc.option(fc.webUrl()),
      }),
      { minLength: 0, maxLength: 5 }
    ),
    awards: fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        title: unicodeString,
        issuer: unicodeString,
        date: fc.string({ minLength: 1, maxLength: 50 }),
        description: unicodeString,
      }),
      { minLength: 0, maxLength: 5 }
    ),
    projects: fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        title: unicodeString,
        subtitle: unicodeString,
        description: unicodeString,
        longDescription: unicodeString,
        image: fc.string({ minLength: 1, maxLength: 200 }),
        category: unicodeString,
        tags: fc.array(unicodeString, { minLength: 1, maxLength: 5 }),
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
        year: fc.string({ minLength: 1, maxLength: 10 }),
        role: unicodeString,
        duration: fc.string({ minLength: 1, maxLength: 50 }),
        challenges: fc.option(fc.array(unicodeString, { minLength: 0, maxLength: 5 })),
        solutions: fc.option(fc.array(unicodeString, { minLength: 0, maxLength: 5 })),
        testimonial: fc.option(
          fc.record({
            quote: unicodeString,
            author: unicodeString,
            role: unicodeString,
          })
        ),
      }),
      { minLength: 0, maxLength: 5 }
    ),
    blog: fc.record({
      enabled: fc.boolean(),
      posts: fc.array(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
          title: unicodeString,
          excerpt: unicodeString,
          date: fc.string({ minLength: 1, maxLength: 50 }),
          readTime: fc.string({ minLength: 1, maxLength: 20 }),
          url: fc.webUrl(),
          tags: fc.array(unicodeString, { minLength: 0, maxLength: 5 }),
        }),
        { minLength: 0, maxLength: 10 }
      ),
    }),
    stats: fc.record({
      yearsOfExperience: fc.integer({ min: 0, max: 50 }),
      projectsCompleted: fc.integer({ min: 0, max: 1000 }),
      happyClients: fc.integer({ min: 0, max: 1000 }),
      linesOfCode: fc.string({ minLength: 1, maxLength: 20 }),
      cupsOfCoffee: fc.string({ minLength: 1, maxLength: 20 }),
    }),
    theme: fc.record({
      primaryColor: fc.string({ minLength: 1, maxLength: 50 }),
      accentColor: fc.string({ minLength: 1, maxLength: 50 }),
    }),
  })
}
