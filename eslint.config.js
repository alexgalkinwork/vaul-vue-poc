import pluginVue from 'eslint-plugin-vue'

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
]
