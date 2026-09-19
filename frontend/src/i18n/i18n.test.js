import { describe, it, expect } from 'vitest';
import en from './en';
import te from './te';
import hi from './hi';
import { SUPPORTED_LANGUAGES } from './index';

describe('i18n Multi-language Dictionary Integrity', () => {
  it('supports English, Telugu, and Hindi', () => {
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('te');
    expect(codes).toContain('hi');
  });

  it('contains essential brand and debate keys across all languages', () => {
    [en, te, hi].forEach(dict => {
      expect(dict.brand).toBeDefined();
      expect(dict.setup.enterChamber).toBeDefined();
      expect(dict.debate.leaveTitle).toBeDefined();
      expect(dict.debate.retryTurn).toBeDefined();
      expect(dict.auth.loginTitle).toBeDefined();
      expect(dict.settings.language).toBeDefined();
    });
  });

  it('Telugu dictionary has authentic Telugu script text', () => {
    expect(te.settings.language).toBe('చర్చ & ఇంటర్‌ఫేస్ భాష (Language)');
    expect(te.debate.leaveTitle).toBe('ఈ చర్చ నుండి నిష్క్రమించాలా?');
    expect(te.debate.retryTurn).toBe('మళ్ళీ ప్రయత్నించండి');
  });

  it('Hindi dictionary has authentic Devanagari script text', () => {
    expect(hi.settings.language).toBe('वाद-विवाद और इंटरफ़ेस की भाषा');
    expect(hi.debate.leaveTitle).toBe('क्या आप इस चर्चा को छोड़ना चाहते हैं?');
    expect(hi.debate.retryTurn).toBe('पुनः प्रयास करें');
  });
});
