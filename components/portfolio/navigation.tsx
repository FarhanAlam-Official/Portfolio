"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { personalInfo } from "@/lib/data"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
]


import { useRouter } from "next/navigation"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (clickCount >= 5) {
      setClickCount(0);
      router.push("/dashboard");
    }
  }, [clickCount, router]);

  const handleNavbarClick = () => {
    setClickCount((c) => c + 1);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50"
        onClick={handleNavbarClick}
      >
        {/* Ambient glow effect */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl opacity-30" />
        </div>

        {/* Glass navbar container */}
        <div className="mx-4 md:mx-8 mt-4">
          <nav
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl transition-all duration-500 ${
              isScrolled
                ? "bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5"
                : "bg-background/30 backdrop-blur-md border border-border/30"
            }`}
          >
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Logo with 3D effect */}
              <Link href="/">
                <motion.div
                  className="relative flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Logo image */}
                  <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden ring-2 ring-primary/40 shadow-lg shadow-primary/20">
                    <Image
                      src="/user.png"
                      alt={personalInfo.name}
                      width={40}
                      height={40}
                      className="object-cover"
                      priority
                    />
                  </div>
                  <span className="hidden sm:block text-sm md:text-base font-bold tracking-wider uppercase text-foreground">
                    {personalInfo.name}
                  </span>
                </motion.div>
              </Link>

              {/* Desktop nav with glass pills */}
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1 bg-secondary/30 backdrop-blur-sm rounded-full p-1 border border-border/50">
                  {navItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                      <motion.div
                        className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                          pathname === item.href
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {pathname === item.href && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 bg-gradient-to-r from-primary to-chart-2 rounded-full shadow-lg shadow-primary/30"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className="ml-2 relative overflow-hidden group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                      <span className="relative z-10 font-semibold">Hire Me</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Mobile menu button with glow */}
              <motion.button
                className="md:hidden relative p-2 rounded-xl hover:bg-secondary/50 transition-colors border border-border/30"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card/90 backdrop-blur-xl border-l border-border/50 p-6 pt-20 shadow-2xl"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
              
              <div className="relative flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`group block px-5 py-4 text-base font-medium rounded-xl transition-all relative overflow-hidden ${
                        pathname === item.href
                          ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/20"
                          : "hover:bg-secondary/50 text-foreground border border-border/30"
                      }`}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        {item.label}
                        <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="mt-6"
                >
                  <Link href="/contact">
                    <Button size="lg" className="w-full relative overflow-hidden group shadow-lg shadow-primary/20">
                      <span className="relative z-10 font-semibold">Hire Me</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-chart-2 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// nav: responsive + active link

// fix: active-state detection
