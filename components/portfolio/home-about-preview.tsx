"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { useRef } from "react"
import { ArrowRight, Code2, Palette, Zap, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, scalable code that stands the test of time",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Design Focus",
    description: "Crafting pixel-perfect interfaces with attention to every detail",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Building lightning-fast applications optimized for all devices",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Exploring cutting-edge technologies to deliver modern solutions",
    gradient: "from-green-500 to-emerald-500",
  },
]

export function HomeAboutPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-chart-2/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              About Me
            </motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">
              Passionate About Creating{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Digital Excellence
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              I&apos;m a full-stack developer with a passion for creating beautiful, functional, and user-centered
              digital experiences. With expertise in modern web technologies, I transform complex problems into elegant
              solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              When I&apos;m not coding, you&apos;ll find me contributing to open-source projects, writing technical
              articles, or exploring the latest design trends.
            </p>
            <Link href="/about">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent group">
                Learn More About Me
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient hover effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
