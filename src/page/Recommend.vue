<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="210px">
        <LeftBar></LeftBar>
      </el-aside>
      <el-container>
        <el-header>
          <HeadBar></HeadBar>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer height="100px">
          <PlayControl></PlayControl>
        </el-footer>
      </el-container>
    </el-container>
  </div>

</template>

<script setup lang="ts">
import LeftBar from '../components/LeftBar.vue';
import HeadBar from '../components/HeadBar.vue';
import PlayControl from '../components/PlayControl.vue';

// defineProps<{ msg: string }>()
</script>

<style scoped lang="scss">

</style>
