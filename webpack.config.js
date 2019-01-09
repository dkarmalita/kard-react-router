const path = require('path');
const pkg = require('./package.json');

module.exports = {
  entry: path.join(__dirname, pkg.module),
  devtool: 'source-map',
  output: {

    // file name to generate is taken from main field of the package.json
    filename: path.basename(pkg.main),

    // path of the distribution is taken from the main field of the package json
    path: path.join(__dirname, path.dirname(pkg.main)),

    // name of the module is taken from package.json
    library: pkg.name,

    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  externals : {
    react : {
      commonjs: 'react',
      commonjs2: 'react',
      umd: 'react',
      root: 'React' // indicates global variable
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [
      "node_modules",
      'packages',
      'src'
    ],
    mainFields: [
      'module',
      'main'
    ],
  },

  // ref: https://habr.com/post/350370/
  // optimization: {
  //     minimize: false,
  // },
};
