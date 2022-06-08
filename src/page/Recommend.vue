<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="14%">
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
const store = useStore()
onMounted(()=>{
  //得到网易云账户的cookie
  let cookie = document.cookie.replace(/(?:(?:^|.*;\s*)MUSIC_U\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  if(cookie != null){
    console.log('已经处于登录状态')
  } else{
    //没有则发送登录请求获取cookie
    loginTourist()
  }
  
  
  //邮箱登录请求 上线部署时候不设置登录功能的时候可以使用来进行测试
  async function loginTourist(){
    let result = await request("/login",{ 
      //这个账号用于测试
      email: 'lezheng47000@163.com',
      password: 'fengs9555'
    })
  console.log(result,'登录成功')
  }
  
})


</script>

<style lang="scss" scoped>
html,body{height:100%;margin:0px; padding: 0px;}

</style>
