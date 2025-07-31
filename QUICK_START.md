# 🚀 Быстрый старт - Развертывание за 5 минут

## Шаг 1: Развертывание на Vercel

1. **Откройте:** https://vercel.com/new
2. **Войдите через GitHub**
3. **Выберите репозиторий:** `moloko666777/vidStore`
4. **Нажмите:** "Deploy"
5. **Дождитесь развертывания** (1-2 минуты)
6. **Скопируйте URL** (например: `https://vidstore-xxx.vercel.app`)

## Шаг 2: Интеграция с Lampa

1. **Откройте приложение Lampa**
2. **Настройки → Парсеры**
3. **Добавьте новый парсер:**

```json
{
  "name": "Ukraine Parser",
  "type": "custom",
  "base_url": "https://your-url.vercel.app",
  "search_url": "/api/search?query={query}",
  "movie_url": "/api/movie/{id}/full?source={source}",
  "series_url": "/api/series/{id}/full?source={source}",
  "stream_url": "/api/stream/{id}?source={source}"
}
```

## Шаг 3: Тестирование

Замените `your-url.vercel.app` на ваш URL и протестируйте:

```bash
# Health check
curl https://your-url.vercel.app/health

# Поиск
curl "https://your-url.vercel.app/api/search?query=название фильма"
```

## ✅ Готово!

Теперь у вас есть рабочий парсер для украинских ресурсов в Lampa!

## 🔧 Поддержка

- **Логи:** https://vercel.com/dashboard → ваш проект → Functions
- **Обновления:** Автоматически при push в GitHub
- **Мониторинг:** В реальном времени в панели Vercel

## 📱 Использование в Lampa

1. Откройте Lampa
2. Найдите фильм/сериал
3. Парсер автоматически найдет контент на украинских сайтах
4. Выберите источник и качество
5. Наслаждайтесь просмотром! 🎬 