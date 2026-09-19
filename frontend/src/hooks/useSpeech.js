import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeech() {
  const [voiceState, setVoiceState] = useState('IDLE'); // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING'
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  const recognitionSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const synthesisSupported = typeof window !== 'undefined' && 
    !!window.speechSynthesis;

  // Initialize SpeechRecognition once
  useEffect(() => {
    if (!recognitionSupported) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisSupported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [recognitionSupported, synthesisSupported]);

  // Start listening for user speech
  const startListening = useCallback((onTranscriptReceived) => {
    if (!recognitionSupported || !recognitionRef.current) {
      setErrorMessage("Voice input isn't supported in this browser. You can continue with text.");
      return;
    }

    // Safety rule: Cannot listen while AI is speaking
    if (voiceState === 'AI_SPEAKING') {
      return;
    }

    setErrorMessage(null);
    setVoiceState('LISTENING');

    const recognition = recognitionRef.current;

    recognition.onresult = (event) => {
      setVoiceState('PROCESSING');
      const text = event.results[0]?.[0]?.transcript || '';
      if (text && onTranscriptReceived) {
        onTranscriptReceived(text);
      }
      setVoiceState('IDLE');
    };

    recognition.onerror = (event) => {
      console.warn('[Speech Recognition Error]:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMessage('Microphone access denied. Please check browser permissions.');
      } else if (event.error !== 'no-speech') {
        setErrorMessage(`Voice recognition note: ${event.error}`);
      }
      setVoiceState('IDLE');
    };

    recognition.onend = () => {
      setVoiceState((prev) => (prev === 'LISTENING' ? 'IDLE' : prev));
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      setVoiceState('IDLE');
    }
  }, [recognitionSupported, voiceState]);

  // Stop listening manually
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
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
      recognitionRef.current.abort();
    }

    window.speechSynthesis.cancel();

    const cleanText = (text || '')
      .replace(/[*#_`]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Pick an articulate English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
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
  }, [synthesisSupported, isMuted]);

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
    startListening,
    stopListening,
    speakAIResponse,
    stopSpeaking,
    toggleMute,
  };
}
