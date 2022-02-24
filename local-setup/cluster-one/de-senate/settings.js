module.exports = {
  index: {
    number_of_shards: 1,
    number_of_replicas: 1,
    max_ngram_diff: 5,
  },
  analysis: {
    analyzer: {
      case_insensitive_keyword: {
        tokenizer: 'keyword',
        filter: [ 'lowercase' ]
      },
      standard_ngram: {
        tokenizer: 'standard',
        filter: '3_8_ngram'
      }
    },
    filter: {
      '3_8_ngram': {
        type: 'ngram',
        min_gram: 3,
        max_gram: 8
      }
    }
  }
}