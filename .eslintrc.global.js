module.exports = {
  plugins: [
    'eslint-plugin-jsdoc',
    'eslint-plugin-prefer-arrow',
    'eslint-plugin-no-null',
    'eslint-plugin-unicorn',
    'eslint-plugin-jsx-conditional',
    'monorepo-cop',
    'unused-imports'
  ],
  extends: ['plugin:monorepo-cop/recommended'],
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array'
      }
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-types': [
      'warn',
      {
        types: {
          Object: {
            message: 'Avoid using the `Object` type. Did you mean `object`?'
          },
          Function: {
            message:
              'Avoid using the `Function` type. Prefer a specific function type, like `() => void`, or use `ts.AnyFunction`.'
          },
          Boolean: {
            message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
          },
          Number: {
            message: 'Avoid using the `Number` type. Did you mean `number`?'
          },
          String: {
            message: 'Avoid using the `String` type. Did you mean `string`?'
          }
        }
      }
    ],
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/dot-notation': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public'
      }
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        // Curated to match our existing practice
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'public-constructor',
          'protected-constructor',
          'private-constructor',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method'
        ]
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enumMember',
        format: ['PascalCase', 'camelCase'] // Both are fine, for compatibility
      }
    ],
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        ignoreParameters: true
      }
    ],
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2, 10, 16, 100, 1000, 60],
        ignoreEnums: true,
        ignoreReadonlyClassProperties: true,
        ignoreNumericLiteralTypes: true,
        ignoreDefaultValues: true
      }
    ],
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-shadow': [
      'error',
      {
        hoist: 'all'
      }
    ],
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        // Allowing `` without parameter
        allowTemplateLiterals: true
      }
    ],
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        path: 'always',
        types: 'prefer-import',
        lib: 'always'
      }
    ],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unbound-method': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    // We have a variety of styles on this one
    'arrow-body-style': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'capitalized-comments': ['error', 'always'],
    /*
     For some historic, when we started this code base, first class function wasn't favored.
     At this point, we have no point but to turn off this feature unless it offers things like:
     `ignorePublicMethod` or `ignorePrivateMethod`
     */
    'class-methods-use-this': 'off',
    'comma-dangle': 'error',
    complexity: [
      'error',
      {
        max: 20
      }
    ],
    'constructor-super': 'error',
    curly: 'error',
    'default-case': 'error',
    'eol-last': 'error',
    eqeqeq: ['error', 'always'],
    'guard-for-in': 'error',
    'id-blacklist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined'
    ],
    'id-match': 'error',
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        // Allow importing devDependencies in test environment.
        devDependencies: [
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          '**/*.integration.{ts,tsx}',
          '**/test/*'
        ]
      }
    ],
    'import/no-internal-modules': 'off',
    'import/order': 'off',
    'jsdoc/check-alignment': 'error',
    // Don't really care :p
    'jsdoc/check-indentation': 'warn',
    'jsdoc/tag-lines': 0,
    'linebreak-style': ['error', 'unix'],
    'max-classes-per-file': ['error', 1],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    'max-lines': ['error', 500],
    'new-parens': 'error',
    'no-bitwise': 'off',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-extra-bind': 'error',
    'no-fallthrough': 'error',
    'no-invalid-this': 'error',
    // Prefer @typescript-eslint/no-magic-numbers, it has better support for Enum
    'no-magic-numbers': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2
      }
    ],
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-null/no-null': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@node-ts/**/src/*'],
        paths: [
          '.',
          './',
          './.',
          '../',
          '../.',
          '../../',
          '../../.',
          '../../../',
          '../../../.',
          '..',
          '../..',
          '../../..'
        ]
      }
    ],
    'no-return-await': 'error',
    'no-sequences': 'error',
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-labels': 'error',
    'no-var': 'error',
    'no-void': 'off',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow/prefer-arrow-functions': [
      /*
       Currently we heavily rely on function hoisting.
       And we do think that make source easier to read.
       */
      'off'
    ],
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'quote-props': ['error', 'as-needed'],
    radix: 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-in-parens': ['error', 'never'],
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/']
      }
    ],
    'unicorn/filename-case': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off',
    'unused-imports/no-unused-imports-ts': 'error'
  },
  overrides: [
    {
      files: ['**/*.spec.*', '**/*.test.*', '**.integration.*'],
      rules: {
        // Test files shouldn't be split across multiple files.
        'max-lines': 'off',
        // Tests are full of magic 🪄
        '@typescript-eslint/no-magic-numbers': 'off',
        'jest/no-focused-tests': 'error'
      }
    }
  ]
}
