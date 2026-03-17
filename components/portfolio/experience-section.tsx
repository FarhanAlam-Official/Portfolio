"use client"

import { motion } from "framer-motion"
import { Building2, ExternalLink } from "lucide-react"
import { SectionHeader } from "./section-header"

const experiences = [
  {
    role: "Senior Full-Stack Developer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    description:
      "Leading development of enterprise SaaS platform. Architected microservices infrastructure serving 100k+ users.",
    highlights: ["Led team of 5 developers", "Reduced load time by 60%", "Implemented CI/CD pipelines"],
  },
  {
    role: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description:
      "Built and scaled core product features from ground up. Collaborated with design team to create seamless UX.",
    highlights: ["Built real-time collaboration features", "Integrated 15+ third-party APIs", "Mentored junior devs"],
  },
  {
    role: "Frontend Developer",
    company: "Digital Agency Co.",
    period: "2019 - 2020",
    description:
      "Developed responsive web applications for diverse clients. Specialized in React and modern CSS frameworks.",
    highlights: ["Delivered 20+ client projects", "Created reusable component library", "Won 3 design awards"],
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge="Experience"
          title="My Professional Journey"
          description="A timeline of growth, challenges, and achievements"
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative grid md:grid-cols-2 gap-8 mb-12 ${
                index % 2 === 0 ? "md:text-right" : "md:text-left md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-primary rounded-full border-4 border-background -translate-x-1/2 md:-translate-x-1/2 z-10" />

              {/* Content */}
              <div className={`pl-8 md:pl-0 ${index % 2 === 0 ? "md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                <div
                  className={`bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3">
                    {exp.period}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                  <div
                    className={`flex items-center gap-2 text-muted-foreground mb-4 ${
                      index % 2 === 0 ? "md:justify-end" : ""
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{exp.company}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{exp.description}</p>
                  <ul className={`space-y-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    {exp.highlights.map((highlight) => (
                      <li key={highlight} className="text-sm text-foreground/80">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Empty column for alternating layout */}
              {index % 2 === 0 ? <div className="hidden md:block" /> : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// experience: timeline layout
