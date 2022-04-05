/*
 * @Author: renlei
 * @Date: 2022-04-03 15:43:28
 * @LastEditors: renlei
 * @LastEditTime: 2022-04-05 15:18:21
 * @Description:
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin()]
});
