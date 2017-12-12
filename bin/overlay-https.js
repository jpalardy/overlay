#!/usr/bin/env node
/* eslint no-console: 0 */

const fs      = require('fs');
const https   = require('https');
const overlay = require('../lib');

//-------------------------------------------------

const options = {
  key:  fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

//-------------------------------------------------

const args = process.argv.slice(2);

// augment command-line arguments with their types
const targets = args.map(arg => (
  {type: (arg.startsWith('http') ? 'proxy' : 'static'), value: arg}
));

//-------------------------------------------------

const port = process.env.PORT || 7890;
const app  = overlay({targets});

const server = https.createServer(options, app);
server.listen(port, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.error(`* ready on: https://127.0.0.1:${port}`);
});

