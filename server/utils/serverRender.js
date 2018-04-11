const ReactDomServer = require('react-dom/server');
const bootstrapper = require('react-async-bootstrapper');
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const Helmat = require('react-helmet').default;

const SheetsRegistry = require('react-jss').SheetsRegistry;
// const create = require('jss').create;
// const preset = require('jss-preset-default').default;
const createMuiTheme = require('material-ui/styles').createMuiTheme;
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default;
const colors = require('material-ui/colors');

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
};

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const user = req.session.user;
    const createStoreMap = bundle.createStoreMap;
    const createApp = bundle.default;
    const routeContext = {};
    const stores = createStoreMap();
    const sheetsRegistry = new SheetsRegistry();

    if (user) {
      console.log(user);
      stores.appState.user.info = user;
      stores.appState.user.isLogin = true;
    }

    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        accent: colors.lightBlue,
        type: 'light',
      }
    });

    const generateClassName = createGenerateClassName();

    const app = createApp(stores, routeContext, sheetsRegistry, generateClassName, theme, req.url);
    bootstrapper(app).then(() => {
      if (routeContext.url) {
        res.status(302).set({ 'Location': routeContext.url });
        res.end();
        return;
      }
      const helmet = Helmat.rewind();
      const state = getStoreState(stores);
      const content = ReactDomServer.renderToString(app);
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString(),
      })
      res.send(html);
      resolve();
    }).catch(reject);
  });
};
