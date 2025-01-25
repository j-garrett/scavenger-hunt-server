module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'sort-keys-fix',
    'import',
    'simple-import-sort',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': ['off'],
    'prettier/prettier': [
      'error',
      {
        semi: false,
      },
    ],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'import/order': [
      'warn',
      {
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
  },
}
