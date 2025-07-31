const BaseParser = require('./baseParser');
const config = require('../config/config');

class FilmixParser extends BaseParser {
  constructor() {
    super(config.sites.filmix);
  }

  async search(query) {
    try {
      console.log(`🔍 Searching Filmix for: ${query}`);
      
      const searchUrl = `${this.searchUrl}${encodeURIComponent(query)}`;
      const html = await this.getPage(searchUrl);
      const $ = this.parseHTML(html);

      const results = [];

      // Парсим результаты поиска
      $('.movie-item').each((index, element) => {
        const $item = $(element);
        
        const titleElement = $item.find('.movie-title a');
        const title = this.cleanText(titleElement.text());
        const url = this.normalizeUrl(titleElement.attr('href'));
        const id = this.extractId(url);

        const poster = $item.find('.movie-poster img').attr('src');
        const year = this.extractYear($item.find('.movie-year').text());
        const rating = this.extractRating($item.find('.movie-rating').text());
        
        const typeElement = $item.find('.movie-type');
        const type = typeElement.text().includes('Сериал') ? 'series' : 'movie';

        if (title && id) {
          results.push(this.createResultItem({
            id,
            title,
            year,
            rating,
            poster: this.normalizeUrl(poster),
            type,
            url
          }));
        }
      });

      console.log(`✅ Found ${results.length} results on Filmix`);
      return results;

    } catch (error) {
      return this.handleError(error, 'search');
    }
  }

  async getMovieInfo(id) {
    try {
      console.log(`🎬 Getting movie info from Filmix: ${id}`);
      
      const url = `${this.baseUrl}/movie/${id}`;
      const html = await this.getPage(url);
      const $ = this.parseHTML(html);

      const title = this.cleanText($('.movie-title h1').text());
      const originalTitle = this.cleanText($('.movie-original-title').text());
      const year = this.extractYear($('.movie-year').text());
      const rating = this.extractRating($('.movie-rating').text());
      const poster = this.normalizeUrl($('.movie-poster img').attr('src'));
      const description = this.cleanText($('.movie-description').text());

      // Парсим жанры
      const genres = [];
      $('.movie-genres a').each((index, element) => {
        genres.push(this.cleanText($(element).text()));
      });

      // Парсим актеров
      const actors = [];
      $('.movie-actors a').each((index, element) => {
        actors.push(this.cleanText($(element).text()));
      });

      const director = this.cleanText($('.movie-director').text());
      const duration = this.cleanText($('.movie-duration').text());
      const country = this.cleanText($('.movie-country').text());

      return this.createResultItem({
        id,
        title,
        originalTitle,
        year,
        rating,
        poster,
        description,
        genres,
        actors,
        director,
        duration,
        country,
        type: 'movie',
        url
      });

    } catch (error) {
      return this.handleError(error, 'getMovieInfo');
    }
  }

  async getSeriesInfo(id) {
    try {
      console.log(`📺 Getting series info from Filmix: ${id}`);
      
      const url = `${this.baseUrl}/series/${id}`;
      const html = await this.getPage(url);
      const $ = this.parseHTML(html);

      const title = this.cleanText($('.series-title h1').text());
      const originalTitle = this.cleanText($('.series-original-title').text());
      const year = this.extractYear($('.series-year').text());
      const rating = this.extractRating($('.series-rating').text());
      const poster = this.normalizeUrl($('.series-poster img').attr('src'));
      const description = this.cleanText($('.series-description').text());

      // Парсим сезоны
      const seasons = [];
      $('.season-item').each((index, element) => {
        const $season = $(element);
        const seasonNumber = $season.find('.season-number').text();
        const episodes = [];
        
        $season.find('.episode-item').each((epIndex, epElement) => {
          const $episode = $(epElement);
          episodes.push({
            number: $episode.find('.episode-number').text(),
            title: this.cleanText($episode.find('.episode-title').text()),
            url: this.normalizeUrl($episode.find('a').attr('href'))
          });
        });

        seasons.push({
          number: seasonNumber,
          episodes
        });
      });

      return {
        ...this.createResultItem({
          id,
          title,
          originalTitle,
          year,
          rating,
          poster,
          description,
          type: 'series',
          url
        }),
        seasons
      };

    } catch (error) {
      return this.handleError(error, 'getSeriesInfo');
    }
  }

  async getStreams(id) {
    try {
      console.log(`🎥 Getting streams from Filmix: ${id}`);
      
      const url = `${this.baseUrl}/movie/${id}`;
      const html = await this.getPage(url);
      const $ = this.parseHTML(html);

      const streams = [];

      // Парсим плееры
      $('.player-item').each((index, element) => {
        const $player = $(element);
        const playerName = this.cleanText($player.find('.player-name').text());
        const playerUrl = $player.find('.player-url').attr('data-url');
        const quality = this.cleanText($player.find('.player-quality').text());

        if (playerUrl) {
          streams.push({
            name: playerName,
            url: playerUrl,
            quality: quality || 'HD',
            source: 'filmix'
          });
        }
      });

      return streams;

    } catch (error) {
      return this.handleError(error, 'getStreams');
    }
  }
}

module.exports = FilmixParser; 