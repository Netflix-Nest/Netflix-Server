export const MOVIE_INDEX = 'movies';

export const MOVIE_INDEX_SETTINGS = {
  settings: {
    analysis: {
      filter: {
        edge_ngram_filter: {
          type: 'edge_ngram',
          min_gram: 1,
          max_gram: 20,
        },
      },
      analyzer: {
        autocomplete_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'edge_ngram_filter'],
        },
        autocomplete_search_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase'],
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: 'integer' },
      slug: { type: 'keyword' },

      title: {
        type: 'text',
        analyzer: 'autocomplete_analyzer',
        search_analyzer: 'autocomplete_search_analyzer',
        fields: {
          raw: { type: 'keyword' },
        },
      },

      // Completion suggester title
      title_suggest: { type: 'completion' },

      description: { type: 'text' },
      thumbnail: { type: 'keyword' },

      genres: { type: 'keyword' },
      tags: { type: 'keyword' },
      actors: { type: 'keyword' },

      country: { type: 'keyword' },
      director: { type: 'keyword' },

      type: { type: 'keyword' },

      video: { type: 'keyword' },
      series: { type: 'keyword' },

      year: { type: 'integer' },
      view: { type: 'long' },

      followers: { type: 'integer' },

      publishAt: { type: 'date' },
      quality: { type: 'keyword' },

      totalScoreRating: { type: 'float' },
      ratingCount: { type: 'integer' },
      likeCount: { type: 'integer' },

      studio: { type: 'keyword' },
      season: { type: 'keyword' },

      trailer: { type: 'keyword' },

      ageRating: { type: 'integer' },

      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
      deletedAt: { type: 'date' },
    },
  },
};
