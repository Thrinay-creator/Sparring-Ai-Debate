export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message
        }));
        return res.status(400).json({
          code: 'INVALID_REQUEST',
          message: issues[0]?.message || 'Invalid request payload',
          details: issues
        });
      }
      req.body = parsed.data;
      next();
    } catch (err) {
      next(err);
    }
  };
}
