const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');

// Поиск по всем источникам
router.get('/', async (req, res) => {
  try {
    const { query, sources } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query parameter is required',
        example: '/api/search?query=название фильма'
      });
    }

    const sourceList = sources ? sources.split(',') : ['filmix', 'baskino'];
    const results = await searchService.search(query, sourceList);
    
    res.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Search route error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

// Поиск по конкретному источнику
router.get('/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query parameter is required',
        example: `/api/search/${source}?query=название фильма`
      });
    }

    const results = await searchService.searchBySource(query, source);
    
    res.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Search by source route error:`, error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

// Получение доступных источников
router.get('/sources/available', (req, res) => {
  try {
    const sources = searchService.getAvailableSources();
    
    res.json({
      success: true,
      sources,
      total: sources.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Get sources route error:', error);
    res.status(500).json({
      error: 'Failed to get sources',
      message: error.message
    });
  }
});

module.exports = router; 