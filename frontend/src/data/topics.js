export const PRESET_TOPICS = [
  "Should social media be banned for under-16s?",
  "Is remote work better than office work?",
  "Should college education be free?",
  "Should AI-generated content be labeled?",
  "Should governments regulate social media algorithms?",
  "Should school uniforms be mandatory?",
  "Should autonomous vehicles replace human drivers?",
  "Should companies adopt a four-day workweek?",
  "Should college attendance be optional for some careers?",
  "Should governments provide universal basic income?"
];

export const MULTILINGUAL_TOPICS = [
  {
    id: "social-media-under-16",
    en: "Should social media be banned for under-16s?",
    te: "16 ఏళ్లలోపు పిల్లలకు సోషల్ మీడియాను నిషేధించాలా?",
    hi: "क्या 16 वर्ष से कम उम्र के बच्चों के लिए सोशल मीडिया प्रतिबंधित होना चाहिए?"
  },
  {
    id: "remote-work-vs-office",
    en: "Is remote work better than office work?",
    te: "ఆఫీస్ పని కంటే రిమోట్ వర్క్ మంచిదా?",
    hi: "क्या ऑफिस के काम से रिमोट वर्क बेहतर है?"
  },
  {
    id: "free-college-education",
    en: "Should college education be free?",
    te: "కళాశాల విద్యను ఉచితంగా అందించాలా?",
    hi: "क्या कॉलेज की शिक्षा पूरी तरह मुफ़्त होनी चाहिए?"
  },
  {
    id: "label-ai-content",
    en: "Should AI-generated content be labeled?",
    te: "AI రూపొందించిన కంటెంట్‌పై స్పష్టమైన లేబుల్ ఉండాలా?",
    hi: "क्या AI द्वारा बनाए गए कंटेंट पर स्पष्ट लेबल होना चाहिए?"
  },
  {
    id: "regulate-algorithms",
    en: "Should governments regulate social media algorithms?",
    te: "ప్రభుత్వాలు సోషల్ మీడియా అల్గారిథమ్‌లను నియంత్రించాలా?",
    hi: "क्या सरकारों को सोशल मीडिया एल्गोरिदम को नियंत्रित करना चाहिए?"
  },
  {
    id: "school-uniforms-mandatory",
    en: "Should school uniforms be mandatory?",
    te: "పాఠశాల యూనిఫారాలు తప్పనిసరిగా ఉండాలా?",
    hi: "क्या स्कूल यूनिफॉर्म अनिवार्य होनी चाहिए?"
  },
  {
    id: "autonomous-vehicles",
    en: "Should autonomous vehicles replace human drivers?",
    te: "మానవ డ్రైవర్ల స్థానంలో డ్రైవర్‌లెస్ వాహనాలు రావాలా?",
    hi: "क्या ऑटोनॉमस (चालक रहित) वाहनों को मानव ड्राइवरों की जगह लेनी चाहिए?"
  },
  {
    id: "four-day-workweek",
    en: "Should companies adopt a four-day workweek?",
    te: "సంస్థలు వారానికి 4 రోజుల పని విధానాన్ని అమలు చేయాలా?",
    hi: "क्या कंपनियों को 4-दिवसीय कार्य सप्ताह लागू करना चाहिए?"
  },
  {
    id: "college-optional-careers",
    en: "Should college attendance be optional for some careers?",
    te: "కొన్ని ఉద్యోగాలకు కళాశాల డిగ్రీని ఐచ్ఛికం చేయాలా?",
    hi: "क्या कुछ करियर के लिए कॉलेज की डिग्री वैकल्पिक होनी चाहिए?"
  },
  {
    id: "universal-basic-income",
    en: "Should governments provide universal basic income?",
    te: "ప్రభుత్వాలు సార్వత్రిక ప్రాథమిక ఆదాయాన్ని (UBI) అందించాలా?",
    hi: "क्या सरकारों को सभी नागरिकों को सार्वभौमिक बुनियादी आय (UBI) देनी चाहिए?"
  }
];

/**
 * Returns localized list of preset topic strings for the given language.
 */
export function getPresetTopicsForLanguage(lang = 'en') {
  return MULTILINGUAL_TOPICS.map(item => item[lang] || item.en);
}

/**
 * Returns the localized text of a topic if it matches a known preset.
 * Preserves user-entered custom text verbatim.
 */
export function getLocalizedTopic(topicText, lang = 'en') {
  if (!topicText) return '';
  const match = MULTILINGUAL_TOPICS.find(
    item => item.en === topicText || item.te === topicText || item.hi === topicText
  );
  if (match) {
    return match[lang] || match.en;
  }
  return topicText;
}

/**
 * Returns canonical English topic for backend processing if matched, or custom topic.
 */
export function getCanonicalTopic(topicText) {
  if (!topicText) return '';
  const match = MULTILINGUAL_TOPICS.find(
    item => item.en === topicText || item.te === topicText || item.hi === topicText
  );
  return match ? match.en : topicText;
}

export const DIFFICULTIES = [
  {
    id: "NEWBIE",
    label: "Debate Newbie",
    description: "Friendly and encouraging. Offers simple, single-issue rebuttals and asks clarifying questions.",
    tone: "Constructive & Accessible"
  },
  {
    id: "SHARP",
    label: "Sharp Rival",
    description: "Challenges hidden assumptions, points out weak evidence, and introduces targeted counterexamples.",
    tone: "Rigorously Analytical"
  },
  {
    id: "RUTHLESS",
    label: "Ruthless Lawyer",
    description: "Surgically precise. Attacks unproven premises, exposes contradictions, and concedes nothing without proof.",
    tone: "Unforgiving & Precise"
  }
];
