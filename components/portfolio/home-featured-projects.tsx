"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const featuredProjects = [
  {
    id: 1,
    title: "FinanceFlow",
    description:
      "A comprehensive personal finance management platform with real-time analytics and AI-powered insights.",
    image: "/finance-dashboard-dark-theme-purple-accents.jpg",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "AI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    color: "#8b5cf6",
  },
  {
    id: 2,
    title: "CollabSpace",
    description: "Real-time collaborative workspace for remote teams with video calls and whiteboarding.",
    image: "/collaboration-workspace-app-dark-theme.jpg",
    tags: ["React", "WebRTC", "Socket.io", "Redis"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    color: "#06b6d4",
  },
  {
    id: 3,
    title: "ArtifyAI",
    description: "AI-powered design tool that generates unique artwork from text prompts with style transfer.",
    image: "/ai-art-generator-interface-dark-purple.jpg",
    tags: ["Python", "TensorFlow", "FastAPI", "React"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    color: "#f43f5e",
  },
]

export function HomeFeaturedProjects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              Featured Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            >
              Recent Projects
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/projects">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent group">
                View All Projects
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative"
            >
              <Link href={`/projects/${project.id}`}>
                <div className="relative bg-card rounded-3xl border border-border overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                    {/* Colored overlay on hover */}
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: project.color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === index ? 0.1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    <motion.div
                      className="absolute top-4 right-4 flex gap-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                        y: hoveredIndex === index ? 0 : -10,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        onClick={(e) => handleExternalLink(e, project.liveUrl)}
                        className="p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={`View ${project.title} live`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleExternalLink(e, project.githubUrl)}
                        className="p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={`View ${project.title} source`}
                      >
                        <Github className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                      <motion.div
                        animate={{
                          x: hoveredIndex === index ? 0 : 10,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                      </motion.div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// home: featured projects
