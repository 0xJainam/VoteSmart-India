import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import "./globals.css";

// =============================================================================
// Font Loading — via next/font/google (zero local font files)
// =============================================================================
// next/font automatically self-hosts Google Fonts at build time,
// eliminating layout shift (CLS) and external network requests at runtime.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// =============================================================================
// SEO Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "VoteSmart India — Interactive Election Guide",
  description:
    "An AI-powered interactive guide to the Indian election process. Learn about voter registration, candidate research, polling day procedures, and election results — in 5 Indian languages.",
  keywords: [
    "Indian elections",
    "voter registration",
    "EVM",
    "VVPAT",
    "Election Commission of India",
    "voting guide",
  ],
  openGraph: {
    title: "VoteSmart India — Interactive Election Guide",
    description:
      "Your complete guide to the Indian election process, powered by AI.",
    type: "website",
    locale: "en_IN",
  },
};

// =============================================================================
// Root Layout (Server Component)
// =============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-navy-950 text-ivory-50 font-body antialiased">
        <FirebaseAnalytics />
        {/* 
          A11y: Skip-to-content link — first focusable element in the DOM.
          Visually hidden by default, becomes visible on keyboard focus.
          This lets screen reader / keyboard users bypass the navigation.
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-saffron-500 focus:px-4 focus:py-2 focus:text-navy-900 focus:font-semibold focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
