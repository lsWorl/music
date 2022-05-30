<template>
  <div class="common-layout">
    <el-scrollbar height="560px">
      <div>
        <h2>音乐馆</h2>
        <!-- 导航栏 -->
        <head-nav></head-nav>
        <!-- 中间部分 -->
        <router-view></router-view>
      </div>
    </el-scrollbar>
  </div>

</template>
<script setup lang="ts" >

import '../../components/LeftBar.vue';
import '../../components/HeadBar.vue';
import '../../components/HeadNav.vue';
import Recommend from './Recommend.vue'
import { provide, ref } from 'vue';

//传递给导航栏数据
const nav = ref([
  {
    navName: '个性推荐',
    router: '/recommend/musicMuseum/musicMuseumRecommend',
    show:true
  },
  {
    navName: '歌单',
    router: '/recommend/musicMuseum/musicMuseumList',
    show:false
  },
  {
    navName: '排行榜',
    router: '/recommend/musicMuseum/rankingList',
    show:false
  },
  {
    navName: '歌手',
    router: '/recommend/musicMuseum/singerList',
    show:false
  },
])
provide('MusicMuseumnav', nav)
</script>

<style lang="scss">
</style>