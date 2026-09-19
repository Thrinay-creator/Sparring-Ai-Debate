export const MIN_ARGUMENT_LENGTH = 10;
export const MAX_ARGUMENT_LENGTH = 1500;
export const MAX_ROUNDS = 6;

export function validateArgument(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Argument cannot be empty.' };
  }
  if (trimmed.length < MIN_ARGUMENT_LENGTH) {
    return { 
      valid: false, 
      error: `Argument must be at least ${MIN_ARGUMENT_LENGTH} characters (currently ${trimmed.length}).` 
    };
  }
  if (trimmed.length > MAX_ARGUMENT_LENGTH) {
    return { 
      valid: false, 
      error: `Argument cannot exceed ${MAX_ARGUMENT_LENGTH} characters (currently ${trimmed.length}).` 
    };
  }
  return { valid: true, error: null };
}

export function validateSetup({ topic, userStance, difficulty }) {
  const trimmedTopic = (topic || '').trim();
  if (!trimmedTopic) {
    return { valid: false, error: 'Please choose or enter a debate topic.' };
  }
  if (trimmedTopic.length < 5) {
    return { valid: false, error: 'Topic must be at least 5 characters.' };
  }
  if (!['FOR', 'AGAINST'].includes(userStance)) {
    return { valid: false, error: 'Please select your stance (For or Against).' };
  }
  if (!['NEWBIE', 'SHARP', 'RUTHLESS'].includes(difficulty)) {
    return { valid: false, error: 'Please select a valid difficulty level.' };
  }
  return { valid: true, error: null };
}
