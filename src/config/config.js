module.exports = {
  // Настройки для разных сайтов
  sites: {
    filmix: {
      baseUrl: 'https://filmix.ac',
      searchUrl: 'https://filmix.ac/search/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'uk-UA,uk;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    },
    baskino: {
      baseUrl: 'https://baskino.me',
      searchUrl: 'https://baskino.me/index.php?do=search',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'uk-UA,uk;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    },
    uakino: {
      baseUrl: 'https://uakino.club',
      searchUrl: 'https://uakino.club/search/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'uk-UA,uk;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    }
  },

  // Настройки запросов
  request: {
    timeout: 10000,
    retries: 3,
    delay: 1000 // Задержка между запросами в мс
  },

  // Настройки кэширования
  cache: {
    enabled: true,
    ttl: 3600 // Время жизни кэша в секундах
  },

  // Настройки API
  api: {
    version: 'v1',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 100 // максимум 100 запросов с одного IP
    }
  }
}; 