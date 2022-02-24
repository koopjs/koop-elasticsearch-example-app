const https = require('https');
const fs = require('fs');
const config = require('config');
const Koop = require('koop');
const routes = require('./routes');
const plugins = require('./plugins');

// initiate a koop app
const koop = new Koop()

// register koop plugins
plugins.forEach((plugin) => {
  koop.register(plugin.instance, plugin.options);
});

// add additional routes
routes.forEach((route) => {
  route.methods.forEach((method) => {
    koop.server[method](route.path, route.handler);
  });
});

koop.server.get('/hello', (_req, res) => res.json({ message: 'Hello World'}));

https.createServer({ 
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt')
}, koop.server).listen(config.port, () => koop.log.info(`Koop server listening at ${config.port}`))
