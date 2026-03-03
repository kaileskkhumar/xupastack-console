

## Diagnosis

This is a Vite SPA — crawlers see an empty `<div id="root"></div>` with no content. That's the core problem. Here's what's missing or fixable:

| Issue | Status |
|---|---|
| Server-rendered HTML | SPA — empty shell, unfixable without SSR |
| OpenGraph tags | Partially present — missing `og:url`, `og:image`, `og:site_name` |
| Twitter card tags | Missing `twitter:image`, `twitter:site` |
| `robots.txt` | Exists but missing `Sitemap:` directive |
| `sitemap.xml` | Does not exist |
| Canonical URL | Missing |
| Structured data (JSON-LD) | Missing |
| Cloudflare Bot Fight Mode | Infrastructure config — not code-level, noted in memory as "DNS only" mode already |

Since this is a Lovable (Vite) project, true SSR is not possible. But we can maximize what crawlers get from the static HTML shell.

## Plan

### 1. Enhance `index.html` meta tags

Add the missing OG/Twitter tags:
- `og:url` → `https://xupastack.com`
- `og:image` → create a simple OG image placeholder at `public/og-image.png` (or reference a URL)
- `og:site_name` → `XupaStack`
- `twitter:image` → same as og:image
- `twitter:site` → `@xupastack` (or omit if no Twitter handle)
- `<link rel="canonical" href="https://xupastack.com" />`

Also add a noscript fallback in `<body>` with key text content so crawlers that don't execute JS still get something:

```html
<noscript>
  <h1>XupaStack — Keep Supabase Working When It's Blocked</h1>
  <p>Free self-hosted and managed gateway to route Supabase traffic when supabase.co is blocked in your region.</p>
  <a href="https://xupastack.com/docs">Documentation</a>
  <a href="https://xupastack.com/quickstart">Quickstart</a>
</noscript>
```

### 2. Create `public/sitemap.xml`

Static sitemap listing all public routes:

```
/
/about
/docs
/guides
/quickstart
/security
/faq
/blog
/donate
/login
/privacy
/terms
```

### 3. Update `public/robots.txt`

Add `Sitemap: https://xupastack.com/sitemap.xml` directive.

### 4. Add JSON-LD structured data to `index.html`

A `<script type="application/ld+json">` block with Organization/WebSite schema so search engines understand the site identity.

### Technical note

Cloudflare Bot Fight Mode is an infrastructure setting, not a code change. Per project memory, Cloudflare proxy is already disabled (DNS only / grey cloud), so crawlers hit Lovable directly — no interstitial pages. No code action needed there.

