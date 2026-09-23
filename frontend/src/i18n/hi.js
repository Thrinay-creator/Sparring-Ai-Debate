export default {
  // Brand & General
  brand: "स्पारिंग",
  tagline: "अहम पलों से पहले अपने तर्कों को तराशें।",
  subtitle: "एक कुशल AI प्रतिद्वंद्वी के विरुद्ध अपने रुख का बचाव करें जो आपके तर्कों की गहराई जांचता है, तार्किक खामियों को पकड़ता है और विश्लेषणात्मक रिपोर्ट देता है।",
  badge: "AI वाद-विवाद अभ्यास व तर्क क्षमता संवर्धक",
  vs: "vs",
  you: "आप",
  aiOpponent: "स्पारिंग AI",
  round: "दौर",
  of: "कुल",

  // Setup Page
  setup: {
    topicLabel: "वाद-विवाद का विषय (Topic)",
    topicHint: "चयनित विषय चुनें या अपना विषय दर्ज करें",
    topicPlaceholder: "उदा. क्या स्कूल यूनिफॉर्म अनिवार्य होनी चाहिए?",
    curatedPrompts: "प्रमुख वाद-विवाद विषय",
    stanceLabel: "आपका पक्ष (Stance)",
    stanceHint: "प्रतिद्वंद्वी का पक्ष अपने आप उलट जाएगा",
    forLabel: "पक्ष में (FOR / Affirmative)",
    forDesc: "आप विषय का समर्थन करते हैं। AI आपके तर्कों को चुनौती देगा।",
    againstLabel: "विपक्ष में (AGAINST / Negative)",
    againstDesc: "आप विषय का विरोध करते हैं। AI पक्ष में तर्क प्रस्तुत करेगा।",
    for: "पक्ष (FOR)",
    against: "विपक्ष (AGAINST)",
    pro: "पक्ष",
    con: "विपक्ष",
    youStance: "आप",
    opponentStance: "स्पारिंग AI",
    difficultyLabel: "प्रतिद्वंद्वी का स्तर (Difficulty)",
    difficultyHint: "कठिनाई और तर्क शैली चुनें",
    enterChamber: "वाद-विवाद कक्ष में प्रवेश करें",
    roundsRule: "अधिकतम 6 दौर। प्रति दौर 1 आपका तर्क + 1 AI का प्रतिवाद।",
    recentReports: "हालिया वाद-विवाद रिपोर्ट",
    history: "इतिहास",
    guest: "अतिथि",
    view: "देखें",
    score: "स्कोर"
  },

  // Difficulties
  difficulties: {
    NEWBIE: {
      label: "शुरुआती (Newbie)",
      description: "सहानुभूतिपूर्ण और सरल। आसान तर्क और स्पष्टीकरण संबंधी प्रश्न पूछता है।",
      tone: "रचनात्मक एवं सुलभ"
    },
    SHARP: {
      label: "तेज प्रतिद्वंद्वी (Sharp Rival)",
      description: "छुपी मान्यताओं को चुनौती देता है, कमजोर साक्ष्यों पर सवाल उठाता है और उदाहरण देता है।",
      tone: "गंभीर तार्किक विश्लेषण"
    },
    RUTHLESS: {
      label: "सख्त वकील (Ruthless Lawyer)",
      description: "अत्यंत सटीक और निर्दयी। अप्रमाणित दावों पर तीखा वार करता है और बिना ठोस प्रमाण के कुछ नहीं मानता।",
      tone: "कड़ा एवं अत्यंत सटीक"
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
    processingSpeech: "आवाज संसाधित हो रही है...",
    aiSpeakingMsg: "AI बोल रहा है... (माइक्रोफ़ोन अस्थायी रूप से रोक दिया गया है)",
    minChars: "(न्यूनतम {min} अक्षर)",
    chars: "अक्षर",
    sendArgument: "तर्क भेजें",
    retryTurn: "पुनः प्रयास करें",
    dictateMic: "माइक्रोफ़ोन से बोलकर लिखें",
    dictateMicAria: "माइक्रोफ़ोन से बोलकर तर्क दें",
    stopListening: "सुनना रोकें",
    returnHome: "होम पर वापस जाएं",
    stopSpeechAudio: "AI आवाज रोकें",
    concludeTooltip: "वाद-विवाद समाप्त कर रिपोर्ट प्राप्त करें",
    concludeDisabledTooltip: "शुरुआती तर्क प्रस्तुत करने के बाद उपलब्ध"
  },

  // Voice & Speech
  voice: {
    notSupported: "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। आप लिखकर जारी रख सकते हैं।",
    permissionDenied: "माइक्रोफ़ोन की अनुमति अस्वीकृत की गई। ब्राउज़र सेटिंग्स जांचें।",
    langNotSupported: "{lang} ({locale}) भाषा में वाक् पहचान इस ब्राउज़र पर उपलब्ध नहीं है।",
    voiceUnavailable: "इस डिवाइस पर {lang} ब्राउज़र आवाज उपलब्ध नहीं है। ऑडियो म्यूट रहेगा, किंतु टेक्स्ट चर्चा सामान्य रूप से जारी रहेगी।",
    genericError: "वॉयस पहचान सूचना: {error}"
  },

  // Summary Page
  summary: {
    completeBadge: "वाद-विवाद पूर्ण व मूल्यांकित",
    startNew: "नया वाद-विवाद शुरू करें",
    compositeProficiency: "समग्र तर्क क्षमता स्कोर",
    compositeDesc: "तार्किक प्रामाणिकता, साक्ष्य, और प्रतिवाद से निपटने की क्षमता पर आधारित।",
    dimensionalBreakdown: "विस्तृत प्रदर्शन विश्लेषण",
    scale: "पैमाना: 0 – 100",
    logicLabel: "तर्क व संरचनात्मक दृढ़ता",
    logicDesc: "तर्कसंगत दावे और तार्किक दोषों से बचाव।",
    evidenceLabel: "ठोस साक्ष्य और स्पष्टता",
    evidenceDesc: "हवा-हवाई बातों के बजाय प्रामाणिक साक्ष्य।",
    persuasivenessLabel: "प्रभावशाली प्रस्तुति व संवाद",
    persuasivenessDesc: "प्रतिवादों का सामना करने की क्षमता और स्पष्टता।",
    strengthsTitle: "आपकी खूबियां",
    noStrengths: "कोई विशेष खूबी दर्ज नहीं हुई।",
    weaknessesTitle: "कमजोरियां व तार्किक खामियां",
    noWeaknesses: "कोई बड़ी कमजोरी नहीं पाई गई।",
    fallaciesTitle: "तार्किक दोष विश्लेषण (Fallacy Audit)",
    noFallacies: "कोई तार्किक दोष नहीं मिला। आपके तर्क सुसंगत रहे।",
    suggestionsTitle: "सुधार के लिए ठोस सुझाव",
    noSuggestions: "कोई सुझाव उपलब्ध नहीं है।",
    reviewTranscript: "पूरी चर्चा की समीक्षा करें ({count} दौर)",
    startAnother: "एक और नया वाद-विवाद शुरू करें",
    guestPrompt: "अपनी चर्चाओं का इतिहास सुरक्षित रखने के लिए खाता बनाएं।",
    createAccountBtn: "खाता बनाएं",
    continueGuestBtn: "अतिथि के रूप में जारी रखें"
  },

  // Settings Modal
  settings: {
    title: "प्राथमिकताएं (Preferences)",
    appearance: "प्रस्तुति एवं थीम",
    appearanceDesc: "वाद-विवाद कक्ष की दिखावट अनुकूलित करें।",
    light: "लाइट (Light)",
    lightDesc: "स्पष्ट और उच्च कंट्रास्ट स्वरूप",
    dark: "डार्क (Dark)",
    darkDesc: "आंखों के लिए शांत डार्क परिवेश (डिफ़ॉल्ट)",
    system: "सिस्टम (System)",
    systemDesc: "डिवाइस की प्राथमिकता के अनुसार स्वचालित",
    language: "वाद-विवाद और इंटरफ़ेस की भाषा",
    languageDesc: "UI और AI प्रतिद्वंद्वी की भाषा निर्धारित करता है।",
    done: "संपन्न",
    close: "सेटिंग्स बंद करें"
  },

  // Authentication
  auth: {
    loginTitle: "स्पारिंग में स्वागत है",
    loginSubtitle: "अभ्यास करने और अपनी प्रगति देखने के लिए लॉग इन करें।",
    signupTitle: "अपना स्पारिंग खाता बनाएं",
    signupSubtitle: "वाद-विवाद कक्ष में शामिल हों और अपनी तर्कशक्ति निखारें।",
    email: "ईमेल पता",
    emailPlaceholder: "",
    password: "पासवर्ड",
    passwordPlaceholder: "",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    loginBtn: "लॉग इन करें",
    signupBtn: "खाता बनाएं",
    noAccount: "खाता नहीं है?",
    createAccount: "खाता बनाएं",
    hasAccount: "पहले से खाता है?",
    signIn: "लॉग इन करें",
    logout: "लॉग आउट",
    guest: "अतिथि",
    continueGuest: "अतिथि के रूप में जारी रखें",
    loggedInAs: "लॉग इन किया हुआ खाता:"
  }
};
