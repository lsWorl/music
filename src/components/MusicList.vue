<template>
  <div class="recommendCard">
    <div class="recommendList">
      <ul>
        <li v-for="item in musicList.value" :key="item.id">
          <div class="card">
            <img :src="item.picUrl || item.coverImgUrl" alt="">
          </div>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div class="pagination">
  </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, onBeforeUpdate, reactive, ref } from 'vue';
import { request } from '../network/request'
//接收从父组件收到的数据
let musicList: any = inject('musicList')
onBeforeUpdate(()=>{
console.log(musicList)
if(musicList.value.playlists){
  musicList.value = musicList.value.playlists
}
})


</script>

<style lang="scss" scoped>
//歌单部分
.recommendCard {

  .recommendList {
    margin-top: 20px;
  }

  ul {

    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;

    li {
      margin-right: 40px;

    }

    li>span {
      width: 12rem;
      white-space: pre-wrap;
      display: block;
      overflow: hidden;
      margin: 10px;
      cursor: pointer;
    }
  }

  .card {
    height: 200px;
    width: 200px;
    cursor: pointer;

    img {
      border-radius: 20px;
      width: 100%;
    }
  }
}
</style>