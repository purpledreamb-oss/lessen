/**
 * Validation and sanitization utilities for user input
 */

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: '密碼至少需要 8 個字元' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個小寫英文字母' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個大寫英文字母' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個數字' };
  }
  return { valid: true, message: '' };
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Taiwan mobile: 09xx-xxx-xxx or 09xxxxxxxx
  const phoneRegex = /^09\d{2}-?\d{3}-?\d{3}$/;
  return phoneRegex.test(phone);
}

export function sanitizeInput(input: string, maxLength = 500): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .slice(0, maxLength);
}
