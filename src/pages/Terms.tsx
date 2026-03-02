import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const lastUpdated = "March 2, 2026";

const Terms = () => (
  <Layout>
    <div className="section-container py-20 max-w-3xl">
      <AnimatedSection>
        <h1 className="text-4xl font-display font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {lastUpdated}</p>
      </AnimatedSection>

      <div className="prose prose-sm max-w-none space-y-10 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:leading-relaxed">
        <AnimatedSection delay={0.05}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the XupaStack website (xupastack.com), managed gateway service, self-hosted tools, console, documentation, or any related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
          </p>
          <p>
            XupaStack is an independent, open-source project and is not affiliated with Supabase Inc or any other entity.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <h2>2. Description of Service</h2>
          <p>
            XupaStack provides an open-source connectivity gateway designed to improve the reachability of Supabase-powered applications, particularly in regions experiencing ISP-level connectivity issues. The Service includes:
          </p>
          <ul>
            <li>A web-based console for creating and managing gateway configurations</li>
            <li>Self-hosted gateway tooling (deployed to your own infrastructure)</li>
            <li>A managed gateway option (hosted by XupaStack)</li>
            <li>Documentation, guides, and related developer resources</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection delay={0.11}>
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 16 years of age to use the Service. By using the Service, you represent that you meet this requirement. If you are using the Service on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.14}>
          <h2>4. Account & Authentication</h2>
          <p>
            Certain features of the Service require authentication via GitHub OAuth or email magic link. You are responsible for maintaining the security of your authentication credentials and for all activities that occur under your account. You must notify us promptly of any unauthorised use of your account.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.17}>
          <h2>5. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable law, regulation, or third-party rights</li>
            <li>Transmit malware, viruses, or any destructive code</li>
            <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure</li>
            <li>Interfere with or disrupt the Service or the servers and networks connected to it</li>
            <li>Use the Service to proxy, relay, or route traffic for purposes other than legitimate Supabase application connectivity</li>
            <li>Abuse rate limits or attempt to overload the managed gateway infrastructure</li>
            <li>Impersonate any person or entity, or falsely claim affiliation with any person or entity</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate access for any user who violates these terms, with or without notice.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2>6. Self-Hosted vs. Managed Gateway</h2>
          <h3>6.1 Self-Hosted</h3>
          <p>
            When you deploy a self-hosted gateway, it runs entirely within your own infrastructure (e.g., your Cloudflare account). You are solely responsible for the operation, security, and maintenance of that deployment. XupaStack provides the tooling and configuration but has no access to or control over your self-hosted gateway's traffic.
          </p>
          <h3>6.2 Managed</h3>
          <p>
            The managed gateway option is provided as a convenience. Traffic routed through the managed gateway passes through infrastructure operated by XupaStack. While we do not log request or response bodies by default, this represents a different trust model. The managed gateway may be subject to capacity limits, fair-use policies, and availability constraints.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.23}>
          <h2>7. Intellectual Property</h2>
          <p>
            XupaStack is released under the MIT License. The source code is freely available, and you may use, modify, and distribute it in accordance with the license terms. The XupaStack name, logo, and branding are trademarks of the project maintainers and may not be used to imply endorsement without permission.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.26}>
          <h2>8. No Warranty</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, error-free, or secure. We do not guarantee that the gateway will resolve all connectivity issues, as network conditions depend on factors outside our control (ISP behaviour, DNS propagation, regional infrastructure).
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.29}>
          <h2>9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL XUPASTACK, ITS MAINTAINERS, CONTRIBUTORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul>
            <li>Your use of or inability to use the Service</li>
            <li>Any unauthorised access to or alteration of your data</li>
            <li>Any third-party conduct on the Service</li>
            <li>Any other matter relating to the Service</li>
          </ul>
          <p>
            Our total aggregate liability for all claims arising out of or relating to these Terms or the Service shall not exceed the amount you paid us (if any) in the twelve months preceding the claim.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.32}>
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless XupaStack and its maintainers from any claims, damages, losses, or expenses (including reasonable legal fees) arising out of your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.35}>
          <h2>11. Modifications to Terms</h2>
          <p>
            We may revise these Terms at any time by updating this page. The "Last updated" date at the top will reflect the most recent revision. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms. If you disagree with any changes, you should discontinue use of the Service.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.38}>
          <h2>12. Termination</h2>
          <p>
            You may stop using the Service at any time. We may suspend or terminate your access to the Service at any time, for any reason, including violation of these Terms. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination (including limitation of liability, indemnification, and intellectual property) shall survive.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.41}>
          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved in the courts of competent jurisdiction.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.44}>
          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.47}>
          <h2>15. Contact</h2>
          <p>
            If you have questions about these Terms, please reach out via our{" "}
            <a href="https://github.com" target="_blank" rel="noopener" className="text-primary hover:underline">
              GitHub repository
            </a>{" "}
            or contact us at{" "}
            <a href="mailto:legal@xupastack.com" className="text-primary hover:underline">
              legal@xupastack.com
            </a>.
          </p>
        </AnimatedSection>
      </div>
    </div>
  </Layout>
);

export default Terms;
