module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    rules : {
        "react/jsx-filename-extension": 0,
        "jsx-a11y/label-has-for": 0,
        "no-console": 0,
        "react/prop-types": 0,
        "jsx-a11y/anchor-is-valid": 0,
        "jsx-a11y/media-has-caption": 0,
        "no-lone-blocks": 0
    },
    "globals": {
        "document": 1
    },
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module"
    },
    env: {
        browser: 1
    }
};