"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ArrowUp, Github, Linkedin, Twitter, Mail, Send, Code2, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
]

const projectLinks = [
  { label: "Web Applications", href: "/projects" },
  { label: "Mobile Apps", href: "/projects" },
  { label: "UI/UX Design", href: "/projects" },
]

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@alexchen.dev", label: "Email" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isHoveringTop, setIsHoveringTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribe:", email)
    setEmail("")
  }

  return (
    <footer className="relative w-full pt-24 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient Background Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-chart-2/5 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* Top decorative border with glowing indicator */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-primary to-chart-2 shadow-[0_0_15px_rgba(148,110,228,0.5)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Zone A: Brand & CTA */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Logo with image */}
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/40 shadow-lg shadow-primary/20 group-hover:ring-primary/60 group-hover:shadow-primary/30 transition-all">
                <Image
                  src="/user.png"
                  alt="Farhan Alam"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <span className="text-foreground text-lg font-bold tracking-widest uppercase">Farhan Alam</span>
            </Link>

            {/* Headline */}
            <div className="flex flex-col gap-4">
              <h2 className="text-foreground tracking-tight text-4xl md:text-5xl font-bold leading-[0.9] text-left">
                Let&apos;s build<br />
                <span className="text-muted-foreground">something</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-2 drop-shadow-[0_0_15px_rgba(148,110,228,0.3)]">
                  amazing.
                </span>
              </h2>
              <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
                Crafting immersive digital experiences with modern technologies. Open for new opportunities and collaborations.
              </p>
            </div>
          </div>

          {/* Zone B: Links Grid */}
          <div className="lg:col-span-4">
            <div className="glass-panel bg-card/30 backdrop-blur-xl border border-border/50 p-8 rounded-2xl h-full flex flex-col justify-between hover:bg-card/50 hover:border-primary/20 transition-all duration-500 group shadow-lg">
              {/* Projects Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
                  <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Code2 className="w-3 h-3" />
                    Selected Works
                  </h3>
                  <motion.div
                    initial={{ x: -8, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    →
                  </motion.div>
                </div>
                <ul className="space-y-3">
                  {projectLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link text-foreground text-base font-medium hover:text-primary hover:pl-3 transition-all duration-300 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
                  <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Navigation</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="px-3 py-1.5 text-sm rounded-full bg-secondary/30 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30 hover:border-primary/30 transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-3">Get in touch</h3>
                <a
                  href="mailto:hello@alexchen.dev"
                  className="group/email text-xl md:text-2xl text-foreground font-bold hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  hello@alexchen.dev
                  <Send className="w-5 h-5 transform group-hover/email:-rotate-45 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Zone C: Newsletter & 3D Object */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Newsletter Card */}
            <div className="glass-panel bg-card/30 backdrop-blur-xl border border-border/50 p-8 rounded-2xl relative overflow-hidden shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-500">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-foreground text-xl font-bold mb-2 flex items-center gap-2">
                  Stay in the loop
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Subscribe for the latest resources and updates.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <div className="relative group/input">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-background/60 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl shadow-inner"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full bg-gradient-to-r from-primary to-chart-2 hover:from-chart-2 hover:to-primary text-primary-foreground font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Subscribe</span>
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* 3D Decorative Box */}
            <div className="hidden lg:flex flex-1 min-h-[140px] glass-panel bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl items-center justify-center relative overflow-hidden group/box hover:border-primary/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
              {/* Abstract Geometric Shapes */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-16 h-16 border-2 border-primary/30 rounded-lg absolute top-1/2 left-1/3 blur-[1px]"
              />
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="w-20 h-20 border-2 border-border/30 rounded-full absolute bottom-1/4 right-1/3"
              />
              <div className="text-xs text-primary font-mono bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm z-10">
                Interactive Zone
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-20" />

        {/* Zone D: Bottom Bar */}
        <div className="relative border-t border-border/50 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-8">
          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              © {new Date().getFullYear()} Alex Chen. Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" /> using Next.js
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Sitemap
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Social Dock */}
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-full px-2 py-2 flex items-center gap-1 shadow-lg">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all group/social"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="absolute -top-10 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover/social:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* 3D Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              onHoverStart={() => setIsHoveringTop(true)}
              onHoverEnd={() => setIsHoveringTop(false)}
              className="relative w-14 h-14 hidden md:block group/top cursor-pointer"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <motion.div
                animate={{
                  opacity: isHoveringTop ? [0.3, 0.6, 0.3] : 0.2,
                  scale: isHoveringTop ? [1, 1.1, 1] : 1,
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-primary/40 rounded-full blur-xl"
              />
              {/* Main Button */}
              <div className="relative w-full h-full bg-gradient-to-br from-primary to-chart-2 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform duration-300 group-hover/top:rotate-12 border-t border-white/20">
                <ArrowUp className="w-6 h-6 text-primary-foreground font-bold" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Back to Top (Fixed) */}
        <motion.button
          onClick={scrollToTop}
          className="md:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-primary to-chart-2 text-primary-foreground rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center border-t border-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5 font-bold" />
        </motion.button>
      </div>
    </footer>
  )
}