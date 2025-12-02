import Navbar from '@/components/home/NavbarNew'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import CTASection from '@/components/home/CTASection'
import SeeItAction from '@/components/home/SeeItAction'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import Footer from '@/components/home/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SeeItAction />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
