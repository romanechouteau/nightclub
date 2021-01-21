require('dotenv').config({path: __dirname + '/.env'});
const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildPath = './build/';

module.exports = {
  entry: ['./src/entry.js'],
  output: {
    path: path.join(__dirname, buildPath),
    filename: '[name].[hash].js'
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              'sass-loader',
        ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|tga|gltf|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
        use: 'file-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(vert|frag|glsl|shader|txt)$/i,
        use: 'raw-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        type: 'javascript/auto',
        test: /\.(json)/,
        exclude: path.resolve(__dirname, './node_modules/'),
        use: [{
          loader: 'file-loader'
        }],
      },
      {
        test: /\.(glb|gltf)$/,
        use:
        [
            {
                loader: 'file-loader',
                options:
                {
                    outputPath: 'assets/models/'
                }
            }
        ]
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nightclub',
      meta: {
        'facebookurl': {property: 'og:url', content: process.env.PUBLIC_URL },
        'facebooktype': {property: 'og:type', content: "website"},
        'facebooktitle': {property: 'og:title', content: "Nightclub"},
        'facebookimage': {property: 'og:image', content: "src/assts/img/nightclub.jpg"},
        'facebookdescription': {property: 'og:description', content: "Clap to a rythm to find a music and make the little guy dance."},
        'facebooksite_name': {property: 'og:site_name', content: "Nightclub"},
        'twittercard': {property: "twitter:card", content: "summary_large_image"},
        'twittercreator': {property: "twitter:creator", content: "@RomaneChouteau"},
        'twitterurl': {property: "twitter:url", content: process.env.PUBLIC_URL },
        'twittertitle': {property: "twitter:title", content: "Nightclub"},
        'twitterdescription': {property: "twitter:description", content: "Clap to a rythm to find a music and make the little guy dance."},
        'twitterimage': {property: "twitter:image", content: './src/assets/img/nightclub.jpg'}
      }
    })
  ]
}
