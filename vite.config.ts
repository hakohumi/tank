import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

export default defineConfig({
  server: {
    open: './server/src/index.ts',
  },
  // build: {
  //   outDir: '../../public',
  // },
  plugins: [
    ...VitePluginNode({
      // Vite Plugin Node の設定
      // デフォルト値でいい場合は省略して問題ない

      // Node.js Webアプリケーションのフレームワークを利用する場合はここで指定する
      // 現在は 'express', 'nest', 'koa' and 'fastify' を利用できる
      adapter: 'express',

      // エントリーポイントとなるファイルのパスを指定する
      appPath: './server/src/index.ts',

      // エントリーポイントのファイルで export したアプリケーションの export name を指定する
      // デフォルトは 'viteNodeApp'
      exportName: 'viteNodeApp',
      // TypeScript のコンパイラを選択できる(esbuild or swc)
      // デフォルトは esbuild
      tsCompiler: 'esbuild',
    }),
  ],
})
