/**
 * Simple test function to verify Cloudflare Pages Functions are working
 */

export async function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'Cloudflare Pages Function is working!',
    timestamp: new Date().toISOString(),
    path: new URL(context.request.url).pathname,
    hasAdminKey: !!context.env.ADMIN_KEY,
    hasFriendKey: !!context.env.FRIEND_KEY
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
