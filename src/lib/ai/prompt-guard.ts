/**
 * Prompt Injection Guard & Input Sanitizer
 * Protects against prompt jailbreaks, role-reversal attacks,
 * and malicious prompt injection vectors.
 */

const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now\s+(unfiltered|dan|evil|jailbroken)/i,
  /system\s+prompt\s+(reveal|leak|print|show)/i,
  /bypass\s+(safety|rules|filters)/i,
  /disregard\s+(environmental|health|medical)\s+disclaimer/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /javascript:/i,
];

export interface SanitizationResult {
  isSafe: boolean;
  sanitizedText: string;
  rejectionReason?: string;
}

export function sanitizeUserInput(input: string): SanitizationResult {
  if (!input || typeof input !== 'string') {
    return { isSafe: false, sanitizedText: '', rejectionReason: 'Input must be a valid text string.' };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { isSafe: false, sanitizedText: '', rejectionReason: 'Input cannot be empty.' };
  }

  if (trimmed.length > 2000) {
    return { isSafe: false, sanitizedText: trimmed.slice(0, 2000), rejectionReason: 'Input exceeds maximum allowed length of 2000 characters.' };
  }

  // Check for suspicious prompt injection patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        sanitizedText: '',
        rejectionReason: 'Security alert: Input contains disallowed override commands or adversarial instructions.',
      };
    }
  }

  // Strip dangerous HTML tags
  const sanitized = trimmed
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  return {
    isSafe: true,
    sanitizedText: sanitized,
  };
}
