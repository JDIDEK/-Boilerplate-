import { breakItems, jasmineWorks } from "@/data/jasmine";
import { BreakSection } from "./BreakSection";
import { FeaturedWorks } from "./FeaturedWorks";
import { HeroBanner } from "./HeroBanner";
import { HomeIntro } from "./HomeIntro";
import { JasmineFooter } from "./JasmineFooter";
import { JasmineHeader } from "./JasmineHeader";
import { JasminePreloader } from "./JasminePreloader";
import { JasmineTransitions } from "./JasmineTransitions";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

export function JasmineHome() {
  return (
    <SmoothScrollProvider>
      <JasminePreloader />
      <JasmineTransitions />
      <JasmineHeader />
      <main>
        <HeroBanner />
        <HomeIntro />
        <FeaturedWorks works={jasmineWorks} />
        <BreakSection items={breakItems} />
      </main>
      <JasmineFooter />
    </SmoothScrollProvider>
  );
}

