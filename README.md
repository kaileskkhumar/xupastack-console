# XupaStack — Console

> The open-source web console for [XupaStack](https://xupastack.com) — a Cloudflare gateway that keeps Supabase working when `supabase.co` is blocked by ISPs.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

**Live:** [xupastack.com](https://xupastack.com) · **Backend:** [xupastack-backend](https://github.com/kaileskkhumar/xupastack-backend)

---

## What is this?

This is the frontend for XupaStack — the landing page, fix guides, documentation, and the console where users create and manage their Supabase gateways.

When Indian ISPs (Jio, Airtel, ACT) block `*.supabase.co`, this console lets developers spin up a proxy gateway in under 60 seconds.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **shadcn/ui** — component library
- **React Query** — data fetching
- **React Router** — routing

---

## Project Structure

```
src/
  pages/          # Route-level pages (Home, Docs, Guides, Fix, Console)
  components/     # Reusable UI components
    home/         # Landing page sections
    console/      # Console dashboard components
    layout/       # Header, Footer, Layout wrappers
  data/           # Static data (ISP info, stack snippets, blog posts)
  hooks/          # Custom React hooks
  lib/            # API client and utilities
```

---

## Local Development

**Requirements:** Node 18+, npm or bun

```bash
# Clone the repo
git clone https://github.com/kaileskkhumar/xupastack-console.git
cd xupastack-console

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Set VITE_API_BASE to your local API (default: https://api.xupastack.com)

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE` | XupaStack API base URL | `https://api.xupastack.com` |

---

## Contributing

Pull requests are welcome. See [CONTRIBUTING.md](https://github.com/kaileskkhumar/xupastack-backend/blob/main/CONTRIBUTING.md) for guidelines.

For backend changes, see [xupastack-backend](https://github.com/kaileskkhumar/xupastack-backend).

---

## License

[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0) — free to use, modify, and self-host. If you run a modified version as a public service, you must open-source your changes.
