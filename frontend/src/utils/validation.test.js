import { describe, it, expect } from 'vitest';
import { validateArgument, validateSetup, MIN_ARGUMENT_LENGTH, MAX_ARGUMENT_LENGTH } from './validation';

describe('Frontend Validation Utilities', () => {
  describe('validateArgument', () => {
    it('rejects empty argument or whitespace only', () => {
      expect(validateArgument('').valid).toBe(false);
      expect(validateArgument('   ').valid).toBe(false);
    });

    it(`rejects argument shorter than ${MIN_ARGUMENT_LENGTH} chars`, () => {
      const res = validateArgument('Too short');
      expect(res.valid).toBe(false);
      expect(res.error).toContain(`at least ${MIN_ARGUMENT_LENGTH} characters`);
    });

    it(`rejects argument longer than ${MAX_ARGUMENT_LENGTH} chars`, () => {
      const res = validateArgument('A'.repeat(MAX_ARGUMENT_LENGTH + 1));
      expect(res.valid).toBe(false);
      expect(res.error).toContain(`cannot exceed ${MAX_ARGUMENT_LENGTH} characters`);
    });

    it('accepts valid arguments', () => {
      const res = validateArgument('This is a completely valid argument defending remote work.');
      expect(res.valid).toBe(true);
      expect(res.error).toBeNull();
    });
  });

  describe('validateSetup', () => {
    it('rejects empty topic', () => {
      const res = validateSetup({ topic: '', userStance: 'FOR', difficulty: 'SHARP' });
      expect(res.valid).toBe(false);
      expect(res.error).toContain('debate topic');
    });

    it('rejects topic shorter than 5 chars', () => {
      const res = validateSetup({ topic: 'Why?', userStance: 'FOR', difficulty: 'SHARP' });
      expect(res.valid).toBe(false);
      expect(res.error).toContain('at least 5 characters');
    });

    it('rejects invalid stance', () => {
      const res = validateSetup({ topic: 'Valid debate topic here', userStance: 'MAYBE', difficulty: 'SHARP' });
      expect(res.valid).toBe(false);
      expect(res.error).toContain('stance');
    });

    it('rejects invalid difficulty', () => {
      const res = validateSetup({ topic: 'Valid debate topic here', userStance: 'FOR', difficulty: 'EXTREME' });
      expect(res.valid).toBe(false);
      expect(res.error).toContain('difficulty');
    });

    it('approves valid setup parameters', () => {
      const res = validateSetup({
        topic: 'Should college education be free?',
        userStance: 'FOR',
        difficulty: 'RUTHLESS'
      });
      expect(res.valid).toBe(true);
      expect(res.error).toBeNull();
    });
  });
});
