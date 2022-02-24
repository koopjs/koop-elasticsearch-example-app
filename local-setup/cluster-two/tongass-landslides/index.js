const { Client } = require('@elastic/elasticsearch');
const proj4 = require('proj4')
const config = require('config');
const axios = require('axios').default;
const settings = require('./settings');
const mappings = require('./mappings');

let cluster;
let clusterHosts;
let index;
let client;

async function scrape() {
  cluster = config.esConnections['cluster-two'];

  if (!cluster) {
    throw new Error('cluster-two-config-does-not-exist');
  }

  clusterHosts = cluster.hosts;
  if (!Array.isArray(clusterHosts) || !clusterHosts.length) {
    throw new Error('must-provide-cluster-hosts');
  }

  index = cluster.indices['tongass-landslides'];

  if (!index || !index.index) {
    throw new Error('must-provide-index-with-index-name');
  }

  client = new Client({
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
    return page(25000, index.index);
  }).then(_res => {
    console.log(JSON.stringify({ success: true }));
  }).catch(err => {
    console.log(err);
  });
}

async function page(recordLimit) {
  let current = 0;

  while (current < recordLimit) {
    const page = await axios.get('https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TongassLandslide_01/MapServer/1/query', {
      params: {
        where: '1=1',
        f: 'json',
        outFields: '*',
        resultOffset: current,
        returnGeometry: true,
      }
    });

    const features = page.data?.features || [];

    if (!features.length) {
      return [];
    }

    const processed = features.map(feature => ({
      OBJECTID: current++,
      tnfLsNo: feature.attributes?.TNF_LS_NO,
      slideNo: feature.attributes?.SLIDE_NO,
      inventory: feature.attributes?.INVENTORY,
      firstYearSeen: feature.attributes?.FIRST_YEAR_SEEN,
      latestYearNotSeen: feature.attributes?.LATEST_YEAR_NOTSEEN,
      treatment: feature.attributes?.TREATMENT,
      rdRelated: feature.attributes?.RD_RELATED,
      strmImpac: feature.attributes?.STRM_IMPAC,
      coverPercent: feature.attributes?.COVER_PERCENT,
      failType: feature.attributes?.FAIL_TYPE,
      geometry: feature.geometry ? {
        type: 'Polygon',
        coordinates: (feature.geometry.rings || [[]])
      } : null
    }));

    const body = processed.flatMap(doc => [{ index: { _index: index.index, _id: doc.id } }, doc]);
    await client.bulk({ body });

    console.log(`indexed ${current} records`);
  }
}

if (require.main === module) {
  (async () => await scrape())();
}

module.exports = scrape