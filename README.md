# Lampa Ukraine Parser 🎬

Парсер для приложения Lampa, который получает контент с украинских ресурсов (Filmix, Baskino и др.).

## ✨ Возможности

- 🔍 Поиск фильмов и сериалов по всем источникам
- 📺 Получение подробной информации о контенте
- 🎬 Получение ссылок на видео и стримы
- 🌐 Поддержка украинских ресурсов
- 🚀 REST API для интеграции с Lampa
- ⚡ Быстрая работа и кэширование
- 🛡️ Защита от rate limiting

## 🌐 Поддерживаемые ресурсы

- **Filmix** - filmix.ac
- **Baskino** - baskino.me
- **UAKino** - uakino.club (готов к добавлению)
- **Kinogo** - kinogo.by (готов к добавлению)
- **HDRezka** - hdrezka.ag (готов к добавлению)

## 🚀 Быстрый старт

### Установка

```bash
git clone https://github.com/yourusername/lampa-ukraine-parser.git
cd lampa-ukraine-parser
npm install
```

### Запуск

```bash
# Разработка
npm run dev

# Продакшн
npm start

# Тестирование
npm test
```

### Проверка работы

```bash
# Health check
curl http://localhost:3000/health

# Доступные источники
curl http://localhost:3000/api/search/sources/available

# Поиск
curl "http://localhost:3000/api/search?query=название фильма"
```

📖 Подробные инструкции по тестированию и добавлению на GitHub: [TESTING_AND_GITHUB.md](./TESTING_AND_GITHUB.md)

## 📡 API Endpoints

### Поиск
- `GET /api/search?query=название` - поиск по всем источникам
- `GET /api/search?query=название&sources=filmix,baskino` - поиск по конкретным источникам
- `GET /api/search/filmix?query=название` - поиск по конкретному источнику

### Фильмы
- `GET /api/movie/:id?source=filmix` - информация о фильме
- `GET /api/movie/:id/streams?source=filmix` - стримы фильма
- `GET /api/movie/:id/full?source=filmix` - полная информация + стримы

### Сериалы
- `GET /api/series/:id?source=filmix` - информация о сериале
- `GET /api/series/:id/streams?source=filmix` - стримы сериала
- `GET /api/series/:id/full?source=filmix` - полная информация + стримы
- `GET /api/series/:id/season/:season/episode/:episode?source=filmix` - конкретная серия

### Стримы
- `GET /api/stream/:id?source=filmix` - все стримы
- `GET /api/stream/:id/quality/hd?source=filmix` - стримы по качеству
- `GET /api/stream/:id/player/vk?source=filmix` - стримы по плееру
- `GET /api/stream/:id/qualities?source=filmix` - доступные качества
- `GET /api/stream/:id/players?source=filmix` - доступные плееры

## 🌍 Развертывание

Проект можно развернуть на бесплатных платформах:

### Vercel (Рекомендуется) ⭐
```bash
# Подключите репозиторий к Vercel
# Получите URL: https://your-project.vercel.app
```

### Netlify
```bash
# Загрузите проект на Netlify
# Получите URL: https://your-project.netlify.app
```

### Railway
```bash
# Подключите репозиторий к Railway
# Получите URL: https://your-project.railway.app
```

### Render
```bash
# Создайте Web Service на Render
# Получите URL: https://your-project.onrender.com
```

📖 Подробные инструкции: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 Интеграция с Lampa

После развертывания добавьте парсер в Lampa:

```javascript
var parser = {
  "name": "Ukraine Parser",
  "type": "custom",
  "base_url": "https://your-url.vercel.app",
  "search_url": "/api/search?query={query}",
  "movie_url": "/api/movie/{id}/full?source={source}",
  "series_url": "/api/series/{id}/full?source={source}",
  "stream_url": "/api/stream/{id}?source={source}",
  "sources": ["filmix", "baskino"]
};
```

Добавьте URL в настройки Lampa (замените на URL вашего развернутого проекта):
```
https://raw.githubusercontent.com/moloko666777/vidStore/main/surs.js
```

📖 Подробные инструкции: [LAMPA_INTEGRATION.md](./LAMPA_INTEGRATION.md)

## 📁 Структура проекта

```
├── src/
│   ├── parsers/          # Парсеры для разных сайтов
│   │   ├── baseParser.js     # Базовый класс парсера
│   │   ├── filmixParser.js   # Парсер Filmix
│   │   └── baskinoParser.js  # Парсер Baskino
│   ├── services/         # Бизнес-логика
│   │   ├── searchService.js  # Сервис поиска
│   │   └── contentService.js # Сервис контента
│   ├── routes/           # API маршруты
│   │   ├── search.js     # Маршруты поиска
│   │   ├── movie.js      # Маршруты фильмов
│   │   ├── series.js     # Маршруты сериалов
│   │   └── stream.js     # Маршруты стримов
│   ├── utils/            # Утилиты
│   │   └── httpClient.js # HTTP клиент
│   └── config/           # Конфигурация
│       └── config.js     # Настройки
├── tests/                # Тесты
├── index.js              # Точка входа
├── package.json          # Зависимости
├── vercel.json           # Конфигурация Vercel
├── netlify.toml          # Конфигурация Netlify
└── README.md             # Документация
```

## 🛠️ Технологии

- **Node.js** - серверная платформа
- **Express** - веб-фреймворк
- **Cheerio** - парсинг HTML
- **Axios** - HTTP клиент
- **Rate Limiter** - защита от перегрузки

## 📊 Статус

- ✅ Поиск фильмов и сериалов
- ✅ Получение информации о контенте
- ✅ Получение стримов
- ✅ Rate limiting и защита
- ✅ Кэширование
- ✅ Обработка ошибок
- ✅ Логирование
- ✅ Тесты
- ✅ Документация

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте [issues](../../issues)
2. Создайте новый issue с описанием проблемы
3. Приложите логи и конфигурацию

## ⚠️ Отказ от ответственности

Этот проект предназначен только для образовательных целей. Используйте на свой страх и риск. Авторы не несут ответственности за использование проекта. 

## Disclaimer

This parser is for educational purposes only. Please respect the terms of service of the websites being parsed and ensure you have the right to access their content.

---

**Last updated:** July 31, 2024 - Vercel deployment fix applied 
