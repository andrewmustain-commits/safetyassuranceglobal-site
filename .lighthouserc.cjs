module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [
        'https://safetyassuranceglobal.com/',
        'https://safetyassuranceglobal.com/maritime/',
        'https://safetyassuranceglobal.com/services/',
        'https://safetyassuranceglobal.com/contact/',
        'https://safetyassuranceglobal.com/request-proposal/'
      ],
      settings: {
        preset: 'desktop',
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }]
      }
    }
  }
};
