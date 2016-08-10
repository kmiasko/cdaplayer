const safeEval = require('safe-eval');
const rp = require('./http');

const CDA = (() => {
  // "emulation" of env needed by eval (video link obfuscator)
  const window = {};

  window.jwplayer = () => {
    return {
      setup: (...args) => {
        return args[0].modes[0].config.file;
      },
    };
  };
  window.ads = () => false;
  window.checkFlash = () => true;
  window.navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
  };

  const getEval = (data) => {
    const e = data.match(/^eval(.*)$/m)[0];
    return safeEval(e, window);
  };

  const getFileUrl = (url) => rp.getUrl(url);

  const download = (url) => getFileUrl(url)
    .then(getEval)
    .catch((err) => new Error(err));

  return {
    download,
  };
})();

module.exports = CDA;
