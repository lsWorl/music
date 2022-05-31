<template>
  <div class="foot">
    <div class="progressBar">
      <el-slider :class="['progressSlider']" v-model="timeProgress" :show-tooltip="true" @change="changeProgress">
      </el-slider>

    </div>
    <div class="footBottom">
      <!-- 左侧图片和歌名等部分 -->
      <div class="left">
        <!-- 图片 -->
        <div class="loadPic">
          <div></div>
        </div>
        <div class="hid">
          <span class="song">歌名111111111111111111111 - </span>
          <span class="singer">歌手</span>
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
import { ref } from "vue";
import { handleMusicTime, returnSecond } from '../plugins/utils'
// 当前播放时间位置
const currentTime = ref('00:00')
// 音乐总时长
const duration = "00:00"
// 进度条的位置
const timeProgress = ref(0)
// 音量
const volume = 30
// 是否静音
const isMuted = false
// 是否暂停
const isPause = ref(false)
//是否随机播放
const isRadom = ref(false)
//是否点击了播放列表
const drawer = ref(false)
// 拖动进度条的回调
const changeProgress = (e: any) => {
  console.log(e);
  // 修改当前播放时间
  // currentTime.value = Math.floor((e / 100) * durationNum);
  // // 改变audio的实际当前播放时间
  // this.$refs.audioPlayer.currentTime = currentTime;
}

</script>

<style lang="scss" scoped>
*{
  //用户禁止选中
  user-select: none;
}
.foot{
  position: absolute;
  bottom: 0px;
  background-color: #fff;
  width: 100%;
}
.progressBar {
  height: 10px;
  /* background-color: #1ecd99; */
  /* overflow: hidden; */
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
    margin-left: 10px;
  }

  .loadPic {
    >div {
      height: 50px;
      width: 50px;
      background-color: #1ecd99;
    }
  }

  .song {
    // margin-left: 10px;
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