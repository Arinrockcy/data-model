module.exports = {
    "env": {
        "node": true,
        "es2021": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "semi": ["error", "always"],
        "constructor-super": ["error", "always"],
        "no-const-assign": ["error", "always"],
        "no-dupe-class-members": ["error", "always"],
        "no-undef": ["error", "always"],
        "no-unsafe-negation": ["error", "always"],
        "spaced-comment": ["error", "always"],
        "block-spacing": ["error", "always"],
        "arrow-spacing": ["error", "always"],
        "no-multi-spaces": ["error", "always"],
    }
};
