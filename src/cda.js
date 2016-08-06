const safeEval = require('safe-eval');
const rp = require('request-promise');
const window = require('jsdom').jsdom().defaultView;

window.jwplayer = () => {
  return {
    setup: (...args) => {
      return args[0].modes[0].config.file;
    },
  };
};
window.ads = () => { return false; };
window.checkFlash = () => { return true; };

const CDA = (() => {

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
