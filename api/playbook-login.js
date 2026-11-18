// GET  -> { authed: boolean }   (is there a valid session cookie?)
// POST -> body { password }; checks it on the server and sets a signed, HttpOnly session cookie.
import { configured, passwordMatches, makeSessionCookie, hasValidSession, json } from './_lib/session.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(request) {
  if (request.method === 'GET') {
    return json({ authed: hasValidSession(request) });
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, { Allow: 'GET, POST' });
  }
  if (!configured()) {
    return json({ error: 'Not configured' }, 503);
  }
  let password = '';
  try {
    const body = await request.json();
    password = typeof body.password === 'string' ? body.password.slice(0, 200) : '';
  } catch {
    return json({ error: 'Bad request' }, 400);
  }
  if (!password || !passwordMatches(password)) {
    await sleep(900); // slow down repeated guessing
    return json({ ok: false }, 401);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': makeSessionCookie() });
}
