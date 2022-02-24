module.exports = {
  properties: {
    OBJECTID: {
      type: 'long'
    },
    reportDate: {
      type: 'date',
    },
    routeId: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        keyword: {
          type: 'text',
          analyzer: 'case_insensitive_keyword'
        },
        exact: {
          type: 'keyword'
        }
      }
    },
    measure: {
      type: 'float'
    },
    offset: {
      type: 'float'
    },
    fromDate: {
      type: 'date',
    },
    toDate: {
      type: 'date',
    },
    address: {
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
        }
      }
    },
    ward: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        keyword: {
          type: 'text',
          analyzer: 'case_insensitive_keyword'
        }
      }
    },
    eventId: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        keyword: {
          type: 'text',
          analyzer: 'case_insensitive_keyword'
        },
        exact: {
          type: 'keyword'
        }
      }
    },
    marAddress: {
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
        }
      }
    },
    majorInjuriesBicyclist: { type: 'integer' },
    minorInjuriesBicyclist: { type: 'integer' },
    fatalBicyclist: { type: 'integer' },
    unknownInjuriesBicyclist: { type: 'integer' },
    majorInjuriesDriver: { type: 'integer' },
    minorInjuriesDriver: { type: 'integer' },
    fatalDriver: { type: 'integer' },
    unknownInjuriesDriver: { type: 'integer' },
    majorInjuriesPedestrian: { type: 'integer' },
    minorInjuriesPedestrian: { type: 'integer' },
    fatalDriver: { type: 'integer' },
    unknownInjuriesPassenger: { type: 'integer' },
    majorInjuriesPassenger: { type: 'integer' },
    minorInjuriesPassenger: { type: 'integer' },
    fatalPassenger: { type: 'integer' },
    unknownInjuriesDriver: { type: 'integer' },
    totalVehicles: { type: 'integer' },
    totalBicycles: { type: 'integer' },
    totalPedestrians: { type: 'integer' },
    pedestriansImpaired: { type: 'integer' },
    bicyclistsImpaired: { type: 'integer' },
    driversImpaired: { type: 'integer' },
    totalTaxis: { type: 'integer' },
    totalGovernment: { type: 'integer' },
    speedingInvolved: { type: 'integer' },
    nearestIntRouteId: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        keyword: {
          type: 'text',
          analyzer: 'case_insensitive_keyword'
        },
        exact: {
          type: 'keyword'
        }
      }
    },
    nearestIntStreetName: {
      type: 'text',
      analyzer: 'standard',
      fields: {
        keyword: {
          type: 'text',
          analyzer: 'case_insensitive_keyword'
        },
        exact: {
          type: 'keyword'
        },
        autocomplete: {
          type: 'text',
          analyzer: 'standard_ngram'
        }
      }
    },
    location: {
      type: 'geo_point'
    }
  }
}