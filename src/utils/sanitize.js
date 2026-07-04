import DOMPurify from 'dompurify';
import xss from 'xss';

/** Konfigurasi DOMPurify untuk sanitasi HTML */
const purifyConfig = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'blockquote'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

/** Konfigurasi xss untuk filter tambahan */
const xssConfig = {
  whiteList: {
    a: ['href', 'title', 'target'],
    b: [],
    i: [],
    em: [],
    strong: [],
    p: [],
    br: [],
    ul: [],
    ol: [],
    li: [],
    h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
    pre: [],
    code: [],
    blockquote: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe'],
};

export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input.trim();

  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  sanitized = xss(sanitized, xssConfig);

  return sanitized;
};

export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';

  let sanitized = html.length > 50000 ? html.substring(0, 50000) : html;
  sanitized = DOMPurify.sanitize(sanitized, purifyConfig);

  return sanitized;
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;

  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(sanitized)) return null;
  if (sanitized.length > 254) return null;

  return sanitized;
};

export const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') return null;

  let sanitized = name.trim();
  sanitized = sanitized.replace(/[<>{}[\]\\\/]/g, '');

  if (sanitized.length < 2 || sanitized.length > 100) return null;

  return sanitized;
};

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6 && password.length <= 128;
};

export const escapeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};