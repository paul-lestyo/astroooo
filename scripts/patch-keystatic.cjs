#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filesToPatch = [
  'keystatic-core-api-generic.worker.js',
  'keystatic-core-api-generic.react-server.js',
  'keystatic-core-api-generic.node.js',
  'keystatic-core-api-generic.js',
  'keystatic-core-api-generic.node.react-server.js'
];

const distDir = path.join(__dirname, '../node_modules/@keystatic/core/dist');

console.log('Patching Keystatic OAuth handler...');

const searchString = "url.searchParams.set('code', code);";
const replacementString = "url.searchParams.set('code', code); url.searchParams.set('redirect_uri', config.redirectUrl || `${new URL(req.url).origin}/api/keystatic/github/oauth/callback`); // PATCH: Add redirect_uri";

let patchedCount = 0;

for (const file of filesToPatch) {
  const filePath = path.join(distDir, file);
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${file}, skipping.`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // If it was already patched with the WRONG version (containing request.url), let's replace it!
    if (content.includes('request.url')) {
      content = content.replace('request.url', 'req.url');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated incorrect patch in ${file}.`);
      patchedCount++;
      continue;
    }

    if (content.includes('PATCH: Add redirect_uri')) {
      console.log(`File ${file} already patched, skipping.`);
      continue;
    }

    if (content.includes(searchString)) {
      content = content.replaceAll(searchString, replacementString);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Patch applied successfully to ${file}.`);
      patchedCount++;
    } else {
      console.error(`Could not find the target code to patch in ${file}.`);
    }
  } catch (err) {
    console.error(`Error patching ${file}:`, err);
  }
}

console.log(`Finished patching. Patched/updated ${patchedCount} files.`);
process.exit(0);
