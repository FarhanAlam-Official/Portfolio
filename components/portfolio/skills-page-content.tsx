"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Code2,
  Server,
  Palette,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Layers,
  GitBranch,
  Terminal,
  Figma,
  Boxes,
} from "lucide-react"
import { SectionHeader } from "./section-header"
import Image from "next/image"

const skillCategories = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: Code2,
    color: "from-cyan-500 to-blue-600",
    description: "Building responsive, interactive user interfaces",
    skills: [
      { name: "React", level: 95, years: 5 },
      { name: "Next.js", level: 95, years: 4 },
      { name: "TypeScript", level: 90, years: 4 },
      { name: "Tailwind CSS", level: 95, years: 3 },
      { name: "Framer Motion", level: 85, years: 2 },
      { name: "Vue.js", level: 75, years: 2 },
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    icon: Server,
    color: "from-green-500 to-emerald-600",
    description: "Scalable server-side solutions",
    skills: [
      { name: "Node.js", level: 90, years: 5 },
      { name: "Python", level: 80, years: 4 },
      { name: "GraphQL", level: 85, years: 3 },
      { name: "REST APIs", level: 95, years: 5 },
      { name: "Express.js", level: 90, years: 5 },
      { name: "FastAPI", level: 75, years: 2 },
    ],
  },
  {
    id: "database",
    title: "Database & Storage",
    icon: Database,
    color: "from-orange-500 to-amber-600",
    description: "Data management and optimization",
    skills: [
      { name: "PostgreSQL", level: 85, years: 4 },
      { name: "MongoDB", level: 80, years: 3 },
      { name: "Redis", level: 75, years: 3 },
      { name: "Prisma ORM", level: 85, years: 2 },
      { name: "Supabase", level: 80, years: 2 },
      { name: "Firebase", level: 75, years: 3 },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "from-purple-500 to-violet-600",
    description: "Deployment and infrastructure",
    skills: [
      { name: "AWS", level: 80, years: 3 },
      { name: "Vercel", level: 95, years: 4 },
      { name: "Docker", level: 75, years: 3 },
      { name: "CI/CD", level: 85, years: 4 },
      { name: "Kubernetes", level: 60, years: 1 },
      { name: "GitHub Actions", level: 85, years: 3 },
    ],
  },
  {
    id: "design",
    title: "Design & UI/UX",
    icon: Palette,
    color: "from-pink-500 to-rose-600",
    description: "Creating beautiful user experiences",
    skills: [
      { name: "Figma", level: 85, years: 4 },
      { name: "UI Design", level: 85, years: 5 },
      { name: "Prototyping", level: 80, years: 4 },
      { name: "Design Systems", level: 85, years: 3 },
      { name: "Responsive Design", level: 95, years: 5 },
      { name: "Animation", level: 80, years: 3 },
    ],
  },
  {
    id: "tools",
    title: "Tools & Workflow",
    icon: Terminal,
    color: "from-slate-500 to-zinc-600",
    description: "Productivity and collaboration",
    skills: [
      { name: "Git", level: 95, years: 6 },
      { name: "VS Code", level: 95, years: 6 },
      { name: "Linux/Unix", level: 80, years: 5 },
      { name: "Agile/Scrum", level: 85, years: 4 },
      { name: "Jira", level: 80, years: 4 },
      { name: "Testing", level: 80, years: 4 },
    ],
  },
]

const certifications = [
  { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: 2023 },
  { name: "Meta Frontend Developer", issuer: "Meta", year: 2023 },
  { name: "Google UX Design", issuer: "Google", year: 2022 },
]

const innerOrbitTools = [
  { name: "React", icon: Layers },
  { name: "Next.js", icon: Globe },
  { name: "TypeScript", icon: Code2 },
  { name: "Node.js", icon: Server },
  { name: "PostgreSQL", icon: Database },
  { name: "Git", icon: GitBranch },
]

const outerOrbitTools = [
  { name: "Figma", icon: Figma },
  { name: "Docker", icon: Boxes },
  { name: "AWS", icon: Cloud },
  { name: "Mobile", icon: Smartphone },
  { name: "Terminal", icon: Terminal },
  { name: "Design", icon: Palette },
]

export function SkillsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Skills & Expertise"
          title="My Technical Toolkit"
          description="Years of experience building modern, scalable applications with cutting-edge technologies"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative h-[420px] mb-20 hidden lg:flex items-center justify-center"
        >
          <div className="relative w-[400px] h-[400px]">
            {/* Outer orbit ring */}
            <div className="absolute inset-0 rounded-full border border-border/30" />

            {/* Inner orbit ring */}
            <div className="absolute inset-[70px] rounded-full border border-border/50" />

            {/* Innermost glow ring */}
            <div className="absolute inset-[130px] rounded-full border border-primary/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]" />

            {/* Outer orbit - rotates clockwise */}
            <div className="absolute inset-0 animate-spin-slow">
              {outerOrbitTools.map((tool, index) => {
                const angle = (index / outerOrbitTools.length) * 360
                return (
                  <div
                    key={tool.name}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-200px)`,
                    }}
                  >
                    {/* Counter-rotate to keep icon upright */}
                    <div className="animate-spin-slow-reverse" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="w-14 h-14 bg-card/80 backdrop-blur-sm border border-border rounded-2xl flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:scale-110 transition-all duration-300 cursor-pointer group">
                        <tool.icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                        {tool.name}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Inner orbit - rotates counter-clockwise */}
            <div className="absolute inset-[70px] animate-spin-slow-reverse">
              {innerOrbitTools.map((tool, index) => {
                const angle = (index / innerOrbitTools.length) * 360
                return (
                  <div
                    key={tool.name}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-130px)`,
                    }}
                  >
                    {/* Counter-rotate to keep icon upright */}
                    <div className="animate-spin-slow">
                      <div className="w-12 h-12 bg-card/80 backdrop-blur-sm border border-border rounded-xl flex items-center justify-center shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:scale-110 transition-all duration-300 cursor-pointer group">
                        <tool.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Center - Photo with glow effect */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Animated glow rings */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary via-chart-2 to-primary opacity-20 blur-xl animate-pulse" />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-chart-2 opacity-30 animate-spin-very-slow" />

                {/* Photo container */}
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/50 shadow-2xl shadow-primary/25">
                  <Image
                    src="/professional-developer-portrait-dark-background-pu.jpg"
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name badge below */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    Farhan Alam
                  </span>
                </div>
              </div>
            </div>

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/50"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Mobile view - simple grid */}
        <div className="lg:hidden mb-12">
          <div className="grid grid-cols-4 gap-3">
            {[...innerOrbitTools, ...outerOrbitTools].slice(0, 8).map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-card/80 border border-border rounded-xl flex items-center justify-center">
                  <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skill Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              onMouseEnter={() => setSelectedCategory(category.id)}
              onMouseLeave={() => setSelectedCategory(null)}
              className={`group relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 hover:border-primary/30 transition-all duration-300 overflow-hidden ${
                selectedCategory === category.id ? "ring-1 ring-primary/50" : ""
              }`}
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                  >
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="relative"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{skill.years}y</span>
                          <span
                            className={`text-xs font-medium ${hoveredSkill === skill.name ? "text-primary" : "text-muted-foreground"} transition-colors`}
                          >
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Certifications</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-5 hover:border-primary/30 transition-colors text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold mb-1">{cert.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer} - {cert.year}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "6+", label: "Years Coding" },
            { value: "15+", label: "Technologies" },
            { value: "50+", label: "Projects Built" },
            { value: "99%", label: "Client Satisfaction" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
