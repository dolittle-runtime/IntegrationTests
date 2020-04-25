const path = require('path');
const envPath = path.resolve(process.cwd(), 'dolittle.env');

require('dotenv').config({ path: envPath });

const webpack = require('@dolittle/typescript.webpack.aurelia').webpack;
const originalConfig = webpack(__dirname, path.resolve(__dirname, '..'));

module.exports = () => {
    const config = originalConfig.apply(null, arguments);
    config.resolve.alias = config.resolve.alias || {};  
    config.resolve.alias['aurelia-binding'] = path.resolve(path.join(__dirname,'../../'), 'node_modules/aurelia-binding');
    config.devServer = {
        historyApiFallback: true,
        port: 8081,
        proxy: {
            '/api': 'http://localhost:3000',
        }
    };
    return config;
};
