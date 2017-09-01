var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        // 'webpack/hot/only-dev-server',//自己刷新页面,
        'webpack/hot/dev-server',//自己刷新页面,
        'react-hot-loader/patch',
        path.join(__dirname, 'app/index.js')
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',//模板文件在根部录下的index.html
            inject: 'body',
            filename: './index.html'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module: {
        resolve:{
            extensions:['','.js','.json']
        },
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                inject:'foot',
                query:
                {
                    presets:['react','es2015']
                }
            },
            {
                test: /\.json?$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    }
};