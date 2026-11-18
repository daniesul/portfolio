// Shared helpers for the playbook functions. Files starting with "_" are not deployed as routes.
// All secrets come from environment variables (set in Vercel). Nothing is hardcoded here.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'pb_session';
export const SESSION_SECONDS = 2 * 60 * 60; // 2 hours

// The only documents that can ever be served: public name -> file name in the private Blob store.
export const PLAYBOOKS = {
  'decision-maker': 'playbook-decision-maker.pdf',
  'recommender': 'playbook-recommender.pdf',
  'practitioner': 'playbook-practitioner.pdf'
};

export function configured() {
  return Boolean(process.env.PLAYBOOK_PASSWORD && process.env.PLAYBOOK_SESSION_SECRET);
}

// Constant-time password comparison (hash both sides so lengths always match).
export function passwordMatches(input) {
  const a = createHash('sha256').update(String(input)).digest();
  const b = createHash('sha256').update(String(process.env.PLAYBOOK_PASSWORD)).digest();
  return timingSafeEqual(a, b);
}

function sign(value) {
  return createHmac('sha256', process.env.PLAYBOOK_SESSION_SECRET).update(value).digest('hex');
}

export function makeSessionCookie() {
  const exp = String(Date.now() + SESSION_SECONDS * 1000);
  const token = `${exp}.${sign(exp)}`;
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${SESSION_SECONDS}`;
}

export function hasValidSession(request) {
  if (!configured()) return false;
  const header = request.headers.get('cookie') || '';
  const match = header.split(';').map((s) => s.trim()).find((s) => s.startsWith(COOKIE + '='));
  if (!match) return false;
  const [exp, sig] = match.slice(COOKIE.length + 1).split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = Buffer.from(sign(exp), 'hex');
  let given;
  try { given = Buffer.from(sig, 'hex'); } catch { return false; }
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra }
  });
}
