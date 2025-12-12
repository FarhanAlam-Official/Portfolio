"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { SectionHeader } from "./section-header"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO at TechStart",
    avatar: "/professional-woman-headshot.png",
    content:
      "Alex transformed our outdated platform into a modern, user-friendly experience. The attention to detail and technical expertise exceeded our expectations. Our user engagement increased by 150% after the redesign.",
    rating: 5,
    company: "TechStart Inc.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager at InnovateCo",
    avatar: "/professional-asian-man-headshot.png",
    content:
      "Working with Alex was an absolute pleasure. They delivered a complex e-commerce solution on time and under budget. The code quality and documentation were exceptional.",
    rating: 5,
    company: "InnovateCo",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Founder at DesignHub",
    avatar: "/professional-latina-woman-headshot.png",
    content:
      "Alex has an incredible ability to translate design concepts into pixel-perfect code. Our collaboration resulted in one of the most beautiful and functional websites in our industry.",
    rating: 5,
    company: "DesignHub",
  },
  {
    id: 4,
    name: "David Kim",
    role: "CTO at CloudScale",
    avatar: "/professional-korean-man-headshot.png",
    content:
      "The technical architecture Alex implemented for our SaaS platform handles millions of requests seamlessly. Their expertise in performance optimization saved us significant infrastructure costs.",
    rating: 5,
    company: "CloudScale",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev === testimonials.length - 1 ? 0 : prev + 1
      }
      return prev === 0 ? testimonials.length - 1 : prev - 1
    })
  }

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000)
    return () => clearInterval(timer)
  }, [])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge="Testimonials"
          title="What Clients Say"
          description="Trusted by companies and individuals worldwide"
        />

        <div className="relative">
          {/* Main testimonial card */}
          <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl border border-border p-8 md:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                  &ldquo;{currentTestimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-chart-2 p-0.5">
                    <img
                      src={currentTestimonial.avatar || "/placeholder.svg"}
                      alt={currentTestimonial.name}
                      className="w-full h-full rounded-full object-cover bg-card"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{currentTestimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{currentTestimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => paginate(-1)}
              className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-primary" : "bg-muted hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="p-3 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Client logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            {["TechStart", "InnovateCo", "DesignHub", "CloudScale", "DataFlow"].map((company) => (
              <div
                key={company}
                className="text-xl md:text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
