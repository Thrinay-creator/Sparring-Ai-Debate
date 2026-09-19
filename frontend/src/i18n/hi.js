export default {
  // Brand & General
  brand: "स्पारिंग (Sparring)",
  tagline: "महत्वपूर्ण क्षण आने से पहले अपने तर्क को निखारें।",
  subtitle: "एक ऐसी AI विरोधी के साथ अभ्यास करें जो आपकी दलीलों की कमियां और तार्किक त्रुटियां खोजकर आपकी तर्क क्षमता की विस्तृत रिपोर्ट देती है।",
  badge: "AI वाद-विवाद अभ्यास व तर्क सुदृढ़ीकरण",
  vs: "बनाम",
  you: "आप",
  aiOpponent: "स्पारिंग AI",
  round: "दौर (Round)",
  of: "/",

  // Setup Page
  setup: {
    topicLabel: "वाद-विवाद का विषय (Debate Topic)",
    topicHint: "सुझाए गए विषय को चुनें या अपना विषय दर्ज करें",
    topicPlaceholder: "उदा. क्या सोशल मीडिया एल्गोरिदम पर कानूनी नियंत्रण होना चाहिए?",
    curatedPrompts: "सुझाए गए विषय",
    stanceLabel: "आपका पक्ष (Your Stance)",
    stanceHint: "AI विरोधी अपने आप विपरीत पक्ष लेगा",
    forLabel: "पक्ष में (FOR)",
    forDesc: "आप विषय का समर्थन करते हैं। AI विरोधी आपकी दलीलों को चुनौती देगा।",
    againstLabel: "विपक्ष में (AGAINST)",
    againstDesc: "आप विषय का विरोध करते हैं। AI विरोधी पक्ष में दलील देगा।",
    pro: "पक्ष",
    con: "विपक्ष",
    youStance: "आप",
    opponentStance: "स्पारिंग AI",
    difficultyLabel: "विरोधी का स्तर (Difficulty)",
    difficultyHint: "AI प्रतिद्वंद्वी की तर्क कठोरता चुनें",
    enterChamber: "वाद-विवाद कक्ष में प्रवेश करें",
    roundsRule: "अधिकतम 6 दौर। प्रत्येक दौर में आपका तर्क + AI का प्रतिवाद होगा।",
    recentReports: "हालिया वाद-विवाद रिपोर्ट",
    view: "देखें",
    score: "स्कोर"
  },

  // Difficulties
  difficulties: {
    NEWBIE: {
      label: "शुरुआती (Debate Newbie)",
      description: "मित्रवत और उत्साहवर्धक। सरल सवाल पूछते हुए सीधे और सरल प्रतिवाद करता है।",
      tone: "सकारात्मक व सुगम"
    },
    SHARP: {
      label: "कुशाग्र प्रतिद्वंद्वी (Sharp Rival)",
      description: "छिपी हुई मान्यताओं और कमजोर सबूतों को चुनौती देता है तथा सटीक जवाबी उदाहरण पेश करता है।",
      tone: "सख्त व विश्लेषणात्मक"
    },
    RUTHLESS: {
      label: "कठोर वकील (Ruthless Lawyer)",
      description: "अत्यधिक सटीक और तीखा। बिना सबूत के किसी बात को नहीं मानता और विरोधाभासों को तुरंत पकड़ता है।",
      tone: "अविचल व सटीक"
    }
  },

  // Debate Chamber
  debate: {
    chamberActive: "वाद-विवाद कक्ष सक्रिय है",
    chamberActiveDesc: "AI का पक्ष: {stance}। चुनौतियों का सीधा जवाब दें। कुल 6 दौर।",
    openingPrompt: "मैं विपरीत पक्ष ({stance}) का बचाव करूंगा। अपने सर्वोत्तम तर्क और साक्ष्यों के साथ शुरुआत करें।",
    argQuality: "तर्क गुणवत्ता",
    thinking: "स्पारिंग AI आपके तर्क का विश्लेषण कर रहा है...",
    finishingTitle: "छह दौर पूरे हुए",
    finishingDesc: "संपूर्ण चर्चा का निष्पक्ष मूल्यांकन किया जा रहा है... तार्किक मजबूती और साक्ष्यों की जांच हो रही है।",
    stopSpeaking: "आवाज रोकें",
    muteVoice: "AI आवाज म्यूट करें",
    unmuteVoice: "AI आवाज चालू करें",
    themePreferences: "थीम और भाषा प्राथमिकताएं",
    finishDebate: "वाद-विवाद समाप्त करें",
    finishTitle: "क्या चर्चा समय से पहले समाप्त करनी है?",
    finishDesc: "आपने 6 में से केवल {rounds} दौर पूरे किए हैं। पूरे दौर खेलने से AI आपके तर्क कौशल का बेहतर विश्लेषण कर सकेगा।",
    keepSparring: "चर्चा जारी रखें",
    concludeReport: "समाप्त कर रिपोर्ट देखें",
    leaveTitle: "क्या आप इस चर्चा को छोड़ना चाहते हैं?",
    leaveDesc: "आपकी चर्चा अभी जारी है। छोड़ने पर आप होम पेज पर वापस आ जाएंगे।",
    leaveConfirm: "होम पर जाएं",
    inputPlaceholder: "अपना तर्क प्रस्तुत करें... (भेजने के लिए Enter दबाएं, नई पंक्ति के लिए Shift+Enter)",
    inputSpeaking: "AI बोल रहा है...",
    inputThinking: "स्पारिंग AI अपना जवाब तैयार कर रहा है...",
    listeningMsg: "आपकी बात सुनी जा रही है... माइक्रोफ़ोन में स्पष्ट बोलें",
    aiSpeakingMsg: "AI बोल रहा है... (माइक्रोफ़ोन अस्थायी रूप से रोक दिया गया है)",
    minChars: "(न्यूनतम {min} अक्षर)",
    sendArgument: "तर्क भेजें",
    retryTurn: "पुनः प्रयास करें",
    dictateMic: "माइक्रोफ़ोन से बोलकर लिखें",
    stopListening: "सुनना रोकें"
  },

  // Summary Page
  summary: {
    completeBadge: "वाद-विवाद पूर्ण व मूल्यांकित",
    startNew: "नया वाद-विवाद शुरू करें",
    compositeProficiency: "समग्र तर्क क्षमता स्कोर",
    compositeDesc: "तार्किक प्रामाणिकता, साक्ष्य, और प्रतिवाद से निपटने की क्षमता पर आधारित।",
    dimensionalBreakdown: "तर्क का विस्तृत विश्लेषण",
    scale: "पैमाना: 0 – 100",
    logicLabel: "तर्क व सुसंगति (Logic)",
    logicDesc: "दलीलों की तार्किक वैधता और निष्कर्ष की सटीकता।",
    evidenceLabel: "ठोस साक्ष्य (Evidence)",
    evidenceDesc: "तथ्यात्मक प्रमाण बनाम अपुष्ट सामान्यीकरण।",
    persuasivenessLabel: "प्रभावोत्पादकता (Persuasiveness)",
    persuasivenessDesc: "स्पष्टता, शैली और विरोधी दलील को काटने की कुशलता।",
    strengthsTitle: "आपकी मजबूत दलीलें (Strengths)",
    noStrengths: "कोई विशेष मजबूती दर्ज नहीं हुई।",
    weaknessesTitle: "कमजोरियां व तार्किक खामियां (Weaknesses)",
    noWeaknesses: "कोई बड़ी कमजोरी नहीं पाई गई।",
    fallaciesTitle: "तार्किक दोष विश्लेषण (Fallacy Audit)",
    noFallacies: "कोई तार्किक दोष नहीं मिला। आपके तर्क सुसंगत व अनुशासित थे।",
    suggestionsTitle: "सुधार हेतु महत्वपूर्ण सुझाव (Suggestions)",
    noSuggestions: "कोई विशेष सुझाव उपलब्ध नहीं है।",
    reviewTranscript: "संपूर्ण चर्चा का विवरण देखें ({count} संदेश)",
    startAnother: "एक और सत्र शुरू करें"
  },

  // Settings Modal
  settings: {
    title: "प्राथमिकताएं (Preferences)",
    appearance: "दिखावट और थीम (Theme)",
    appearanceDesc: "वाद-विवाद कक्ष का रंग और पृष्ठभूमि चुनें।",
    light: "लाइट (Light)",
    lightDesc: "स्पष्ट, उच्च कंट्रास्ट वाली पृष्ठभूमि",
    dark: "डार्क (Dark)",
    darkDesc: "शांत, गंभीर माहौल वाली डार्क थीम (डिफ़ॉल्ट)",
    system: "सिस्टम (System)",
    systemDesc: "आपकी डिवाइस की थीम के अनुसार अपने आप बदलेगी",
    language: "वाद-विवाद और इंटरफ़ेस की भाषा",
    languageDesc: "ऐप और AI विरोधी के संवाद की भाषा निर्धारित करता है।",
    done: "पूर्ण",
    close: "सेटिंग्स बंद करें"
  },

  // Authentication
  auth: {
    loginTitle: "स्पारिंग में आपका स्वागत है",
    loginSubtitle: "अभ्यास करने और अपने स्कोर देखने के लिए लॉग इन करें।",
    signupTitle: "अपना स्पारिंग खाता बनाएं",
    signupSubtitle: "वाद-विवाद कक्ष में शामिल हों और अपनी तर्कशक्ति निखारें।",
    email: "ईमेल पता",
    emailPlaceholder: "name@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    loginBtn: "लॉग इन करें",
    signupBtn: "खाता बनाएं",
    noAccount: "खाता नहीं है?",
    createAccount: "नया खाता बनाएं",
    hasAccount: "पहले से खाता है?",
    signIn: "साइन इन करें",
    logout: "लॉग आउट",
    continueGuest: "अतिथि (Guest) के रूप में जारी रखें",
    loggedInAs: "लॉग इन उपयोगकर्ता:"
  }
};
