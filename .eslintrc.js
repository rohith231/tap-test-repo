module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "prettier"
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  rules: {
    'vue/v-on-event-hyphenation': 0,
    'vue/multi-word-component-names': 0,
    "vue/attributes-order": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "space-before-function-paren": "off",
    "generator-star-spacing": "off",
    'vue/no-deprecated-slot-attribute': 'off',
    "vue/no-setup-props-destructure": "off" 
  },
};
