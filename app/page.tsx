import { PageLayout } from "@/components/portfolio/page-layout"
import { HeroSection } from "@/components/portfolio/hero-section"
import { TestimonialsSection } from "@/components/portfolio/testimonials-section"
import { HomeAboutPreview } from "@/components/portfolio/home-about-preview"
import { HomeFeaturedProjects } from "@/components/portfolio/home-featured-projects"
import { HomeSkillsPreview } from "@/components/portfolio/home-skills-preview"

export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />
      <HomeAboutPreview />
      <HomeSkillsPreview />
      <HomeFeaturedProjects />
      <TestimonialsSection />
    </PageLayout>
  )
}

// page: SEO + Open Graph
