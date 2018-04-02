'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
module.exports = function makeWebpackConfig (options) {
    var config = {
        plugins: []
    };
    config.entry = {
        app: './src/app.js'
    }
    config.output = {
        path: __dirname + '/dist',
        publicPath: 'http://localhost:8080/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js'
    }
    config.devtool = 'eval';
    config.module = {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['transform-runtime']
                }
            },
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            use: 'file'
        }, {
            test: /\.css/,
            use: [
                { loader: "style-loader" },
                { loader: "css-loader" }
              ]
        }, { 
            test: /\.html$/, 
            exclude: path.resolve(__dirname, './src/index.html'),
            loader: 'ng-cache-loader?prefix=[dir]/[dir]' 
        }]
    };
    config.plugins.push(
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            minify: false
        })
    );

    config.devServer = {
        contentBase: './dist',
        stats: {
        modules: false,
        cached: false,
        colors: true,
        chunk: false
        }
    };

    return config;
};