module.exports = {
  properties: {
    OBJECTID: {
      type: 'long'
    },
    tnfLsNo: {
      type: 'long',
    },
    slideNo: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        exact: {
          type: 'keyword'
        }
      }
    },
    inventory: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        exact: {
          type: 'keyword'
        }
      }
    },
    firstYearSeen: {
      type: 'long'
    },
    latestYearNotSeen: {
      type: 'long'
    },
    treatment: {
      type: 'text',
      analyzer: 'standard',
    },
    rdRelated: {
      type: 'text',
      analyzer: 'standard',
    },
    strmImpac: {
      type: 'text',
      analyzer: 'standard',
    },
    coverPercent: {
      type: 'long'
    },
    failType: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        keyword: {
          type: 'text',
          analyzer: 'case_insensitive_keyword'
        },
        autocomplete: {
          type: 'text',
          analyzer: 'standard_ngram'
        },
        exact: {
          type: 'keyword'
        }
      }
    },
    geometry: {
      type: 'geo_shape'
    }
  }
}
