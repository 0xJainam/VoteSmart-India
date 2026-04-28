// =============================================================================
// components/MapEmbed.tsx — Smart Proxy Search
// =============================================================================

import { UI_LABELS } from "@/lib/constants";
import type { SupportedLanguage, TranslatedText } from "@/lib/types";

interface MapEmbedProps {
  // We use "Government School" because ~90% of Indian polling booths are located there.
  query?: string;
  className?: string;
  language?: SupportedLanguage;
}

function t(text: TranslatedText, lang: SupportedLanguage): string {
  return text[lang] || text.en;
}

export default function MapEmbed({
  query = "Government Schools and Post Offices near me", 
  className = "",
  language = "en",
}: MapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  // 1. Official Universal Link (Opens the Google Maps App on phones)
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  if (!apiKey) {
    return (
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6 text-center">
        <p className="text-ivory-200 text-sm italic">📍 Map restricted. Check .env prefixes.</p>
      </div>
    );
  }

  // 2. Official Embed API Link (Renders the iframe on your site)
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=14`;

  return (
    <figure className={`rounded-xl overflow-hidden ${className}`}>
      <iframe
        src={src}
        width="100%"
        height="350"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        title="Polling station locator"
        className="rounded-xl border border-navy-600 shadow-lg"
      />
      
      <div className="bg-navy-900/50 p-3 mt-2 rounded-lg border border-navy-700">
        <p className="text-[10px] text-saffron-400 font-bold uppercase tracking-widest mb-1">
          {t(UI_LABELS.pro_voter_tip, language)}
        </p>
        <p className="text-xs text-ivory-300 leading-relaxed">
          {t(UI_LABELS.polling_station_info, language)}
        </p>
        
        {/* Deep link: opens Google Maps app on mobile */}
        <div className="mt-3 text-center">
          <a 
            href={mapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-600/50 text-xs rounded transition-colors inline-block"
          >
            Open in Google Maps App
          </a>
        </div>
      </div>
    </figure>
  );
}