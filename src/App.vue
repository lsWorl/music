<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { useRoute, useRouter } from 'vue-router'
</script>

<template>
  <!-- <Recommend msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <router-view></router-view>
</template>

<style lang="scss">
*{
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  box-sizing: border-box;
  
  list-style: none;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
html{
  overflow: hidden;
}
</style>
