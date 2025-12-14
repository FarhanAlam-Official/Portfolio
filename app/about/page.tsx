import { PageLayout } from "@/components/portfolio/page-layout"
import { AboutSection } from "@/components/portfolio/about-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"

export const metadata = {
  title: "About | Farhan Alam",
  description: "Learn more about Farhan Alam, a full-stack developer passionate about creating digital experiences.",
}

export default function AboutPage() {
  return (
    <PageLayout>
      <AboutSection />
      <ExperienceSection />
    </PageLayout>
  )
}
