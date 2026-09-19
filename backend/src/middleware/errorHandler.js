export function errorHandler(err, req, res, next) {
  // Log internal error safely on server without exposing API keys
  console.error('[Error caught in middleware]:', err?.message || err);

  // Zod error
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: err.issues?.[0]?.message || 'Validation failed',
      details: err.issues
    });
  }

  // Known custom Sparring & Gemini errors
  if (err?.code === 'GEMINI_BLOCKED') {
    return res.status(400).json({
      code: 'GEMINI_BLOCKED',
      message: err.userMessage || 'Your argument triggered content safety filters. Please rephrase your point.'
    });
  }

  if (err?.code === 'GEMINI_QUOTA_ERROR') {
    return res.status(429).json({
      code: 'GEMINI_QUOTA_ERROR',
      message: 'The AI debate chamber is currently at capacity. Please wait a moment and try again.'
    });
  }

  if (err?.code === 'GEMINI_SCHEMA_ERROR' || err?.code === 'GEMINI_PARSE_ERROR' || err?.code === 'SPARRING_RESPONSE_ERROR') {
    return res.status(502).json({
      code: err.code,
      message: err.userMessage || 'Sparring received an incomplete response. Please retry.'
    });
  }

  if (err?.code === 'GEMINI_EMPTY_RESPONSE') {
    return res.status(502).json({
      code: 'GEMINI_EMPTY_RESPONSE',
      message: err.userMessage || 'Sparring received an empty response. Please retry.'
    });
  }

  if (err?.code === 'GEMINI_API_ERROR') {
    return res.status(503).json({
      code: 'GEMINI_API_ERROR',
      message: err.userMessage || "Sparring couldn't reach the AI opponent. Check your connection and try again."
    });
  }

  // Generic sanitized fallback
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    code: err.code || 'INTERNAL_ERROR',
    message: err.userMessage || "Sparring couldn't respond. Check your connection and try again."
  });
}
