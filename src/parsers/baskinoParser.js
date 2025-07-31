const BaseParser = require('./baseParser');
const config = require('../config/config');

class BaskinoParser extends BaseParser {
  constructor() {
    super(config.sites.baskino);
  }

  async search(query) {
    try {
      console.log(`🔍 Searching Baskino for: ${query}`);
      
      // Baskino использует POST запрос для поиска
      const searchData = {
        do: 'search',
        subaction: 'search',
        search_start: '0',
        full_search: '0',
        result_from: '1',
        story: query
      };

      const html = await httpClient.post(this.searchUrl, searchData, {
        headers: this.headers
      });
      
      const $ = this.parseHTML(html.data);
      const results = [];

      // Парсим результаты поиска
      $('.shortstory').each((index, element) => {
        const $item = $(element);
        
        const titleElement = $item.find('.shortstoryTitle a');
        const title = this.cleanText(titleElement.text());
        const url = this.normalizeUrl(titleElement.attr('href'));
        const id = this.extractId(url);

        const poster = $item.find('.shortstoryImg img').attr('src');
        const year = this.extractYear($item.find('.shortstoryYear').text());
        const rating = this.extractRating($item.find('.shortstoryRating').text());
        
        const typeElement = $item.find('.shortstoryType');
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

      console.log(`✅ Found ${results.length} results on Baskino`);
      return results;

    } catch (error) {
      return this.handleError(error, 'search');
    }
  }

  async getMovieInfo(id) {
    try {
      console.log(`🎬 Getting movie info from Baskino: ${id}`);
      
      const url = `${this.baseUrl}/index.php?newsid=${id}`;
      const html = await this.getPage(url);
      const $ = this.parseHTML(html);

      const title = this.cleanText($('.fullstoryTitle h1').text());
      const originalTitle = this.cleanText($('.fullstoryOriginalTitle').text());
      const year = this.extractYear($('.fullstoryYear').text());
      const rating = this.extractRating($('.fullstoryRating').text());
      const poster = this.normalizeUrl($('.fullstoryImg img').attr('src'));
      const description = this.cleanText($('.fullstoryText').text());

      // Парсим жанры
      const genres = [];
      $('.fullstoryGenres a').each((index, element) => {
        genres.push(this.cleanText($(element).text()));
      });

      // Парсим актеров
      const actors = [];
      $('.fullstoryActors a').each((index, element) => {
        actors.push(this.cleanText($(element).text()));
      });

      const director = this.cleanText($('.fullstoryDirector').text());
      const duration = this.cleanText($('.fullstoryDuration').text());
      const country = this.cleanText($('.fullstoryCountry').text());

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
      console.log(`📺 Getting series info from Baskino: ${id}`);
      
      const url = `${this.baseUrl}/index.php?newsid=${id}`;
      const html = await this.getPage(url);
      const $ = this.parseHTML(html);

      const title = this.cleanText($('.fullstoryTitle h1').text());
      const originalTitle = this.cleanText($('.fullstoryOriginalTitle').text());
      const year = this.extractYear($('.fullstoryYear').text());
      const rating = this.extractRating($('.fullstoryRating').text());
      const poster = this.normalizeUrl($('.fullstoryImg img').attr('src'));
      const description = this.cleanText($('.fullstoryText').text());

      // Парсим сезоны
      const seasons = [];
      $('.seasonBlock').each((index, element) => {
        const $season = $(element);
        const seasonNumber = $season.find('.seasonNumber').text();
        const episodes = [];
        
        $season.find('.episodeItem').each((epIndex, epElement) => {
          const $episode = $(epElement);
          episodes.push({
            number: $episode.find('.episodeNumber').text(),
            title: this.cleanText($episode.find('.episodeTitle').text()),
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
      console.log(`🎥 Getting streams from Baskino: ${id}`);
      
      const url = `${this.baseUrl}/index.php?newsid=${id}`;
      const html = await this.getPage(url);
      const $ = this.parseHTML(html);

      const streams = [];

      // Парсим плееры
      $('.playerBlock').each((index, element) => {
        const $player = $(element);
        const playerName = this.cleanText($player.find('.playerName').text());
        const playerUrl = $player.find('.playerUrl').attr('data-url');
        const quality = this.cleanText($player.find('.playerQuality').text());

        if (playerUrl) {
          streams.push({
            name: playerName,
            url: playerUrl,
            quality: quality || 'HD',
            source: 'baskino'
          });
        }
      });

      return streams;

    } catch (error) {
      return this.handleError(error, 'getStreams');
    }
  }
}

module.exports = BaskinoParser; 