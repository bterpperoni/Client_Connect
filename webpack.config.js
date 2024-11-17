import path from 'path';

export const output = {
  filename: 'my-first-webpack.bundle.js',
};
export const module = {
  rules: [{ test: /\.txt$/, use: 'raw-loader' }],
};
