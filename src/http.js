const nodeHttp = require('http');


const http = (() => {
  const getUrl = (url) => new Promise((resolve, reject) => {
    const req = nodeHttp.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(new Error(`Bad status code ${res.statusCode}`));
      }

      const html = [];

      res.on('data', (chunk) => html.push(chunk));
      res.on('end', () => resolve(html.join('')));
    });

    req.on('error', (err) => reject(err));
  });

  return {
    getUrl,
  };
})();

module.exports = http;
