// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import * as path from "node:path";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  {
    files: ["src/**/*.{js,mjs,ts,mts}"],
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: path.resolve("./tsconfig.json"),
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Strict rules
      "no-console": "error",
      "no-unused-vars": "off",
      "no-undef": "error",
      "no-shadow": "error",
      eqeqeq: ["error", "always"],
      "no-implicit-coercion": "error",
      "no-use-before-define": ["error", { functions: false, classes: true, variables: true }],

      // Import rules
      "import/no-unresolved": ["error", { commonjs: false }],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [["builtin", "external"], "internal", "parent", "sibling", "index"],
        },
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.ts",
            "**/*.spec.ts",
            "**/*.test.mts",
            "**/*.spec.mts",
            "**/eslint.config.js", 
            "**/*.config.{js,ts}", 
            "scripts/**", 
          ],
          packageDir: "./",
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          ts: "always",
          mjs: "never",
          mts: "always",
        },
      ],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true, allowTypedFunctionExpressions: true }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".d.ts", ".js", ".ts", ".mjs", ".mts"],
        },
        typescript: {
          alwaysTryTypes: true,
          project: path.resolve("./tsconfig.json"),
        },
      },
    },
  },
];
