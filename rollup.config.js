import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const pkg = require(`${process.cwd()}/package.json`);

export default {
  input: 'src/index.js',
  output: [
    {
      name: pkg.name,
      file: 'dist/bundle.js',
      format: 'umd',
    },
    {
      name: pkg.name,
      file: 'dist/bundle.esm.js',
      format: 'esm',
    },
  ],
  external: [
    'styled-components',
    'fs',
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      browser: true,
    }),
    commonjs({
      // include: 'node_modules/**',
      // module: false,
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType','isElement', 'ForwardRef'],
        'node_modules/react/index.js': ['Component', 'PureComponent', 'Fragment', 'Children', 'createElement','cloneElement','createContext'],
        'node_modules/react-dom/index.js': ['findDOMNode'],
      }
    }),
  ]
}