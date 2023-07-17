// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
  },
  plugins: [
    resolve({ browser: true }), 
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env']
    }),
  ],
};
