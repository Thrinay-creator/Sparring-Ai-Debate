import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import LoadingPage from './LoadingPage';
import RunningPage from './RunningPage';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { LanguageProvider } from '../i18n';
import en from '../i18n/en';
import te from '../i18n/te';
import hi from '../i18n/hi';

describe('Error, Status, and Diagnostic Pages Suite', () => {
  it('i18n dictionaries contain complete error, loading, and running keys', () => {
    [en, te, hi].forEach((dict) => {
      expect(dict.loading).toBeDefined();
      expect(dict.loading.badge).toBeDefined();
      expect(dict.loading.title).toBeDefined();

      expect(dict.running).toBeDefined();
      expect(dict.running.badge).toBeDefined();
      expect(dict.running.title).toBeDefined();
      expect(dict.running.step1).toBeDefined();
      expect(dict.running.step4).toBeDefined();

      expect(dict.notFound).toBeDefined();
      expect(dict.notFound.badge).toBeDefined();
      expect(dict.notFound.title).toBeDefined();
      expect(dict.notFound.returnHome).toBeDefined();

      expect(dict.errorPage).toBeDefined();
      expect(dict.errorPage.badge).toBeDefined();
      expect(dict.errorPage.title).toBeDefined();
      expect(dict.errorPage.reloadChamber).toBeDefined();
    });
  });

  it('LoadingPage renders chamber initialization markup', () => {
    const html = renderToString(
      <LanguageProvider>
        <LoadingPage message="Calibrating Arena..." subtitle="Setting up AI opponent" />
      </LanguageProvider>
    );

    expect(html).toContain('Calibrating Arena...');
    expect(html).toContain('Setting up AI opponent');
    expect(html).toContain('CHAMBER INITIALIZATION');
  });

  it('RunningPage renders active debate topic, turns, and adjudication telemetry', () => {
    const mockSession = {
      topic: "Should artificial intelligence be granted legal personhood?",
      transcript: [
        { role: 'user', content: 'AI systems can act autonomously.' },
        { role: 'assistant', content: 'Autonomy does not equate to moral agency.' }
      ]
    };

    const html = renderToString(
      <LanguageProvider>
        <RunningPage session={mockSession} />
      </LanguageProvider>
    );

    expect(html).toContain('ADJUDICATION IN PROGRESS');
    expect(html).toContain('Should artificial intelligence be granted legal personhood?');
    expect(html).toContain('Rounds Completed: 1');
  });

  it('NotFoundPage renders 404 message and navigation triggers', () => {
    const html = renderToString(
      <LanguageProvider>
        <NotFoundPage onNavigate={() => {}} />
      </LanguageProvider>
    );

    expect(html).toContain('404');
    expect(html).toContain('404 / PREMISE NOT FOUND');
    expect(html).toContain('Lost in the Dialectic');
    expect(html).toContain('Return to Arena Home');
  });

  it('ErrorPage renders disruption badge, error message, and controls', () => {
    const mockError = new Error('Test chamber disruption');
    const html = renderToString(
      <LanguageProvider>
        <ErrorPage error={mockError} />
      </LanguageProvider>
    );

    expect(html).toContain('500 / CHAMBER DISRUPTION');
    expect(html).toContain('Test chamber disruption');
    expect(html).toContain('Reload Chamber');
    expect(html).toContain('Return to Home');
  });

  it('ErrorBoundary manages lifecycle and state transitions on error', () => {
    const boundary = new ErrorBoundary({});
    expect(boundary.state.hasError).toBe(false);

    const derived = ErrorBoundary.getDerivedStateFromError(new Error('Fatal exception'));
    expect(derived.hasError).toBe(true);
    expect(derived.error.message).toBe('Fatal exception');
  });
});
