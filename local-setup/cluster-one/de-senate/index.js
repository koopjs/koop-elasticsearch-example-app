const { Client } = require('@elastic/elasticsearch');
const proj4 = require('proj4')
const config = require('config');
const axios = require('axios').default;
const settings = require('./settings');
const mappings = require('./mappings');

async function scrape() {
  const cluster = config.esConnections['cluster-one'];

  if (!cluster) {
    throw new Error('cluster-one-config-does-not-exist');
  }

  const clusterHosts = cluster.hosts;
  if (!Array.isArray(clusterHosts) || !clusterHosts.length) {
    throw new Error('must-provide-cluster-hosts');
  }

  const index = cluster.indices['de-senate'];

  if (!index || !index.index) {
    throw new Error('must-provide-index-with-index-name');
  }

  const client = new Client({
    node: clusterHosts[0],
  });

  client.indices.create({
    index: index.index,
    body: {
      settings,
      mappings
    }
  }).then(res => {
    console.log(JSON.stringify(res.body));

    return axios.get('https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Boundaries/DE_Enacted_Sen_House/FeatureServer/2/query', {
      params: {
        where: '1=1',
        f: 'json',
        outFields: '*',
        returnGeometry: true
      }
    });

  }).then(res => {
    const features = res.data?.features || [];
    let currentId = 1;

    const processed = features.map(feature => ({
      id: currentId++,
      district: feature.attributes?.DISTRICT,
      name: feature.attributes?.NAME,
      adjustedPopulation: feature.attributes?.ADJ_POPULA,
      idealValue: feature.attributes?.IDEAL_VALU,
      deviation: feature.attributes?.DEVIATION,
      geometry: feature.geometry ? {
        type: 'Polygon',
        coordinates: [(feature.geometry.rings || [[]])[0].map(coordinates => proj4('EPSG:3857', 'EPSG:4326', coordinates))]
      } : null
    }));

    const body = processed.flatMap(doc => [{ index: { _index: index.index, _id: doc.id } }, doc]);
    return client.bulk({ body });
  }).then(_res => {
    console.log(JSON.stringify({ success: true }));
  }).catch(err => {
    console.log(err)
  });
}

if (require.main === 'module') {
  (async () => await scrape())();
}

module.exports = scrape