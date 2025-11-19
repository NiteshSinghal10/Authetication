// eslint.config.js (CommonJS)

const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "index.ts"],
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.js",
      "**/*.js",
      "eslint.config.js",
    ],
    rules: {
      "no-unnecessary-class": [
        "off",
        {
          "allow-constructor-only": true,
          "allow-static-only": true,
          "allow-empty-class": true,
        },
      ],
      "class-methods-use-this": "off",
      "no-constant-condition": "off",
      "@typescript-eslint/ban-types": "off",
      "no-case-declarations": "off",

      // TS rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsupported-features": "off",

      // Good rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-eval": "error",
      "no-redeclare": "error",
      "no-trailing-spaces": "error",
      quotes: ["error", "single"],
      semi: ["error", "always"],
      curly: "error",
      eqeqeq: "error",
      "prefer-const": "error",

      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
];
