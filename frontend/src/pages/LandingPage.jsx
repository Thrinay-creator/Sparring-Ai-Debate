import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import TrustStrip from '../components/landing/TrustStrip';
import ProblemSection from '../components/landing/ProblemSection';
import HowItWorks from '../components/landing/HowItWorks';
import InteractiveDemo from '../components/landing/InteractiveDemo';
import MetricsSection from '../components/landing/MetricsSection';
import VoiceSection from '../components/landing/VoiceSection';
import LanguageSection from '../components/landing/LanguageSection';
import TopicExplorer from '../components/landing/TopicExplorer';
import DebateHistorySection from '../components/landing/DebateHistorySection';
import ProductDifferentiation from '../components/landing/ProductDifferentiation';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

export default function LandingPage({
  onStartDebating,
  onStartDebateWithTopic,
  onNavigate,
  theme,
  onToggleTheme,
  user,
  isAuthenticated,
  speech
}) {
  // Global ⌘K / Ctrl+K keyboard shortcut to launch debate arena
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onStartDebating();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartDebating]);

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#F5F5F7] font-sans selection:bg-[#7C3AED]/30 selection:text-[#F5F5F7] overflow-x-hidden arena-grid-bg">
      {/* Top Floating Navbar */}
      <Navbar
        onStartDebating={onStartDebating}
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      {/* Hero Section */}
      <Hero
        onStartDebating={onStartDebating}
        onExploreHowItWorks={() => handleScrollToSection('how-it-works')}
      />

      {/* Trust & Capabilities Strip */}
      <TrustStrip />

      {/* Problem & Philosophical Contrast Section */}
      <ProblemSection />

      {/* 4-Step Arena Sequence */}
      <HowItWorks onStartDebating={onStartDebating} />

      {/* Live Interactive Debate Demo Simulator */}
      <InteractiveDemo onStartDebateWithTopic={onStartDebateWithTopic} />

      {/* AI Debate Intelligence & Diagnostic Radar */}
      <MetricsSection />

      {/* Voice Synthesis & Audio Arena */}
      <VoiceSection speech={speech} />

      {/* Native Multilingual Arena (English, Telugu, Hindi) */}
      <LanguageSection speech={speech} />

      {/* Curated Motions / Topic Explorer */}
      <TopicExplorer onStartDebateWithTopic={onStartDebateWithTopic} />

      {/* Debate History Log */}
      <DebateHistorySection
        onNavigate={onNavigate}
        isAuthenticated={isAuthenticated}
      />

      {/* Product Differentiation: Think, Challenge, Improve */}
      <ProductDifferentiation />

      {/* Cinematic Final Call-To-Action */}
      <FinalCTA onStartDebating={onStartDebating} />

      {/* Footer */}
      <Footer
        onStartDebating={onStartDebating}
        onNavigate={onNavigate}
      />
    </div>
  );
}
