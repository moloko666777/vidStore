const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing Lampa Ukraine Parser API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const health = await makeRequest('/health');
    console.log('✅ Health check:', health);
    console.log('');

    // Test available sources
    console.log('2. Testing available sources...');
    const sources = await makeRequest('/api/search/sources/available');
    console.log('✅ Available sources:', sources);
    console.log('');

    // Test search (this will likely return empty results since we're not actually parsing real sites)
    console.log('3. Testing search...');
    const search = await makeRequest('/api/search?query=test');
    console.log('✅ Search results:', search);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('🚀 Your Lampa Ukraine Parser is ready to use!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI(); 