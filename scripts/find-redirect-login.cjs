const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../node_modules/@keystatic/core/dist/keystatic-core-api-generic.worker.js');
const content = fs.readFileSync(filePath, 'utf8');

const targetIndex = content.indexOf("tokenDataResultType");
if (targetIndex !== -1) {
  const start = Math.max(0, targetIndex - 300);
  const end = Math.min(content.length, targetIndex + 500);
  console.log(content.substring(start, end).replace(/\n/g, ' '));
} else {
  console.log("Could not find match in file.");
}
