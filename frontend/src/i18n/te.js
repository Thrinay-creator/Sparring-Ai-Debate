export default {
  // Brand & General
  brand: "స్పారింగ్",
  tagline: "కీలకమైన సమయానికి ముందే మీ వాదనను పదునుపెట్టుకోండి.",
  subtitle: "మీ తార్కిక ఆలోచనను పరిశీలించే, తర్క లోపాలను గుర్తించే మరియు మీ వాదన బలాన్ని విశ్లేషించే ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ ప్రత్యర్థితో పోటీపడండి.",
  badge: "AI వాదనా సాధన & తార్కిక శిక్షణ",
  vs: "vs",
  you: "మీరు",
  aiOpponent: "స్పారింగ్ AI",
  round: "రౌండ్",
  of: "మొత్తం",

  // Setup Page
  setup: {
    topicLabel: "చర్చాంశం (Topic)",
    topicHint: "సిద్ధంగా ఉన్న అంశాన్ని ఎంచుకోండి లేదా మీ స్వంత అంశాన్ని రాయండి",
    topicPlaceholder: "ఉదాహరణ: పాఠశాల యూనిఫారాలు తప్పనిసరిగా ఉండాలా?",
    curatedPrompts: "ఎంపిక చేసిన చర్చాంశాలు",
    stanceLabel: "మీ వైఖరి (Stance)",
    stanceHint: "ప్రత్యర్థి వైఖరి స్వయంచాలకంగా మారుతుంది",
    forLabel: "అనుకూలం (FOR / Affirmative)",
    forDesc: "మీరు అంశానికి మద్దతు ఇస్తారు. AI మీ వాదనలను సవాలు చేస్తుంది.",
    againstLabel: "వ్యతిరేకం (AGAINST / Negative)",
    againstDesc: "మీరు అంశాన్ని వ్యతిరేకిస్తారు. AI అనుకూల పక్షాన వాదిస్తుంది.",
    for: "అనుకూలం",
    against: "వ్యతిరేకం",
    pro: "అనుకూల",
    con: "వ్యతిరేక",
    youStance: "మీరు",
    opponentStance: "స్పారింగ్ AI",
    difficultyLabel: "ప్రత్యర్థి స్థాయి (Difficulty)",
    difficultyHint: "ఎదుర్కొనే స్థాయి మరియు తీరును ఎంచుకోండి",
    enterChamber: "చర్చా వేదికలోకి ప్రవేశించండి",
    roundsRule: "గరిష్టంగా 6 రౌండ్లు. ప్రతి రౌండ్‌లో మీ వాదన + AI ప్రతిస్పందన ఉంటాయి.",
    recentReports: "ఇటీవలి చర్చా నివేదికలు",
    history: "చరిత్ర",
    guest: "అతిథి",
    view: "చూడండి",
    score: "స్కోరు"
  },

  // Difficulties
  difficulties: {
    NEWBIE: {
      label: "బిగినర్ (Newbie)",
      description: "సానుకూలమైన వైఖరి. సాధారణ ప్రతివాదనలు మరియు స్పష్టత కోరే ప్రశ్నలు అడుగుతుంది.",
      tone: "నిర్మాణాత్మకమైన & సులభమైన"
    },
    SHARP: {
      label: "తీక్షణ ప్రత్యర్థి (Sharp Rival)",
      description: "మీ ఊహలను ప్రశ్నిస్తుంది, బలహీన ఆధారాలను ఎత్తిచూపుతుంది, ఉదాహరణలతో సవాలు చేస్తుంది.",
      tone: "లోతైన తార్కిక విశ్లేషణ"
    },
    RUTHLESS: {
      label: "కఠిన న్యాయవాది (Ruthless Lawyer)",
      description: "అత్యంత ఖచ్చితమైన విమర్శ. నిరూపించని అంశాలను తీవ్రంగా వ్యతిరేకిస్తుంది, లోపాలను ఒప్పుకోదు.",
      tone: "కఠినమైన & అత్యంత ఖచ్చితమైన"
    }
  },

  // Debate Chamber
  debate: {
    chamberActive: "చర్చా వేదిక చురుకుగా ఉంది",
    chamberActiveDesc: "AI వైఖరి: {stance}. సవాళ్లకు నేరుగా బదులివ్వండి. మొత్తం 6 రౌండ్లు.",
    openingPrompt: "నేను వ్యతిరేక వైఖరిని ({stance}) సమర్థిస్తున్నాను. మీ ప్రారంభ వాదనను బలమైన ఆధారాలతో ప్రారంభించండి.",
    argQuality: "వాదన నాణ్యత",
    thinking: "స్పారింగ్ AI మీ తర్కాన్ని విశ్లేషిస్తోంది...",
    finishingTitle: "ఆరు రౌండ్లు పూర్తయ్యాయి",
    finishingDesc: "పూర్తి చర్చను న్యాయనిర్ణయం చేస్తోంది... తార్కిక స్థిరత్వం, ఆధారాలు మరియు లోపాలను లెక్కిస్తోంది.",
    stopSpeaking: "వాయిస్ ఆపండి",
    muteVoice: "AI వాయిస్ మ్యూట్ చేయండి",
    unmuteVoice: "AI వాయిస్ ఆన్ చేయండి",
    themePreferences: "థీమ్ & భాష సెట్టింగ్‌లు",
    finishDebate: "చర్చను ముగించండి",
    finishTitle: "చర్చను ముందే ముగిస్తారా?",
    finishDesc: "మీరు 6 రౌండ్లలో {rounds} రౌండ్లు మాత్రమే పూర్తి చేశారు. మరిన్ని రౌండ్లు ఆడితే మరింత సమగ్రమైన నివేదిక లభిస్తుంది.",
    keepSparring: "వాదన కొనసాగించండి",
    concludeReport: "ముగించి నివేదిక చూడండి",
    leaveTitle: "ఈ చర్చ నుండి నిష్క్రమించాలా?",
    leaveDesc: "మీ చర్చ ఇంకా కొనసాగుతోంది. నిష్క్రమిస్తే ప్రస్తుత సెషన్ ముగిసి హోమ్ పేజీకి చేరుకుంటారు.",
    leaveConfirm: "హోమ్‌కు వెళ్ళండి",
    inputPlaceholder: "మీ వాదనను రాయండి... (సమర్పించడానికి Enter, కొత్త లైన్ కోసం Shift+Enter)",
    inputSpeaking: "AI సమాధానం చెబుతోంది...",
    inputThinking: "స్పారింగ్ AI ప్రతివాదనను సిద్ధం చేస్తోంది...",
    listeningMsg: "మీ వాదన వింటోంది... మైక్రోఫోన్‌లో స్పష్టంగా మాట్లాడండి",
    processingSpeech: "మాటలను విశ్లేషిస్తోంది...",
    aiSpeakingMsg: "AI మాట్లాడుతోంది... (మైక్రోఫోన్ తాత్కాలికంగా ఆపబడింది)",
    minChars: "(కనీసం {min} అక్షరాలు)",
    chars: "అక్షరాలు",
    sendArgument: "వాదన పంపండి",
    retryTurn: "మళ్ళీ ప్రయత్నించండి",
    dictateMic: "మైక్రోఫోన్ ద్వారా మాట్లాడండి",
    dictateMicAria: "మైక్రోఫోన్ ద్వారా వాదన చెప్పండి",
    stopListening: "వినడం ఆపండి",
    returnHome: "హోమ్ పేజీకి వెళ్లండి",
    stopSpeechAudio: "AI ఆడియోను ఆపండి",
    concludeTooltip: "చర్చను ముగించి నివేదిక పొందండి",
    concludeDisabledTooltip: "ప్రారంభ వాదన సమర్పించిన తర్వాత అందుబాటులో ఉంటుంది"
  },

  // Voice & Speech
  voice: {
    notSupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. మీరు టైప్ చేసి కొనసాగించవచ్చు.",
    permissionDenied: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్‌లను తనిఖీ చేయండి.",
    langNotSupported: "{lang} ({locale}) భాషలో స్పీచ్ రికగ్నిషన్ ఈ బ్రౌజర్‌లో అందుబాటులో లేదు.",
    voiceUnavailable: "ఈ పరికరంలో {lang} బ్రౌజర్ వాయిస్ అందుబాటులో లేదు. ఆడియో మ్యూట్ చేయబడింది, కానీ టెక్స్ట్ చర్చ కొనసాగుతుంది.",
    genericError: "వాయిస్ రికగ్నిషన్ గమనిక: {error}"
  },

  // Summary Page
  summary: {
    completeBadge: "చర్చ విజయవంతంగా పూర్తయింది",
    startNew: "కొత్త చర్చ ప్రారంభించండి",
    compositeProficiency: "సమగ్ర వాదనా ప్రావీణ్యత",
    compositeDesc: "తార్కిక దృఢత్వం, సాక్ష్యాధారాలు, ప్రతివాదనలను ఎదుర్కొనే నైపుణ్యం ఆధారంగా లెక్కించబడింది.",
    dimensionalBreakdown: "వివిధ విభాగాల్లో ప్రదర్శన",
    scale: "కొలమానం: 0 – 100",
    logicLabel: "తర్కం & నిర్మాణం",
    logicDesc: "కారణాలు మరియు తర్క దోషాలు లేకుండా మాట్లాడటం.",
    evidenceLabel: "వాస్తవ ఆధారాలు & స్పష్టత",
    evidenceDesc: "ఊహాగానాలు కాకుండా సరైన ఆధారాలను చూపడం.",
    persuasivenessLabel: "ఆకర్షణీయమైన శైలి & ప్రభావం",
    persuasivenessDesc: "స్పష్టత మరియు ప్రత్యర్థి వాదనను ఎదుర్కొనే తీరు.",
    strengthsTitle: "మీ బలాలు",
    noStrengths: "ప్రత్యేక బలాలు నమోదు కాలేదు.",
    weaknessesTitle: "బలహీనతలు & తర్క లోపాలు",
    noWeaknesses: "ఎటువంటి పెద్ద లోపాలు కనిపించలేదు.",
    fallaciesTitle: "తర్క దోషాల విశ్లేషణ (Fallacy Audit)",
    noFallacies: "ఎలాంటి తర్క దోషాలు లేవు. మీ వాదన పద్ధతిగా సాగింది.",
    suggestionsTitle: "మెరుగుపరుచుకోవడానికి సూచనలు",
    noSuggestions: "సూచనలు ఏమీ లేవు.",
    reviewTranscript: "పూర్తి చర్చను సమీక్షించండి ({count} రౌండ్లు)",
    startAnother: "మరో చర్చను ప్రారంభించండి",
    guestPrompt: "మీ చర్చా చరిత్రను నిల్వ చేయడానికి ఖాతాను సృష్టించుకోండి.",
    createAccountBtn: "ఖాతా సృష్టించండి",
    continueGuestBtn: "అతిథిగా కొనసాగండి"
  },

  // Settings Modal
  settings: {
    title: "ప్రాధాన్యతలు (Preferences)",
    appearance: "రూపురేఖలు & థీమ్",
    appearanceDesc: "చర్చా వేదిక ప్రదర్శనను మార్చుకోండి.",
    light: "లైట్ (Light)",
    lightDesc: "స్పష్టమైన, కాంతివంతమైన రూపం",
    dark: "డార్క్ (Dark)",
    darkDesc: "కంటికి ఇంపుగా ఉండే నలుపు రూపం (డిఫాల్ట్)",
    system: "సిస్టమ్ (System)",
    systemDesc: "మీ పరికర సెట్టింగ్‌లకు అనుగుణంగా మారుతుంది",
    language: "చర్చ & ఇంటర్‌ఫేస్ భాష (Language)",
    languageDesc: "UI మరియు AI ప్రత్యర్థి వాదించే భాషను నిర్ణయిస్తుంది.",
    done: "పూర్తయింది",
    close: "సెట్టింగ్‌లను మూసివేయండి"
  },

  // Authentication
  auth: {
    loginTitle: "స్పారింగ్‌కు స్వాగతం",
    loginSubtitle: "వాదన సాధన చేయడానికి మరియు మీ నైపుణ్యాన్ని ట్రాక్ చేయడానికి లాగిన్ అవ్వండి.",
    signupTitle: "ఖాతాను సృష్టించుకోండి",
    signupSubtitle: "చర్చా వేదికలో చేరి మీ వాగ్ధాటిని పదునుపెట్టుకోండి.",
    email: "ఈమెయిల్ చిరునామా",
    emailPlaceholder: "",
    password: "పాస్‌వర్డ్",
    passwordPlaceholder: "",
    confirmPassword: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
    loginBtn: "లాగిన్ (Login)",
    signupBtn: "ఖాతా సృష్టించండి",
    noAccount: "ఖాతా లేదా?",
    createAccount: "ఖాతా సృష్టించండి",
    hasAccount: "ఇప్పటికే ఖాతా ఉందా?",
    signIn: "లాగిన్ అవ్వండి",
    logout: "లాగౌట్",
    guest: "అతిథి",
    continueGuest: "అతిథిగా కొనసాగండి",
    loggedInAs: "లాగిన్ అయిన ఖాతా:"
  }
};
