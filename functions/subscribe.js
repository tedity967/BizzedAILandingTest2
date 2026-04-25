export async function onRequestPost(context) {
  const BREVO_API_KEY = context.env.BREVO_API_KEY;
 
  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
 
  const { email, firstName, lastName, source } = body;
 
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }
 
  const payload = {
    email,
    updateEnabled: true,
    attributes: {}
  };
  if (firstName) payload.attributes.FIRSTNAME = firstName;
  if (lastName)  payload.attributes.LASTNAME  = lastName;
  if (source)    payload.attributes.SOURCE    = source;
 
  const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });
 
  const text = await brevoRes.text();
 
  return new Response(text, {
    status: brevoRes.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
 
// Handle preflight CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
