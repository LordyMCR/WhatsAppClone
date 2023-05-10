/* eslint-disable linebreak-style */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'linebreak-style': ['error', 'windows'],
    'no-use-before-define': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'no-throw-literal': 'off',
    'consistent-return': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/prefer-stateless-function': 'off',
    'no-useless-constructor': 'off',
    camelcase: 'off',
    'no-param-reassign': 'off',
    'react/jsx-no-bind': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-nested-ternary': 'off',
    'no-mixed-operators': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/no-unstable-nested-components': [
      'error',
      {
        allowAsProps: true,
      },
    ],

  },
};
