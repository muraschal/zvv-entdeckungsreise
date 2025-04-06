const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/widget.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zvv-entdeckungsreise-widget.js',
    library: {
      name: 'ZVVEntdeckungsreiseWidget',
      type: 'umd'
    },
    globalObject: 'this',
    publicPath: '/',
    chunkFilename: 'zvv-entdeckungsreise-widget.[chunkhash].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.GITHUB_SHA': JSON.stringify(process.env.GITHUB_SHA || 'local-build'),
      'process.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-syntax-dynamic-import'
            ]
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: false,
          passes: 2,
        },
        mangle: true,
        output: {
          comments: false,
        },
      },
    })],
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 250000,
    maxEntrypointSize: 400000,
  },
}; 