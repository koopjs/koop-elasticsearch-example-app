const { Client } = require('@elastic/elasticsearch');
const config = require('config');
const axios = require('axios').default;
const settings = require('./settings');
const mappings = require('./mappings');

let cluster;
let clusterHosts;
let index;
let client;

async function scrape() {
  cluster = config.esConnections['cluster-one'];

  if (!cluster) {
    throw new Error('cluster-one-config-does-not-exist');
  }

  clusterHosts = cluster.hosts;
  if (!Array.isArray(clusterHosts) || !clusterHosts.length) {
    throw new Error('must-provide-cluster-hosts');
  }

  index = cluster.indices['dc-crashes'];

  if (!index || !index.index) {
    throw new Error('must-provide-dc-crashes-index-with-index-name');
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
    const page = await axios.get('https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Public_Safety_WebMercator/MapServer/24/query', {
      params: {
        where: '1=1',
        f: 'json',
        outFields: '*',
        resultOffset: current
      }
    });

    const features = page.data?.features || [];

    if (!features.length) {
      return [];
    }

    const processed = features.map(feature => ({
      OBJECTID: current++,
      reportDate: feature.attributes?.REPORTDATE ? new Date(parseInt(feature.attributes.REPORTDATE)) : null,
      routeId: feature.attributes?.ROUTEID,
      measure: feature.attributes?.MEASURE,
      offset: feature.attributes?.OFFSET,
      streetSegId: feature.attributes?.STREETSEGID,
      roadwaySegId: feature.attributes?.ROADWAYSEGID,
      fromDate: feature.attributes?.FROMDATE ? new Date(parseInt(feature.attributes.FROMDATE)) : null,
      toDate: feature.attributes?.TODATE ? new Date(parseInt(feature.attributes.TODATE)) : null,
      address: feature.attributes?.ADDRESS,
      ward: feature.attributes?.WARD,
      eventId: feature.attributes?.EVENTID,
      marAddress: feature.attributes?.MAR_ADDRESS,
      marScore: feature.attributes?.MAR_SCORE,
      majorInjuriesBicyclist: feature.attributes?.MAJORINJURIES_BICYCLIST || 0,
      minorInjuriesBicyclist: feature.attributes?.MINORINJURIES_BICYCLIST || 0,
      fatalBicyclist: feature.attributes?.FATAL_BICYCLIST || 0,
      unknownInjuriesBicyclist: feature.attributes?.UNKNOWNINJURIES_BICYCLIST || 0,
      majorInjuriesDriver: feature.attributes?.MAJORINJURIES_DRIVER || 0,
      minorInjuriesDriver: feature.attributes?.MINORINJURIES_DRIVER || 0,
      fatalDriver: feature.attributes?.FATAL_DRIVER || 0,
      unknownInjuriesDriver: feature.attributes?.UNKNOWNINJURIES_DRIVER || 0,
      majorInjuriesPedestrian: feature.attributes?.MAJORINJURIES_PEDESTRIAN || 0,
      minorInjuriesPedestrian: feature.attributes?.MINORINJURIES_PEDESTRIAN || 0,
      fatalDriver: feature.attributes?.FATAL_PEDESTRIAN || 0,
      unknownInjuriesPassenger: feature.attributes?.UNKNOWNINJURIESPASSENGER || 0,
      majorInjuriesPassenger: feature.attributes?.MAJORINJURIESPASSENGER || 0,
      minorInjuriesPassenger: feature.attributes?.MINORINJURIESPASSENGER || 0,
      fatalPassenger: feature.attributes?.FATALPASSENGER || 0,
      unknownInjuriesDriver: feature.attributes?.UNKNOWNINJURIES_PEDESTRIAN || 0,
      totalVehicles: feature.attributes?.TOTAL_VEHICLES || 0,
      totalBicycles: feature.attributes?.TOTAL_BICYCLES || 0,
      totalPedestrians: feature.attributes?.TOTAL_PEDESTRIANS || 0,
      pedestriansImpaired: feature.attributes?.PEDESTRIANSIMPAIRED || 0,
      bicyclistsImpaired: feature.attributes?.BICYCLISTSIMPAIRED || 0,
      driversImpaired: feature.attributes?.PEDESTRIANSIMPAIRED || 0,
      totalTaxis: feature.attributes?.TOTAL_TAXIS || 0,
      totalGovernment: feature.attributes?.TOTAL_GOVERNMENT || 0,
      speedingInvolved: feature.attributes?.SPEEDING_INVOLVED || 0,
      nearestIntRouteId: feature.attributes?.NEARESTINTROUTEID,
      nearestIntStreetName: feature.attributes?.NEARESTINTSTREETNAME,
      location: !!feature.attributes?.LATITUDE && !!feature.attributes?.LONGITUDE
        ? { lat: feature.attributes?.LATITUDE, lon: feature.attributes?.LONGITUDE }
        : null
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