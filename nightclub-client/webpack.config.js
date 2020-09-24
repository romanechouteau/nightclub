const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SocialTags = require('social-tags-webpack-plugin');
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
    new HtmlWebpackPlugin({'title': 'Nightclub'}),
    new SocialTags({
      appUrl: 'http://localhost:8080/',
      facebook: {
        'og:url': "http://localhost:8080/",
        'og:type': "website",
        'og:title': "Nightclub",
        'og:image': 'src/assts/img/nightclub.jpg',
        'og:description': "Clap to a rythm to find a music and make the little guy dance.",
        'og:site_name': "Nightclub",
      },
      twitter: {
        "twitter:card": "summary_large_image",
        "twitter:creator": "@RomaneChouteau",
        "twitter:url": "http://localhost:8080/",
        "twitter:title": "Nightclub",
        "twitter:description": "Clap to a rythm to find a music and make the little guy dance.",
        "twitter:image": './src/assets/img/nightclub.jpg'
      },
    })
  ]
}
