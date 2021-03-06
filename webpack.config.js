const path = require('path');

module.exports = {
    entry: {
        index: ['core-js/stable', 'regenerator-runtime/runtime', './src/index.js'],
        edit: ['core-js/stable', 'regenerator-runtime/runtime', './src/edit.js']
    },
    output: {
        path: path.resolve(__dirname, 'public', 'scripts'),
        publicPath: '/scripts/',
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                }
            }
        }, {
            test: /\.s?css$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'            
            ]
        }]
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public'),
        },
        // contentBase: public,
        historyApiFallback: true
    }
};