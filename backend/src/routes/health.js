import { Router } from 'express';

const router = Router();

router.get('/health', async (req, res) => {
  if (req.query.diagnostic === '1' || req.query.details === 'true') {
    const diagnostic = {
      status: 'ok',
      providers: {
        gemini: Boolean(process.env.GEMINI_API_KEY),
        groq: Boolean(process.env.GROQ_API_KEY),
        mistral: Boolean(process.env.MISTRAL_API_KEY)
      }
    };

    if (req.query.test_provider === 'mistral' && process.env.MISTRAL_API_KEY) {
      try {
        const testModel = req.query.model || process.env.MISTRAL_MODEL || 'mistral-small-latest';
        const testRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: 'user', content: 'Say "hello" in JSON {"greeting":"hello"}' }],
            response_format: { type: 'json_object' }
          })
        });
        const bodyText = await testRes.text();
        diagnostic.mistral_test = {
          model: testModel,
          status: testRes.status,
          ok: testRes.ok,
          response: bodyText.slice(0, 300)
        };
      } catch (err) {
        diagnostic.mistral_test = { error: err.message };
      }
    }

    if (req.query.test_provider === 'groq' && process.env.GROQ_API_KEY) {
      try {
        const testRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'Say "hello" in JSON {"greeting":"hello"}' }],
            response_format: { type: 'json_object' }
          })
        });
        const bodyText = await testRes.text();
        diagnostic.groq_test = {
          status: testRes.status,
          ok: testRes.ok,
          response: bodyText.slice(0, 300)
        };
      } catch (err) {
        diagnostic.groq_test = { error: err.message };
      }
    }

    return res.json(diagnostic);
  }
  res.json({ status: 'ok' });
});

export default router;

