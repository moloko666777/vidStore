const searchService = require('../src/services/searchService');

describe('SearchService', () => {
  test('should search across all sources', async () => {
    const query = 'test';
    const result = await searchService.search(query);
    
    expect(result).toHaveProperty('query', query);
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('sources');
    expect(Array.isArray(result.results)).toBe(true);
  });

  test('should search by specific source', async () => {
    const query = 'test';
    const source = 'filmix';
    const result = await searchService.searchBySource(query, source);
    
    expect(result).toHaveProperty('query', query);
    expect(result).toHaveProperty('source', source);
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.results)).toBe(true);
  });

  test('should return available sources', () => {
    const sources = searchService.getAvailableSources();
    expect(Array.isArray(sources)).toBe(true);
    expect(sources).toContain('filmix');
    expect(sources).toContain('baskino');
  });

  test('should handle search errors gracefully', async () => {
    const query = '';
    const result = await searchService.search(query);
    
    expect(result).toHaveProperty('query', query);
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('total');
  });
}); 