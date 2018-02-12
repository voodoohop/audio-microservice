// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
export default {
    input: 'midiFighterMidiClock',
    output: {
      file: 'build/midiFighterMidiClock.js',
      format: 'umd'
    },
    name: 'MyModule',
    plugins: [
        resolve(),
        commonjs(),

      builtins()
    ]
  };