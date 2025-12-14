import { PageLayout } from "@/components/portfolio/page-layout"
import { SkillsPageContent } from "@/components/portfolio/skills-page-content"

export const metadata = {
  title: "Skills | Farhan Alam",
  description: "Explore the technologies, tools, and expertise of Farhan Alam.",
}

export default function SkillsPage() {
  return (
    <PageLayout>
      <SkillsPageContent />
    </PageLayout>
  )
}
