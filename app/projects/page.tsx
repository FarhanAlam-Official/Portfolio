import { PageLayout } from "@/components/portfolio/page-layout"
import { ProjectsPageContent } from "@/components/portfolio/projects-page-content"

export const metadata = {
  title: "Projects | Farhan Alam",
  description: "Explore the portfolio of projects built by Farhan Alam.",
}

export default function ProjectsPage() {
  return (
    <PageLayout>
      <ProjectsPageContent />
    </PageLayout>
  )
}
