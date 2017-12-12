/* eslint no-console: 0 */

const http    = require('http');
const overlay = require('../lib');

//-------------------------------------------------

const args = process.argv.slice(2);

// augment command-line arguments with their types
const targets = args.map(arg => (
  {type: (arg.startsWith('http') ? 'proxy' : 'static'), value: arg}
));

//-------------------------------------------------

const port = process.env.PORT || 7890;
const app  = overlay({targets});

const server = http.createServer(app);
server.listen(port, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.error(`* ready on: http://127.0.0.1:${port}`);
});

