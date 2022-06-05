<template>
  <div class="foot">
    <audio ref="audioPlayer" autoplay :src="musicUrl" @play="changeState(true)" @pause="changeState(false)"
      @ended="changeMusic('next')" @timeupdate="timeupdate"></audio>
    <!-- 进度条 -->
    <div class="progressBar">
      <el-slider :class="['progressSlider']" v-model="timeProgress" :show-tooltip="true" @change="changeProgress">
      </el-slider>
    </div>
    <div class="footBottom">

      <!-- 左侧图片和歌名等部分 -->
      <div class="left">
        <!-- 图片 -->
        <div class="loadPic" v-if="musicDetail.value" @click="store.commit('changeMusicDetailCardState')">
          <img :src="musicDetail.value.al.picUrl" alt="" :draggable="false" />
        </div>
        <div class="loadPic" v-else><img src="../assets/images/logoPic.jpg" alt="" /></div>
        <div class="hid">
          <div class="nameInfo">
            <div>
              <span class="song" v-if="musicDetail.value">{{ musicDetail.value.name }}</span>
              <span class="song" v-else>歌名</span>
            </div>
            <div>
              <span class="singer" v-if="musicDetail.value">{{ musicDetail.value.ar[0].name }}</span>
              <span class="singer" v-else>歌手</span>
            </div>
          </div>

          <div class="ic">
            <i class="iconfont icon-xihuan iconfont_size"></i>
            <el-icon>
              <Download />
            </el-icon>
            <i class="iconfont icon-pinglun iconfont_size"></i>
            <el-icon>
              <Operation />
            </el-icon>
          </div>
        </div>
      </div>
      <!-- 中间控制按钮等部分 -->
      <div class="middle">
        <i :class="['iconfont', isRadom ? 'icon-suiji' : 'icon-24gl-repeat2']" @click="isRadom = !isRadom"></i>
        <el-icon>
          <ArrowLeftBold />
        </el-icon>
        <div class="pause">
          <i :class="['iconfont', isPause ? 'icon-weibiaoti519 fontSize' : 'icon-arrow_right_fat fontSize']"
            @click="isPause = !isPause"></i>
        </div>
        <el-icon>
          <ArrowRightBold />
        </el-icon>
        <i class="iconfont icon-shengyinkai"></i>
      </div>
      <!-- 时间和查看播放队列 -->
      <div class="right">
        <div class="time">
          <span class="currentTime">{{ currentTime }} /</span>
          <span class="totalTime">{{ duration }}</span>
        </div>
        <div>
          <i class="iconfont icon-24gf-playlistMusic4" @click="drawer = true"></i>
        </div>
      </div>
      <el-drawer v-model="drawer" title="I am the title" :with-header="false">
        <h3>播放队列</h3>
        <span>总0首</span>
      </el-drawer>

    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { request } from "../network/request";
import { handleMusicTime, returnSecond } from '../plugins/utils'
import { ElMessage } from 'element-plus'
//获取当前实例，来获得播放音乐的ref
let instance: any
onMounted(() => {
  instance = getCurrentInstance()
  // console.log(instance.ctx.$refs.audioPlayer)
})
const store = useStore()
let lastSecond = 0;
// 总时长的秒数
let durationNum = 0;
// 保存当前音量
let volumeSave = 0;
// 当前音乐类型，用于下载
let musicType = "";
//当前音乐索引值
let currentMusicIndex = ref(0)
//当前音乐
let musicList = reactive([])
//当前音乐路径
let musicUrl = ref('')
// 当前播放时间位置
let currentTime = ref('00:00')
// 音乐总时长
let duration = ref("00:00")
// 进度条的位置
let timeProgress = ref(0)
// 音量
let volume = 30
// 是否静音
let isMuted = false
// 是否暂停
let isPause = ref(false)
//是否随机播放
let isRadom = ref(false)
//是否点击了播放列表
let drawer = ref(false)
//播放模式
let playType = ref('order')


let musicDetail = reactive({})
// 请求歌曲的url
async function getMusicDetail(id: any) {
  store.commit("updateMusicLoadState", true);
  let result = await request("/song/url", { id });
  // 获取不到url
  if (result.data.data[0].url == null) {
    ElMessage.error("该歌曲暂无版权，将为您播放下一首歌曲");
    changeMusic("next");
    return;
  }
  musicUrl.value = result.data.data[0].url;
  musicType = result.data.data[0].type.toLowerCase();
  store.commit("updateMusicLoadState", false);
}

// 根据id找到 musicList中对应的musicDetail
const getMusicDetailFromMusicList = () => {
  let index = musicList.value.findIndex(
    (item: any) => item.id == store.state.musicId
  );

  if (index != -1) {
    // 记录当前音乐的index
    currentMusicIndex.value = index;
    // 将索引传至vuex
    store.commit("updateCurrentIndex", index);
    musicDetail.value = musicList.value[index];
    // 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
    duration.value = musicList.value[index].dt;
  }
}

//监听id的变化
watch(() => store.state.musicId, (id: any) => {
  console.log("vuex中的id发生了变化")
  pauseMusic()
  musicList.value = store.state.musicList
  getMusicDetailFromMusicList()
  getMusicDetail(id)
  durationNum = returnSecond(duration.value)
}, { deep: true })

// 当前播放时间位置
const timeupdate = () => {
  // console.log(this.$refs.audioPlayer.currentTime);
  // 节流
  let time = instance.ctx.$refs.audioPlayer.currentTime;
  // 将当前播放时间保存到vuex  如果保存到vuex这步节流,会导致歌词不精准,误差最大有1s
  store.commit("updateCurrentTime", time);

  time = Math.floor(time);
  if (time !== lastSecond) {
    // console.log(time);
    lastSecond = time;
    currentTime.value = time;
    // 计算进度条的位置
    timeProgress.value = Math.floor((time / durationNum) * 100);
    // console.log(this.timeProgress);
  }
}

// 播放音乐的函数
const playMusic = () => {
  instance.ctx.$refs.audioPlayer.play();
}
// 暂停音乐的函数
const pauseMusic = () => {
  instance.ctx.$refs.audioPlayer.pause();
}
// 拖动进度条的回调
const changeProgress = (e: any) => {
  console.log(e);
  // 修改当前播放时间
  // currentTime.value = Math.floor((e / 100) * durationNum);
  // // 改变audio的实际当前播放时间
  // this.$refs.audioPlayer.currentTime = currentTime;
}

// 切歌函数
const changeMusic = (type: string, id?: any) => {
  if (type == "click") {
    // 点击抽屉row进行切歌
    store.commit("updateMusicId", id);
  } else if (type == "pre") {
    let currentIndex = currentMusicIndex.value;
    let preIndex;
    if (playType.value == "order") {
      preIndex =
        currentIndex - 1 < 0
          ? musicList.value.length - 1
          : currentIndex - 1;
    } else if (playType.value == "random") {
      if (musicList.value.length == 1) {
        preIndex = currentIndex;
      } else {
        // Math.floor(Math.random()*10); 可均衡获取0到9的随机整数。
        preIndex = currentIndex;
        while (preIndex == currentIndex) {
          preIndex = Math.floor(Math.random() * musicList.value.length);
        }
      }
    }
    console.log(musicList.value[preIndex].id);
    store.commit("updateMusicId", musicList.value[preIndex].id);
  } else if (type == "next") {
    let currentIndex = currentMusicIndex.value;
    let nextIndex;
    if (playType.value == "order") {
      nextIndex =
        currentIndex + 1 == musicList.value.length
          ? 0
          : currentIndex + 1;
    } else if (playType.value == "random") {
      if (musicList.value.length == 1) {
        nextIndex = currentMusicIndex;
      } else {
        // Math.floor(Math.random()*10); 可均衡获取0到9的随机整数。
        nextIndex = currentMusicIndex;
        while (nextIndex == currentMusicIndex) {
          nextIndex = Math.floor(Math.random() * musicList.value.length);
        }
      }
    }
    // console.log(this.musicList.value[nextIndex].id);
    store.commit("updateMusicId", musicList.value[nextIndex].id);
  }
}


// audio开始或暂停播放的回调  在vuex中改变状态
const changeState = (state: any) => {
  store.commit("changePlayState", state);
}




</script>

<style lang="scss" scoped>
* {
  //用户禁止选中
  user-select: none;
}

.foot {
  position: absolute;
  bottom: 0px;
  background-color: #fff;
  width: 85%;
}

.progressBar {
  height: 10px;
  /* overflow: hidden; */
  padding-top: 10px;
  display: flex;
  align-items: center;

}

.progressSlider {
  width: 100%;
}

/* 修改element进度条样式 */
.el-slider__runway {
  background-color: #eaeaea;
}

.el-slider__bar {
  background-color: #1ecd99 !important;
}

.el-slider__button {
  border: 1px solid #ccc !important;
  background-color: #1ecd99 !important;
  width: 14px !important;
  height: 14px !important;
}

// 歌名与图标部分样式
.footBottom {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left {
  width: 19rem;
  overflow: hidden;
  display: flex;

  .hid {
    overflow: hidden;
    margin-left: 15px;
    .nameInfo{
      background-color: #1ecd99;
      font-size: 14px;
    }
  }
  .loadPic {
    width: 50px;
    height: 50px;
    cursor: pointer;

    img {
      width: 100%;
    }

    >div {
      height: 50px;
      width: 50px;
      background-color: #1ecd99;
    }
  }

  .song {
    margin-bottom: 10px;
  }
}

.ic {
  padding: 5px;

  >i:nth-child(1) {
    margin-left: 0px;
  }

  >i {
    margin-left: 20px;
    font-size: 22px;
    cursor: pointer;
  }

  >i:hover {
    color: #1ecd99;
  }
}

// 中间部分
.middle {
  display: flex;
  width: 20rem;
  margin-right: 100px;
  margin-top: 8px;

  >i {
    cursor: pointer;
    font-size: 24px;
    margin-top: 8px;
  }

  >i:nth-child(1) {
    margin-right: 12px;
  }

  >i:nth-child(2) {
    margin-right: 12px;
  }

  >i:nth-child(4) {
    margin-left: 12px;
    margin-right: 12px;
  }

  i:hover {
    color: #1ecd99;
  }

  .pause {
    width: 42px;
    height: 42px;
    padding: 6px;
    border-radius: 50%;
    background-color: #1ecd99;
    cursor: pointer;

    >i {
      color: #fff;
    }

    .fontSize {
      font-size: 28px;
    }
  }
}

// 右侧部分
.right {
  display: flex;
  margin-top: 16px;

  .currentTime,
  .totalTime {
    font-size: 16px;
    transform: scale(0.85);
    color: #aaa;
    margin: 0 5px;
    width: 30px;
    text-align: center;
  }

  // 对播放列表按钮进行修改
  .icon-24gf-playlistMusic4 {
    color: #7b7b7b;
    cursor: pointer;
    font-size: 18px;
    margin-left: 12px;
  }

  i:hover {
    color: #1ecd99;
  }
}
</style>