import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/layout/HeroSection";
import { SearchForm } from "@/components/main/SearchForm";
import { FeatureCards } from "@/components/main/FeatureCards";
import { HowItWorks } from "@/components/main/HowItWorks";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection>
        <SearchForm />
      </HeroSection>
      <HowItWorks />
      <FeatureCards />
      <Footer />
    </main>
  );
}
