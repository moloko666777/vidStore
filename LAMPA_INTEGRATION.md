# Интеграция с Lampa

Этот парсер создан для интеграции с приложением Lampa. Ниже приведены инструкции по настройке.

## Настройка в Lampa

### 1. Добавление парсера в Lampa

1. Откройте приложение Lampa
2. Перейдите в настройки
3. Найдите раздел "Парсеры" или "Источники"
4. Добавьте новый парсер

### 2. Конфигурация парсера

```javascript
var parser = {
  "name": "Ukraine Parser",
  "type": "custom",
  "base_url": "https://your-deployed-url.vercel.app",
  "search_url": "/api/search?query={query}",
  "movie_url": "/api/movie/{id}/full?source={source}",
  "series_url": "/api/series/{id}/full?source={source}",
  "stream_url": "/api/stream/{id}?source={source}",
  "sources": ["filmix", "baskino"]
};
```

### 3. Добавление URL в Lampa

В настройках Lampa добавьте URL вашего развернутого проекта:
```
https://raw.githubusercontent.com/moloko666777/vidStore/main/surs.js
```
(Замените URL на ваш собственный после развертывания)

### 3. Поддерживаемые источники

- **filmix** - Filmix.ac
- **baskino** - Baskino.me

### 4. Примеры запросов

#### Поиск фильмов
```
GET /api/search?query=название фильма
```

#### Информация о фильме
```
GET /api/movie/123/full?source=filmix
```

#### Информация о сериале
```
GET /api/series/456/full?source=baskino
```

#### Стримы
```
GET /api/stream/123?source=filmix
```

## Структура ответов

### Поиск
```json
{
  "success": true,
  "query": "название фильма",
  "results": [
    {
      "id": "123",
      "title": "Название фильма",
      "originalTitle": "Original Title",
      "year": 2023,
      "rating": 8.5,
      "poster": "https://example.com/poster.jpg",
      "description": "Описание фильма",
      "genres": ["боевик", "драма"],
      "actors": ["Актер 1", "Актер 2"],
      "director": "Режиссер",
      "duration": "2ч 15мин",
      "country": "США",
      "type": "movie",
      "url": "https://example.com/movie/123",
      "source": "filmix"
    }
  ],
  "total": 1,
  "sources": ["filmix", "baskino"]
}
```

### Информация о фильме/сериале
```json
{
  "success": true,
  "movie": {
    "id": "123",
    "title": "Название фильма",
    "originalTitle": "Original Title",
    "year": 2023,
    "rating": 8.5,
    "poster": "https://example.com/poster.jpg",
    "description": "Описание фильма",
    "genres": ["боевик", "драма"],
    "actors": ["Актер 1", "Актер 2"],
    "director": "Режиссер",
    "duration": "2ч 15мин",
    "country": "США",
    "type": "movie",
    "url": "https://example.com/movie/123",
    "source": "filmix",
    "streams": [
      {
        "name": "VK Player",
        "url": "https://vk.com/video123",
        "quality": "HD",
        "source": "filmix"
      }
    ]
  }
}
```

### Стримы
```json
{
  "success": true,
  "id": "123",
  "streams": [
    {
      "name": "VK Player",
      "url": "https://vk.com/video123",
      "quality": "HD",
      "source": "filmix"
    },
    {
      "name": "YouTube Player",
      "url": "https://youtube.com/watch?v=123",
      "quality": "FullHD",
      "source": "baskino"
    }
  ],
  "total": 2,
  "sources": ["filmix", "baskino"]
}
```

## Развертывание

### Vercel (Рекомендуется)
1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Vercel автоматически развернет приложение
4. Используйте полученный URL в конфигурации Lampa

### Netlify
1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Загрузите файлы проекта
3. Настройте функции Netlify
4. Используйте полученный URL

### Railway
1. Зарегистрируйтесь на [railway.app](https://railway.app)
2. Подключите репозиторий
3. Настройте переменные окружения
4. Получите URL для использования

## Устранение неполадок

### Проблемы с доступом к сайтам
- Проверьте, что сайты доступны из вашего региона
- Используйте VPN при необходимости
- Обновите User-Agent в конфигурации

### Ошибки парсинга
- Проверьте структуру HTML на сайтах
- Обновите селекторы в парсерах
- Проверьте логи сервера

### Проблемы с Lampa
- Убедитесь, что URL парсера корректный
- Проверьте формат ответов API
- Обновите версию Lampa

## Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Убедитесь, что все зависимости установлены
3. Проверьте доступность сайтов-источников
4. Создайте issue в репозитории проекта 
