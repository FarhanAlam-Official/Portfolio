"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Lightbulb,
  Quote,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/projects-data"
import { projects } from "@/lib/projects-data"

interface ProjectDetailContentProps {
  project: Project
}

export function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const currentIndex = projects.findIndex((p) => p.id === project.id)
  const nextProject = projects[(currentIndex + 1) % projects.length]
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length]

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/projects">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-chart-2/10 text-chart-2 border border-chart-2/20">
                Featured Project
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.subtitle}</p>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video rounded-2xl overflow-hidden mb-12 border border-border"
        >
          <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

          {/* Quick actions */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <ExternalLink className="w-4 h-4" />
                View Live Site
              </Button>
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 bg-card/80 backdrop-blur-sm">
                <Github className="w-4 h-4" />
                Source Code
              </Button>
            </a>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-bold mb-4">About the Project</h2>
              <div className="prose prose-invert max-w-none">
                {project.longDescription?.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.section>

            {/* Challenges & Solutions */}
            {project.challenges && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6">Challenges & Solutions</h2>
                <div className="grid gap-6">
                  {project.challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Challenge</h3>
                          <p className="text-sm text-muted-foreground">{challenge}</p>
                        </div>
                      </div>
                      {project.solutions?.[index] && (
                        <div className="flex gap-4 pl-14">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Solution</h3>
                            <p className="text-sm text-muted-foreground">{project.solutions[index]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Testimonial */}
            {project.testimonial && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8">
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
                  <blockquote className="text-lg text-foreground leading-relaxed mb-4">
                    &ldquo;{project.testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{project.testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{project.testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project info card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 sticky top-24"
            >
              <h3 className="font-bold mb-6">Project Details</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Role</div>
                    <div className="font-medium">{project.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Year</div>
                    <div className="font-medium">{project.year}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="font-medium">{project.duration}</div>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-border" />

              {/* Technologies */}
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Metrics */}
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Metrics</h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(project.metrics).map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">{value}</div>
                    <div className="text-xs text-muted-foreground capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation to other projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href={`/projects/${prevProject.id}`}
              className="group bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ArrowLeft className="w-4 h-4" />
                Previous Project
              </div>
              <h4 className="font-semibold group-hover:text-primary transition-colors">{prevProject.title}</h4>
            </Link>
            <Link
              href={`/projects/${nextProject.id}`}
              className="group bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/30 transition-colors text-right"
            >
              <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                Next Project
                <ArrowRight className="w-4 h-4" />
              </div>
              <h4 className="font-semibold group-hover:text-primary transition-colors">{nextProject.title}</h4>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
