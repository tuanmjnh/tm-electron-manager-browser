/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@electron-toolkit",
    "@electron-toolkit/eslint-config-ts/eslint-recommended",
    "@vue/eslint-config-typescript/recommended",
    // '@vue/eslint-config-prettier'
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-var-requires": "off",
    "vue/html-indent": "off",
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off",
    "vue/max-attributes-per-line": "off",
    "vue/require-valid-default-prop": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/first-attribute-linebreak": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/component-definition-name-casing": "off",
    "no-constant-condition": "off",
    "no-unused-variable": "off",
    "no-unused-vars": "off",
    "no-useless-escape": "off",
    "no-redeclare": "off",
    "no-useless-catch": "off",
  },
};
