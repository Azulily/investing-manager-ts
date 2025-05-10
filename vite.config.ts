/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({ // Vite の設定と Vitest の設定をマージ
  plugins: [react()],
  // Vitest の設定を直接記述
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // setupTests.ts のパスを確認
  },
  esbuild: {
    jsxImportSource: '@emotion/react', // Emotion の JSX トランスパイラを指定
  }
});
