const FilmixParser = require('../parsers/filmixParser');
const BaskinoParser = require('../parsers/baskinoParser');

class SearchService {
  constructor() {
    this.parsers = {
      filmix: new FilmixParser(),
      baskino: new BaskinoParser()
    };
  }

  async search(query, sources = ['filmix', 'baskino']) {
    try {
      // Убеждаемся, что sources - это массив
      const sourceArray = Array.isArray(sources) ? sources : ['filmix', 'baskino'];
      console.log(`🔍 Starting search for: "${query}" on sources: ${sourceArray.join(', ')}`);
      
      const searchPromises = [];
      for (const source of sourceArray) {
        if (this.parsers[source]) {
          searchPromises.push(
            this.parsers[source].search(query)
              .then(results => ({ source, results, error: null }))
              .catch(error => ({ source, results: [], error: error.message }))
          );
        } else {
          searchPromises.push(Promise.resolve({ source, results: [], error: 'Parser not found' }));
        }
      }

      const results = await Promise.allSettled(searchPromises);
      
      const allResults = [];
      const errors = [];

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { source, results, error } = result.value;
          if (error) {
            errors.push({ source, error });
          } else {
            if (Array.isArray(results)) {
              allResults.push(...results);
            }
          }
        } else {
          errors.push({ source: 'unknown', error: result.reason.message });
        }
      }

      // Сортируем результаты по рейтингу и году
      allResults.sort((a, b) => {
        if (b.rating && a.rating) {
          return b.rating - a.rating;
        }
        if (b.year && a.year) {
          return b.year - a.year;
        }
        return 0;
      });

      // Удаляем дубликаты по ID и названию
      const uniqueResults = this.removeDuplicates(allResults);

      console.log(`✅ Search completed. Found ${uniqueResults.length} unique results`);
      if (errors.length > 0) {
        console.log(`⚠️ Errors:`, errors);
      }

      return {
        query,
        results: uniqueResults,
        total: uniqueResults.length,
        sources: sourceArray,
        errors: errors.length > 0 ? errors : null
      };

    } catch (error) {
      console.error('❌ Search service error:', error);
      throw error;
    }
  }

  removeDuplicates(results) {
    const seen = new Set();
    return results.filter(item => {
      const key = `${item.id}-${item.source}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async searchBySource(query, source) {
    try {
      if (!this.parsers[source]) {
        throw new Error(`Parser for source '${source}' not found`);
      }

      const results = await this.parsers[source].search(query);
      return {
        query,
        source,
        results,
        total: results.length
      };

    } catch (error) {
      console.error(`❌ Search by source error (${source}):`, error);
      throw error;
    }
  }

  getAvailableSources() {
    return Object.keys(this.parsers);
  }
}

module.exports = new SearchService(); 