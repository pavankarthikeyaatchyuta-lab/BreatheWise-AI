/**
 * Multilingual Translations Dictionary
 * Supports English (en), Telugu (te), and Hindi (hi)
 * Consistent scientific symbols (PM2.5, AQI, µg/m³) and numbers
 */

export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface Translations {
  // Navigation
  navDashboard: string;
  navPlanner: string;
  navIndoorCoach: string;
  navAlternatives: string;
  navImpact: string;
  navCommunity: string;
  navAssistant: string;

  // Header & Controls
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  headerSubtitle: string;
  evaluatorDemoTitle: string;
  evaluatorScenarioStandard: string;
  evaluatorScenarioCommuter: string;
  evaluatorScenarioChild: string;
  evaluatorScenarioSenior: string;
  resetDefault: string;
  activeScenarioPill: string;
  demoDataBadge: string;
  officialMeasuredBadge: string;

  // Common UI
  currentAqi: string;
  dominantPollutant: string;
  todayRecommendations: string;
  diurnalForecast: string;
  viewDetails: string;
  scientificDisclaimer: string;
  languageNotice: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    navDashboard: 'Dashboard',
    navPlanner: 'Daily Planner',
    navIndoorCoach: 'Indoor Coach',
    navAlternatives: 'Alternatives',
    navImpact: 'Impact Intelligence',
    navCommunity: 'Community Hub',
    navAssistant: 'AI Assistant',

    greetingMorning: 'Good Morning',
    greetingAfternoon: 'Good Afternoon',
    greetingEvening: 'Good Evening',
    headerSubtitle: "Here's your air quality, forecast and personalized guidance for today.",
    evaluatorDemoTitle: 'Evaluator Demo Scenarios',
    evaluatorScenarioStandard: 'Standard Family (Default)',
    evaluatorScenarioCommuter: '1. Working Commuter',
    evaluatorScenarioChild: '2. Family with School Child',
    evaluatorScenarioSenior: '3. Senior Citizen Household',
    resetDefault: 'Reset to Default',
    activeScenarioPill: 'Active Scenario',
    demoDataBadge: 'DEMO DATA',
    officialMeasuredBadge: 'CPCB NAQI Method',

    currentAqi: 'Current Air Quality (NAQI)',
    dominantPollutant: 'Dominant Pollutant',
    todayRecommendations: "Today's Recommendations",
    diurnalForecast: '24-Hour Diurnal Forecast',
    viewDetails: 'View Calculation Proof',
    scientificDisclaimer: 'Evidence-based environmental guidance. Does not replace clinical healthcare advice.',
    languageNotice: 'Note: Full navigation and AI assistant are localized; technical equations and impact formulas are presented in standard SI scientific notation.',
  },
  te: {
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navPlanner: 'రోజువారీ ప్రణాళిక',
    navIndoorCoach: 'ఇంటి గాలి కోచ్',
    navAlternatives: 'ప్రయాణ ప్రత్యామ్నాయాలు',
    navImpact: 'ప్రభావ విశ్లేషణ',
    navCommunity: 'కమ్యూనిటీ వేదిక',
    navAssistant: 'AI సహాయకుడు',

    greetingMorning: 'శుభోదయం',
    greetingAfternoon: 'శుభ మధ్యాహ్నం',
    greetingEvening: 'శుభ సాయంత్రం',
    headerSubtitle: 'నేటి వాయు నాణ్యత, అంచనాలు మరియు మీ కుటుంబానికి తగిన సలహాలు ఇక్కడ ఉన్నాయి.',
    evaluatorDemoTitle: 'మూల్యాంకన డెమో దృశ్యాలు',
    evaluatorScenarioStandard: 'ప్రామాణిక కుటుంబం (డిఫాల్ట్)',
    evaluatorScenarioCommuter: '1. రోజువారీ ఉద్యోగి & ప్రయాణికుడు',
    evaluatorScenarioChild: '2. పాఠశాల విద్యార్థి కుటుంబం (నో ప్యూరిఫైయర్)',
    evaluatorScenarioSenior: '3. సీనియర్ సిటిజన్లు & సున్నిత గృహం',
    resetDefault: 'డిఫాల్ట్‌కు రీసెట్ చేయండి',
    activeScenarioPill: 'ప్రస్తుత దృశ్యం',
    demoDataBadge: 'డెమో రికార్డు',
    officialMeasuredBadge: 'CPCB NAQI పద్ధతి',

    currentAqi: 'ప్రస్తుత వాయు నాణ్యత (NAQI)',
    dominantPollutant: 'ప్రధాన కాలుష్య కారకం',
    todayRecommendations: 'నేటి ముఖ్య సలహాలు',
    diurnalForecast: '24 గంటల పగటి-రాత్రి అంచనా',
    viewDetails: 'లెక్కింపు రుజువు చూడండి',
    scientificDisclaimer: 'శాస్త్రీయ ఆధారిత పర్యావరణ మార్గదర్శనం. ఇది క్లినికల్ వైద్య సలహా కాదు.',
    languageNotice: 'గమనిక: ప్రాథమిక నావిగేషన్ మరియు AI సహాయకుడు తెలుగులో అందుబాటులో ఉన్నాయి; వివరణాత్మక ఇంపాక్ట్ సూత్రాలు ఆంగ్లంలో ప్రదర్శించబడతాయి.',
  },
  hi: {
    navDashboard: 'डैशबोर्ड',
    navPlanner: 'दैनिक दिनचर्या प्लानर',
    navIndoorCoach: 'इनडोर एयर कोच',
    navAlternatives: 'सस्टेनेबल विकल्प',
    navImpact: 'इम्पैक्ट विश्लेषण',
    navCommunity: 'कम्युनिटी हब',
    navAssistant: 'AI सहायक',

    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    headerSubtitle: 'आज की वायु गुणवत्ता, 24 घंटे का पूर्वानुमान और व्यक्तिगत मार्गदर्शन।',
    evaluatorDemoTitle: 'मूल्यांकनकर्ता डेमो परिदृश्य',
    evaluatorScenarioStandard: 'मानक परिवार (डिफ़ॉल्ट)',
    evaluatorScenarioCommuter: '1. कामकाजी पेशेवर और दैनिक यात्री',
    evaluatorScenarioChild: '2. स्कूली बच्चे वाला परिवार (नो प्यूरीफायर)',
    evaluatorScenarioSenior: '3. वरिष्ठ नागरिक और संवेदनशील परिवार',
    resetDefault: 'डिफ़ॉल्ट पर रीसेट करें',
    activeScenarioPill: 'सक्रिय परिदृश्य',
    demoDataBadge: 'डेमो रिकॉर्ड',
    officialMeasuredBadge: 'CPCB NAQI मानक',

    currentAqi: 'वर्तमान वायु गुणवत्ता (NAQI)',
    dominantPollutant: 'प्रमुख प्रदूषक',
    todayRecommendations: 'आज की प्रमुख सिफारिशें',
    diurnalForecast: '24 घंटे का डायूरनल पूर्वानुमान',
    viewDetails: 'गणना प्रमाण देखें',
    scientificDisclaimer: 'वैज्ञानिक रूप से प्रमाणित पर्यावरणीय मार्गदर्शन। यह नैदानिक चिकित्सा सलाह नहीं है।',
    languageNotice: 'सूचना: प्राथमिक नेविगेशन और AI सहायक हिंदी में उपलब्ध हैं; विस्तृत तकनीकी व प्रभाव गणनाएं अंग्रेजी में हैं।',
  },
};
