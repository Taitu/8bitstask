import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import path from 'path'
import cssnano from 'cssnano'

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({algorithm: 'gzip', threshold: 10240, deleteOriginFile: false })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`
      }
    },
    postcss: {
      plugins: [
        cssnano({ preset: 'default' })
      ]
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    cssCodeSplit: true
  }
})
