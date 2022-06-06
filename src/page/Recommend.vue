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
    <music-detail-card  class="musicDetailCard"></music-detail-card>
  </div>

</template>

<script setup lang="ts">
import '../components/LeftBar.vue';
import HeadBar from '../components/HeadBar.vue';
import PlayControl from '../components/PlayControl.vue';
import MusicDetailCard from './MusicDetailCard.vue';
import { useStore } from 'vuex';
import { onMounted } from '@vue/runtime-core';
import { request } from '../network/request';
onMounted(()=>{
  loginTourist()
  async function loginTourist(){
    let result = await request("/register/anonimous")
  console.log(result,'游客登录成功')
  }
  
})

const store = useStore()
</script>

<style scoped lang="scss">
html,body{height:100%;margin:0px;}

</style>
