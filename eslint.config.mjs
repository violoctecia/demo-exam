// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
	files: ['**/*.ts', '**/*.vue', '**/*.js'],
	rules: {
		'prettier/prettier': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'vue/no-multiple-template-root': 'off',
		'vue/html-self-closing': 'off',
		'vue/require-default-prop': 'off',
	},
});
