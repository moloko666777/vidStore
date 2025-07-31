const cheerio = require('cheerio');
const httpClient = require('../utils/httpClient');

class BaseParser {
  constructor(siteConfig) {
    this.config = siteConfig;
    this.baseUrl = siteConfig.baseUrl;
    this.searchUrl = siteConfig.searchUrl;
    this.headers = siteConfig.headers;
  }

  // Базовый метод для получения HTML страницы
  async getPage(url, customHeaders = {}) {
    try {
      const headers = { ...this.headers, ...customHeaders };
      const response = await httpClient.requestWithHeaders(url, headers);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching page ${url}:`, error.message);
      throw error;
    }
  }

  // Базовый метод для парсинга HTML с Cheerio
  parseHTML(html) {
    return cheerio.load(html);
  }

  // Базовый метод поиска
  async search(query) {
    throw new Error('search method must be implemented in child class');
  }

  // Базовый метод получения информации о фильме
  async getMovieInfo(id) {
    throw new Error('getMovieInfo method must be implemented in child class');
  }

  // Базовый метод получения информации о сериале
  async getSeriesInfo(id) {
    throw new Error('getSeriesInfo method must be implemented in child class');
  }

  // Базовый метод получения стримов
  async getStreams(id) {
    throw new Error('getStreams method must be implemented in child class');
  }

  // Утилиты для очистки текста
  cleanText(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
  }

  // Утилита для извлечения ID из URL
  extractId(url) {
    const match = url.match(/(\d+)/);
    return match ? match[1] : null;
  }

  // Утилита для нормализации URL
  normalizeUrl(url) {
    if (url.startsWith('http')) {
      return url;
    }
    return `${this.baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  }

  // Утилита для извлечения года из строки
  extractYear(text) {
    const match = text.match(/(\d{4})/);
    return match ? parseInt(match[1]) : null;
  }

  // Утилита для извлечения рейтинга
  extractRating(text) {
    const match = text.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }

  // Утилита для создания стандартного объекта результата
  createResultItem(data) {
    return {
      id: data.id,
      title: data.title,
      originalTitle: data.originalTitle || data.title,
      year: data.year,
      rating: data.rating,
      poster: data.poster,
      description: data.description,
      genres: data.genres || [],
      duration: data.duration,
      country: data.country,
      director: data.director,
      actors: data.actors || [],
      type: data.type, // 'movie' или 'series'
      url: data.url,
      source: this.constructor.name.toLowerCase().replace('parser', '')
    };
  }

  // Утилита для обработки ошибок
  handleError(error, context = '') {
    console.error(`❌ Error in ${this.constructor.name} ${context}:`, error.message);
    return {
      error: true,
      message: error.message,
      context
    };
  }
}

module.exports = BaseParser; 