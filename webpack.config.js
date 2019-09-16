const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const entryPlus = require('webpack-entry-plus');
const glob = require('glob');

const entryFiles = [
    {
        entryFiles: glob.sync('./src/js/*.js'),
        outputName(item) {
            return item.replace('./src/js/', '').replace('.js', '');
        }
    }
];

module.exports = {
    entry: entryPlus(entryFiles),
    output: {
        path: __dirname + '/public',
        filename: 'js/[name].js'
    },
    devServer: {
        contentBase: __dirname + '/public'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /vendor/],
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s[ac]ss$/,
                exclude: /vendor/,
                // Set loaders to transform files.
                // Loaders are applying from right to left(!)
                // The first loader will be applied after others
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    {
                        // This loader resolves url() and @imports inside CSS
                        loader: "css-loader"
                    },
                    {
                        // Then we apply postCSS fixes like autoprefixer and minifying
                        loader: "postcss-loader",
                        options: {
                            plugins: [ require('autoprefixer'), require('cssnano') ]
                        }
                    },
                    {
                        // First we transform SASS to standard CSS
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass")
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ],
    devtool: process.env.NODE_ENV !== 'development' ? 'source-map' : 'eval'
};
