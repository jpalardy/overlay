/* eslint no-console: 0 */

const express   = require('express');
const httpProxy = require('http-proxy');
const morgan    = require('morgan');
const chalk     = require('chalk');

//-------------------------------------------------

function updateSource(value) {
  return function (req, res, next) {
    req.source = value;
    next();
  };
}

//-------------------------------------------------

module.exports = function ({targets}) {
  const app = express();

  app.use(morgan(':date[iso] :status :method :url - :response-time - :source', {stream: process.stderr}));
  morgan.token('source', req => req.source.color(req.source.value));

  targets.forEach(({type, value}) => {
    if (type === 'static') {
      app.use(updateSource({value, color: chalk.green}));
      app.use(express.static(value));
      return;
    }

    // proxy
    app.use(updateSource({value, color: chalk.yellow}));
    app.use((req, res, next) => {
      const ifValidPassthrough = function (f) {
        return function (...args) {
          if (!this.valid) { return undefined; }
          return f(...args);
        };
      };
      const fakeRes = {
        valid: true,
      };
      ['emit', 'end', 'on', 'once', 'removeListener', 'setHeader', 'write', 'writeHead'].forEach((name) => {
        fakeRes[name] = ifValidPassthrough(res[name].bind(res));
      });
      const proxy = httpProxy.createProxyServer({target: value});
      proxy.on('proxyRes', (proxyRes) => {
        if (proxyRes.statusCode === 404) {
          fakeRes.valid = false;
          next();
        }
      });
      proxy.web(req, fakeRes);
    });
  });

  // 404
  app.use((req, res) => {
    req.source = {value: 'not found', color: chalk.red};
    res.sendStatus(404);
  });

  return app;
};

