// ESLint Flat Config for ESLint 9.x+
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"
import prettierPlugin from "eslint-plugin-prettier"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import eslintComments from "eslint-plugin-eslint-comments"

export default [
  {
    ignores: [".next/", "node_modules/", "dist/", "build/", "eslint.config.mjs", "next.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
      "eslint-comments": eslintComments,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ["./tsconfig.json"],
      },
      globals: {
        NodeJS: "readonly",
        React: "readonly",
        JSX: "readonly",
        window: "readonly",
        document: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx", ".js", ".json"],
        },
        typescript: {
          project: ["./tsconfig.json"],
        },
      },
    },
    rules: {
      camelcase: 0,
      "no-void": 0,
      "comma-dangle": ["error", "always-multiline"],
      "prettier/prettier": "error",
      "max-len": ["error", { code: 120 }],
      "no-use-before-define": 0,
      "eslint-comments/disable-enable-pair": [2, { allowWholeFile: true }],
      "import/extensions": 0,
      "newline-before-return": 2,
      "func-names": 0,
      "lines-between-class-members": 0,
      "max-classes-per-file": 0,
      "no-console": 0,
      "no-empty": 0,
      "no-underscore-dangle": 0,
      "no-unused-expressions": 0,
      "no-useless-constructor": 0,
      semi: [2, "never"],
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: false }],
      "node/no-callback-literal": 0,
      "prefer-template": 2,
      "react/jsx-indent": [2, 2],
      "react/jsx-filename-extension": [2, { extensions: [".ts", ".tsx", ".json", ".js"] }],
      "react/jsx-uses-react": 0,
      "react/react-in-jsx-scope": 0,
      "react/self-closing-comp": 2,
      "react/jsx-boolean-value": 2,
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-non-null-assertion": 0,
      "@typescript-eslint/no-useless-constructor": 2,
      "@typescript-eslint/no-unsafe-assignment": 0,
      "@typescript-eslint/no-unsafe-member-access": 0,
      "@typescript-eslint/no-unsafe-argument": 0,
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^react", "^@?\\w"], ["^\\u0000"], ["^@(/.*|$)", "^\\.\\.(?!/?$)", "^\\.\\./?$"], ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"]],
        },
      ],
      "simple-import-sort/exports": "warn",
    },
  },
]
