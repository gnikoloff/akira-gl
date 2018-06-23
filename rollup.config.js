import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'index.js',
  dest: 'build/bundle.js',
  plugins: [
    resolve(),
    commonjs(),
    buble()
  ]
};