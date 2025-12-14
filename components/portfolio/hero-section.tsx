"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { TypingAnimation } from "./typing-animation"
import { Hero3DScene } from "./hero-3d-scene"
import { AnimatedText } from "./animated-text"
import { GlowingButton } from "./glowing-button"
import { MagneticSocial } from "./magnetic-social"
import { personalInfo } from "@/lib/data"

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* 3D Background Scene */}
      <Hero3DScene />

      {/* Gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-[1]" />

      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Available for freelance work
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
            >
              <AnimatedText text="Hi, I'm" delay={0.2} />
              <br />
              <motion.span
                className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {personalInfo.name}
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-6 h-10"
            >
              <TypingAnimation
                texts={["Full-Stack Developer", "UI/UX Designer", "Creative Problem Solver", "Open Source Contributor"]}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              I craft beautiful, performant web experiences that delight users and drive business results. With 5+ years
              of experience building modern applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <GlowingButton href="/projects" variant="primary">
                View My Work
                <ArrowRight className="w-4 h-4" />
              </GlowingButton>
              <GlowingButton href="/contact" variant="secondary">
                Get In Touch
              </GlowingButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <MagneticSocial />
            </motion.div>
          </div>

          {/* Right side - Stats cards floating over 3D scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 relative h-[250px] sm:h-[300px] lg:h-[500px] flex items-center justify-center lg:block"
          >
            {/* Circular Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative lg:absolute left-0 lg:left-1/2 top-0 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10"
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72">
                {/* Glowing ring effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-chart-2 to-chart-3 opacity-20 blur-2xl animate-pulse" />
                
                {/* Image container with border */}
                <div className="relative w-full h-full rounded-full border-4 border-primary/30 overflow-hidden bg-card/50 backdrop-blur-sm shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-3/10" />
                  {/* Placeholder for the actual image - replace '/path/to/your/image.jpg' with your image */}
                  <img
                    src="/user.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Rotating gradient border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-chart-2 to-chart-3 opacity-30 blur-md -z-10"
                />
              </div>
            </motion.div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="hidden lg:block absolute left-0 top-1/4 z-20"
            >
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-4 shadow-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  5+
                </div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="hidden lg:block absolute right-0 top-1/2 z-20"
            >
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-4 shadow-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="hidden lg:block absolute left-1/4 bottom-10 z-20"
            >
              <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-4 shadow-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-chart-3 to-primary bg-clip-text text-transparent">
                  30+
                </div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
        >
          <motion.div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
