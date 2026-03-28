"use client"

import { motion } from "framer-motion"
import { Download, MapPin, Calendar, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "./section-header"
import { personalInfo, stats as portfolioStats } from "@/lib/data"

const componentStats = [
  { value: `${portfolioStats.yearsOfExperience}+`, label: "Years Experience" },
  { value: `${portfolioStats.projectsCompleted}+`, label: "Projects Completed" },
  { value: `${portfolioStats.happyClients}+`, label: "Happy Clients" },
  { value: "15+", label: "Awards Won" },
]

const info = [
  { icon: MapPin, label: personalInfo.contact.location },
  { icon: Calendar, label: personalInfo.contact.availability },
  { icon: Briefcase, label: "Open to Remote" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeader badge="About Me" title="Passionate About Creating Digital Experiences" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image/Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-3/20 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-card rounded-3xl border border-border overflow-hidden">
                <img
                  src="/professional-developer-portrait-dark-background-pu.jpg"
                  alt={`${personalInfo.name} - ${personalInfo.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-lg"
              >
                <div className="text-2xl font-bold text-primary">{portfolioStats.yearsOfExperience}+</div>
                <div className="text-sm text-muted-foreground">Years Exp.</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Building the Future, <span className="text-primary">One Pixel at a Time</span>
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              I&apos;m a full-stack developer and designer with a passion for creating beautiful, functional, and
              user-centered digital experiences. With expertise in modern web technologies, I transform complex problems
              into elegant solutions.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me contributing to open-source projects, writing technical
              articles, or exploring the latest design trends. I believe in continuous learning and pushing the
              boundaries of what&apos;s possible on the web.
            </p>

            {/* Info badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {info.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="gap-2" asChild>
              <a href={personalInfo.resume} download>
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {componentStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// about: bio + stats grid

// fix: about-reader integration
