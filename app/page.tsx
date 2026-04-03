import BenefitsSection from "@/components/landing/BenefitsSection";
import HeroSection from "@/components/landing/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection />
      <BenefitsSection />
    </main>
  );
}