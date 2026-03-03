import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const lastUpdated = "March 4, 2026";

const FairUse = () => (
  <Layout>
    <div className="section-container py-20 max-w-3xl">
      <AnimatedSection>
        <h1 className="text-4xl font-display font-bold mb-2">Fair Use Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {lastUpdated}</p>
      </AnimatedSection>

      <div className="prose prose-sm max-w-none space-y-10 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:leading-relaxed">

        <AnimatedSection delay={0.05}>
          <h2>Overview</h2>
          <p>
            XupaStack is currently free to use. To keep the service sustainable and fair for everyone,
            we apply sensible limits on usage. This policy explains what those limits are, why they exist,
            and what happens if you reach them.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2>Gateway Request Limits</h2>
          <p>
            Each app you create on the managed gateway has a monthly request allowance. These limits
            reset at the start of each calendar month (UTC).
          </p>
          <div className="mt-4 rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 text-foreground font-semibold">Limit</th>
                  <th className="text-left px-4 py-3 text-foreground font-semibold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3">Requests per app per month</td>
                  <td className="px-4 py-3 text-foreground font-medium">100,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Total requests across all apps per month</td>
                  <td className="px-4 py-3 text-foreground font-medium">10,000,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            When an app reaches its monthly cap, the gateway returns a <code className="text-foreground bg-secondary px-1 py-0.5 rounded text-xs">429 Too Many Requests</code> response
            with the header <code className="text-foreground bg-secondary px-1 py-0.5 rounded text-xs">X-XupaStack-Cap: monthly</code> until the month resets.
            Your Supabase project is not affected — only traffic routed through the XupaStack gateway is blocked.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2>Auth &amp; API Rate Limits</h2>
          <p>
            To protect against abuse, the following rate limits apply to the XupaStack console API.
            All limits are sliding windows.
          </p>
          <div className="mt-4 rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 text-foreground font-semibold">Action</th>
                  <th className="text-left px-4 py-3 text-foreground font-semibold">Limit</th>
                  <th className="text-left px-4 py-3 text-foreground font-semibold">Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3">Magic link requests per email</td>
                  <td className="px-4 py-3 text-foreground font-medium">3</td>
                  <td className="px-4 py-3">5 minutes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Magic link requests per IP</td>
                  <td className="px-4 py-3 text-foreground font-medium">10</td>
                  <td className="px-4 py-3">5 minutes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">App creations per account</td>
                  <td className="px-4 py-3 text-foreground font-medium">10</td>
                  <td className="px-4 py-3">1 hour</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">App config updates per account</td>
                  <td className="px-4 py-3 text-foreground font-medium">30</td>
                  <td className="px-4 py-3">1 hour</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            When you hit a rate limit, the API returns <code className="text-foreground bg-secondary px-1 py-0.5 rounded text-xs">429 Too Many Requests</code>.
            Limits reset automatically after the window expires — no action needed on your part.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h2>What Counts as a Request?</h2>
          <p>
            Every HTTP request proxied through your XupaStack gateway URL counts toward your monthly
            allowance — including REST, Auth, Storage, Edge Functions, GraphQL, and Realtime upgrade requests.
            Requests that are rejected before reaching your Supabase project (e.g. blocked by CORS or
            rate limiting) do not count.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <h2>Need More?</h2>
          <p>
            If your project genuinely needs higher limits — high-traffic app, open-source project,
            or anything else — reach out at <a href="mailto:hello@xupastack.com" className="text-foreground underline underline-offset-2">hello@xupastack.com</a>.
            We'll work something out. We're not here to block legitimate use.
          </p>
          <p className="mt-3">
            Self-hosting is also always an option. The gateway is fully open-source and you can run
            it on your own Cloudflare account with no request caps.
            See the <a href="/quickstart" className="text-foreground underline underline-offset-2">self-host quickstart</a>.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <h2>Abuse &amp; Suspension</h2>
          <p>
            Accounts found to be deliberately circumventing limits, running traffic that harms other
            users, or violating the <a href="/terms" className="text-foreground underline underline-offset-2">Terms of Service</a> may be suspended without notice.
            We reserve the right to modify or revoke access to protect the service for everyone.
          </p>
        </AnimatedSection>

      </div>
    </div>
  </Layout>
);

export default FairUse;
