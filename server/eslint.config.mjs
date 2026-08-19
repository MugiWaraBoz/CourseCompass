import globals from 'globals';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['scripts/**'],
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    files: ['src/test/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.jest,
    },
  },

  js.configs.recommended,
]);
