import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import ChooseFix from "@/components/home/ChooseFix";
import HowItWorks from "@/components/home/HowItWorks";
import StackSnippets from "@/components/home/StackSnippets";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import WhyNotDnsVpn from "@/components/home/WhyNotDnsVpn";
import TrustSection from "@/components/home/TrustSection";
import HomeFAQ from "@/components/home/HomeFAQ";
import DonateSection from "@/components/home/DonateSection";

const Index = () => (
  <Layout>
    <Hero />
    <ChooseFix />
    <HowItWorks />
    <StackSnippets />
    <FeaturesGrid />
    <WhyNotDnsVpn />
    <TrustSection />
    <HomeFAQ />
    <DonateSection />
  </Layout>
);

export default Index;
