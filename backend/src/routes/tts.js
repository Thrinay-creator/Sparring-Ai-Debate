import { Router } from 'express';

const router = Router();

/**
 * Server-side Neural Text-To-Speech (TTS) Proxy
 * Supports English, Telugu (te), and Hindi (hi).
 * Ensures zero API keys are exposed to the browser.
 */
router.get('/tts', async (req, res) => {
  try {
    const rawText = req.query.text || '';
    const lang = (req.query.lang || 'en').toLowerCase().trim();

    const cleanText = rawText
      .replace(/[*#_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      return res.status(400).json({ error: 'Text query parameter is required' });
    }

    // Map language code: te -> te, hi -> hi, en -> en
    const tl = lang.startsWith('te') ? 'te' : lang.startsWith('hi') ? 'hi' : 'en';

    // Google TTS takes up to ~200 characters per segment.
    // If text is longer, we slice the opening chunk for immediate speech.
    const textChunk = cleanText.length > 200 ? cleanText.slice(0, 195) + '...' : cleanText;
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textChunk)}&tl=${tl}&client=tw-ob`;

    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!audioRes.ok) {
      throw new Error(`TTS provider returned HTTP ${audioRes.status}`);
    }

    const audioBuffer = await audioRes.arrayBuffer();

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength,
      'Cache-Control': 'public, max-age=86400'
    });

    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.warn('[Server TTS Warning]:', err.message);
    res.status(502).json({ error: 'Failed to synthesize speech audio' });
  }
});

export default router;
