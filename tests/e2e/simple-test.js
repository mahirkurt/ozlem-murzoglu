// Simple test to check if the app is running
const http = require('http');

const testPort = (port) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      console.log(`Port ${port}: Status Code ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`✅ Application is running on port ${port}`);
        resolve(true);
      } else {
        console.log(`⚠️ Application returned ${res.statusCode} on port ${port}`);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log(`❌ Error connecting to port ${port}:`, error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`❌ Timeout connecting to port ${port}`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Test both ports
const runTests = async () => {
  console.log('🔍 Testing application availability...\n');
  
  const port4200 = await testPort(4200);
  
  if (port4200) {
    const availablePort = 4200;
    console.log(`\n✨ Application is available on port ${availablePort}`);
    console.log(`🌐 Open http://localhost:${availablePort} in your browser\n`);
    
    // Test specific endpoints
    console.log('📋 Testing endpoints...');
    const endpoints = [
      '/',
      '/hakkimizda',
      '/hizmetlerimiz',
      '/kaynaklar',
      '/iletisim',
      '/hizmetlerimiz/triple-p'
    ];
    
    for (const endpoint of endpoints) {
      const options = {
        hostname: 'localhost',
        port: availablePort,
        path: endpoint,
        method: 'GET',
        timeout: 3000
      };
      
      const result = await new Promise((resolve) => {
        const req = http.request(options, (res) => {
          if (res.statusCode === 200) {
            console.log(`  ✅ ${endpoint} - OK`);
          } else {
            console.log(`  ⚠️ ${endpoint} - Status ${res.statusCode}`);
          }
          resolve(true);
        });
        
        req.on('error', () => {
          console.log(`  ❌ ${endpoint} - Failed`);
          resolve(false);
        });
        
        req.end();
      });
    }
  } else {
    console.log('\n❌ Application is not running on port 4200');
    console.log('💡 Please start the application with: npm start or ng serve');
  }
};

runTests();
