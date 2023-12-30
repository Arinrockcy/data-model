module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    // Enforce 2 spaces for indentation (or your preferred indentation size)
    'indent': ['error', 2],
    
    // Require or disallow spaces around operators
    'space-infix-ops': 'error', // Requires spaces around operators like +, -, *, etc.
    'space-before-blocks': 'error', // Requires a space before blocks
    'space-before-function-paren': ['error', 'never'], // No space before function parentheses
    
    // Require a space after keywords like if, for, while, etc.
    'keyword-spacing': 'error',

    // Enforce consistent spacing inside braces (object literals, destructuring assignments, etc.)
    'object-curly-spacing': ['error', 'always'],
    
    // Enforce consistent spacing in function parameters
    'space-in-parens': ['error', 'never'], // No space in function parameters
    
    // Enforce consistent spacing before/after unary operators like ++, --, !, etc.
    'space-unary-ops': 'error',

    // Enforce consistent spacing after a comma
    'comma-spacing': 'error',

    // Enforce consistent spacing inside array brackets
    'array-bracket-spacing': ['error', 'never'], // No spaces inside array brackets

    // Enforce consistent spacing for template literals
    'template-curly-spacing': 'error',

    // Enforce consistent spacing in object properties
    'key-spacing': 'error',
    // Enforce camelCase for variable names
    'camelcase': 'error',

    // Enforce consistent style for variable declarations (var, let, const)
    'one-var': ['error', 'never'], // Enforces variables to be declared separately with one var/let/const per variable
    
    // Enforce or disallow initialization in variable declarations
    'init-declarations': 'error', // Requires variables to be initialized when declared
    
    // Disallow the use of undeclared variables unless mentioned in global comments
    'no-undef': 'error',

    // Disallow the use of variables before they are defined
    'no-use-before-define': ['error', { 'functions': false }], // Allows function declarations to be used before they are defined
    
  }
}
