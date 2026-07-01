import assert from 'node:assert/strict';
import test from 'node:test';

import {
  expiryForDuration,
  isAllowedImage,
  isValidSlug,
  normalizeMooncrumb,
  normalizeSlug,
  sanitizeHttpUrl,
} from '../netlify/functions/_pm/validation.mjs';
import { inspectTrace } from '../netlify/functions/_pm/safety.mjs';
import {
  createOwnerCapability,
  decryptTrace,
  encryptTrace,
  verifyOwnerCapability,
} from '../netlify/functions/_pm/crypto.mjs';
import {
  createSessionToken,
  parseSessionToken,
} from '../netlify/functions/_pm/session.mjs';

test('normalizes Mooncrumbs without retaining formatting differences', () => {
  assert.equal(normalizeMooncrumb('  Silver   Window  '), 'silver window');
});

test('normalizes memorable moon names into clean slugs', () => {
  assert.equal(normalizeSlug('  Blue Lantern!  '), 'blue-lantern');
  assert.equal(isValidSlug('blue-lantern'), true);
  assert.equal(isValidSlug('a'), false);
  assert.equal(isValidSlug('blue_lantern'), false);
});

test('maps stay choices to exact future expiries', () => {
  const now = new Date('2026-06-14T10:00:00.000Z');
  assert.equal(expiryForDuration('today', now).toISOString(), '2026-06-15T10:00:00.000Z');
  assert.equal(expiryForDuration('week', now).toISOString(), '2026-06-21T10:00:00.000Z');
  assert.equal(expiryForDuration('month', now).toISOString(), '2026-07-14T10:00:00.000Z');
  assert.throws(() => expiryForDuration('forever', now), /stay choice/i);
});

test('allows only safe http links', () => {
  assert.equal(sanitizeHttpUrl('https://example.com/moon'), 'https://example.com/moon');
  assert.equal(sanitizeHttpUrl('javascript:alert(1)'), '');
  assert.equal(sanitizeHttpUrl('data:text/html,hello'), '');
});

test('validates supported image signatures rather than trusting names', () => {
  assert.equal(isAllowedImage(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), 'image/jpeg');
  assert.equal(isAllowedImage(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png');
  assert.equal(isAllowedImage(Buffer.from('RIFF1234WEBP')), 'image/webp');
  assert.equal(isAllowedImage(Buffer.from('<svg onload=alert(1)>')), '');
});

test('blocks unsafe and spammy traces without storing their text', () => {
  assert.equal(inspectTrace('A small and kind trace.').allowed, true);
  assert.equal(inspectTrace('I will kill you tonight.').allowed, false);
  assert.equal(inspectTrace('Send money or I publish your address.').allowed, false);
  assert.equal(inspectTrace('https://a.test https://b.test https://c.test https://d.test').allowed, false);
});

test('encrypts trace bodies and rejects tampering', () => {
  const key = Buffer.alloc(32, 7).toString('base64');
  const protectedBody = encryptTrace('moonlight', key);
  assert.notEqual(protectedBody.ciphertext, 'moonlight');
  assert.equal(decryptTrace(protectedBody, key), 'moonlight');
  assert.throws(
    () => decryptTrace({
      ...protectedBody,
      ciphertext: `${protectedBody.ciphertext[0] === 'A' ? 'B' : 'A'}${protectedBody.ciphertext.slice(1)}`,
    }, key),
    /trace/i,
  );
});

test('signs moon-scoped sessions and expires them', () => {
  const secret = 'a'.repeat(48);
  const token = createSessionToken({
    moonId: '0b83a80f-02d4-48fd-b7b5-51ec9a8d19bf',
    slug: 'paper-moon',
    side: 'creator',
    secret,
    now: 1_000,
  });

  assert.deepEqual(parseSessionToken(token, { secret, now: 2_000 }), {
    moonId: '0b83a80f-02d4-48fd-b7b5-51ec9a8d19bf',
    slug: 'paper-moon',
    side: 'creator',
    expiresAt: 1_801_000,
  });
  assert.equal(parseSessionToken(token, { secret, now: 1_802_000 }), null);
  assert.equal(parseSessionToken(`${token}x`, { secret, now: 2_000 }), null);
});

test('restores maker status with a local capability without exposing it in the URL', () => {
  const capability = createOwnerCapability();
  assert.equal(capability.token.length >= 40, true);
  assert.equal(verifyOwnerCapability(capability.token, capability.hash), true);
  assert.equal(verifyOwnerCapability(`${capability.token}x`, capability.hash), false);
});
