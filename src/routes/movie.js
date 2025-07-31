const express = require('express');
const router = express.Router();
const contentService = require('../services/contentService');

// Получение информации о фильме
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { source } = req.query;
    
    if (!source) {
      return res.status(400).json({
        error: 'Source parameter is required',
        example: '/api/movie/123?source=filmix'
      });
    }

    const movieInfo = await contentService.getMovieInfo(id, source);
    
    res.json({
      success: true,
      movie: movieInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get movie route error:', error);
    res.status(500).json({
      error: 'Failed to get movie info',
      message: error.message
    });
  }
});

// Получение стримов для фильма
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
        example: '/api/movie/123/streams?source=filmix'
      });
    }
    
    res.json({
      success: true,
      ...streams,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get movie streams route error:', error);
    res.status(500).json({
      error: 'Failed to get movie streams',
      message: error.message
    });
  }
});

// Получение полной информации о фильме (включая стримы)
router.get('/:id/full', async (req, res) => {
  try {
    const { id } = req.params;
    const { source } = req.query;
    
    if (!source) {
      return res.status(400).json({
        error: 'Source parameter is required',
        example: '/api/movie/123/full?source=filmix'
      });
    }

    const movieInfo = await contentService.getContentInfo(id, source, 'movie');
    
    res.json({
      success: true,
      movie: movieInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get full movie route error:', error);
    res.status(500).json({
      error: 'Failed to get full movie info',
      message: error.message
    });
  }
});

module.exports = router; 