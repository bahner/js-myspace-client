// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
  },
  plugins: [
    alias({
      entries: [
        { find: 'events', replacement: 'events' }
      ]
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      dedupe: ['events'],
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      babelHelpers: 'bundled'
    }),
  ],
};
