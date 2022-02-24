const scrapeDeSenateLayer = require('./cluster-one/de-senate');
const scrapeCrashesLayer = require('./cluster-one/dc-crashes');
const scrapeTongassLayer = require('./cluster-two/tongass-landslides');

(async () => {
  await Promise.all([
    scrapeDeSenateLayer(),
    scrapeCrashesLayer(),
    scrapeTongassLayer()
  ]);
})()