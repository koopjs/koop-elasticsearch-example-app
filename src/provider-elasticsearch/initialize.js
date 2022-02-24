const providerElasticsearch = require('@koopjs/provider-elasticsearch');
function initialize() {
  return {
    instance: providerElasticsearch
  };
}
module.exports = initialize;