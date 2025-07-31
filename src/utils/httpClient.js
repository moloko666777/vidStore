const axios = require('axios');
const config = require('../config/config');

class HttpClient {
  constructor() {
    this.instance = axios.create({
      timeout: config.request.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'uk-UA,uk;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    // Добавляем перехватчики для логирования и обработки ошибок
    this.instance.interceptors.request.use(
      (config) => {
        console.log(`🌐 Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error.message);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        console.log(`✅ Response received from: ${response.config.url} (${response.status})`);
        return response;
      },
      (error) => {
        console.error('❌ Response error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  async request(url, options = {}) {
    const { retries = config.request.retries, delay = config.request.delay } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.instance.get(url, options);
        return response;
      } catch (error) {
        console.error(`❌ Attempt ${attempt}/${retries} failed for ${url}:`, error.message);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Ждем перед следующей попыткой
        await this.sleep(delay * attempt);
      }
    }
  }

  async requestWithHeaders(url, headers = {}) {
    return this.request(url, { headers });
  }

  async post(url, data = {}, options = {}) {
    try {
      const response = await this.instance.post(url, data, options);
      return response;
    } catch (error) {
      console.error('❌ POST request error:', error.message);
      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Метод для получения случайного User-Agent
  getRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }
}

module.exports = new HttpClient(); 