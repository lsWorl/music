<template>
  <div>
    <div class="tag">
      <ul>
        <li v-for="item in hotTags" :key="item.id" @click="changeMusicList(item.name)">
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <h3>精品歌单</h3>
  </div>
  <!-- 歌单部分 -->
  
  <div class="list">
    <music-list></music-list>
  </div>
  <div class="page" v-if="musicList.length !=0">
    <el-pagination background layout="prev, pager, next" :total="500" :page-size="50" small :current-page="currentPage"
      @current-change="pageChange">
    </el-pagination>
  </div>

</template>

<script setup lang="ts">
import { onBeforeMount, provide, reactive, ref, toRefs } from 'vue';
import MusicList from '../../components/MusicList.vue';
import { request } from '../../network/request';

//歌单标签
let currentTag: any = reactive({})
let hotTags: any = ref([])
// 获取热门歌单tag数据
getHotTag()
async function getHotTag() {
  let result = await request("/playlist/hot")
  currentTag.value = result.data.tags[0]
  hotTags.value = result.data.tags
}

//歌单数据
let musicList: any = reactive({})
let currentPage = ref(1)
// 根据歌单名请求歌单列表
getMusicList()

async function getMusicList(tag?: string) {

  let result = await request("/top/playlist", {
    cat: currentTag.name || tag,
    offset: 50 * (currentPage.value - 1),
  })
  // console.log(result);
  // 里面的total可以用于分页，所以把整个对象都保存下来
  musicList.value = result.data
}

onBeforeMount(() => {

})
//点击标签改变歌单
const changeMusicList = (value: string) => {
  getMusicList(value)
}

//当页数发生改变时
const pageChange = (page: any) => {
  // page是当前页数
  // console.log(e);
  currentPage.value = page;
  getMusicList();
}

//给MusicList传数据
provide('musicList', musicList)

</script>

<style scoped lang="scss">
.tag {
  ul {
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    li {
      background-color: #e3e3e3;
      height: 2rem;
      width: 9rem;
      border-radius: 5px;
      text-align: center;
      line-height: 2rem;
      margin-left: 10px;
      margin-top: 15px;
      cursor: pointer;
      user-select: none;
    }

    >li:hover {
      background-color: #dbdbdb;
      color: #76d3b5;
    }
  }
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  // background-color: #dbdbdb;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: black !important;
  background-color: #f4f4f4 !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ec4141 !important;
  color: white !important;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #fff !important;
  border: 1px solid #ddd;
  font-weight: normal;
}

</style>