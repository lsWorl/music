<template>
  <div class="common-layout">

    <div>
      <h2>音乐馆</h2>
      <!-- 导航栏 -->
      <head-nav></head-nav>
      <div class="scrollBar">
        <el-scrollbar>
          <!-- 中间部分 -->
          <router-view></router-view>
        </el-scrollbar>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts" >

import '../../components/LeftBar.vue';
import '../../components/HeadBar.vue';
import '../../components/HeadNav.vue';
import './Recommend.vue'
import { onMounted, provide, ref } from 'vue';
import { ElMessage } from 'element-plus'
onMounted(() => {
  ElMessage({
    message: '此项目调用了网易云接口，不登录很多歌只有试听阶段',
    type: 'warning',
  })
})

//传递给导航栏数据
const nav = ref([
  {
    navName: '个性推荐',
    router: '/recommend/musicMuseum/musicMuseumRecommend',
    show: true
  },
  {
    navName: '歌单',
    router: '/recommend/musicMuseum/musicMuseumList',
    show: false
  },
  {
    navName: '排行榜',
    router: '/recommend/musicMuseum/rankingList',
    show: false
  },
  {
    navName: '歌手',
    router: '/recommend/musicMuseum/singerList',
    show: false
  },
])
provide('MusicMuseumnav', nav)
</script>

<style lang="scss" scoped>
.scrollBar {
  // background-color: aqua;
  height: calc(80vh - 110px);
  width: 100%;
}
</style>