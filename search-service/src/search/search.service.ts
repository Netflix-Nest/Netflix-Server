import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  BulkIndexMoviesDto,
  IndexMovieDto,
  SearchMoviesDto,
  SuggestDto,
  UpdateMovieDto,
} from './dto/search.dto';
import { MOVIE_INDEX, MOVIE_INDEX_SETTINGS } from './search.constants';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly es: ElasticsearchService) {}

  // --- Utilities
  private toDoc(movie: IndexMovieDto) {
    return {
      ...movie,
      title_suggest: movie.title,
    };
  }

  // --- Index lifecycle
  async ensureIndex() {
    const exists = await this.es.indices.exists({ index: MOVIE_INDEX });
    if (!exists) {
      await this.es.indices.create({
        index: MOVIE_INDEX,
        ...(MOVIE_INDEX_SETTINGS as any),
      });
      this.logger.log(`Created index ${MOVIE_INDEX}`);
    }
    return { index: MOVIE_INDEX, exists: !!exists };
  }

  async deleteIndex() {
    const exists = await this.es.indices.exists({ index: MOVIE_INDEX });
    if (exists) {
      await this.es.indices.delete({ index: MOVIE_INDEX });
      this.logger.warn(`Deleted index ${MOVIE_INDEX}`);
    }
    return { index: MOVIE_INDEX, deleted: !!exists };
  }

  async indexMovie(movie: IndexMovieDto) {
    await this.ensureIndex();
    return this.es.index({
      index: MOVIE_INDEX,
      id: String(movie.id),
      document: this.toDoc(movie),
    });
  }

  async bulkIndexMovies(payload: BulkIndexMoviesDto) {
    await this.ensureIndex();
    if (!payload.movies?.length) return { indexed: 0 };

    const res = await this.es.helpers.bulk({
      datasource: payload.movies.map((m) => this.toDoc(m)),
      onDocument(doc) {
        return {
          index: { _index: MOVIE_INDEX, _id: String(doc.id) },
        };
      },
    });

    return { ...res };
  }
  async updateMovie(id: string, patch: UpdateMovieDto) {
    return this.es.update({ index: MOVIE_INDEX, id, doc: patch as any });
  }

  async deleteMovie(id: string) {
    return this.es.delete({ index: MOVIE_INDEX, id });
  }

  // --- Reindex from primary DB (strategy)
  // Call this from an admin job to refresh the whole index.
  async reindex(allMovies: IndexMovieDto[]) {
    await this.deleteIndex();
    await this.ensureIndex();
    return this.bulkIndexMovies({ movies: allMovies });
  }

  async searchMovies(qry: SearchMoviesDto) {
    const {
      q,
      genres,
      tags,
      country,
      yearFrom,
      yearTo,
      ratingFrom,
      ratingTo,
      type,
      sort,
      page = 1,
      pageSize = 20,
    } = qry;

    const must: any[] = [];
    const filter: any[] = [];

    if (q) {
      must.push({
        multi_match: {
          query: q,
          type: 'best_fields',
          fields: [
            'title^3',
            'title.raw^4',
            'description^1',
            'director^1',
            'studio^0.5',
          ],
          fuzziness: 'AUTO',
        },
      });
    }

    if (genres?.length) filter.push({ terms: { genres } });
    if (tags?.length) filter.push({ terms: { tags } });
    if (country) filter.push({ term: { country } });
    if (type) filter.push({ term: { type } });
    if (yearFrom != null || yearTo != null) {
      filter.push({ range: { year: { gte: yearFrom, lte: yearTo } } });
    }
    if (ratingFrom != null || ratingTo != null) {
      filter.push({
        range: { totalScoreRating: { gte: ratingFrom, lte: ratingTo } },
      });
    }

    const sortClause = (() => {
      switch (sort) {
        case 'view':
          return [{ view: 'desc' }];
        case 'rating':
          return [{ totalScoreRating: 'desc' }];
        case 'newest':
          return [{ publishAt: 'desc' }];
        case 'year':
          return [{ year: 'desc' }];
        default:
          return q ? ['_score'] : [{ view: 'desc' }];
      }
    })();

    const from = (page - 1) * pageSize;

    const body: any = {
      index: MOVIE_INDEX,
      from,
      size: pageSize,
      query: {
        bool: {
          must: must.length ? must : [{ match_all: {} }],
          filter,
        },
      },
      sort: sortClause,
      highlight: q
        ? {
            fields: {
              title: {},
              description: {},
            },
          }
        : undefined,
    };

    const res = (await this.es.search(body)) as any;
    const hits = (res.hits?.hits || []) as any[];

    return {
      total: res.hits?.total?.value ?? hits.length,
      page,
      pageSize,
      results: hits.map((h) => ({
        id: h._id,
        score: h._score,
        ...h._source,
        highlight: h.highlight,
      })),
    };
  }

  // --- Autocomplete (primary: completion suggester; fallback: edge-ngram prefix)
  async suggest(input: SuggestDto) {
    const size = input.size ?? 5;
    const prefix = input.prefix;

    try {
      const res = await this.es.search({
        index: MOVIE_INDEX,
        size: 0,
        suggest: {
          movie_suggest: {
            prefix,
            completion: {
              field: 'title_suggest',
              fuzzy: { fuzziness: 2 },
              size,
            },
          },
        },
      } as any);

      const options = (res as any).suggest?.movie_suggest?.[0]?.options || [];
      if (options.length) {
        return options.map((o: any) => ({
          id: o._id,
          title: o._source?.title ?? o.text,
        }));
      }
    } catch (e) {
      this.logger.warn(`Completion suggest failed, falling back. ${e}`);
    }

    // Fallback: prefix query on edge-ngram analyzed title
    const res2 = await this.es.search({
      index: MOVIE_INDEX,
      from: 0,
      size,
      query: {
        match_phrase_prefix: { title: prefix },
      },
      _source: ['title'],
      sort: ['_score'],
    } as any);

    return (res2.hits?.hits || []).map((h: any) => ({
      id: h._id,
      title: h._source?.title,
    }));
  }

  async health() {
    const info = await this.es.info();
    const ping = await this.es.ping();
    return {
      ok: ping,
      name: (info as any)?.name,
      version: (info as any)?.version?.number,
    };
  }
}
