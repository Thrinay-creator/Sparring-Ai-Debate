export default {
  // Brand & General
  brand: "స్పారింగ్ (Sparring)",
  tagline: "ముఖ్యమైన సందర్భం రాకముందే మీ వాదనను పరిపూర్ణం చేసుకోండి.",
  subtitle: "మీ వాదనలోని లోపాలు, తార్కిక దోషాలను పసిగట్టి మీ వాదనా పటిమపై విశ్లేషణాత్మక నివేదికను అందించే AI ప్రత్యర్థితో వాదించండి.",
  badge: "AI వాదన అభ్యాసం & తార్కిక బలవర్ధకం",
  vs: "vs",
  you: "మీరు",
  aiOpponent: "స్పారింగ్ AI",
  round: "రౌండ్",
  of: "/",

  // Setup Page
  setup: {
    topicLabel: "చర్చాంశం (Debate Topic)",
    topicHint: "సిఫార్సు చేసిన అంశాన్ని ఎంచుకోండి లేదా మీ స్వంత అంశాన్ని నమోదు చేయండి",
    topicPlaceholder: "ఉదా: సామాజిక మాధ్యమాల అల్గారిథమ్‌లను ప్రభుత్వం నియంత్రించాలా?",
    curatedPrompts: "సిఫార్సు చేయబడిన చర్చాంశాలు",
    stanceLabel: "మీ వైఖరి (Your Stance)",
    stanceHint: "AI ప్రత్యర్థి వ్యతిరేక వైఖరిని తీసుకుంటుంది",
    forLabel: "అనుకూలం (FOR)",
    forDesc: "మీరు ఈ అంశాన్ని సమర్థిస్తారు. AI ప్రత్యర్థి మీ వాదనలను సవాలు చేస్తుంది.",
    againstLabel: "వ్యతిరేకం (AGAINST)",
    againstDesc: "మీరు ఈ అంశాన్ని తిరస్కరిస్తారు. AI ప్రత్యర్థి అనుకూలంగా వాదిస్తుంది.",
    pro: "అనుకూలం",
    con: "వ్యతిరేకం",
    youStance: "మీరు",
    opponentStance: "స్పారింగ్ AI",
    difficultyLabel: "ప్రత్యర్థి స్థాయి (Opponent Difficulty)",
    difficultyHint: "AI ప్రత్యర్థి వాదనా తీవ్రతను ఎంచుకోండి",
    enterChamber: "చర్చా వేదికలోకి ప్రవేశించండి",
    roundsRule: "గరిష్టంగా 6 రౌండ్లు. ప్రతి రౌండ్‌లో మీ వాదన + AI ప్రత్యుత్తరం ఉంటాయి.",
    recentReports: "ఇటీవలి చర్చా నివేదికలు",
    view: "చూడండి",
    score: "స్కోరు"
  },

  // Difficulties
  difficulties: {
    NEWBIE: {
      label: "ప్రారంభ స్థాయి (Debate Newbie)",
      description: "స్నేహపూర్వక మరియు ప్రోత్సాహకరమైన శైలి. సాధారణ ప్రశ్నలతో సులువైన ప్రతివాదన చేస్తుంది.",
      tone: "రచనాత్మకం & సులభగ్రాహ్యం"
    },
    SHARP: {
      label: "నిశిత ప్రత్యర్థి (Sharp Rival)",
      description: "నిరూపితం కాని ఊహలను సవాలు చేస్తుంది, బలహీనమైన ఆధారాలను ఎత్తిచూపుతూ గట్టి ప్రతివాదన చేస్తుంది.",
      tone: "విశ్లేషణాత్మకం & దృఢమైనది"
    },
    RUTHLESS: {
      label: "కఠిన న్యాయవాది (Ruthless Lawyer)",
      description: "చాలా నిక్కచ్చిగా ఉంటుంది. చిన్న వైరుధ్యాలను కూడా వదలకుండా నిరూపణ లేని వాదనలపై నిర్దాక్షిణ్యంగా దాడి చేస్తుంది.",
      tone: "ఖచ్చితమైనది & అలుపెరగనిది"
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
    aiSpeakingMsg: "AI మాట్లాడుతోంది... (మైక్రోఫోన్ తాత్కాలికంగా ఆపబడింది)",
    minChars: "(కనీసం {min} అక్షరాలు)",
    sendArgument: "వాదన పంపండి",
    retryTurn: "మళ్ళీ ప్రయత్నించండి",
    dictateMic: "మైక్రోఫోన్ ద్వారా మాట్లాడండి",
    stopListening: "వినడం ఆపండి"
  },

  // Summary Page
  summary: {
    completeBadge: "చర్చ విజయవంతంగా పూర్తయింది",
    startNew: "కొత్త చర్చ ప్రారంభించండి",
    compositeProficiency: "సమగ్ర వాదనా ప్రావీణ్యత",
    compositeDesc: "తార్కిక దృఢత్వం, సాక్ష్యాధారాలు, ప్రతివాదనలను ఎదుర్కొనే నైపుణ్యం ఆధారంగా లెక్కించబడింది.",
    dimensionalBreakdown: "వాదన విశ్లేషణ పట్టిక",
    scale: "స్కేలు: 0 – 100",
    logicLabel: "తర్కం & స్థిరత్వం (Logic)",
    logicDesc: "వాదనలోని సహేతుకత మరియు తార్కిక అనుసంధానం.",
    evidenceLabel: "ఆధారాలు & నిరూపణ (Evidence)",
    evidenceDesc: "ఊహలకు కాకుండా వాస్తవిక ఆధారాలకు ఇచ్చిన ప్రాధాన్యత.",
    persuasivenessLabel: "ఒప్పించే శక్తి (Persuasiveness)",
    persuasivenessDesc: "స్పష్టత, శైలి మరియు ప్రతివాదనలను తిప్పికొట్టే నేర్పు.",
    strengthsTitle: "మీ బలమైన అంశాలు (Strengths)",
    noStrengths: "ప్రత్యేకమైన బలాలు నమోదు కాలేదు.",
    weaknessesTitle: "బలహీనతలు & లోపాలు (Weaknesses)",
    noWeaknesses: "ఎటువంటి ప్రధాన లోపాలు గుర్తించబడలేదు.",
    fallaciesTitle: "తార్కిక దోషాల తనిఖీ (Fallacies Audit)",
    noFallacies: "ఎటువంటి తార్కిక దోషాలు దొర్లలేదు. మీ వాదన క్రమశిక్షణతో కూడి ఉంది.",
    suggestionsTitle: "మెరుగుపరుచుకోవడానికి సూచనలు (Suggestions)",
    noSuggestions: "ప్రత్యేక సూచనలు అందుబాటులో లేవు.",
    reviewTranscript: "పూర్తి చర్చా వివరాలను పరిశీలించండి ({count} సందేశాలు)",
    startAnother: "మరొక చర్చను ప్రారంభించండి"
  },

  // Settings Modal
  settings: {
    title: "ప్రాధాన్యతలు (Preferences)",
    appearance: "రూపురేఖలు & థీమ్ (Theme)",
    appearanceDesc: "చర్చా వేదిక రంగులు మరియు నేపథ్యాన్ని ఎంచుకోండి.",
    light: "లైట్ (Light)",
    lightDesc: "స్వచ్ఛమైన, స్పష్టమైన పేపర్ థీమ్",
    dark: "డార్క్ (Dark)",
    darkDesc: "గంభీరమైన చీకటి చర్చా వేదిక (డిఫాల్ట్)",
    system: "సిస్టమ్ (System)",
    systemDesc: "మీ పరికరపు సెట్టింగ్‌లకు అనుగుణంగా మారుతుంది",
    language: "చర్చ & ఇంటర్‌ఫేస్ భాష (Language)",
    languageDesc: "యాప్ మరియు AI ప్రత్యర్థి వాదించే భాషను నిర్ణయిస్తుంది.",
    done: "పూర్తయింది",
    close: "సెట్టింగ్‌లు మూసివేయండి"
  },

  // Authentication
  auth: {
    loginTitle: "స్పారింగ్‌కు స్వాగతం",
    loginSubtitle: "మీ వాదనా నైపుణ్యాన్ని సాధన చేయడానికి లాగిన్ అవ్వండి.",
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
    createAccount: "ఖాతా తెరవండి",
    hasAccount: "ఇప్పటికే ఖాతా ఉందా?",
    signIn: "సైన్ ఇన్ అవ్వండి",
    logout: "లాగ్ అవుట్",
    continueGuest: "గెస్ట్‌గా కొనసాగండి",
    loggedInAs: "లాగిన్ అయిన యూజర్:"
  }
};
