module.exports = {
  root: true,
  ignorePatterns: [
    'projects/**/*',
    '*.json',
    '.eslintrc.js',
    'dist/**/*',
    'package.json',
    'package-lock.json',
  ],
  overrides: [
    {
      files: ['*.ts', '*.js'],
      parserOptions: {
        project: ['tsconfig.json', 'e2e/tsconfig.json'],
        tsconfigRootDir: __dirname,
        createDefaultProgram: true,
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:prettier/recommended',
      ],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        '@typescript-eslint/no-shadow': ['warn'],
        '@angular-eslint/prefer-inject': ['warn'],
        'prefer-const': 'error',
        'object-shorthand': ['warn', 'always'],
        'no-multiple-empty-lines': [
          'error',
          {
            max: 1,
            maxEOF: 0,
            maxBOF: 0,
          },
        ],
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            arrowParens: 'always',
            endOfLine: 'auto',
            trailingComma: 'all',
          },
        ],
      },
    },
    {
      files: ['*.html'],
      excludedFiles: ['*inline-template-*.component.html'],
      extends: [
        'plugin:@angular-eslint/template/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        '@angular-eslint/template/prefer-control-flow': ['warn'],
      },
    },
  ],
};
