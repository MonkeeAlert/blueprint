const TerserJSPlugin          = require('terser-webpack-plugin');
const MiniCssExtractPlugin    = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const production = process.env.NODE_ENV === "production";

module.exports = {
    entry: {
        main: './src/js/main.js',
        blueprint: './src/js/blueprint.ts',
    },
    output: {
        filename: production ? '[name].[hash].js' : '[name].js',
        sourceMapFilename: production ? '[name].[hash].js.map' : '[name].js.map'
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.sass|scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        }
                    },
                    'resolve-url-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }, 
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                  'file-loader',
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      bypassOnDebug: true, // webpack@1.x
                      disable: true, // webpack@2.x and newer
                      outputPath: 'img/'
                    },
                  },
                ],
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: production ? 'main.[hash].css' : 'main.css',
            chunkFilename: '[id].[hash].css',
        })
    ],
    optimization: {
        minimizer: [ new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({}) ],
    },
};