import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { LearningMethod } from "@/components/home/LearningMethod";
import { PracticeCards } from "@/components/home/PracticeCards";
import { ValueStrip } from "@/components/home/ValueStrip";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 min-[640px]:px-8 min-[1200px]:px-5">
      <main>
        <Hero />
        <ValueStrip />
        <LearningMethod />
        <FeatureShowcase />
        <PracticeCards />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
