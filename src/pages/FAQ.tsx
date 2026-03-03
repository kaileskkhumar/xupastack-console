import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Does this store my data?",
    a: "No. XupaStack is a pass-through proxy. In self-hosted mode, nothing is stored — requests are forwarded to your Supabase project and responses are returned. In managed mode, we don't log request payloads by default, but the infrastructure theoretically could. For sensitive data, use self-hosted.",
  },
  {
    q: "Does Realtime work through the gateway?",
    a: "Yes. XupaStack supports WebSocket upgrades for Supabase Realtime. Both self-hosted and managed modes proxy WebSocket connections. To verify, open browser DevTools → Network → WS — you should see a 101 Switching Protocols connection to your gateway URL.",
  },
  {
    q: "Do my API keys change?",
    a: "No. Your anon key, service role key, and all other credentials remain the same. Only the SUPABASE_URL changes to point to your gateway instead of *.supabase.co.",
  },
  {
    q: "How much latency does the gateway add?",
    a: "Typically 5-20ms for self-hosted (Cloudflare Worker edge). Managed may add slightly more depending on your location. The latency is far less than the timeout you'd experience with a blocked connection.",
  },
  {
    q: "Why doesn't changing DNS fix my users?",
    a: "Changing DNS (to 1.1.1.1 or 8.8.8.8) only works on your machine. Your end users are on their carrier's default DNS and can't change it. Some ISPs also use SNI-based blocking that works regardless of DNS settings. A gateway routes through an entirely different domain.",
  },
  {
    q: "Is the managed gateway safe for production?",
    a: "We recommend self-hosted for production. The managed gateway is shared infrastructure with rate limits and no SLA. It's designed for prototypes, hackathons, and emergencies. If your app handles sensitive data or needs reliability guarantees, self-host.",
  },
  {
    q: "How do I lock down CORS?",
    a: "In the XupaStack console, go to your gateway → Settings → Allowed Origins and add your app's domains. This prevents unauthorized domains from making requests through your gateway. Example: https://your-app.com",
  },
  {
    q: "How do I revert if I need to remove the gateway?",
    a: "Change your SUPABASE_URL back to the original *.supabase.co URL. No data migration needed — your database, auth configuration, and RLS policies are unchanged. The gateway is stateless.",
  },
];

const FAQ = () => (
  <Layout>
    <div className="section-container py-16 md:py-24 max-w-3xl">
      <AnimatedSection>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">FAQ &amp; Troubleshooting</h1>
        <p className="text-lg text-muted-foreground mb-12">Common questions, honest answers.</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="surface-elevated rounded-xl px-6 border-0"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </div>
  </Layout>
);

export default FAQ;
