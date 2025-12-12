"use client"

import { motion } from "framer-motion"
import { SectionHeader } from "./section-header"

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 85 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Python", level: 80 },
      { name: "PostgreSQL", level: 85 },
      { name: "GraphQL", level: 80 },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git / GitHub", level: 95 },
      { name: "Figma", level: 85 },
      { name: "Docker", level: 75 },
      { name: "AWS / Vercel", level: 85 },
    ],
  },
]

const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Tailwind",
  "Framer",
  "Figma",
  "Git",
  "Docker",
  "AWS",
  "Vercel",
  "Redis",
]

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="Skills & Expertise"
          title="Technologies I Work With"
          description="A comprehensive toolkit for building modern, scalable applications"
        />

        {/* Skill bars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6"
            >
              <h3 className="text-xl font-bold mb-6 text-primary">{category.title}</h3>
              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: skillIndex * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech stack marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden"
        >
          <div className="flex gap-4 animate-marquee">
            {[...technologies, ...technologies].map((tech, index) => (
              <div
                key={`${tech}-${index}`}
                className="flex-shrink-0 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
