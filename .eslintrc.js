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
        "no-console": 0
    },
    "globals": {
        "document": 1
    },
    "parserOptions": {
        "ecmaVersion": 7,
         "sourceType": "module"
    }
};