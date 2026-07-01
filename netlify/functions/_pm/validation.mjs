const SLUG_MIN = 3;
const SLUG_MAX = 48;
const TRACE_MAX = 2400;
const MOONCRUMB_MIN = 4;
const MOONCRUMB_MAX = 120;
const PHOTO_MAX_BYTES = 1024 * 1024;

const normalizeMooncrumb = (value) =>
  String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

const normalizeSlug = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, '');

const isValidSlug = (value) =>
  typeof value === 'string'
  && value.length >= SLUG_MIN
  && value.length <= SLUG_MAX
  && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const validateMooncrumb = (value) => {
  const normalized = normalizeMooncrumb(value);
  if (normalized.length < MOONCRUMB_MIN || normalized.length > MOONCRUMB_MAX) {
    const error = new Error('Mooncrumb must be between 4 and 120 characters.');
    error.status = 400;
    throw error;
  }
  return normalized;
};

const validateTrace = (value) => {
  const trace = String(value ?? '').trim();
  if (!trace || trace.length > TRACE_MAX) {
    const error = new Error('Trace must be between 1 and 2400 characters.');
    error.status = 400;
    throw error;
  }
  return trace;
};

const expiryForDuration = (duration, now = new Date()) => {
  const expiry = new Date(now);
  if (duration === 'today') expiry.setUTCDate(expiry.getUTCDate() + 1);
  else if (duration === 'week') expiry.setUTCDate(expiry.getUTCDate() + 7);
  else if (duration === 'month') expiry.setUTCMonth(expiry.getUTCMonth() + 1);
  else {
    const error = new Error('Unknown stay choice.');
    error.status = 400;
    throw error;
  }
  return expiry;
};

const stayLabelForDuration = (duration) => ({
  today: 'stays today',
  week: 'stays this week',
  month: 'stays this month',
})[duration] || '';

const sanitizeHttpUrl = (value) => {
  try {
    const url = new URL(String(value ?? '').trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
};

const isAllowedImage = (bytes) => {
  if (!bytes || bytes.length < 4) return '';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (
    bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a
  ) return 'image/png';
  if (
    bytes.length >= 12
    && bytes.subarray(0, 4).toString('ascii') === 'RIFF'
    && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  ) return 'image/webp';
  return '';
};

export {
  PHOTO_MAX_BYTES,
  TRACE_MAX,
  expiryForDuration,
  isAllowedImage,
  isValidSlug,
  normalizeMooncrumb,
  normalizeSlug,
  sanitizeHttpUrl,
  stayLabelForDuration,
  validateMooncrumb,
  validateTrace,
};
