const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://upload.wikimedia.org/wikipedia/en/5/5b/East_African_Community_logo.png';
const dest = path.join(__dirname, 'public', 'logo.png');

const file = fs.createWriteStream(dest);
https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Download complete');
  });
}).on('error', function(err) {
  fs.unlink(dest);
  console.error('Error downloading file:', err.message);
});
