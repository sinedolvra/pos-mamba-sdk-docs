const { IS_TEST, IS_DEV } = require('quickenv');

const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: false,
      loose: true,
      /** Only parse modules if testing. If not, let webpack handle it */
      modules: IS_TEST() ? 'commonjs' : false,
      debug: false,
      forceAllTransforms: true,
    },
  ],
];

const plugins = [
  /** Add support to import() */
  '@babel/plugin-syntax-dynamic-import',
  /** Add class properties support */
  ['@babel/plugin-proposal-class-properties', { loose: true }],
];

module.exports = {
  sourceMaps: true,
  presets,
  plugins,
}
