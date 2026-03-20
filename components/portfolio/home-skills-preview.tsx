"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const skills = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#339933" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Figma", color: "#F24E1E" },
  { name: "AWS", color: "#FF9900" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Docker", color: "#2496ED" },
  { name: "Python", color: "#3776AB" },
  { name: "MongoDB", color: "#47A248" },
]

export function HomeSkillsPreview() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            Skills & Tools
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Technologies I Work With
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            A curated selection of tools and technologies I use to build modern, scalable applications
          </motion.p>
        </div>

        {/* Animated skill pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{
                scale: 1.1,
                y: -4,
                boxShadow: `0 10px 40px -10px ${skill.color}40`,
              }}
              className="group relative px-5 py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border hover:border-primary/50 transition-all duration-300 cursor-default"
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: skill.color }}
              />
              <span className="relative z-10 font-medium text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/skills">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent group">
              View All Skills & Experience
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// home: skills preview
