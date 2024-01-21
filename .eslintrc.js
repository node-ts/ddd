module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '**/*.spec.ts',
    '**/*.integration.ts',
    '**/test/**/*.ts',
    '**/local-setup/**/*.ts'
  ],
  plugins: ['eslint-plugin-import', '@typescript-eslint'],
  extends: ['./.eslintrc.global.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module'
      }
    }
  ]
}
