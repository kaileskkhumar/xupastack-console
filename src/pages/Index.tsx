import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import ChooseFix from "@/components/home/ChooseFix";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import TrustSection from "@/components/home/TrustSection";
import DonateSection from "@/components/home/DonateSection";

const Index = () => (
  <Layout>
    <Hero />
    <ChooseFix />
    <HowItWorks />
    <FeaturesGrid />
    <TrustSection />
    <DonateSection />
  </Layout>
);

export default Index;
