const providerElasticsearch = require('./provider-elasticsearch/initialize')();
const outputs = [];
const auths = [];
const caches = [];
const plugins = [providerElasticsearch];
module.exports = [...outputs, ...auths, ...caches, ...plugins];