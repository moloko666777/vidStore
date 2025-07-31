const express = require('express');
const router = express.Router();
const contentService = require('../services/contentService');

// Получение информации о сериале
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { source } = req.query;
    
    if (!source) {
      return res.status(400).json({
        error: 'Source parameter is required',
        example: '/api/series/123?source=filmix'
      });
    }

    const seriesInfo = await contentService.getSeriesInfo(id, source);
    
    res.json({
      success: true,
      series: seriesInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get series route error:', error);
    res.status(500).json({
      error: 'Failed to get series info',
      message: error.message
    });
  }
});

// Получение стримов для сериала
router.get('/:id/streams', async (req, res) => {
  try {
    const { id } = req.params;
    const { source, sources } = req.query;
    
    let streams;
    
    if (sources) {
      // Получаем стримы с нескольких источников
      const sourceList = sources.split(',');
      streams = await contentService.getMultipleStreams(id, sourceList);
    } else if (source) {
      // Получаем стримы с одного источника
      const streamList = await contentService.getStreams(id, source);
      streams = {
        id,
        streams: streamList,
        total: streamList.length,
        sources: [source]
      };
    } else {
      return res.status(400).json({
        error: 'Source or sources parameter is required',
        example: '/api/series/123/streams?source=filmix'
      });
    }
    
    res.json({
      success: true,
      ...streams,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get series streams route error:', error);
    res.status(500).json({
      error: 'Failed to get series streams',
      message: error.message
    });
  }
});

// Получение полной информации о сериале (включая стримы)
router.get('/:id/full', async (req, res) => {
  try {
    const { id } = req.params;
    const { source } = req.query;
    
    if (!source) {
      return res.status(400).json({
        error: 'Source parameter is required',
        example: '/api/series/123/full?source=filmix'
      });
    }

    const seriesInfo = await contentService.getContentInfo(id, source, 'series');
    
    res.json({
      success: true,
      series: seriesInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get full series route error:', error);
    res.status(500).json({
      error: 'Failed to get full series info',
      message: error.message
    });
  }
});

// Получение информации о конкретной серии
router.get('/:id/season/:seasonNumber/episode/:episodeNumber', async (req, res) => {
  try {
    const { id, seasonNumber, episodeNumber } = req.params;
    const { source } = req.query;
    
    if (!source) {
      return res.status(400).json({
        error: 'Source parameter is required',
        example: '/api/series/123/season/1/episode/1?source=filmix'
      });
    }

    const seriesInfo = await contentService.getSeriesInfo(id, source);
    
    if (!seriesInfo.seasons) {
      return res.status(404).json({
        error: 'Seasons information not found'
      });
    }

    const season = seriesInfo.seasons.find(s => s.number == seasonNumber);
    if (!season) {
      return res.status(404).json({
        error: `Season ${seasonNumber} not found`
      });
    }

    const episode = season.episodes.find(e => e.number == episodeNumber);
    if (!episode) {
      return res.status(404).json({
        error: `Episode ${episodeNumber} not found in season ${seasonNumber}`
      });
    }

    // Получаем стримы для эпизода
    let streams = [];
    try {
      const episodeId = contentService.extractId(episode.url);
      if (episodeId) {
        streams = await contentService.getStreams(episodeId, source);
      }
    } catch (streamError) {
      console.warn(`⚠️ Could not get streams for episode: ${streamError.message}`);
    }

    res.json({
      success: true,
      series: {
        ...seriesInfo,
        currentSeason: season,
        currentEpisode: {
          ...episode,
          streams
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get episode route error:', error);
    res.status(500).json({
      error: 'Failed to get episode info',
      message: error.message
    });
  }
});

module.exports = router; 