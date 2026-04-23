const http = require('http');
http.get('http://localhost:3000', (res) => {
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
  });
}).on('error', (e) => {
  console.error(e.message);
});
