import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const lastUpdated = "March 2, 2026";

const Privacy = () => (
  <Layout>
    <div className="section-container py-20 max-w-3xl">
      <AnimatedSection>
        <h1 className="text-4xl font-display font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {lastUpdated}</p>
      </AnimatedSection>

      <div className="prose prose-sm max-w-none space-y-10 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:leading-relaxed">
        <AnimatedSection delay={0.05}>
          <h2>1. Who We Are</h2>
          <p>
            XupaStack is an open-source connectivity gateway that helps developers ensure their applications remain reachable for end users. XupaStack is not affiliated with Supabase Inc or any other company. This Privacy Policy explains how XupaStack ("we", "us", "our") collects, uses, and protects information when you use our website at xupastack.com, our managed gateway service, and related tools (collectively, the "Service").
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Account Information</h3>
          <p>When you sign in via GitHub OAuth or email magic link, we receive and store:</p>
          <ul>
            <li>Your email address</li>
            <li>Your display name (if provided by the OAuth provider)</li>
            <li>Your OAuth provider identifier (e.g., GitHub user ID)</li>
          </ul>
          <p>We do not store passwords. Authentication is handled via OAuth tokens or time-limited magic links.</p>

          <h3>2.2 App Metadata</h3>
          <p>When you register a gateway through the console, we store minimal metadata:</p>
          <ul>
            <li>Your application name and slug</li>
            <li>The target Supabase project reference (the public project URL, not secret keys)</li>
            <li>Deployment mode (self-hosted or managed)</li>
            <li>Gateway status and creation timestamps</li>
          </ul>

          <h3>2.3 What We Do NOT Collect</h3>
          <ul>
            <li><strong>Supabase service keys or secret keys</strong> — we never request, transmit, or store these</li>
            <li><strong>Request or response bodies</strong> — the gateway does not log payload data by default</li>
            <li><strong>End-user personal data</strong> — we do not have access to your users' data passing through the gateway</li>
            <li><strong>Browsing behavior or tracking pixels</strong> — we do not use third-party analytics trackers</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection delay={0.11}>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Authenticate you and maintain your session</li>
            <li>Provision and manage your gateway configurations</li>
            <li>Send transactional emails (magic link sign-in, critical service notices)</li>
            <li>Monitor service health and prevent abuse</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties. We do not use your data for advertising or profiling.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.14}>
          <h2>4. Data Storage & Security</h2>
          <p>
            Your data is stored on infrastructure we control or that is managed by reputable cloud providers. We apply industry-standard security measures including encryption in transit (TLS), encrypted storage, and access controls. However, no system is perfectly secure, and we cannot guarantee absolute security.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.17}>
          <h2>5. Cookies & Sessions</h2>
          <p>
            We use essential, first-party cookies solely for session management (keeping you signed in). We do not use advertising cookies, tracking cookies, or third-party cookies. You can clear your cookies at any time; doing so will sign you out.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2>6. Self-Hosted Deployments</h2>
          <p>
            If you choose the self-hosted deployment model, the gateway runs entirely within your own Cloudflare account. In this mode, XupaStack has no access to traffic flowing through your gateway. We only store the metadata you provided during setup in the console.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.23}>
          <h2>7. Third-Party Services</h2>
          <p>We integrate with the following third-party services:</p>
          <ul>
            <li><strong>GitHub OAuth</strong> — for authentication. Subject to GitHub's privacy policy.</li>
            <li><strong>Email delivery provider</strong> — for sending magic link emails. We share only your email address for delivery purposes.</li>
            <li><strong>Cloudflare</strong> — for managed gateway infrastructure and DNS. Subject to Cloudflare's privacy policy.</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection delay={0.26}>
          <h2>8. Data Retention & Deletion</h2>
          <p>
            We retain your account data for as long as your account is active. You can request deletion of your account and all associated data at any time by contacting us. Upon deletion, we remove your account information and gateway metadata. Aggregated, anonymised usage statistics (e.g., total number of active gateways) may be retained.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.29}>
          <h2>9. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p>To exercise any of these rights, please contact us at the email below.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.32}>
          <h2>10. Children's Privacy</h2>
          <p>
            The Service is not directed at individuals under 16 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.35}>
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top. We encourage you to review this page periodically. Continued use of the Service after changes constitutes acceptance of the updated policy.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.38}>
          <h2>12. Contact</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please reach out via our{" "}
            <a href="https://github.com" target="_blank" rel="noopener" className="text-primary hover:underline">
              GitHub repository
            </a>{" "}
            or contact us at{" "}
            <a href="mailto:privacy@xupastack.com" className="text-primary hover:underline">
              privacy@xupastack.com
            </a>.
          </p>
        </AnimatedSection>
      </div>
    </div>
  </Layout>
);

export default Privacy;
