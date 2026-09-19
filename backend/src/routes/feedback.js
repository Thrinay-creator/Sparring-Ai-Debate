import { Router } from 'express';
import { feedbackRequestSchema } from '../schemas/feedbackSchema.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { processFeedback } from '../services/feedbackService.js';

const router = Router();

router.post('/feedback', validateRequest(feedbackRequestSchema), async (req, res, next) => {
  try {
    const feedbackResult = await processFeedback(req.body);
    res.json(feedbackResult);
  } catch (err) {
    next(err);
  }
});

export default router;
