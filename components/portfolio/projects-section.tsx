"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "./section-header"

const categories = ["All", "Web Apps", "Mobile", "Design", "Open Source"]

const projects = [
  {
    id: 1,
    title: "FinanceFlow",
    description:
      "A comprehensive personal finance management platform with real-time analytics, budget tracking, and AI-powered insights.",
    image: "/finance-dashboard-dark-theme-purple-accents.jpg",
    category: "Web Apps",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "AI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    metrics: { users: "10k+", performance: "99%", satisfaction: "4.9" },
  },
  {
    id: 2,
    title: "CollabSpace",
    description:
      "Real-time collaborative workspace for remote teams. Features video calls, whiteboarding, and document collaboration.",
    image: "/collaboration-workspace-app-dark-theme.jpg",
    category: "Web Apps",
    tags: ["React", "WebRTC", "Socket.io", "Redis"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    metrics: { users: "5k+", performance: "98%", satisfaction: "4.8" },
  },
  {
    id: 3,
    title: "HealthPulse",
    description:
      "Mobile-first health tracking application with wearable device integration and personalized wellness recommendations.",
    image: "/health-fitness-mobile-app-dark-theme.jpg",
    category: "Mobile",
    tags: ["React Native", "Node.js", "MongoDB", "ML"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    metrics: { users: "25k+", performance: "97%", satisfaction: "4.7" },
  },
  {
    id: 4,
    title: "ArtifyAI",
    description:
      "AI-powered design tool that generates unique artwork from text prompts. Includes style transfer and image editing.",
    image: "/ai-art-generator-interface-dark-purple.jpg",
    category: "Design",
    tags: ["Python", "TensorFlow", "FastAPI", "React"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    metrics: { users: "15k+", performance: "95%", satisfaction: "4.9" },
  },
  {
    id: 5,
    title: "DevToolkit",
    description:
      "Open-source collection of developer tools including code formatters, converters, and productivity utilities.",
    image: "/developer-tools-utilities-dark-theme.jpg",
    category: "Open Source",
    tags: ["TypeScript", "Rust", "WebAssembly"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    metrics: { stars: "2.5k", forks: "400+", contributors: "50+" },
  },
  {
    id: 6,
    title: "EcoTrack",
    description:
      "Sustainability tracking platform helping businesses monitor and reduce their carbon footprint with actionable insights.",
    image: "/sustainability-eco-dashboard-dark-green-accents.jpg",
    category: "Web Apps",
    tags: ["Vue.js", "GraphQL", "PostgreSQL", "D3.js"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    metrics: { users: "3k+", performance: "98%", satisfaction: "4.8" },
  },
]

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const filteredProjects = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Portfolio"
          title="Featured Projects"
          description="A selection of my recent work showcasing creativity and technical expertise"
        />

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-foreground hover:bg-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`group relative bg-card rounded-2xl border border-border overflow-hidden ${
                  project.featured ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Image container */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                  {/* Overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center gap-4"
                  >
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-card rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
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
                      className="p-3 bg-card rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`View ${project.title} source code`}
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  </motion.div>

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary/50 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-bold text-primary">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Button variant="outline" size="lg" className="gap-2 bg-transparent">
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
