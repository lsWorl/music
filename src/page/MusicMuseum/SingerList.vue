<template>
  <div class="singerContainer">
    <div class="singer">
      <!-- 歌手分类选择 -->
      <div class="selectors">
        <div class="selectorItem">
          
          <SecondNavBar :SecondNavBarData="languageSort" @clickSecondBarItem="areaItem" class="secondNavBar" />
        </div>
        <div class="selectorItem">
          
          <SecondNavBar :SecondNavBarData="typeSort" @clickSecondBarItem="typeItem" class="secondNavBar" />
        </div>
        <div class="selectorItem">
          <SecondNavBar :SecondNavBarData="initialSort" @clickSecondBarItem="initialItem" class="secondNavBar" />
        </div>
      </div>
      <div class="listCardContainer">
        <!-- 歌手列表 -->
        <music-list isLoad class="listCard"  @bottomLoad="bottomLoad"></music-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, ref } from 'vue';
import '../../components/SecondNavBar.vue';
import '../../components/MusicList.vue';
import { request } from '../../network/request';
import { useRouter } from 'vue-router';
const router = useRouter()
const languageSort = ref([
  { area: -1, name: "全部" },
  { area: 7, name: "华语" },
  { area: 96, name: "欧美" },
  { area: 8, name: "日本" },
  { area: 16, name: "韩国" },
  { area: 0, name: "其它" }
])
const typeSort = ref([
  { type: -1, name: "全部" },
  { type: 1, name: "男歌手" },
  { type: 2, name: "女歌手" },
  { type: 3, name: "乐队" }
])
const initialSort = ref([
  { initial: -1, name: "热门" },
  { initial: "a", name: "A" },
  { initial: "b", name: "B" },
  { initial: "c", name: "C" },
  { initial: "d", name: "D" },
  { initial: "e", name: "E" },
  { initial: "f", name: "F" },
  { initial: "g", name: "G" },
  { initial: "h", name: "H" },
  { initial: "i", name: "I" },
  { initial: "j", name: "J" },
  { initial: "k", name: "K" },
  { initial: "l", name: "L" },
  { initial: "m", name: "M" },
  { initial: "n", name: "N" },
  { initial: "o", name: "O" },
  { initial: "p", name: "P" },
  { initial: "q", name: "Q" },
  { initial: "r", name: "R" },
  { initial: "s", name: "S" },
  { initial: "t", name: "T" },
  { initial: "u", name: "U" },
  { initial: "v", name: "V" },
  { initial: "w", name: "W" },
  { initial: "x", name: "X" },
  { initial: "y", name: "Y" },
  { initial: "z", name: "Z" },
  { initial: 0, name: "#" }
])
let singerList: any = reactive([])
let type = -1
let area = -1
let initial = -1
let currentPage = 1
let isMore = false
// 请求歌手列表
getSingerList()
async function getSingerList() {
  let res = await request("/artist/list", {
    type: type,
    area: area,
    initial: initial,
    offset: (currentPage - 1) * 30,
  });
  // console.log(res);
  
  singerList.value = singerList.push(...res.data.artists)
  if(currentPage != 1 ){
    singerList.value = singerList.push(...res.data.artists)
  }
  
  console.log(singerList)
  isMore = res.data.more;
}

//向子组件发送数据
provide('musicList', singerList)

// 地区
function areaItem(index: number) {
  console.log(languageSort.value[index].area);
  area = languageSort.value[index].area;
  // 先清空list 再请求数据
  singerList.value = [];
  currentPage = 1;
  getSingerList();
}

// 分类
function typeItem(index: number) {
  console.log(typeSort.value[index].type);
  type = typeSort.value[index].type;
  // 先清空list 再请求数据
  currentPage = 1;
  singerList.value = [];
  getSingerList();
}

// 筛选
function initialItem(index:number) {
  console.log(initialSort.value[index].initial);
  initial = initialSort.value[index].initial as number;
  // 先清空list 再请求数据
  currentPage = 1;
  singerList.value = [];
  getSingerList();
}

// 卡片上拉触底触发
function bottomLoad() {
  console.log("bottomLoad");
  // 如果还有更多数据 则发送请求 将数据 push到数组
  if (isMore === true) {
    currentPage += 1;
    getSingerList();
  }
}

// 点击歌手item的回调

</script>

<style scoped lang="scss">
.singerContainer {
  display: flex;
  justify-content: flex-start;
  // background-color: aqua;
}

.singer {
  max-width: 1400px;
  min-width: 1000px;
  // margin: 0px auto;
}

.selectorItem {
  display: flex;
}


.secondNavBar {
  width: calc(100% - 60px);
}

.listCardContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}

</style>
