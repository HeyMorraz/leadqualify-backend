import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ChatLauncher from "@/components/landing/ChatLauncher";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <Footer />
      <ChatLauncher />
    </main>
  );
}