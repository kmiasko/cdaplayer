const safeEval = require('safe-eval');
const rp = require('request-promise');

const CDA = (() => {

  // "emulation" of env needed by eval (video link obfuscator)
  const window = {};

  window.jwplayer = () => {
    return {
      setup: (...args) => {
        console.log(args[0].modes[0].config.file);
        return args[0].modes[0].config.file;
      },
    };
  };
  window.ads = () => { return false; };
  window.checkFlash = () => { return true; };
  window.navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
  };

  const getEval = (data) => {
    const e = data.match(/^eval(.*)$/m)[0];
    const prom = new Promise((resolve, reject) => {
      const result = safeEval(e, window);
      if (result) resolve(result);
      else reject(new Error('Can\'t evaluate code'));
    });
    return prom;
  };

  const getFileUrl = (url) => rp(url);

  const download = (url) => {
    return getFileUrl(url)
    .then(getEval);
  };

  return {
    download: download,
  };
})();

module.exports = CDA;
