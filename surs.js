var parser = {
  "name": "Ukraine Parser",
  "type": "custom",
  "base_url": "https://vid-store.vercel.app",
  "search_url": "/api/search?query={query}",
  "movie_url": "/api/movie/{id}/full?source={source}",
  "series_url": "/api/series/{id}/full?source={source}",
  "stream_url": "/api/stream/{id}?source={source}",
  "sources": ["filmix", "baskino"],
  "version": "1.0.0",
  "description": "Parser for Ukrainian streaming sites (Filmix, Baskino)",
  "author": "moloko666777",
  "repository": "https://github.com/moloko666777/vidStore",
  "supported_features": {
    "search": true,
    "movies": true,
    "series": true,
    "streams": true,
    "multiple_sources": true
  },
  "endpoints": {
    "health": "/health",
    "sources": "/api/search/sources/available",
    "search": "/api/search?query={query}&sources={sources}",
    "movie_info": "/api/movie/{id}?source={source}",
    "movie_streams": "/api/movie/{id}/streams?source={source}",
    "series_info": "/api/series/{id}?source={source}",
    "series_streams": "/api/series/{id}/streams?source={source}",
    "episode_info": "/api/series/{id}/season/{season}/episode/{episode}?source={source}"
  }
};