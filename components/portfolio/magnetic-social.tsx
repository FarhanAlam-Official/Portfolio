"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useRef, type MouseEvent } from "react"
import { Github, Linkedin, Twitter, Mail, type LucideIcon } from "lucide-react"
import { personalInfo } from "@/lib/data"

interface MagneticSocialProps {
  icon: LucideIcon
  href: string
  label: string
  color: string
}

function MagneticIcon({ icon: Icon, href, label, color }: MagneticSocialProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative p-4 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-colors duration-300 group"
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
        }}
      />
      <Icon className="w-6 h-6 relative z-10 transition-colors group-hover:text-primary" />
    </motion.a>
  )
}

export function MagneticSocial() {
  const socials = [
    { icon: Github, href: personalInfo.social.github, label: "GitHub", color: "#8b5cf6" },
    { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn", color: "#0077b5" },
    { icon: Twitter, href: personalInfo.social.twitter, label: "Twitter", color: "#1da1f2" },
    { icon: Mail, href: `mailto:${personalInfo.contact.email}`, label: "Email", color: "#ea4335" },
  ]

  return (
    <div className="flex gap-4">
      {socials.map((social) => (
        <MagneticIcon key={social.label} {...social} />
      ))}
    </div>
  )
}
