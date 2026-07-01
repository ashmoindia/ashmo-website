const blockedPatterns = [
  /\b(?:i(?:'| a)?m going to|i will|gonna)\s+(?:kill|hurt|attack|shoot|stab)\b/i,
  /\b(?:kill|murder|shoot|stab|bomb)\s+(?:you|them|him|her)\b/i,
  /\b(?:send|pay|give)\s+(?:me\s+)?(?:money|cash).{0,50}\b(?:or|otherwise)\b/i,
  /\b(?:publish|post|share|leak).{0,60}\b(?:address|phone|number|details|photos?)\b/i,
  /\b(?:home address|phone number|passport number|credit card number)\s*(?:is|:)\s*/i,
  /\b(?:child sexual|underage sexual|sexual exploitation|exploit a child)\b/i,
  /\b(?:how to|steps to|instructions for)\s+(?:make a bomb|poison|harm|stalk|dox)\b/i,
  /\b(?:worthless|filthy|disgusting)\s+(?:race|religion|ethnicity|people)\b/i,
];

const inspectTrace = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return { allowed: false, reason: 'empty' };
  if (blockedPatterns.some((pattern) => pattern.test(text))) {
    return { allowed: false, reason: 'unsafe' };
  }

  const links = text.match(/https?:\/\/[^\s]+/gi) || [];
  if (links.length > 3) return { allowed: false, reason: 'spam' };

  const repeated = /(.)\1{14,}/i.test(text) || /\b(\w{2,})\b(?:\s+\1\b){7,}/i.test(text);
  if (repeated) return { allowed: false, reason: 'spam' };

  return { allowed: true, reason: '' };
};

export { inspectTrace };
