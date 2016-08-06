// modules for http requests

const http = require('http');

const downloadUrl = (url) => {
  return new Promise((resolve, reject) => {
  http.get(url, (res) => {
    if (res.statusCode < 200 || res.statusCode > 299) {
      reject(new Error('Bad status code: ${res.statusCode}'));
    }

    const html = [];

    http.on('data', (data) => html.push(data));
    http.on('end', () => resolve(html));
  }).on('error', (e) => {
    reject(e);
  });
})};

module.exports = downloadUrl;
