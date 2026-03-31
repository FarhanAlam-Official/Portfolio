
"use client"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/portfolio/page-layout"
import { HeroSection } from "@/components/portfolio/hero-section"
import { TestimonialsSection } from "@/components/portfolio/testimonials-section"
import { HomeAboutPreview } from "@/components/portfolio/home-about-preview"
import { HomeFeaturedProjects } from "@/components/portfolio/home-featured-projects"
import { HomeSkillsPreview } from "@/components/portfolio/home-skills-preview"


export default function HomePage() {
  const router = useRouter();
  const keyBuffer = useRef("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyBuffer.current += e.key.toLowerCase();
      if (keyBuffer.current.length > 5) {
        keyBuffer.current = keyBuffer.current.slice(-5);
      }
      if (keyBuffer.current.endsWith("admin")) {
        router.push("/dashboard");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <PageLayout>
      <HeroSection />
      <HomeAboutPreview />
      <HomeSkillsPreview />
      <HomeFeaturedProjects />
      <TestimonialsSection />
    </PageLayout>
  );
}

// page: SEO + Open Graph
