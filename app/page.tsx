import BenefitsSection from "@/components/landing/BenefitsSection";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <Footer />
    </main>
  );
}