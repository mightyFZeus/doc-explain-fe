import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { CtaSection } from "./components/CtaSection";
import { FeatureSection } from "./components/FeatureSection";
import { HeroSection } from "./components/HeroSection";
import { MetricsStrip } from "./components/MetricsStrip";
import { WorkflowSection } from "./components/WorkflowSection";

export function LandingScreen() {
  return (
    <main className="min-h-screen">
      <MarketingHeader />
      <HeroSection />
      <FeatureSection />
      <WorkflowSection />
      <MetricsStrip />
      <CtaSection />
      <MarketingFooter />
    </main>
  );
}
