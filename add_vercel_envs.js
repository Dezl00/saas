const https = require('https');
const fs = require('fs');

const token = process.env.VERCEL_ACCESS_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;

const envsToAdd = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

async function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    // We send to all targets so it works everywhere
    const data = JSON.stringify([
      {
        key: key,
        value: value,
        type: 'encrypted',
        target: ['production', 'preview', 'development']
      }
    ]);

    const options = {
      hostname: 'api.vercel.com',
      path: `/v10/projects/${projectId}/env?upsert=true`, // upsert to replace if exists
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          console.error(`Failed to add ${key}: ${res.statusCode} ${body}`);
          resolve(body); // Proceed anyway
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  if (!token || !projectId) {
    console.error('Missing VERCEL_ACCESS_TOKEN or VERCEL_PROJECT_ID');
    process.exit(1);
  }

  for (const key of envsToAdd) {
    let value = process.env[key];
    if (value) {
      // Firebase private key needs real newlines if it comes escaped from .env (though node --env-file usually preserves it if quoted)
      if (key === 'FIREBASE_PRIVATE_KEY' && value.includes('\\n')) {
        value = value.replace(/\\n/g, '\n');
      }
      console.log(`Adding ${key}...`);
      await addEnv(key, value);
    } else {
      console.log(`Skipping ${key}, not found in env`);
    }
  }
  console.log('Done adding variables to Vercel!');
}

run();
