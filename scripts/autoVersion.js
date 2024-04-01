import fs from 'fs';
// get package.json version only date
// version format '2023/07/17 18:34'

// Get date '0.1.6 - 2023/07/17 18:34'
const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(':').slice(0, -1).join(':').replace(/-/g, '/');

// Append date to version
const versionWithDate = `${date}`;

// Read .env
let env = fs.readFileSync('./.env', 'utf8');

// Replace PUBLIC_APP_VERSION
env = env.replace(/PUBLIC_APP_VERSION=.*/g, `PUBLIC_APP_VERSION="${versionWithDate}"`);

// Update .env
fs.writeFileSync('./.env', env);

// Log version
console.log(`versionWithDate: ${versionWithDate}`);
