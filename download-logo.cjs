const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://www.vectorlogo.zone/logos/eac/eac-tile.png';
const dest = path.join(__dirname, 'public', 'logo.png');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error('Final Status:', res.statusCode);
    return;
  }
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Success');
  });
}).on('error', (err) => console.error(err.message));
