<template>
  <div class="musicDetailCard" :class="[
    isMusicDetailCardShow ? '' : 'hide',
  ]">
    <div class="closeCard" @click="closeCard">
      <el-icon class="iconfont">
        <ArrowDownBold />
      </el-icon>
    </div>
    <div class="musicDetailCardContainer" v-if="!cleanCard && musicInfo.value.name">
      <div class="top">
        <div class="left">
          <div class="discContainer">
            <!-- 左侧部分 -->
          </div>
        </div>
        <div class="right">
          <div class="title">
						<div class="musicName">{{ musicInfo.value.name }}</div>
						<div class="album" @click="goToDetailPage('album', musicInfo.value.al.id)">
							{{ musicInfo.value.al.name }}
						</div>
						<div class="singer" @click="goToDetailPage('singerDetail', musicInfo.value.ar[0].id)">
							{{ musicInfo.value.ar[0].name }}
						</div>
					</div>
          <lyrics-scroll :lyric="lyric"></lyrics-scroll>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { request } from "../network/request";
//store
const store = useStore()
// 定时器
let timer: any
// 是否显示歌曲详情卡片
let isMusicDetailCardShow = ref(false)
// 是否删除卡片渲染的内容
let cleanCard = ref(true)
//当前评论页数
let currentCommentPage = ref(1)
// 评论数据
let comment = reactive({})
//   歌词
let lyric = ref([[0, "正在加载歌词"]])
//   当前歌曲信息
let musicInfo = reactive({})
// 评论是否在加载中
let isCommentLoading = ref(false)
// 热门评论
let hotComments = ref([])
//是否点击了打开音乐详情
watch(() => store.state.isMusicDetailCardShow, (isMusicDetailShow: any) => {
  console.log(123)
  isMusicDetailCardShow.value = isMusicDetailShow
  //如果卡片没有展示就不发送请求和渲染里面的内容
  //   删除定时器 避免用户在关闭卡片的1s内又打开卡片 导致展示内容被删除
  clearTimeout(timer)
  cleanCard.value = false
  if (isMusicDetailShow && !comment.value.comments && store.state.musicId != "") {
    console.log("请求歌词和评论");
    getLyric(store.state.musicId)
    getMusicComment(store.state.musicId)
  } else if (isMusicDetailShow == false) {
    //   当卡片关闭时 延迟 3s再删除里面渲染的内容
    timer = setTimeout(() => {
      cleanCard.value = true;
    }, 3000)
  }
}, { deep: true })

watch(() => store.state.musicId, (musicId: any) => {
  // 清空歌词
  lyric.value = [[0, "正在加载歌词"]]
  // 重置评论页数
  currentCommentPage.value = 1
  musicInfo.value = store.state.musicList[store.state.currentIndex]
  comment.value = {}
  // 仅在卡片展示时才发送请求
  if (isMusicDetailCardShow.value) {
    getLyric(musicId);
    getMusicComment(musicId);
  }
})

//请求并处理歌词数据
async function getLyric(id: any) {
  let res = await request("/lyric", { id })
  //   console.log(res)
  let lyrics = res.data.lrc.lyric;
  // 对获取到的歌词进行处理
  let arr = lyrics.split("\n");
  let array: any = [];
  let time = "";
  let value = "";
  let result: any = [];

  //去除空行
  arr.forEach((item: any) => {
    if (item != "") {
      array.push(item);
    }
  })
  arr = array;
  arr.forEach((item: any) => {
    time = item.split("]")[0];
    value = item.split("]")[1];
    //去掉时间里的中括号得到xx:xx.xx
    var t = time.slice(1).split(":");
    //将结果压入最终数组
    result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
  })
  lyric.value = result
}

async function getMusicComment(id: any, type?: any) {
  // 获取时间戳
  let date = new Date()
  var timestamp = Date.parse(date)
  isCommentLoading.value = true

  if (type == "changePage") {
    let musicDetailCardContainer = document.querySelector(
      ".musicDetailCardContainer"
    );
    let top = document.querySelector(".top");
    // console.log([musicDetailCardContainer, top]);
    musicDetailCardContainer!.scrollTo({
      behavior: "smooth",
      top: top!.clientHeight,
    });
  }

  // 当页数为第一页时，请求10条热门数据
  if (currentCommentPage.value == 1) {
    let res = await request("/comment/hot", {
      id,
      limit: 10,
      type: 0,
      timestamp,
    });
    console.log(res);
    if (res.data.code != 200) {
      ElMessage.error("获取热门评论失败,请稍后重试!")
      return;
    }
    hotComments.value = res.data.hotComments;
  }

  let res = await request("/comment/music", {
    id,
    offset: (currentCommentPage.value - 1) * 20,
    timestamp,
  })
  console.log(res)
  if (res.data.code != 200) {
    ElMessage.error("获取热门评论失败,请稍后重试!")
    return;
  }
  isCommentLoading.value = false;
  comment.value = res.data;
}

// 点击关闭卡片的回调
const closeCard = () => {
  store.commit("changeMusicDetailCardState");
}
</script>

<style lang="scss" scoped>
.glassCard {
  // 火狐默认不支持backdrop-filter 可以手动激活，这里不折腾了，火狐关闭玻璃背景功能，反正这个功能特别吃性能，字体也看不清了，没必要
  backdrop-filter: blur(50px) brightness(95%) !important;
  background-color: unset !important;
  background-image: unset !important;

  * {
    color: rgb(37, 37, 37);
  }
}

.musicDetailCard {
  position: fixed;
  width: 86.3%;
  // height: calc(100vh - 55px);
  height: calc(80vh + 40px);
  bottom: 111px;
  left: 208px;
  z-index: 1000;
  transition: bottom 0.5s ease;
  background-color: #fff;
  background-image: linear-gradient(to bottom, #e3e2e3, white);
}

.closeCard .iconfont {
  position: absolute;
  cursor: pointer;
  top: 15px;
  left: 35px;
  font-size: 21px !important;
}

.musicDetailCardContainer {
  height: 100%;
  overflow-y: scroll;
}

.hide {
  // bottom: calc(-100vh + 55px);
  bottom: calc(-80vh - 40px);
  // transform不会引发重流 性能更好 但是这里如果使用transform 在resize时会出现musicDetailCard拖影的情况，是transition引发的，
  // 可能可以通过animation代替transtion解决，不太确定，没有尝试过，但是使用transform还需另外禁止index页面滚动，
  // 所以我这里还是选择使用固定定位 性能稍差，但是由于脱离的文档流，也不会差很远
  // transform: translateY(calc(80vh - 55px));
}

.top {
  display: flex;
  justify-content: center;
}

.left {
  width: 220px;
  margin: 0 30px 0 -40px;
}

.discContainer {
  margin-top: 60px;
  width: 220px;
  position: relative;
}

.needle {
  position: relative;
  left: 50%;
  width: 88px;
  height: 72px;
  z-index: 10000;
  transition: all 1s;
  transform-origin: 5.3px 5.3px;
}

.needle img {
  width: 100%;
}

.needleRotate {
  transform-origin: 5.3px 5.3px;
  transform: rotate(22deg);
}

.disc {
  width: 220px;
  height: 220px;
  position: relative;
  top: -12px;
}

.disc img:nth-child(1) {
  width: 100%;
}

.disc .musicAvatar {
  position: absolute;
  top: 35px;
  left: 35px;
  width: 150px;
  z-index: -1;
}

/* 碟子设置旋转动画 */
.discAnimation {
  /* infinite动画无限循环 */
  animation: disc 25s linear infinite;
  /* 动画延迟一秒 */
  animation-delay: 0.8s;
}

@keyframes disc {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.pause {
  animation-play-state: paused;
  -webkit-animation-play-state: paused;
}

.right {
  width: 350px;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 12px;
  margin: 30px 0 15px;
  color: rgb(145, 145, 145);
}

.title div {
  margin: 7px 0;
}

.musicName {
  font-size: 23px;
  color: rgb(22, 22, 22);
}

.bottom {
  margin: 40px auto;
  // width: 55vw;
  width: 44vw;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.tip {
  font-size: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.changeBackground {
  position: absolute;
  bottom: 10px;
  right: 20px;
  cursor: pointer;
}

.album,
.singer {
  cursor: pointer;
}
</style>