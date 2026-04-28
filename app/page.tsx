// =============================================================================
// app/page.tsx — Main Page (Server Component shell)
// =============================================================================
// This file is a Server Component — it renders zero client-side JavaScript.
// All interactivity is delegated to the <Dashboard /> client island.
// This keeps the initial page load fast and SEO-friendly.
// =============================================================================

import Dashboard from "@/components/Dashboard";

export default function HomePage() {
  return <Dashboard />;
}
