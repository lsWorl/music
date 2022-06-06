<template>
  <div class="common-layout">
    最近播放
  </div>

</template>

<script setup lang="ts" >
import LeftBar from '../components/LeftBar.vue';
import HeadBar from '../components/HeadBar.vue';
import { ElMessage } from 'element-plus'
import { onMounted } from '@vue/runtime-core';
onMounted(()=>{
  ElMessage({
    message: '此模块仍然在开发中...',
    type: 'warning',
  })
})
</script>

<style lang="scss" scoped>
</style>