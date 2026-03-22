import { notFound } from "next/navigation"
import { PageLayout } from "@/components/portfolio/page-layout"
import { ProjectDetailContent } from "@/components/portfolio/project-detail-content"
import { projects, personalInfo } from "@/lib/content-reader"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | ${personalInfo.name}`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  return (
    <PageLayout showParticles={false}>
      <ProjectDetailContent project={project} />
    </PageLayout>
  )
}
