import { BreakExperiments } from "@/components/home/BreakExperiments";
import { FeaturedWorks } from "@/components/home/FeaturedWorks";
import { FooterCTA } from "@/components/home/FooterCTA";
import { HomeAnimations } from "@/components/home/HomeAnimations";
import { IntroLoader } from "@/components/home/IntroLoader";
import { MinimalNavigation } from "@/components/home/MinimalNavigation";
import { NarrativeSection } from "@/components/home/NarrativeSection";
import { ScrollHero } from "@/components/home/ScrollHero";
import { featuredProjects } from "@/data/projects";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-cream)]">
      <IntroLoader />
      <HomeAnimations />
      <MinimalNavigation />
      <main>
        <ScrollHero />
        <NarrativeSection />
        <FeaturedWorks projects={featuredProjects} />
        <BreakExperiments />
      </main>
      <FooterCTA />
    </div>
  );
}
