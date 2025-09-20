import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // registerTypeを'autoUpdate'にすると、新しいコンテンツが利用可能になったときに自動的に更新するようになります。
      registerType: 'autoUpdate',

      // manifest.jsonに相当する設定
      manifest: {
        name: 'Meas - 作業時間トラッカー', // アプリの正式名称
        short_name: 'Meas', // ホーム画面に表示される短い名前
        description: '作業時間と内容を記録するための打刻アプリです。', // アプリの説明
        theme_color: '#ffffff', // アプリのテーマカラー（スプラッシュスクリーンなどで使用）
        background_color: '#ffffff', // アプリの背景色
        display: 'standalone', // アプリをスタンドアロンモード（ネイティブアプリのように）で開く
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'meas-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'meas-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'meas-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // マスカブルアイコンは、さまざまな形状のアイコンに対応できます
          }
        ]
      },

      // キャッシュ戦略などを定義するworkboxの設定
      workbox: {
        // 全てのアセット（js, css, html, 画像など）をキャッシュ対象にする
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})