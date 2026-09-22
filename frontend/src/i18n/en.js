export default {
  // Brand & General
  brand: "Sparring",
  tagline: "Practice the argument before the moment that matters.",
  subtitle: "Defend your position against an AI adversary that probes your reasoning, identifies logical fallacies, and delivers a diagnostic report on your argument strength.",
  badge: "AI Debate Practice & Argument Strengthener",
  vs: "vs",
  you: "You",
  aiOpponent: "Sparring AI",
  round: "Round",
  of: "of",

  // Setup Page
  setup: {
    topicLabel: "Debate Topic",
    topicHint: "Select a preset or enter your own",
    topicPlaceholder: "E.g., Should social media algorithms be legally regulated?",
    curatedPrompts: "Curated Debate Prompts",
    stanceLabel: "Your Stance",
    stanceHint: "Opponent stance auto-inverts",
    forLabel: "FOR (Affirmative)",
    forDesc: "You defend the premise. The AI will challenge your arguments.",
    againstLabel: "AGAINST (Negative)",
    againstDesc: "You reject the premise. The AI will defend the affirmative case.",
    pro: "PRO",
    con: "CON",
    youStance: "You",
    opponentStance: "Sparring AI",
    difficultyLabel: "Opponent Difficulty",
    difficultyHint: "Select opponent rigor & demeanor",
    enterChamber: "Enter Debate Chamber",
    roundsRule: "6 rounds maximum. 1 user argument + 1 AI rebuttal per round.",
    recentReports: "Recent Sparring Reports",
    view: "View",
    score: "Score"
  },

  // Difficulties
  difficulties: {
    NEWBIE: {
      label: "Debate Newbie",
      description: "Friendly and encouraging. Offers simple, single-issue rebuttals and asks clarifying questions.",
      tone: "Constructive & Accessible"
    },
    SHARP: {
      label: "Sharp Rival",
      description: "Challenges hidden assumptions, points out weak evidence, and introduces targeted counterexamples.",
      tone: "Rigorously Analytical"
    },
    RUTHLESS: {
      label: "Ruthless Lawyer",
      description: "Surgically precise. Attacks unproven premises, exposes contradictions, and concedes nothing without proof.",
      tone: "Unforgiving & Precise"
    }
  },

  // Debate Chamber
  debate: {
    chamberActive: "Debate Chamber Active",
    chamberActiveDesc: "Opponent stance: {stance}. Respond directly to challenges. 6 rounds total.",
    openingPrompt: "I will be defending the opposing position ({stance}). State your opening case with your best rationale and evidence.",
    argQuality: "Arg Quality",
    thinking: "Sparring AI is analyzing your logic...",
    finishingTitle: "Six Rounds Complete",
    finishingDesc: "Adjudicating complete debate transcript... Evaluating logic consistency, evidence rigor, and fallacies.",
    stopSpeaking: "Stop Speaking",
    muteVoice: "Mute AI voice",
    unmuteVoice: "Unmute AI voice",
    themePreferences: "Theme Preferences",
    finishDebate: "Finish Debate",
    finishTitle: "End Debate Early?",
    finishDesc: "You've only completed {rounds} of 6 rounds. Completing more exchanges gives the AI adjudicator richer evidence to assess your logical consistency and debate endurance.",
    keepSparring: "Keep Sparring",
    concludeReport: "Conclude & View Report",
    leaveTitle: "Leave this debate?",
    leaveDesc: "Your current debate is still in progress. Leaving will conclude this session and return you to the home page.",
    leaveConfirm: "Leave to Home",
    inputPlaceholder: "Defend your stance... (Press Enter to submit, Shift+Enter for newline)",
    inputSpeaking: "AI is speaking rebuttal...",
    inputThinking: "Sparring AI is formulating its counterargument...",
    listeningMsg: "Listening to your argument... Speak clearly into microphone",
    aiSpeakingMsg: "AI is speaking rebuttal... (Microphone temporarily paused to avoid feedback)",
    minChars: "(min {min} chars)",
    sendArgument: "Send Argument",
    retryTurn: "Retry Turn",
    dictateMic: "Dictate argument via microphone",
    stopListening: "Stop listening"
  },

  // Summary Page
  summary: {
    completeBadge: "Debate Complete & Adjudicated",
    startNew: "Start New Debate",
    compositeProficiency: "Composite Argument Proficiency",
    compositeDesc: "Calculated across deductive rigor, empirical grounding, fallacy resistance, and rebuttal efficacy.",
    dimensionalBreakdown: "Argument Dimensional Breakdown",
    scale: "Scale: 0 – 100",
    logicLabel: "Logic & Structural Consistency",
    logicDesc: "Validity of causal claims and avoidance of formal non-sequiturs.",
    evidenceLabel: "Empirical Evidence & Specificity",
    evidenceDesc: "Concrete operational backing vs unverified generalizations.",
    persuasivenessLabel: "Rhetorical Persuasiveness",
    persuasivenessDesc: "Force of counterargument handling, clarity, and framing.",
    strengthsTitle: "Demonstrated Strengths",
    noStrengths: "No distinct strengths noted.",
    weaknessesTitle: "Vulnerabilities & Logical Gaps",
    noWeaknesses: "No significant vulnerabilities detected.",
    fallaciesTitle: "Logical Fallacy Audit",
    noFallacies: "No clear logical fallacies detected. Your arguments maintained structural discipline.",
    suggestionsTitle: "Actionable Argument Enhancements",
    noSuggestions: "No specific suggestions available.",
    reviewTranscript: "Review Full Debate Transcript ({count} messages)",
    startAnother: "Start Another Sparring Session"
  },

  // Settings Modal
  settings: {
    title: "Preferences",
    appearance: "Appearance & Theme",
    appearanceDesc: "Customize the debate chamber visual presentation.",
    light: "Light",
    lightDesc: "Clean, high-contrast debate paper aesthetic",
    dark: "Dark",
    darkDesc: "Sophisticated dim chamber ambiance (default)",
    system: "System",
    systemDesc: "Automatically synchronizes with your device preference",
    language: "Debate & Interface Language",
    languageDesc: "Controls UI text and the AI opponent's debate language.",
    done: "Done",
    close: "Close settings"
  },

  // Authentication
  auth: {
    loginTitle: "Welcome to Sparring",
    loginSubtitle: "Sign in to practice debate and track your argument mastery.",
    signupTitle: "Create your Sparring account",
    signupSubtitle: "Join the debate chamber and refine your rhetorical strength.",
    email: "Email Address",
    emailPlaceholder: "",
    password: "Password",
    passwordPlaceholder: "",
    confirmPassword: "Confirm Password",
    loginBtn: "Login",
    signupBtn: "Create Account",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
    logout: "Logout",
    continueGuest: "Continue as Guest",
    loggedInAs: "Logged in as"
  }
};
