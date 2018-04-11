const path = require('path');
const axios = require('axios');
const webpack = require('webpack');
const MemoryFd = require('memory-fs');
const proxy = require('http-proxy-middleware');

const serverRender = require('./serverRender');

const serverConfig = require('../../build/webpack.config.server');

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
}

// const Module = module.constructor;

const NativeModule = require('module');
const vm = require('vm');

// (function(exports, require, module, __filename, __dirname){bundle code})
const getModulefromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
}
const mfs = new MemoryFd();
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
let serverBundle;
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  stats = stats.toJson();
  stats.errors.forEach(err => console.log(err));
  stats.warnings.forEach(warn => console.log(warn));

  const bundlePath = path.resolve(
    serverConfig.output.path,
    serverConfig.output.filename
  );

  const bundle = mfs.readFileSync(bundlePath, 'utf-8');
  const m = getModulefromString(bundle, 'serverEntry.js')
  serverBundle = m.exports;
});

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888',
  }))
  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('waiting for compile, refresh later');
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res);
    }).catch(next)
  });
};
