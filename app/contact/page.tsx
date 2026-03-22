import { PageLayout } from "@/components/portfolio/page-layout"
import { ContactSection } from "@/components/portfolio/contact-section"

export const metadata = {
  title: "Contact | Farhan Alam",
  description: "Get in touch with Farhan Alam for your next project.",
}

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactSection />
    </PageLayout>
  )
}

// contact: schema markup
