// Rollup plugins
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss'
import glsl from 'rollup-plugin-glsl'

export default {
  entry: 'index.js',
  dest: 'build/bundle.js',
  format: 'file',
  sourceMap: 'inline',
  plugins: [
    glsl({
      include: 'src/**/*.glsl',
    }),
    scss({
      output: 'build/bundle.css'
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};