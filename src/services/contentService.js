const FilmixParser = require('../parsers/filmixParser');
const BaskinoParser = require('../parsers/baskinoParser');

class ContentService {
  constructor() {
    this.parsers = {
      filmix: new FilmixParser(),
      baskino: new BaskinoParser()
    };
  }

  async getMovieInfo(id, source) {
    try {
      console.log(`🎬 Getting movie info: ${id} from ${source}`);
      
      if (!this.parsers[source]) {
        throw new Error(`Parser for source '${source}' not found`);
      }

      const movieInfo = await this.parsers[source].getMovieInfo(id);
      
      if (movieInfo.error) {
        throw new Error(movieInfo.message);
      }

      return movieInfo;

    } catch (error) {
      console.error(`❌ Get movie info error:`, error);
      throw error;
    }
  }

  async getSeriesInfo(id, source) {
    try {
      console.log(`📺 Getting series info: ${id} from ${source}`);
      
      if (!this.parsers[source]) {
        throw new Error(`Parser for source '${source}' not found`);
      }

      const seriesInfo = await this.parsers[source].getSeriesInfo(id);
      
      if (seriesInfo.error) {
        throw new Error(seriesInfo.message);
      }

      return seriesInfo;

    } catch (error) {
      console.error(`❌ Get series info error:`, error);
      throw error;
    }
  }

  async getStreams(id, source) {
    try {
      console.log(`🎥 Getting streams: ${id} from ${source}`);
      
      if (!this.parsers[source]) {
        throw new Error(`Parser for source '${source}' not found`);
      }

      const streams = await this.parsers[source].getStreams(id);
      
      if (streams.error) {
        throw new Error(streams.message);
      }

      return streams;

    } catch (error) {
      console.error(`❌ Get streams error:`, error);
      throw error;
    }
  }

  async getContentInfo(id, source, type = 'auto') {
    try {
      console.log(`📋 Getting content info: ${id} from ${source} (type: ${type})`);
      
      if (!this.parsers[source]) {
        throw new Error(`Parser for source '${source}' not found`);
      }

      let contentInfo;
      
      if (type === 'movie') {
        contentInfo = await this.getMovieInfo(id, source);
      } else if (type === 'series') {
        contentInfo = await this.getSeriesInfo(id, source);
      } else {
        // Автоопределение типа
        try {
          contentInfo = await this.getMovieInfo(id, source);
          contentInfo.type = 'movie';
        } catch (error) {
          try {
            contentInfo = await this.getSeriesInfo(id, source);
            contentInfo.type = 'series';
          } catch (seriesError) {
            throw new Error(`Content not found or invalid type`);
          }
        }
      }

      // Добавляем стримы
      try {
        const streams = await this.getStreams(id, source);
        contentInfo.streams = streams;
      } catch (streamError) {
        console.warn(`⚠️ Could not get streams: ${streamError.message}`);
        contentInfo.streams = [];
      }

      return contentInfo;

    } catch (error) {
      console.error(`❌ Get content info error:`, error);
      throw error;
    }
  }

  async getMultipleStreams(id, sources = ['filmix', 'baskino']) {
    try {
      console.log(`🎥 Getting streams from multiple sources: ${id}`);
      
      const streamPromises = sources.map(source => {
        if (this.parsers[source]) {
          return this.getStreams(id, source)
            .then(streams => ({ source, streams, error: null }))
            .catch(error => ({ source, streams: [], error: error.message }));
        }
        return Promise.resolve({ source, streams: [], error: 'Parser not found' });
      });

      const results = await Promise.allSettled(streamPromises);
      
      const allStreams = [];
      const errors = [];

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const { source, streams, error } = result.value;
          if (error) {
            errors.push({ source, error });
          } else {
            allStreams.push(...streams);
          }
        } else {
          errors.push({ source: 'unknown', error: result.reason.message });
        }
      });

      return {
        id,
        streams: allStreams,
        total: allStreams.length,
        sources: sources,
        errors: errors.length > 0 ? errors : null
      };

    } catch (error) {
      console.error(`❌ Get multiple streams error:`, error);
      throw error;
    }
  }

  getAvailableSources() {
    return Object.keys(this.parsers);
  }
}

module.exports = new ContentService(); 