"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { ReactNode } from "react"

interface GlowingButtonProps {
  href: string
  children: ReactNode
  variant?: "primary" | "secondary"
  className?: string
}

export function GlowingButton({ href, children, variant = "primary", className = "" }: GlowingButtonProps) {
  const isPrimary = variant === "primary"

  return (
    <Link href={href}>
      <motion.button
        className={`
          relative group px-8 py-4 rounded-full font-semibold text-base
          overflow-hidden transition-all duration-300
          ${
            isPrimary
              ? "bg-gradient-to-r from-primary via-chart-2 to-primary bg-[length:200%_100%] text-primary-foreground"
              : "bg-transparent border border-primary/50 text-foreground hover:border-primary"
          }
          ${className}
        `}
        whileHover={{
          scale: 1.05,
          backgroundPosition: isPrimary ? "100% 0" : undefined,
        }}
        whileTap={{ scale: 0.98 }}
      >
        {isPrimary && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/25 to-primary/0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>

        {isPrimary && (
          <motion.span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: "0 0 30px 10px rgba(139, 92, 246, 0.3), 0 0 60px 20px rgba(139, 92, 246, 0.2)",
            }}
          />
        )}
      </motion.button>
    </Link>
  )
}
