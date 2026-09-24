import { useState, useEffect, useRef, useCallback } from 'react';
import { LANGUAGE_CONFIG } from '../i18n';
import { getStoredVoiceSpeed, saveStoredVoiceSpeed } from '../utils/storage';

export function useSpeech({ language = 'en', t } = {}) {
  const [voiceState, setVoiceState] = useState('IDLE'); // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING'
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [voiceSpeed, setVoiceSpeedState] = useState(() => getStoredVoiceSpeed());
  const [voices, setVoices] = useState([]);

  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const currentAudioRef = useRef(null);

  const recognitionSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const synthesisSupported = typeof window !== 'undefined' && 
    !!window.speechSynthesis;

  const recognitionLang = LANGUAGE_CONFIG[language]?.recognition || 'en-IN';
  const speechLang = LANGUAGE_CONFIG[language]?.speech || 'en-IN';

  // Translate helper with safe fallback
  const translate = useCallback((key, params = {}) => {
    if (typeof t === 'function') {
      return t(key, params);
    }
    // Fallback if t not provided
    if (key === 'voice.notSupported') return "Voice input is not supported in this browser. You can continue with text.";
    if (key === 'voice.permissionDenied') return "Microphone access denied. Please check browser permissions.";
    if (key === 'voice.langNotSupported') return `Speech recognition in ${params.lang || ''} (${params.locale || ''}) is not supported on this browser.`;
    if (key === 'voice.voiceUnavailable') return `Browser voice for ${params.lang || ''} is unavailable on this device. Audio output will be muted, but text debate continues.`;
    return params.error ? `Voice recognition note: ${params.error}` : key;
  }, [t]);

  // Populate synthesis voices and listen to voiceschanged event
  useEffect(() => {
    if (!synthesisSupported || !window.speechSynthesis) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [synthesisSupported]);

  // Handle dynamic language switching during active recognition or speech
  useEffect(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
      setVoiceState('IDLE');
    }

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {}
      currentAudioRef.current = null;
    }

    if (synthesisSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [language, synthesisSupported]);

  // Clean up recognition and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
          currentAudioRef.current.currentTime = 0;
        } catch {}
      }
      if (synthesisSupported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [synthesisSupported]);

  // Set voice speed preference
  const setVoiceSpeed = useCallback((speed) => {
    const num = parseFloat(speed);
    if (!isNaN(num) && num >= 0.5 && num <= 2.0) {
      setVoiceSpeedState(num);
      saveStoredVoiceSpeed(num);
      if (currentAudioRef.current) {
        currentAudioRef.current.playbackRate = num;
      }
    }
  }, []);

  // Start listening for user speech
  const startListening = useCallback((onTranscriptReceived) => {
    if (!recognitionSupported) {
      setErrorMessage(translate('voice.notSupported'));
      return;
    }

    // Safety rule: Cannot listen while AI is speaking
    if (voiceState === 'AI_SPEAKING') {
      return;
    }

    // Abort any existing active session cleanly
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    setErrorMessage(null);

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = recognitionLang;

    recognition.onstart = () => {
      setVoiceState('LISTENING');
    };

    recognition.onresult = (event) => {
      setVoiceState('PROCESSING');
      const text = event.results[0]?.[0]?.transcript || '';
      if (text && onTranscriptReceived) {
        onTranscriptReceived(text);
      }
    };

    recognition.onerror = (event) => {
      console.warn('[Speech Recognition Error]:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMessage(translate('voice.permissionDenied'));
      } else if (event.error === 'language-not-supported') {
        setErrorMessage(translate('voice.langNotSupported', { 
          lang: language.toUpperCase(), 
          locale: recognitionLang 
        }));
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setErrorMessage(translate('voice.genericError', { error: event.error }));
      }
      setVoiceState('IDLE');
    };

    recognition.onend = () => {
      setVoiceState('IDLE');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      setVoiceState('IDLE');
      recognitionRef.current = null;
    }
  }, [recognitionSupported, voiceState, recognitionLang, language, translate]);

  // Stop listening manually
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setVoiceState('IDLE');
  }, []);

  // Browser SpeechSynthesis fallback
  const fallbackBrowserSpeech = useCallback((cleanText) => {
    if (!synthesisSupported || !window.speechSynthesis || isMuted) {
      setVoiceState('IDLE');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.lang = speechLang;

    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const langNormalized = speechLang.toLowerCase().replace('_', '-');
    const langPrefix = langNormalized.split('-')[0];

    // Priority: 1. Exact locale (te-IN) -> 2. Base language (te) -> 3. Closest match
    let matchedVoice = availableVoices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === langNormalized;
    });

    if (!matchedVoice) {
      matchedVoice = availableVoices.find(v => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang.startsWith(langPrefix);
      });
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      setErrorMessage(null);
    } else if (availableVoices.length > 0 && langPrefix !== 'en') {
      setErrorMessage(translate('voice.voiceUnavailable', { 
        lang: LANGUAGE_CONFIG[language]?.aiLanguage || language 
      }));
    }

    utterance.onstart = () => {
      setVoiceState('AI_SPEAKING');
    };

    utterance.onend = () => {
      setVoiceState('IDLE');
      currentUtteranceRef.current = null;
    };

    utterance.onerror = () => {
      setVoiceState('IDLE');
      currentUtteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  }, [synthesisSupported, isMuted, voiceSpeed, speechLang, voices, language, translate]);

  // Speak AI rebuttal text with neural TTS and browser fallback
  const speakAIResponse = useCallback((text) => {
    if (isMuted) return;

    // Abort active recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    // Stop existing audio or utterance
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {}
      currentAudioRef.current = null;
    }
    if (synthesisSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const cleanText = (text || '')
      .replace(/[*#_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Attempt neural server-side TTS
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const langCode = (language || 'en').toLowerCase();
      const ttsUrl = `${baseUrl}/api/tts?text=${encodeURIComponent(cleanText.slice(0, 195))}&lang=${encodeURIComponent(langCode)}`;

      const audio = new Audio(ttsUrl);
      currentAudioRef.current = audio;
      audio.playbackRate = voiceSpeed;

      audio.onplay = () => {
        setVoiceState('AI_SPEAKING');
        setErrorMessage(null);
      };

      audio.onended = () => {
        setVoiceState('IDLE');
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        currentAudioRef.current = null;
        fallbackBrowserSpeech(cleanText);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          currentAudioRef.current = null;
          fallbackBrowserSpeech(cleanText);
        });
      }
    } catch {
      fallbackBrowserSpeech(cleanText);
    }
  }, [isMuted, language, voiceSpeed, synthesisSupported, fallbackBrowserSpeech]);

  // Stop speaking immediately
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {}
      currentAudioRef.current = null;
    }
    if (synthesisSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('IDLE');
  }, [synthesisSupported]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (nextMuted) {
        if (currentAudioRef.current) {
          try {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
          } catch {}
          currentAudioRef.current = null;
        }
        if (synthesisSupported && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setVoiceState('IDLE');
      }
      return nextMuted;
    });
  }, [synthesisSupported]);

  return {
    voiceState,
    isMuted,
    errorMessage,
    recognitionSupported,
    synthesisSupported,
    voiceSpeed,
    setVoiceSpeed,
    startListening,
    stopListening,
    speakAIResponse,
    stopSpeaking,
    toggleMute,
  };
}
