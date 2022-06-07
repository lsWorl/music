<template>
  <div class="rankingContainer">
    <TableList :officialListDetailItem = "item" v-for="(item,index) in officialListDetail" :key="index" 
    @clickCheckAll="clickListCardItem"></TableList>
  </div>
  <div class="global">
        <div class="title" v-if="officialListDetail.lenth !=0">全球榜</div>
        <!-- 展示歌单列表 -->
        <music-list class="listCard" @clickListCardItem="clickListCardItem"></music-list>
      </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, provide, reactive, ref } from "vue";
import { request } from "../../network/request";
import { handleMusicTime } from '../../plugins/utils'
import '../../components/TableList.vue'
import '../../components/MusicList.vue'
import { useRouter } from "vue-router";
const router = useRouter()
let officialList: any = []
let officialListDetail: any = ref([])
let globalList:any = reactive([])

console.log(officialListDetail)
// 请求所有榜单
onBeforeMount(async ()=>{
  
  await getAllRankings()
  officialList.forEach((item: any) => {
    getMusicListDetail(item.id)
  })
})

async function getAllRankings() {
  let res = await request("/toplist");
  // console.log(res);
  officialList = res.data.list.slice(0, 4); 
  globalList.value = res.data.list.slice(4);
  console.log(globalList)
  
}
// 根据榜单id请求详细数据
// 根据传来的 id 查询歌单
async function getMusicListDetail(id: any) {
  // console.log(this.$route.params.id);
  let result: any = await request("/playlist/detail", { id });
  // console.log(result);
  result = result.data.playlist;
  // 对时间进行处理
  result.tracks.forEach((item: any, index: any) => {
    result.tracks[index].dt = handleMusicTime(item.dt);
  });
  officialListDetail.value.push(result);
  // console.log(officialListDetail)
}
// 点击榜单进入歌单详情界面
   const clickListCardItem =(id:any) => {
      if (id.id) {
        id = id.id;
      }
      router.push({ name: "musicListDetail", params: { id } });
    }


//将globalList传递给子组件
provide('musicList',globalList)






</script>

<style scoped lang="scss">
.rankingContainer {
  display: flex;
  justify-content: flex-start;
  // background-color: aquamarine;
  flex-wrap: wrap;
  width: 100%;
}
.title{
  font-size: 24px;
}
.listCard {
  margin-top: 15px;
}
</style>