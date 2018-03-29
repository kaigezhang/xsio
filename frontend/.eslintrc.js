module.exports = {
    "extends": ["airbnb"],
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true
    },
    "plugins": [
        "react", "import"
    ],
    "settings": {
        "parser": "babel-eslint",
        "import/parser": "babel-eslint",
        "import/resolve": {},
        "ecmaFeatures": {
            "classes": true,
            "jsx": true
        }
    },
    "rules": {
        strict: 2,
        "semi": 1,
        "no-shadow": 1,
        "eol-last": 0,
        "prefer-destructuring": 1,
        "consistent-return": 1,
        "no-return-assign": 1,
        "no-param-reassign": 1,
        "no-use-before-define": 1,
        "import/no-unresolved": 0,
        "import/extensions": 0,
        "import/no-extraneous-dependencies": 0,
        "indent": [
            "error", 2
        ],

        "no-console": "warn",
        "comma-dangle": "off",
        "key-spacing": "off",
        "max-len": "off",
        "react/prefer-stateless-function": "off",
        "react/forbid-prop-types": [
            1, {
                "forbid": ["any"]
            }
        ],
        "react/prop-types": 0,
        "react/sort-comp": 1,
        "react/require-default-props": 1,
        "object-curly-newline": "off",
        "function-paren-newline": "off",
        "import/prefer-default-export": "off",
        "react/jsx-filename-extension": "off",
        "react/jsx-boolean-value": 1,
        "react/jsx-closing-bracket-location": 0,
        "react/jsx-curly-spacing": 1,
        "react/jsx-indent-props": 0,
        "react/jsx-key": 1,
        "react/jsx-max-props-per-line": 0,
        "react/jsx-no-bind": 1,
        "react/jsx-no-duplicate-props": 1,
        "react/jsx-no-literals": 0,
        "react/jsx-no-undef": 1,
        "react/jsx-pascal-case": 1,
        "react/jsx-sort-prop-types": 0,
        "react/jsx-sort-props": 0,
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "react/no-array-index-key": 1,
        "react/no-unused-state": 1,
        "jsx-a11y/click-events-have-key-events": 1,
        "jsx-a11y/no-noninteractive-element-interactions": 1,
        "jsx-a11y/no-static-element-interactions": 1,
        "jsx-a11y/anchor-is-valid": 0,
        "jsx-a11y/mouse-events-have-key-events": 1,
        "jsx-a11y/no-autofocus": 1,
        "no-multi-spaces": "off",
        "no-plusplus": "off",
        "import/no-named-as-default-member": "off",
        "no-unused-vars": [
            1, {
                "varsIgnorePattern": "_",
                "argsIgnorePattern": "_"
            }
        ],
        "no-underscore-dangle": [
            1, {
                "allow": ["_browserHistory", "__data", "__default"]
            }
        ],
        "react/no-multi-comp": [
            0, {
                "ignoreStateless": false
            }
        ]
    },
    "globals": {
        "socket": true,
        "enzyme": true
    }
}
