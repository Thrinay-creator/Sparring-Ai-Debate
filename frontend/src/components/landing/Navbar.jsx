import React, { useState, useEffect } from 'react';
import { Swords, Menu, X, ArrowRight, Sun, Moon, Globe, User, History } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../i18n';

export default function Navbar({ onStartDebating, onNavigate, theme, onToggleTheme, user, isAuthenticated }) {
  const { language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentLangLabel = SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label || 'English';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050507]/80 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/20 py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6366F1] p-0.5 shadow-md shadow-[#7C3AED]/20 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#08080B] rounded-[6px] flex items-center justify-center">
                <Swords className="w-4 h-4 text-[#A78BFA] transition-transform duration-300 group-hover:rotate-6" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-black tracking-tight text-[#F5F5F7]">
                SPARRING
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" title="System Online" />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide text-[#A1A1AA]">
            <a
              href="#debate-demo"
              onClick={(e) => handleNavClick(e, 'debate-demo')}
              className="hover:text-[#F5F5F7] transition-colors"
            >
              Debate
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="hover:text-[#F5F5F7] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#intelligence"
              onClick={(e) => handleNavClick(e, 'intelligence')}
              className="hover:text-[#F5F5F7] transition-colors"
            >
              Intelligence
            </a>
            <a
              href="#voice"
              onClick={(e) => handleNavClick(e, 'voice')}
              className="hover:text-[#F5F5F7] transition-colors"
            >
              Voice Arena
            </a>
            <a
              href="#topics"
              onClick={(e) => handleNavClick(e, 'topics')}
              className="hover:text-[#F5F5F7] transition-colors"
            >
              Motions
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-colors"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="font-mono text-[11px] uppercase">{language}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 py-1 bg-[#0D0D12] border border-white/[0.1] rounded-lg shadow-xl shadow-black/50 z-50 animate-message-in">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-white/[0.06] transition-colors ${
                        language === lang.code ? 'text-[#A78BFA] font-semibold bg-white/[0.03]' : 'text-[#A1A1AA]'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="font-mono text-[10px] uppercase text-[#71717A]">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 rounded-md text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#6366F1]" />
                )}
              </button>
            )}

            {/* User Account / History or Login */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => onNavigate('/history')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#A1A1AA] hover:text-[#F5F5F7] bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-colors"
              >
                <History className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>History</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-white/[0.04] transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary CTA */}
            <button
              type="button"
              onClick={onStartDebating}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white font-medium text-xs shadow-md shadow-[#7C3AED]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Debating</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onStartDebating}
              className="px-3 py-1.5 rounded-md bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white font-medium text-xs shadow-sm"
            >
              Debate
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md text-[#A1A1AA] hover:text-[#F5F5F7] hover:bg-white/[0.05]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-white/[0.08] space-y-3 bg-[#08080B]/95 rounded-lg p-4 backdrop-blur-xl animate-message-in">
            <div className="flex flex-col space-y-2.5 text-sm text-[#A1A1AA]">
              <a
                href="#debate-demo"
                onClick={(e) => handleNavClick(e, 'debate-demo')}
                className="hover:text-[#F5F5F7] py-1"
              >
                Debate Arena
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, 'how-it-works')}
                className="hover:text-[#F5F5F7] py-1"
              >
                How It Works
              </a>
              <a
                href="#intelligence"
                onClick={(e) => handleNavClick(e, 'intelligence')}
                className="hover:text-[#F5F5F7] py-1"
              >
                Debate Intelligence
              </a>
              <a
                href="#voice"
                onClick={(e) => handleNavClick(e, 'voice')}
                className="hover:text-[#F5F5F7] py-1"
              >
                Voice Debate
              </a>
              <a
                href="#topics"
                onClick={(e) => handleNavClick(e, 'topics')}
                className="hover:text-[#F5F5F7] py-1"
              >
                Motions Explorer
              </a>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#71717A]">Lang:</span>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      language === lang.code ? 'bg-[#7C3AED] text-white' : 'bg-white/[0.05] text-[#A1A1AA]'
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {onToggleTheme && (
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="p-1 rounded bg-white/[0.05] text-[#A1A1AA]"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#6366F1]" />}
                  </button>
                )}
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('/history')}
                    className="text-[#22D3EE] font-medium"
                  >
                    History
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="text-[#A1A1AA] hover:text-white"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
