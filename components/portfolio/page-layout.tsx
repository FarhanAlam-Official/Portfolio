"use client"

import type { ReactNode } from "react"
import { Navigation } from "./navigation"
import { Footer } from "./footer"
import { CustomCursor } from "./custom-cursor"
import { ScrollProgress } from "./scroll-progress"
import { ParticlesBackground } from "./particles-background"

interface PageLayoutProps {
  children: ReactNode
  showParticles?: boolean
}

export function PageLayout({ children, showParticles = true }: PageLayoutProps) {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <main className="relative min-h-screen bg-background overflow-hidden">
        {showParticles && <ParticlesBackground />}
        <div className="pt-16 md:pt-20">{children}</div>
        <Footer />
      </main>
    </>
  )
}
