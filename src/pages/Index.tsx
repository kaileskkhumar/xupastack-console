import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import BlockTest from "@/components/home/BlockTest";
import ChooseFix from "@/components/home/ChooseFix";
import HowItWorks from "@/components/home/HowItWorks";
import StackSnippets from "@/components/home/StackSnippets";
import WhyNotDnsVpn from "@/components/home/WhyNotDnsVpn";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import TrustSection from "@/components/home/TrustSection";
import HomeFAQ from "@/components/home/HomeFAQ";
import DonateSection from "@/components/home/DonateSection";

const Index = () => (
  <Layout>
    <Hero />
    <BlockTest />
    <ChooseFix />
    <HowItWorks />
    <StackSnippets />
    <WhyNotDnsVpn />
    <FeaturesGrid />
    <TrustSection />
    <HomeFAQ />
    <DonateSection />
  </Layout>
);

export default Index;
