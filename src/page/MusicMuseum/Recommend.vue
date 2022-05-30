<template>
  <div>
    <!-- 轮播图 -->
    <div class="carousel">
      <el-carousel :interval="4000" type="card" height="250px">
        <el-carousel-item v-for="(item, index) in bannerData.value" :key="index">
          <img :src="item.imageUrl" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 歌单部分 -->
    <h4>推荐歌单</h4>
    <music-list></music-list>
  </div>
</template>

<script setup lang="ts">
import MusicList from '../../components/MusicList.vue'
import { onBeforeMount, onMounted, provide, reactive, ref, toRefs } from 'vue';
import { request } from '../../network/request'

//轮播图数据
let bannerData: any = reactive({})

onBeforeMount(() => {
  console.log('生命周期调用')
  //触发功能
  getBannerData()
  getMusicList()
})
//获取轮播图数据
async function getBannerData() {
  let result = await request('/banner', '?type=1')
  bannerData.value = result.data.banners
  // console.log(bannerData.value)
}

//推荐歌单数据
let musicList: any = reactive({})
// 请求推荐歌单数据的前十个
function getMusicList() {
  request("/personalized", { limit: 10 }).then((res) => {
    musicList.value = res.data.result;
  });
}

//给MusicList传数据
provide('musicList', musicList)

</script>

<style scoped lang="scss">
h4 {
  font-size: 20px;
}

// 轮播图样式
.carousel {
  margin-top: 20px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}


//轮播图设置
.el-carousel__item img {
  height: 100%;
}

.el-carousel__item {
  border-radius: 10px;
}
</style>