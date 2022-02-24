module.exports = {
  properties: {
    id: {
      type: 'long'
    },
    district: {
      type: 'long',
    },
    name: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        keyword: {
          type: 'text',
          analyzer: 'case_insensitive_keyword'
        }
      }
    },
    adjustedPopulation: {
      type: 'long',
    },
    idealValue: {
      type: 'float',
    },
    deviation: {
      type: 'float',
    },
    geometry: {
      type: 'geo_shape'
    }
  }
}