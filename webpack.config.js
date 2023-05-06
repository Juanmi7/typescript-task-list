import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './dist/index.js',
  output: {
    filename: './dist/index.min.js',
    path: path.resolve(__dirname),
    libraryTarget: 'module'
  },
  experiments: {
    outputModule: true
  },
  mode: 'production',
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      }
    ]
  }
};
