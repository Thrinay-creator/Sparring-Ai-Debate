import { useState, useEffect, useRef, useCallback } from 'react';
import { LANGUAGE_CONFIG } from '../i18n';
import { getStoredVoiceSpeed, saveStoredVoiceSpeed } from '../utils/storage';

export function useSpeech({ language = 'en' } = {}) {
  const [voiceState, setVoiceState] = useState('IDLE'); // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING'
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [voiceSpeed, setVoiceSpeedState] = useState(() => getStoredVoiceSpeed());
  const [voices, setVoices] = useState([]);

  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  const recognitionSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const synthesisSupported = typeof window !== 'undefined' && 
    !!window.speechSynthesis;

  const recognitionLang = LANGUAGE_CONFIG[language]?.recognition || 'en-IN';
  const speechLang = LANGUAGE_CONFIG[language]?.speech || 'en-IN';

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

  // Clean up recognition and speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
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
    }
  }, []);

  // Start listening for user speech
  const startListening = useCallback((onTranscriptReceived) => {
    if (!recognitionSupported) {
      setErrorMessage("Voice input isn't supported in this browser. You can continue with text.");
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
        setErrorMessage('Microphone access denied. Please check browser permissions.');
      } else if (event.error === 'language-not-supported') {
        setErrorMessage(`Speech recognition in ${language.toUpperCase()} (${recognitionLang}) is not supported on this browser.`);
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setErrorMessage(`Voice recognition note: ${event.error}`);
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
  }, [recognitionSupported, voiceState, recognitionLang, language]);

  // Stop listening manually
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setVoiceState('IDLE');
  }, []);

  // Speak AI rebuttal text
  const speakAIResponse = useCallback((text) => {
    if (!synthesisSupported || !window.speechSynthesis || isMuted) {
      return;
    }

    // Abort active recognition to prevent feedback loop
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    window.speechSynthesis.cancel();

    const cleanText = (text || '')
      .replace(/[*#_`]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.lang = speechLang;

    // Voice Selection Hierarchy:
    // 1. Exact locale match (e.g. te-IN, hi-IN, en-IN)
    // 2. Language prefix match (e.g. te, hi, en)
    // 3. Fallback to default
    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const langNormalized = speechLang.toLowerCase().replace('_', '-');
    const langPrefix = langNormalized.split('-')[0];

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
  }, [synthesisSupported, isMuted, voiceSpeed, speechLang, voices]);

  // Stop speaking immediately
  const stopSpeaking = useCallback(() => {
    if (synthesisSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('IDLE');
  }, [synthesisSupported]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (nextMuted && synthesisSupported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
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
