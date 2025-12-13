"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, ArrowRight, Calendar, Clock, Users } from "lucide-react"
import { SectionHeader } from "./section-header"
import { projects } from "@/lib/projects-data"

const categories = ["All", "Web Apps", "Mobile", "Design", "Open Source"]

export function ProjectsPageContent() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const filteredProjects = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Portfolio"
          title="My Projects"
          description="A showcase of my recent work, side projects, and open source contributions"
        />

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary/50 text-foreground hover:bg-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div layout className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Image container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

                  {/* Overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] flex items-center justify-center gap-4"
                  >
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-card/95 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`View ${project.title} live`}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-card/95 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`View ${project.title} source code`}
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  </motion.div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.featured && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg">
                        Featured
                      </span>
                    )}
                    <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-full border border-border">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {project.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {project.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {project.role}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-md">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-xs px-2.5 py-1 bg-secondary text-muted-foreground rounded-md">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Metrics & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex gap-4">
                      {Object.entries(project.metrics)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-sm font-bold text-primary">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          </div>
                        ))}
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
