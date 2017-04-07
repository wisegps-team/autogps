//测试环境下对booking.js等页面的单独打包文件
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var fs = require('fs');

module.exports = {
    //插件项
    plugins: [
        // commonsPlugin,//智能提取公共模块插件
        // new webpack.DefinePlugin({
        //     "process.env": {
        //         NODE_ENV: JSON.stringify("production")
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     output: {
        //         comments: false,  // remove all comments
        //     },
        //     compress: {
        //         // warnings: false,
        //         drop_console:true,//去掉console.*一切代码
        //         // drop_debugger:true,//去掉debugger
        //         // conditionals:true, //使用表达式代替if语句
        //         // evaluate:true, //常量表达式求值，如a>5*4转换成a>20
        //     },
        // })
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./manifest.json'),
        })
    ],
    //页面入口文件配置
    entry: {
        '/src/order.js':'./src/order.js',
        '/src/booking.js':'./src/booking.js',
        '/src/booking_install.js':'./src/booking_install.js',
        '/src/booking_install_date.js':'./src/booking_install_date.js'
    },
    //入口文件输出配置
    output: {
        path: './build',
        filename: '[name]'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.jsx$/, loader: 'babel-loader!jsx-loader?harmony' },
            { 
                test: /\.js$/, 
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    
    //其它解决方案配置
    resolve: {
    }
};