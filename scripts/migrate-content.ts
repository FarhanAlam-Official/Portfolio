import { promises as fs } from 'fs';
import path from 'path';
import { PortfolioContentSchema } from '../lib/schemas/content-schema';
import * as data from '../lib/data';
import { projects } from '../lib/projects-data';

/**
 * Content Migration Script
 * Migrates TypeScript data from lib/data.ts and lib/projects-data.ts to data/content.json
 */

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

async function migrateContent() {
  console.log('🚀 Starting content migration...\n');

  try {
    // Transform TypeScript data to Content_Schema format
    const content = {
      personalInfo: data.personalInfo,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      testimonials: data.testimonials,
      certifications: data.certifications,
      awards: data.awards,
      projects: projects,
      blog: data.blog,
      stats: data.stats,
      theme: data.theme,
    };

    console.log('✓ Data transformed from TypeScript modules');

    // Validate against schema
    try {
      const validatedContent = PortfolioContentSchema.parse(content);
      console.log('✓ Content validated against schema');

      // Ensure data directory exists
      const dataDir = path.dirname(CONTENT_FILE_PATH);
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir, { recursive: true });
        console.log('✓ Created data directory');
      }

      // Write formatted JSON to file
      const prettyContent = JSON.stringify(validatedContent, null, 2);
      await fs.writeFile(CONTENT_FILE_PATH, prettyContent, 'utf-8');
      console.log('✓ Content written to data/content.json');

      // Display summary
      console.log('\n📊 Migration Summary:');
      console.log(`   - Projects: ${validatedContent.projects.length}`);
      console.log(`   - Experience: ${validatedContent.experience.length}`);
      console.log(`   - Education: ${validatedContent.education.length}`);
      console.log(`   - Skills: ${Object.values(validatedContent.skills).flat().length} total`);
      console.log(`   - Testimonials: ${validatedContent.testimonials.length}`);
      console.log(`   - Certifications: ${validatedContent.certifications.length}`);
      console.log(`   - Awards: ${validatedContent.awards.length}`);

      console.log('\n✅ Migration completed successfully!');
      console.log(`📁 Content saved to: ${CONTENT_FILE_PATH}\n`);
    } catch (validationError: any) {
      console.error('\n❌ Validation failed:');
      
      if (validationError.errors) {
        validationError.errors.forEach((error: any) => {
          const field = error.path.join('.');
          console.error(`   - ${field}: ${error.message}`);
        });
      } else {
        console.error(validationError.message);
      }

      console.log('\n⚠️  Using sensible defaults for invalid fields...');

      // Create default structure
      const defaultContent = createDefaultContent();
      const prettyContent = JSON.stringify(defaultContent, null, 2);
      await fs.writeFile(CONTENT_FILE_PATH, prettyContent, 'utf-8');
      console.log('✓ Default content structure created');
      
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

/**
 * Create default empty content structure
 */
function createDefaultContent() {
  return {
    personalInfo: {
      name: "Your Name",
      title: "Your Title",
      tagline: "Your Tagline",
      bio: "Your bio here",
      about: {
        description: "About description",
        highlights: [],
        interests: [],
      },
      contact: {
        email: "your.email@example.com",
        location: "Your Location",
        availability: "Available",
      },
      social: {
        github: "",
        linkedin: "",
        twitter: "",
      },
      seo: {
        keywords: ["developer", "portfolio"],
        ogImage: "/user.png",
      },
      resume: "/resume.pdf",
    },
    experience: [],
    education: [],
    skills: {
      languages: [],
      frameworks: [],
      tools: [],
      soft: [],
    },
    testimonials: [],
    certifications: [],
    awards: [],
    projects: [],
    blog: {
      enabled: false,
      posts: [],
    },
    stats: {
      yearsOfExperience: 0,
      projectsCompleted: 0,
      happyClients: 0,
      linesOfCode: "0",
      cupsOfCoffee: "0",
    },
    theme: {
      primaryColor: "#8b5cf6",
      accentColor: "#ec4899",
    },
  };
}

// Run migration
migrateContent();
