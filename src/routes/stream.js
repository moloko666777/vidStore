const express = require('express');
const router = express.Router();
const contentService = require('../services/contentService');

// Получение стримов по ID контента
router.get('/:id', async (req, res) => {
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
        example: '/api/stream/123?source=filmix'
      });
    }
    
    res.json({
      success: true,
      ...streams,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get streams route error:', error);
    res.status(500).json({
      error: 'Failed to get streams',
      message: error.message
    });
  }
});

// Получение стримов по качеству
router.get('/:id/quality/:quality', async (req, res) => {
  try {
    const { id, quality } = req.params;
    const { source, sources } = req.query;
    
    let streams;
    
    if (sources) {
      const sourceList = sources.split(',');
      streams = await contentService.getMultipleStreams(id, sourceList);
    } else if (source) {
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
        example: '/api/stream/123/quality/hd?source=filmix'
      });
    }
    
    // Фильтруем по качеству
    const filteredStreams = streams.streams.filter(stream => 
      stream.quality && stream.quality.toLowerCase().includes(quality.toLowerCase())
    );
    
    res.json({
      success: true,
      id,
      streams: filteredStreams,
      total: filteredStreams.length,
      quality,
      sources: streams.sources,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get streams by quality route error:', error);
    res.status(500).json({
      error: 'Failed to get streams by quality',
      message: error.message
    });
  }
});

// Получение стримов по плееру
router.get('/:id/player/:player', async (req, res) => {
  try {
    const { id, player } = req.params;
    const { source, sources } = req.query;
    
    let streams;
    
    if (sources) {
      const sourceList = sources.split(',');
      streams = await contentService.getMultipleStreams(id, sourceList);
    } else if (source) {
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
        example: '/api/stream/123/player/vk?source=filmix'
      });
    }
    
    // Фильтруем по плееру
    const filteredStreams = streams.streams.filter(stream => 
      stream.name && stream.name.toLowerCase().includes(player.toLowerCase())
    );
    
    res.json({
      success: true,
      id,
      streams: filteredStreams,
      total: filteredStreams.length,
      player,
      sources: streams.sources,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get streams by player route error:', error);
    res.status(500).json({
      error: 'Failed to get streams by player',
      message: error.message
    });
  }
});

// Получение доступных качеств
router.get('/:id/qualities', async (req, res) => {
  try {
    const { id } = req.params;
    const { source, sources } = req.query;
    
    let streams;
    
    if (sources) {
      const sourceList = sources.split(',');
      streams = await contentService.getMultipleStreams(id, sourceList);
    } else if (source) {
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
        example: '/api/stream/123/qualities?source=filmix'
      });
    }
    
    // Извлекаем уникальные качества
    const qualities = [...new Set(streams.streams.map(stream => stream.quality).filter(Boolean))];
    
    res.json({
      success: true,
      id,
      qualities,
      total: qualities.length,
      sources: streams.sources,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get qualities route error:', error);
    res.status(500).json({
      error: 'Failed to get qualities',
      message: error.message
    });
  }
});

// Получение доступных плееров
router.get('/:id/players', async (req, res) => {
  try {
    const { id } = req.params;
    const { source, sources } = req.query;
    
    let streams;
    
    if (sources) {
      const sourceList = sources.split(',');
      streams = await contentService.getMultipleStreams(id, sourceList);
    } else if (source) {
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
        example: '/api/stream/123/players?source=filmix'
      });
    }
    
    // Извлекаем уникальные плееры
    const players = [...new Set(streams.streams.map(stream => stream.name).filter(Boolean))];
    
    res.json({
      success: true,
      id,
      players,
      total: players.length,
      sources: streams.sources,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get players route error:', error);
    res.status(500).json({
      error: 'Failed to get players',
      message: error.message
    });
  }
});

module.exports = router; 