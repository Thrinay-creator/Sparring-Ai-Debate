import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  if (req.query.diagnostic === '1' || req.query.details === 'true') {
    return res.json({
      status: 'ok',
      providers: {
        gemini: Boolean(process.env.GEMINI_API_KEY),
        groq: Boolean(process.env.GROQ_API_KEY),
        mistral: Boolean(process.env.MISTRAL_API_KEY)
      }
    });
  }
  res.json({ status: 'ok' });
});

export default router;
