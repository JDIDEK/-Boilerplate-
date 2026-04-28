import { breakItems, jasmineWorks } from "@/data/jasmine";
import { BreakSection } from "./BreakSection";
import { FeaturedWorks } from "./FeaturedWorks";
import { HeroBanner } from "./HeroBanner";
import { HomeIntro } from "./HomeIntro";
import { JasminePageShell } from "./JasminePageShell";

export function JasmineHome() {
  return (
    <JasminePageShell>
      <HeroBanner />
      <HomeIntro />
      <FeaturedWorks works={jasmineWorks} />
      <BreakSection items={breakItems} />
    </JasminePageShell>
  );
}
