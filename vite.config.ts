import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
//引入查看配置文件
import Inspect from 'vite-plugin-inspect'
//element-ui按序引入
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    Inspect()
  ],
  server: {//设置代理解决跨域问题
    proxy: {
      '/api':
      {
        target: "https://netease-cloud-music-api-two-ashy.vercel.app",
        changeOrigin: true,
        ws:true,
        rewrite: (path) => path.replace(/^\/api/,'')
      }
    }
  }
})
