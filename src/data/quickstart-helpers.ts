export const STACKS = ["Next.js", "Vite", "Expo", "Flutter", "Node"] as const;
export type Stack = (typeof STACKS)[number];

export const CHECKLIST_ITEMS = [
  "Cloudflare account ready",
  "Created gateway",
  "Ran init command",
  "Deployed to Cloudflare",
  "Swapped Supabase URL",
  "Added auth callback URL",
  "Doctor passed",
] as const;

export const DOCTOR_SERVICES = ["REST", "Auth", "Storage", "Realtime", "Functions"] as const;

const gwUrl = (gw?: string) => gw || "https://your-gateway.workers.dev";

export const getEnvSnippet = (stack: Stack, gatewayUrl?: string): string => {
  const url = gwUrl(gatewayUrl);
  switch (stack) {
    case "Next.js":
      return `# .env.local
NEXT_PUBLIC_SUPABASE_URL=${url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`;
    case "Vite":
      return `# .env
VITE_SUPABASE_URL=${url}
VITE_SUPABASE_ANON_KEY=your-anon-key`;
    case "Expo":
      return `// app.config.js
export default {
  extra: {
    supabaseUrl: '${url}',
    supabaseAnonKey: 'your-anon-key',
  },
};`;
    case "Flutter":
      return `// lib/constants.dart
const supabaseUrl = '${url}';
const supabaseAnonKey = 'your-anon-key';`;
    case "Node":
      return `# .env
SUPABASE_URL=${url}
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`;
  }
};

export const getEnvVarName = (stack: Stack): string => {
  switch (stack) {
    case "Next.js": return "NEXT_PUBLIC_SUPABASE_URL";
    case "Vite": return "VITE_SUPABASE_URL";
    case "Expo": return "supabaseUrl";
    case "Flutter": return "supabaseUrl";
    case "Node": return "SUPABASE_URL";
  }
};

export const fixEnvLine = (line: string, gatewayUrl?: string): string | null => {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const url = gwUrl(gatewayUrl);

  // Match KEY=VALUE or const KEY = 'VALUE'
  const envMatch = trimmed.match(/^([A-Z_]+)\s*=\s*(.+)$/);
  if (envMatch) {
    const [, key, val] = envMatch;
    const supabaseKeys = ["NEXT_PUBLIC_SUPABASE_URL", "VITE_SUPABASE_URL", "SUPABASE_URL"];
    if (supabaseKeys.includes(key)) {
      return `${key}=${url}`;
    }
    // If it's an anon key, keep it
    if (key.includes("ANON") || key.includes("SERVICE_ROLE")) {
      return trimmed;
    }
    return `${key}=${url}`;
  }

  const dartMatch = trimmed.match(/^const\s+(\w+)\s*=\s*['"](.+)['"]\s*;?$/);
  if (dartMatch && dartMatch[1].toLowerCase().includes("url")) {
    return `const ${dartMatch[1]} = '${url}';`;
  }

  const jsMatch = trimmed.match(/(\w+):\s*['"](.+)['"]/);
  if (jsMatch && jsMatch[1].toLowerCase().includes("url")) {
    return `${jsMatch[1]}: '${url}',`;
  }

  return `# Could not auto-detect — replace your Supabase URL with:
# ${url}`;
};

export const getAllStepsCopyText = (gatewayUrl?: string, projectRef?: string): string => {
  const ref = projectRef || "your-project-ref";
  const url = gwUrl(gatewayUrl);
  return [
    `# 1. Initialize gateway`,
    `npx xupastack init --gateway ${ref}`,
    ``,
    `# 2. Deploy to Cloudflare`,
    `npx wrangler deploy`,
    ``,
    `# 3. Swap your Supabase URL`,
    `# Replace SUPABASE_URL with: ${url}`,
    ``,
    `# 4. Add auth callback URL`,
    `# ${url}/auth/v1/callback`,
    ``,
    `# 5. Run the doctor`,
    `npx xupastack doctor`,
  ].join("\n");
};
