// =============================================================================
// lib/constants.ts — Election timeline data with full i18n support
// =============================================================================
// All user-facing text is wrapped in TranslatedText objects (5 languages).
// This data is static and can be rendered by Server Components — zero client JS.
// =============================================================================

import type { ElectionStep, SupportedLanguage, QuizQuestion, ElectionStepId, TranslatedText, Candidate } from "./types";

/**
 * Mock candidate data for the EVM Simulator.
 * Moved from EVMSimulator.tsx to centralize configuration.
 */
export const CANDIDATES: Candidate[] = [
  { id: 1, name: "Candidate A", party: "National Progress Party", symbol: "🌻" },
  { id: 2, name: "Candidate B", party: "People's Democratic Front", symbol: "🔔" },
  { id: 3, name: "Candidate C", party: "United Citizens Alliance", symbol: "⭐" },
  { id: 4, name: "Candidate D", party: "Independent", symbol: "🏛️" },
  { id: 5, name: "NOTA", party: "None of the Above", symbol: "✖️" },
];

/**
 * The 4-phase Indian election timeline.
 * Each step includes localised titles, descriptions, and actionable checklists
 * across all 5 supported languages (en, hi, bn, mr, te).
 */
export const ELECTION_TIMELINE: ElectionStep[] = [
  {
    id: "registration",
    order: 1,
    icon: "clipboard",
    showMap: false,
    title: {
      en: "Voter Registration",
      hi: "मतदाता पंजीकरण",
      bn: "ভোটার নিবন্ধন",
      mr: "मतदार नोंदणी",
      te: "ఓటరు నమోదు",
    },
    description: {
      en: "The first step to participating in Indian democracy is registering as a voter. Every Indian citizen aged 18 or above on the qualifying date (January 1st of the revision year) is eligible. You can register online through the National Voters' Service Portal (NVSP) or offline at your local Electoral Registration Office by submitting Form 6.",
      hi: "भारतीय लोकतंत्र में भाग लेने का पहला कदम मतदाता के रूप में पंजीकरण करना है। योग्यता तिथि (संशोधन वर्ष की 1 जनवरी) पर 18 वर्ष या उससे अधिक आयु का प्रत्येक भारतीय नागरिक पात्र है। आप NVSP पोर्टल के माध्यम से ऑनलाइन या फॉर्म 6 जमा करके ऑफलाइन पंजीकरण कर सकते हैं।",
      bn: "ভারতীয় গণতন্ত্রে অংশগ্রহণের প্রথম ধাপ হলো ভোটার হিসেবে নিবন্ধন করা। যোগ্যতার তারিখে (সংশোধন বছরের ১ জানুয়ারি) ১৮ বছর বা তার বেশি বয়সী প্রতিটি ভারতীয় নাগরিক যোগ্য। আপনি NVSP পোর্টালের মাধ্যমে অনলাইনে বা ফর্ম ৬ জমা দিয়ে অফলাইনে নিবন্ধন করতে পারেন।",
      mr: "भारतीय लोकशाहीत सहभागी होण्याची पहिली पायरी म्हणजे मतदार म्हणून नोंदणी करणे. पात्रता तारखेला (सुधारणा वर्षाच्या १ जानेवारी) १८ वर्षे किंवा त्याहून अधिक वयाचा प्रत्येक भारतीय नागरिक पात्र आहे. तुम्ही NVSP पोर्टलद्वारे ऑनलाइन किंवा फॉर्म ६ सबमिट करून ऑफलाइन नोंदणी करू शकता.",
      te: "భారత ప్రజాస్వామ్యంలో పాల్గొనడంలో మొదటి అడుగు ఓటరుగా నమోదు చేసుకోవడం. అర్హత తేదీన (సవరణ సంవత్సరం జనవరి 1) 18 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ వయస్సు ఉన్న ప్రతి భారత పౌరుడు అర్హులు. మీరు NVSP పోర్టల్ ద్వారా ఆన్‌లైన్‌లో లేదా ఫారం 6 సమర్పించడం ద్వారా ఆఫ్‌లైన్‌లో నమోదు చేసుకోవచ్చు.",
    },
    checklist: [
      {
        en: "Check eligibility — must be 18+ Indian citizen",
        hi: "पात्रता जांचें — 18+ भारतीय नागरिक होना चाहिए",
        bn: "যোগ্যতা পরীক্ষা করুন — ১৮+ ভারতীয় নাগরিক হতে হবে",
        mr: "पात्रता तपासा — १८+ भारतीय नागरिक असणे आवश्यक",
        te: "అర్హత తనిఖీ చేయండి — 18+ భారత పౌరుడు అయి ఉండాలి",
      },
      {
        en: "Submit Form 6 online via NVSP or at ERO office",
        hi: "NVSP के माध्यम से ऑनलाइन या ERO कार्यालय में फॉर्म 6 जमा करें",
        bn: "NVSP-এর মাধ্যমে অনলাইনে বা ERO অফিসে ফর্ম ৬ জমা দিন",
        mr: "NVSP द्वारे ऑनलाइन किंवा ERO कार्यालयात फॉर्म ६ सबमिट करा",
        te: "NVSP ద్వారా ఆన్‌లైన్‌లో లేదా ERO కార్యాలయంలో ఫారం 6 సమర్పించండి",
      },
      {
        en: "Collect your EPIC (Voter ID) card",
        hi: "अपना EPIC (मतदाता पहचान पत्र) कार्ड प्राप्त करें",
        bn: "আপনার EPIC (ভোটার আইডি) কার্ড সংগ্রহ করুন",
        mr: "तुमचे EPIC (मतदार ओळखपत्र) कार्ड गोळा करा",
        te: "మీ EPIC (ఓటరు గుర్తింపు) కార్డు సేకరించండి",
      },
      {
        en: "Verify your name on the electoral roll at electoralsearch.eci.gov.in",
        hi: "electoralsearch.eci.gov.in पर मतदाता सूची में अपना नाम सत्यापित करें",
        bn: "electoralsearch.eci.gov.in-এ নির্বাচনী তালিকায় আপনার নাম যাচাই করুন",
        mr: "electoralsearch.eci.gov.in वर मतदार यादीत तुमचे नाव तपासा",
        te: "electoralsearch.eci.gov.in లో ఓటరు జాబితాలో మీ పేరు ధృవీకరించండి",
      },
    ],
  },
  {
    id: "research",
    order: 2,
    icon: "search",
    showMap: false,
    title: {
      en: "Candidate Research",
      hi: "उम्मीदवार अनुसंधान",
      bn: "প্রার্থী গবেষণা",
      mr: "उमेदवार संशोधन",
      te: "అభ్యర్థి పరిశోధన",
    },
    description: {
      en: "An informed vote is a powerful vote. Before election day, research the candidates contesting from your constituency. Review their manifestos, track records, criminal cases (if any), and financial declarations — all publicly available through the Election Commission of India (ECI) and the Association for Democratic Reforms (ADR) portals.",
      hi: "एक सूचित वोट एक शक्तिशाली वोट है। चुनाव दिवस से पहले, अपने निर्वाचन क्षेत्र से चुनाव लड़ रहे उम्मीदवारों पर शोध करें। उनके घोषणापत्र, ट्रैक रिकॉर्ड, आपराधिक मामले और वित्तीय घोषणाएँ देखें — ये सभी ECI और ADR पोर्टल पर उपलब्ध हैं।",
      bn: "একটি সচেতন ভোট একটি শক্তিশালী ভোট। নির্বাচনের দিনের আগে, আপনার নির্বাচনী এলাকা থেকে প্রতিদ্বন্দ্বী প্রার্থীদের সম্পর্কে গবেষণা করুন। তাদের ইশতেহার, ট্র্যাক রেকর্ড, ফৌজদারি মামলা এবং আর্থিক ঘোষণা পর্যালোচনা করুন — এগুলি সবই ECI এবং ADR পোর্টালে পাওয়া যায়।",
      mr: "माहितीपूर्ण मत हे शक्तिशाली मत आहे. निवडणुकीच्या दिवसापूर्वी, तुमच्या मतदारसंघातून निवडणूक लढवणाऱ्या उमेदवारांचे संशोधन करा. त्यांचे जाहीरनामे, ट्रॅक रेकॉर्ड, गुन्हेगारी प्रकरणे आणि आर्थिक घोषणा पहा — हे सर्व ECI आणि ADR पोर्टलवर उपलब्ध आहे.",
      te: "సమాచారంతో కూడిన ఓటు శక్తివంతమైన ఓటు. ఎన్నికల రోజుకు ముందు, మీ నియోజకవర్గం నుండి పోటీ చేస్తున్న అభ్యర్థులను పరిశోధించండి. వారి మేనిఫెస్టోలు, ట్రాక్ రికార్డులు, నేర కేసులు మరియు ఆర్థిక ప్రకటనలను సమీక్షించండి — ఇవన్నీ ECI మరియు ADR పోర్టల్‌లలో అందుబాటులో ఉన్నాయి.",
    },
    checklist: [
      {
        en: "Visit the ECI website to see candidates for your constituency",
        hi: "अपने निर्वाचन क्षेत्र के उम्मीदवारों को देखने के लिए ECI वेबसाइट पर जाएँ",
        bn: "আপনার নির্বাচনী এলাকার প্রার্থীদের দেখতে ECI ওয়েবসাইট দেখুন",
        mr: "तुमच्या मतदारसंघातील उमेदवार पाहण्यासाठी ECI वेबसाइटला भेट द्या",
        te: "మీ నియోజకవర్గ అభ్యర్థులను చూడటానికి ECI వెబ్‌సైట్ సందర్శించండి",
      },
      {
        en: "Check candidate affidavits on MyNeta.info (ADR)",
        hi: "MyNeta.info (ADR) पर उम्मीदवार शपथ पत्र जांचें",
        bn: "MyNeta.info (ADR)-এ প্রার্থীর হলফনামা পরীক্ষা করুন",
        mr: "MyNeta.info (ADR) वर उमेदवाराचे प्रतिज्ञापत्र तपासा",
        te: "MyNeta.info (ADR) లో అభ్యర్థి అఫిడవిట్లు తనిఖీ చేయండి",
      },
      {
        en: "Compare party manifestos and policy promises",
        hi: "पार्टी घोषणापत्रों और नीतिगत वादों की तुलना करें",
        bn: "দলীয় ইশতেহার এবং নীতিগত প্রতিশ্রুতি তুলনা করুন",
        mr: "पक्षांचे जाहीरनामे आणि धोरणात्मक आश्वासने तुलना करा",
        te: "పార్టీ మేనిఫెస్టోలు మరియు విధాన వాగ్దానాలను పోల్చండి",
      },
    ],
  },
  {
    id: "polling",
    order: 3,
    icon: "vote",
    showMap: true, // Google Maps embed shown on this step
    title: {
      en: "Polling Day",
      hi: "मतदान दिवस",
      bn: "ভোটের দিন",
      mr: "मतदान दिवस",
      te: "పోలింగ్ రోజు",
    },
    description: {
      en: "On polling day, head to your assigned polling station with valid ID. The voting process uses Electronic Voting Machines (EVMs) paired with a Voter Verifiable Paper Audit Trail (VVPAT). After pressing the button next to your chosen candidate on the EVM, verify your vote on the VVPAT slip before it drops into the sealed box. Polling hours are typically 7:00 AM to 6:00 PM.",
      hi: "मतदान के दिन, वैध पहचान पत्र के साथ अपने निर्धारित मतदान केंद्र पर जाएँ। मतदान प्रक्रिया EVM और VVPAT का उपयोग करती है। EVM पर अपने चुने हुए उम्मीदवार के बगल में बटन दबाने के बाद, VVPAT पर्ची पर अपना वोट सत्यापित करें। मतदान का समय आमतौर पर सुबह 7:00 बजे से शाम 6:00 बजे तक होता है।",
      bn: "ভোটের দিন, বৈধ পরিচয়পত্র নিয়ে আপনার নির্ধারিত পোলিং স্টেশনে যান। ভোটদান প্রক্রিয়ায় EVM এবং VVPAT ব্যবহার করা হয়। EVM-এ আপনার নির্বাচিত প্রার্থীর পাশের বোতাম টিপে VVPAT স্লিপে আপনার ভোট যাচাই করুন। ভোটদানের সময় সাধারণত সকাল ৭:০০ থেকে সন্ধ্যা ৬:০০।",
      mr: "मतदानाच्या दिवशी, वैध ओळखपत्रासह तुमच्या नियुक्त मतदान केंद्रावर जा. मतदान प्रक्रिया EVM आणि VVPAT वापरते. EVM वर तुमच्या निवडलेल्या उमेदवाराच्या बाजूचे बटण दाबल्यानंतर, VVPAT स्लिपवर तुमचे मत सत्यापित करा. मतदानाची वेळ साधारणतः सकाळी ७:०० ते सायंकाळी ६:०० असते.",
      te: "పోలింగ్ రోజున, చెల్లుబాటు అయ్యే గుర్తింపుతో మీకు కేటాయించిన పోలింగ్ స్టేషన్‌కు వెళ్ళండి. ఓటింగ్ ప్రక్రియ EVM మరియు VVPAT ఉపయోగిస్తుంది. EVM లో మీరు ఎంచుకున్న అభ్యర్థి పక్కన ఉన్న బటన్ నొక్కిన తర్వాత, VVPAT స్లిప్‌పై మీ ఓటును ధృవీకరించండి. పోలింగ్ సమయాలు సాధారణంగా ఉదయం 7:00 నుండి సాయంత్రం 6:00 వరకు.",
    },
    checklist: [
      {
        en: "Carry valid photo ID (EPIC, Aadhaar, Passport, etc.)",
        hi: "वैध फोटो पहचान पत्र ले जाएं (EPIC, आधार, पासपोर्ट आदि)",
        bn: "বৈধ ফটো আইডি বহন করুন (EPIC, আধার, পাসপোর্ট ইত্যাদি)",
        mr: "वैध फोटो ओळखपत्र सोबत ठेवा (EPIC, आधार, पासपोर्ट इ.)",
        te: "చెల్లుబాటు అయ్యే ఫోటో ID తీసుకెళ్ళండి (EPIC, ఆధార్, పాస్‌పోర్ట్ మొ.)",
      },
      {
        en: "Locate your polling station (use the map below or ECI app)",
        hi: "अपना मतदान केंद्र खोजें (नीचे दिए गए मानचित्र या ECI ऐप का उपयोग करें)",
        bn: "আপনার পোলিং স্টেশন খুঁজুন (নিচের মানচিত্র বা ECI অ্যাপ ব্যবহার করুন)",
        mr: "तुमचे मतदान केंद्र शोधा (खालील नकाशा किंवा ECI अॅप वापरा)",
        te: "మీ పోలింగ్ స్టేషన్ కనుగొనండి (క్రింద మ్యాప్ లేదా ECI యాప్ ఉపయోగించండి)",
      },
      {
        en: "Cast your vote on the EVM and verify on VVPAT",
        hi: "EVM पर अपना वोट डालें और VVPAT पर सत्यापित करें",
        bn: "EVM-এ আপনার ভোট দিন এবং VVPAT-এ যাচাই করুন",
        mr: "EVM वर तुमचे मत द्या आणि VVPAT वर सत्यापित करा",
        te: "EVM లో మీ ఓటు వేసి VVPAT లో ధృవీకరించండి",
      },
      {
        en: "Collect your indelible ink mark on your left index finger",
        hi: "अपनी बाईं तर्जनी उंगली पर अमिट स्याही का निशान लगवाएं",
        bn: "আপনার বাম তর্জনীতে অমোচনীয় কালির চিহ্ন সংগ্রহ করুন",
        mr: "तुमच्या डाव्या तर्जनीवर अमिट शाईचे चिन्ह घ्या",
        te: "మీ ఎడమ చూపుడు వేలిపై చెరగని సిరా గుర్తు పొందండి",
      },
    ],
  },
  {
    id: "counting",
    order: 4,
    icon: "bar-chart",
    showMap: false,
    title: {
      en: "Counting & Results",
      hi: "मतगणना और परिणाम",
      bn: "গণনা ও ফলাফল",
      mr: "मतमोजणी आणि निकाल",
      te: "లెక్కింపు మరియు ఫలితాలు",
    },
    description: {
      en: "After polling concludes, EVMs are sealed and stored under heavy security. On counting day (typically a few days after the final polling phase), EVMs are opened in the presence of candidates' agents and observers. Results are tallied round by round. The Election Commission declares results on its official portal. The party or coalition securing a majority (272+ seats in Lok Sabha) is invited to form the government.",
      hi: "मतदान समाप्त होने के बाद, EVM को सील कर कड़ी सुरक्षा में रखा जाता है। मतगणना के दिन, उम्मीदवारों के एजेंटों और पर्यवेक्षकों की उपस्थिति में EVM खोले जाते हैं। परिणाम राउंड दर राउंड गिने जाते हैं। चुनाव आयोग अपने आधिकारिक पोर्टल पर परिणाम घोषित करता है। बहुमत (लोकसभा में 272+ सीटें) हासिल करने वाली पार्टी को सरकार बनाने के लिए आमंत्रित किया जाता है।",
      bn: "ভোটদান শেষ হওয়ার পর, EVM সিল করে কড়া নিরাপত্তায় রাখা হয়। গণনার দিনে, প্রার্থীদের এজেন্ট এবং পর্যবেক্ষকদের উপস্থিতিতে EVM খোলা হয়। ফলাফল রাউন্ড ধরে ধরে গণনা করা হয়। নির্বাচন কমিশন তার অফিসিয়াল পোর্টালে ফলাফল ঘোষণা করে। সংখ্যাগরিষ্ঠতা (লোকসভায় ২৭২+ আসন) অর্জনকারী দল সরকার গঠনে আমন্ত্রিত হয়।",
      mr: "मतदान संपल्यानंतर, EVM सील करून कडक सुरक्षेत ठेवले जातात. मतमोजणीच्या दिवशी, उमेदवारांचे एजंट आणि निरीक्षकांच्या उपस्थितीत EVM उघडले जातात. निकाल फेरीनुसार मोजले जातात. निवडणूक आयोग त्याच्या अधिकृत पोर्टलवर निकाल जाहीर करतो. बहुमत (लोकसभेत २७२+ जागा) मिळवणाऱ्या पक्षाला सरकार स्थापन करण्यासाठी आमंत्रित केले जाते.",
      te: "పోలింగ్ ముగిసిన తర్వాత, EVM లను సీల్ చేసి కఠిన భద్రతలో భద్రపరుస్తారు. లెక్కింపు రోజున, అభ్యర్థుల ఏజెంట్లు మరియు పరిశీలకుల సమక్షంలో EVM లు తెరవబడతాయి. ఫలితాలు రౌండ్ వారీగా లెక్కించబడతాయి. ఎన్నికల సంఘం తన అధికారిక పోర్టల్‌లో ఫలితాలను ప్రకటిస్తుంది. మెజారిటీ (లోక్‌సభలో 272+ సీట్లు) సాధించిన పార్టీ ప్రభుత్వాన్ని ఏర్పాటు చేయడానికి ఆహ్వానించబడుతుంది.",
    },
    checklist: [
      {
        en: "Follow live results on results.eci.gov.in",
        hi: "results.eci.gov.in पर लाइव परिणाम देखें",
        bn: "results.eci.gov.in-এ লাইভ ফলাফল অনুসরণ করুন",
        mr: "results.eci.gov.in वर थेट निकाल पहा",
        te: "results.eci.gov.in లో ప్రత్యక్ష ఫలితాలు అనుసరించండి",
      },
      {
        en: "Understand FPTP (First Past The Post) — highest votes wins",
        hi: "FPTP (फर्स्ट पास्ट द पोस्ट) समझें — सबसे अधिक वोट जीतता है",
        bn: "FPTP (ফার্স্ট পাস্ট দ্য পোস্ট) বুঝুন — সবচেয়ে বেশি ভোট জেতে",
        mr: "FPTP (फर्स्ट पास्ट द पोस्ट) समजून घ्या — सर्वाधिक मते जिंकतात",
        te: "FPTP (ఫస్ట్ పాస్ట్ ది పోస్ట్) అర్థం చేసుకోండి — అత్యధిక ఓట్లు గెలుస్తాయి",
      },
      {
        en: "Learn about government formation and oath of office",
        hi: "सरकार गठन और शपथ ग्रहण के बारे में जानें",
        bn: "সরকার গঠন এবং শপথ গ্রহণ সম্পর্কে জানুন",
        mr: "सरकार स्थापना आणि शपथविधी बद्दल जाणून घ्या",
        te: "ప్రభుత్వ ఏర్పాటు మరియు ప్రమాణ స్వీకారం గురించి తెలుసుకోండి",
      },
    ],
  },
];

/** Default language for the application */
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

/** Maximum chat history messages sent to Gemini (controls token usage) */
export const MAX_CHAT_HISTORY = 10;

/** Gemini model to use — flash for speed and cost efficiency */
export const GEMINI_MODEL = "gemini-2.0-flash";

/** EVM Simulator Constants */
export const EVM_VVPAT_TIMEOUT_MS = 800;
export const EVM_VVPAT_DURATION_S = 7;
export const EVM_EXP_REWARD = 100;
export const EVM_VVPAT_COUNTDOWN_INTERVAL_MS = 1000;

/** Chat Panel Constants */
export const CHAT_COOLDOWN_MS = 3000;
export const CHAT_RETRY_DELAY_MS = 2000;

// Helper: creates a TranslatedText with English value (other langs fallback to en)
function en(text: string): TranslatedText {
  return { en: text, hi: text, bn: text, mr: text, te: text };
}

// =============================================================================
// Quiz Questions — 3 per election step
// =============================================================================

export const QUIZ_QUESTIONS: Record<ElectionStepId, QuizQuestion[]> = {
  registration: [
    {
      question: en("What is the minimum age to register as a voter in India?"),
      options: [en("16 years"), en("18 years"), en("21 years"), en("25 years")],
      correctIndex: 1,
      explanation: en("Under Article 326 of the Constitution, every Indian citizen aged 18 or above on the qualifying date (Jan 1 of the revision year) is eligible to vote."),
    },
    {
      question: en("Which form is used for new voter registration?"),
      options: [en("Form 6"), en("Form 8"), en("Form 6A"), en("Form 7")],
      correctIndex: 0,
      explanation: en("Form 6 is used for new voter registration. Form 6A is for NRI voters, Form 7 for objections, and Form 8 for corrections."),
    },
    {
      question: en("What does EPIC stand for?"),
      options: [en("Electronic Photo Identity Card"), en("Electors Photo Identity Card"), en("Election Process Identity Certificate"), en("Electoral Photo ID Credential")],
      correctIndex: 1,
      explanation: en("EPIC stands for Electors Photo Identity Card — commonly known as the Voter ID card issued by the Election Commission of India."),
    },
  ],
  research: [
    {
      question: en("Which website provides candidate criminal and financial records?"),
      options: [en("eci.gov.in"), en("MyNeta.info (ADR)"), en("india.gov.in"), en("niti.gov.in")],
      correctIndex: 1,
      explanation: en("MyNeta.info, run by the Association for Democratic Reforms (ADR), provides detailed candidate affidavits including criminal cases and financial declarations."),
    },
    {
      question: en("What is a party manifesto?"),
      options: [en("A list of party members"), en("A public document outlining policy promises"), en("The party's financial statement"), en("A voter registration form")],
      correctIndex: 1,
      explanation: en("A manifesto is a public document where a political party outlines its policy positions, goals, and promises to the electorate before an election."),
    },
    {
      question: en("Can independent candidates contest elections in India?"),
      options: [en("No, only party candidates"), en("Yes, with party approval"), en("Yes, any eligible citizen can"), en("Only in local elections")],
      correctIndex: 2,
      explanation: en("Any eligible citizen can contest elections as an independent candidate by filing a nomination and paying the required security deposit."),
    },
  ],
  polling: [
    {
      question: en("What does VVPAT stand for?"),
      options: [en("Voter Verified Paper Audit Trail"), en("Verified Voting Paper Authentication Tool"), en("Vote Validation Paper Approval Ticket"), en("Visual Voter Paper Access Terminal")],
      correctIndex: 0,
      explanation: en("VVPAT is the Voter Verifiable Paper Audit Trail — it prints a slip showing your chosen candidate's name and symbol for 7 seconds so you can verify your vote."),
    },
    {
      question: en("Which of these is NOT a valid ID for voting?"),
      options: [en("EPIC (Voter ID)"), en("Aadhaar Card"), en("Library Card"), en("Passport")],
      correctIndex: 2,
      explanation: en("The Election Commission accepts 12 official photo IDs including EPIC, Aadhaar, Passport, Driving License, and PAN card. A library card is not on this list."),
    },
    {
      question: en("What is applied to your finger after voting?"),
      options: [en("Red paint"), en("Indelible ink"), en("UV stamp"), en("Nothing")],
      correctIndex: 1,
      explanation: en("Indelible ink (containing silver nitrate) is applied to the left index finger's nail and cuticle to prevent duplicate voting. It typically lasts 2-4 weeks."),
    },
  ],
  counting: [
    {
      question: en("What electoral system does India use for Lok Sabha elections?"),
      options: [en("Proportional Representation"), en("First Past The Post (FPTP)"), en("Ranked Choice Voting"), en("Two-Round System")],
      correctIndex: 1,
      explanation: en("India uses FPTP — the candidate with the most votes in a constituency wins, regardless of whether they achieve an absolute majority."),
    },
    {
      question: en("How many seats are needed for a majority in Lok Sabha?"),
      options: [en("250"), en("272"), en("300"), en("364")],
      correctIndex: 1,
      explanation: en("The Lok Sabha has 543 elected seats. A party or coalition needs 272 seats (simple majority) to form the government."),
    },
    {
      question: en("Who officially declares the election results?"),
      options: [en("The Prime Minister"), en("The Supreme Court"), en("The Election Commission of India"), en("The President")],
      correctIndex: 2,
      explanation: en("The Election Commission of India (ECI) is the constitutional body responsible for conducting elections and declaring official results."),
    },
  ],
};

// =============================================================================
// Election Do's and Don'ts — Polling Day Rules (Translated)
// =============================================================================

export const ELECTION_RULES: { rule: TranslatedText; type: "do" | "dont"; icon: string }[] = [
  { 
    rule: {
      en: "Carry a valid photo ID to the polling station",
      hi: "मतदान केंद्र पर वैध फोटो ID ले जाएं",
      bn: "পোলিং স্টেশনে বৈধ ফটো আইডি নিয়ে যান",
      mr: "मतदान केंद्रात वैध फोटो ओळखपत्र सोबत घ्या",
      te: "పోలింగ్ స్టేషన్‌కు చెల్లుబాటు అయ్యే ఫోటో ID తీసుకెళ్ళండి",
    },
    type: "do",
    icon: "✅",
  },
  { 
    rule: {
      en: "Verify your name on the electoral roll before polling day",
      hi: "मतदान दिवस से पहले मतदाता सूची में अपना नाम सत्यापित करें",
      bn: "ভোটের দিনের আগে নির্বাচনী তালিকায় আপনার নাম যাচাই করুন",
      mr: "मतदानाच्या दिवसाआधी मतदार यादीत तुमचे नाव तपासा",
      te: "పోలింగ్ రోజుకు ముందు ఓటరు జాబితాలో మీ పేరు ధృవీకరించండి",
    },
    type: "do",
    icon: "✅",
  },
  { 
    rule: {
      en: "Check your polling station location in advance",
      hi: "पहले से अपने मतदान केंद्र का स्थान जांचें",
      bn: "আগে থেকেই আপনার পোলিং স্টেশনের অবস্থান পরীক্ষা করুন",
      mr: "आगाऊन तुमचे मतदान केंद्र स्थान तपासा",
      te: "ముందుగా మీ పోలింగ్ స్టేషన్ స్థానాన్ని తనిఖీ చేయండి",
    },
    type: "do",
    icon: "✅",
  },
  { 
    rule: {
      en: "Verify your vote on the VVPAT slip",
      hi: "VVPAT पर्ची पर अपना वोट सत्यापित करें",
      bn: "VVPAT স্লিপে আপনার ভোট যাচাই করুন",
      mr: "VVPAT पर्चीवर तुमचे मत सत्यापित करा",
      te: "VVPAT స్లిప్‌పై మీ ఓటును ధృవీకరించండి",
    },
    type: "do",
    icon: "✅",
  },
  { 
    rule: {
      en: "Report any irregularities to the presiding officer",
      hi: "किसी भी अनियमितता की रिपोर्ट अध्यक्ष को करें",
      bn: "কোনো অনিয়ম প্রেসাইডিং অফিসারকে রিপোর্ট করুন",
      mr: "कोणतीही अनियमितता अध्यक्षाला अहवाल द्या",
      te: "ఏదైనా అక్రమాలను ప్రిసిడింగ్ ఆఫీసర్‌కు నివేదించండి",
    },
    type: "do",
    icon: "✅",
  },
  { 
    rule: {
      en: "Carry mobile phones inside the polling booth",
      hi: "मतदान बूथ के अंदर मोबाइल फोन ले जाएं",
      bn: "পোলিং বুথের ভিতরে মোবাইল ফোন নিয়ে যান",
      mr: "मतदान बूथ आत मोबाइल फोन सोबत घ्या",
      te: "పోలింగ్ బూथ్ లోపల మొబైల్ ఫోన్‌ను తీసుకెళ్ళవద్దు",
    },
    type: "dont",
    icon: "🚫",
  },
  { 
    rule: {
      en: "Wear clothing with party symbols or candidate names",
      hi: "पार्टी प्रतीकों या उम्मीदवार के नाम वाले कपड़े पहनें",
      bn: "পার্টি প্রতীক বা প্রার্থীর নাম সহ পোশাক পরুন",
      mr: "पक्षाचे प्रतीक किंवा उमेदवाराच्या नावासह कपडे परिधान करा",
      te: "పార్టీ చిహ్నాలు లేదా అభ్యర్థીల పేర్లతో ఉన్న దుస్తులను ధరించవద్దు",
    },
    type: "dont",
    icon: "🚫",
  },
  { 
    rule: {
      en: "Campaign within 100 meters of the polling station",
      hi: "मतदान केंद्र के 100 मीटर के भीतर प्रचार करें",
      bn: "পোলিং স্টেশনের ১০০ মিটার মধ্যে প্রচার করুন",
      mr: "मतदान केंद्रातून १०० मीटरमध्ये प्रचार करा",
      te: "పోలింగ్ స్టేషన్ నుండి 100 మీటర్ల పరిధిలో ప్రచారం చేయవద్దు",
    },
    type: "dont",
    icon: "🚫",
  },
  { 
    rule: {
      en: "Take selfies or photos inside the polling booth",
      hi: "मतदान बूथ के अंदर सेल्फी या फोटो लें",
      bn: "পোলিং বুথের ভিতরে সেলফি বা ছবি তুলুন",
      mr: "मतदान बूथ आत सेल्फी किंवा फोटो घ्या",
      te: "పోలింగ్ బూత్ లోపల సెల్ఫీలు లేదా ఫోటోలను తీయవద్దు",
    },
    type: "dont",
    icon: "🚫",
  },
  { 
    rule: {
      en: "Share your ballot choice publicly to influence others",
      hi: "दूसरों को प्रभावित करने के लिए अपनी मतपत्र की पसंद सार्वजनिक रूप से साझा करें",
      bn: "অন্যদের প্রভাবিত করার জন্য আপনার ব্যালট পছন্দ প্রকাশ্যে শেয়ার করুন",
      mr: "इतरांना प्रभावित करण्यासाठी तुमची मतपत्र पसंद जनसमोर सामायिक करा",
      te: "ఇతరులను ప్రభావితం చేయడానికి మీ ఓటు ఎంపికను బహిరంగంగా భాగస్వామ్యం చేయవద్దు",
    },
    type: "dont",
    icon: "🚫",
  },
];

// =============================================================================
// UI Labels and Messages — All Translated
// =============================================================================

export const UI_LABELS: Record<string, TranslatedText> = {
  "action_checklist": {
    en: "Action Checklist",
    hi: "कार्य सूची",
    bn: "কর্ম চেকলিস্ট",
    mr: "कार्य सूची",
    te: "చర్య చెకలిస్ట్",
  },
  "polling_day_rules": {
    en: "Polling Day — Do's & Don'ts",
    hi: "मतदान दिवस — करें और न करें",
    bn: "ভোটের দিন — করনীয় এবং বর্জনীয়",
    mr: "मतदान दिवस — करा आणि करू नका",
    te: "పోలింగ్ రోజు — చేయవలసిన మరియు చేయకూడని విషయాలు",
  },
  "find_polling_station": {
    en: "Find Your Polling Station",
    hi: "अपना मतदान केंद्र खोजें",
    bn: "আপনার পোলিং স্টেশন খুঁজুন",
    mr: "तुमचे मतदान केंद्र शोधा",
    te: "మీ పోలింగ్ స్టేషన్ కనుగొనండి",
  },
  "try_evm_simulator": {
    en: "Try EVM Simulator",
    hi: "EVM सिम्युलेटर आजमाएं",
    bn: "EVM সিমুলেটর চেষ্টা করুন",
    mr: "EVM सिम्युलेटर आजमा",
    te: "EVM సిమ్యులేటర్‌ను ప్రయత్నించండి",
  },
  "hide_evm_simulator": {
    en: "Hide EVM Simulator",
    hi: "EVM सिम्युलेटर छुपाएं",
    bn: "EVM সিমুলেটর লুকান",
    mr: "EVM सिम्युलेटर लपवा",
    te: "EVM సిమ్యులేటర్‌ను దాచండి",
  },
  "take_quiz": {
    en: "Take Quiz (+EXP)",
    hi: "क्विज़ लें (+EXP)",
    bn: "কুইজ নিন (+EXP)",
    mr: "क्विজ घ्या (+EXP)",
    te: "క్విజ్‌ను తీసుకోండి (+EXP)",
  },
  "hide_quiz": {
    en: "Hide Quiz",
    hi: "क्विज़ छुपाएं",
    bn: "কুইজ লুকান",
    mr: "क्विज लपवा",
    te: "క్విజ్‌ను దాచండి",
  },
  "pro_voter_tip": {
    en: "💡 Pro Voter Tip",
    hi: "💡 प्रो वोटर टिप",
    bn: "💡 প্রো ভোটার টিপ",
    mr: "💡 प्रो वोटर टिप",
    te: "💡 ప్రో వోటర్ టిప్",
  },
  "polling_station_info": {
    en: "Polling stations are usually located in Government Schools, Post Offices, or Community Centers. The map above shows the nearest public infrastructure used for elections in your area.",
    hi: "मतदान केंद्र आमतौर पर सरकारी स्कूलों, डाकघरों या सामुदायिक केंद्रों में स्थित होते हैं। ऊपर दिया गया नक्शा आपके क्षेत्र में चुनावों के लिए उपयोग किए जाने वाले निकटतम सार्वजनिक बुनियादी ढांचे को दर्शाता है।",
    bn: "পোলিং স্টেশনগুলি সাধারণত সরকারি স্কুল, পোস্ট অফিস বা কমিউনিটি সেন্টারে অবস্থিত। উপরের মানচিত্রটি আপনার এলাকায় নির্বাচনের জন্য ব্যবহৃত নিকটতম সরকারি অবকাঠামো দেখায়।",
    mr: "मतदान केंद्र सामान्यतः सरकारी शाळा, पोस्ट ऑफिस किंवा सामुदायिक केंद्रांत स्थित असतात. वरील नकाशा तुमच्या क्षेत्रातील निवडणुकीसाठी वापरल्या जाणाऱ्या जवळचे सार्वजनिक पायाभूत दर्शवतो.",
    te: "పోలింగ్ స్టేషన్‌లు సాధారణంగా ప్రభుత్వ పాఠశాలలు, పోస్ట్ ఆఫీసులు లేదా కమ్యూనిటీ సెంటర్‌లలో ఉంటాయి. పై మ్యాప్ మీ ఖాళీలో ఎన్నికల కోసం ఉపయోగించే సమీప పబ్లిక్ ఇన్ఫ్రాస్ట్రక్చర్‌ను చూపుతుంది.",
  },
  "evm_simulator_title": {
    en: "🗳️ EVM Simulator — Practice Voting",
    hi: "🗳️ EVM सिम्युलेटर — मतदान का अभ्यास करें",
    bn: "🗳️ EVM সিমুলেটর — ভোটদান অনুশীলন করুন",
    mr: "🗳️ EVM सिम्युलेटर — मतदान अभ्यास करा",
    te: "🗳️ EVM సిమ్యులేటర్ — ఓటింగ్ ప్రాక్టీస్ చేయండి",
  },
  "evm_simulator_subtitle": {
    en: "Experience the Electronic Voting Machine in a safe environment",
    hi: "सुरक्षित वातावरण में इलेक्ट्रॉनिक वोटिंग मशीन का अनुभव करें",
    bn: "নিরাপদ পরিবেশে ইলেকট্রনিক ভোটিং মেশিনের অভিজ্ঞতা নিন",
    mr: "सुरक्षित वातावरणात इलेक्ट्रॉनिक व्होटिंग मशीनचा अनुभव करा",
    te: "సురక్షితమైన వాతావరణంలో ఎలెక్ట్రానిక్ ఓటింగ్ మెషీన్ అనుభవం పొందండి",
  },
  "quiz_excellent": {
    en: "🎉 Excellent!",
    hi: "🎉 शानदार!",
    bn: "🎉 দুর্দান্ত!",
    mr: "🎉 शानदार!",
    te: "🎉 అద్భుతమైనది!",
  },
  "quiz_good": {
    en: "👍 Good effort!",
    hi: "👍 अच्छा प्रयास!",
    bn: "👍 ভাল চেষ্টা!",
    mr: "👍 चांगली कोशिश!",
    te: "👍 మంచి ప్రయత్నం!",
  },
  "quiz_keep_learning": {
    en: "📚 Keep learning!",
    hi: "📚 सीखते रहें!",
    bn: "📚 শিখতে থাকুন!",
    mr: "📚 शिकत राहा!",
    te: "📚 నేర్చుకుంటూ ఉండండి!",
  },
  "try_again": {
    en: "Try Again",
    hi: "फिर से कोशिश करें",
    bn: "আবার চেষ্টা করুন",
    mr: "पुन्हा प्रयत्न करा",
    te: "మళ్లీ ప్రయత్నించండి",
  },
  "step_of": {
    en: "Step",
    hi: "चरण",
    bn: "ধাপ",
    mr: "पायरी",
    te: "దశ",
  },
  "hero_subtitle": {
    en: "Follow the timeline, take quizzes, practice on the EVM simulator, and earn badges on your journey to becoming an informed voter.",
    hi: "टाइमलाइन का पालन करें, क्विज़ लें, EVM सिम्युलेटर पर अभ्यास करें, और एक सूचित मतदाता बनने की अपनी यात्रा पर बैज अर्जित करें।",
    bn: "টাইমলাইন অনুসরণ করুন, কুইজ নিন, EVM সিমুলেটরে অনুশীলন করুন এবং একজন সচেতন ভোটার হওয়ার আপনার যাত্রায় ব্যাজ অর্জন করুন।",
    mr: "टाइमलाइन पालन करा, क्विज घ्या, EVM सिम्युलेटरवर अभ्यास करा आणि एक माहितीपूर्ण मतदार होण्याच्या तुमच्या यात्रेत बॅज अर्जित करा।",
    te: "టైమ్‌లైన్‌ను అనుసరించండి, క్విజ్‌లను తీసుకోండి, EVM సిమ్యులేటర్‌లో ప్రాక్టీస్ చేయండి మరియు సమాచార ఓటర్ అయ్యే మీ ప్రయాణంలో బ్యాడ్జ్‌లను సంపాదించుకోండి।",
  },
  "chat_greeting": {
    en: "Namaste! 🙏 I'm VoteSmart, your AI guide to the Indian election process. Ask me anything about voter registration, candidates, polling procedures, or election results!",
    hi: "नमस्ते! 🙏 मैं VoteSmart हूँ, भारतीय चुनाव प्रक्रिया के लिए आपकी AI मार्गदर्शक। मुझसे मतदाता पंजीकरण, उम्मीदवार, मतदान प्रक्रियाओं या चुनाव परिणामों के बारे में कुछ भी पूछें!",
    bn: "নমস্কার! 🙏 আমি VoteSmart, ভারতীয় নির্বাচন প্রক্রিয়ার জন্য আপনার AI গাইড। মতদাতা নিবন্ধন, প্রার্থী, ভোটদান পদ্ধতি বা নির্বাচনের ফলাফল সম্পর্কে আমাকে যেকোনো প্রশ্ন জিজ্ঞাসা করুন!",
    mr: "नमस्ते! 🙏 मैं VoteSmart हूँ, भारतीय निवडणूक प्रक्रियेचा आपला AI मार्गदर्शक. मतदार नोंदणी, उमेदवार, मतदान प्रक्रिया किंवा निवडणूक परिणामांबद्दल मुझसे कोणतेही विचारा!",
    te: "నమస్కారం! 🙏 నేను VoteSmart, భారతీయ ఎన్నికల ప్రక్రియకు మీ AI గైడ్. ఓటర్ నమోదు, అభ్యర్థులు, పోలింగ్ విధానాలు లేదా ఎన్నికల ఫలితాల గురించి నన్ను ఏదైనా అడగండి!",
  },
};
