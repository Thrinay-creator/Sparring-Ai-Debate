import { Router } from 'express';
import { debateTurnRequestSchema } from '../schemas/debateSchema.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { processDebateTurn } from '../services/debateService.js';

const router = Router();

router.post('/debate-turn', validateRequest(debateTurnRequestSchema), async (req, res, next) => {
  try {
    const turnResult = await processDebateTurn(req.body);
    res.json(turnResult);
  } catch (err) {
    next(err);
  }
});

export default router;
