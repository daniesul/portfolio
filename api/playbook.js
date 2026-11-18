// GET /api/playbook?name=decision-maker|recommender|practitioner
// Streams the PDF from the PRIVATE Blob store, but only with a valid session cookie.
import { PLAYBOOKS, hasValidSession, json } from './_lib/session.js';

async function handle(request) {
  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
  }
  if (!hasValidSession(request)) {
    return json({ error: 'Unauthorized' }, 401);
  }
  const name = new URL(request.url).searchParams.get('name') || '';
  // Only names in the allowlist can be requested; visitors never choose a file path.
  const pathname = Object.prototype.hasOwnProperty.call(PLAYBOOKS, name) ? PLAYBOOKS[name] : null;
  if (!pathname) {
    return json({ error: 'Not found' }, 404);
  }
  try {
    const { get } = await import('@vercel/blob');
    const result = await get(pathname, { access: 'private' });
    if (!result || result.statusCode !== 200) {
      return json({ error: 'Not found' }, 404);
    }
    return new Response(result.stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${pathname}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    });
  } catch (err) {
    // Details go to the function logs only; visitors just see a generic message.
    console.error('playbook fetch failed:', err && err.name, err && err.message);
    return json({ error: 'Unavailable' }, 502);
  }
}

// Vercel Web Standard export: handles every HTTP method.
export default { fetch: handle };
