<template>
  <div class="lyrics">
    <!-- 占位 -->
    <div class="placeholder"></div>
    <!-- 因为歌词快了一句,所以减1 -->
    <!-- 歌词item -->
    <div
      class="lyricsItem"
      :class="lyricsIndex - 1 == index ? 'currentLyric' : ''"
      v-for="(item, index) in lyric"
      :key="index"
    >
      {{ item[1] }}
    </div>
    <!-- 占位 -->
    <div class="placeholder"></div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import { useStore } from "vuex";
const store = useStore()
let placeholderHeight = 0;
const props = defineProps<{
  lyric: any
}>()
let lyricsIndex = ref(0)
  
    // 实现歌词滚动
   const lyricScroll = (currentLyric:any)=>{
      // 获取歌词item
      let lyricsArr = document.querySelectorAll(".lyricsItem")
      // 获取歌词框
      let lyrics = document.querySelector(".lyrics")
      // placeholder的高度
      if (placeholderHeight == 0) {
        placeholderHeight = lyricsArr[0].offsetTop - lyrics.offsetTop;
      }
      //   歌词item在歌词框的高度 = 歌词框的offsetTop - 歌词item的offsetTop
      //   console.log(currentLyric);
      if (lyricsArr[currentLyric - 1]) {
        let distance = lyricsArr[currentLyric - 1].offsetTop - lyrics.offsetTop;
        //   lyricsArr[currentLyric].scrollIntoView();
        lyrics!.scrollTo({
          behavior: "smooth",
          top: distance - placeholderHeight,
        });
      }
    }
    //获取当前歌词索引
    const getCurrentLyricsIndex = (currentTime:any)=>{
      let Index = 0;
      props.lyric.some((item:any) => {
        if (Index < props.lyric.length - 1) {
          if (currentTime > item[0]) {
            Index += 1;
          }
          return currentTime <= item[0];
        }
      });
      // console.log(lyricsIndex);
      lyricsIndex.value = lyricsIndex;
    }
  
    // 监听当前播放时间
    watch(()=>store.state.currentTime,(currentTime:any, lastTime:any)=>{
      // 如果两个时间间隔有1秒,则可得知进度条被拖动 需要重新校准歌词index
      // 当歌词数量大于1并且索引为零时,可能歌词位置差距较大,走这个if进行快速跳转
      if (
        (lastTime && Math.abs(currentTime - lastTime) >= 1) ||
        (lyricsIndex.value == 0 && props.lyric.length > 1)
      ) {
        // 处理播放时间跳转时歌词位置的校准
        if (props.lyric.length > 1) {
          getCurrentLyricsIndex(currentTime);
          // 滑动到当前歌词
          lyricScroll(lyricsIndex.value);
        }
      }
      // 根据实时播放时间实现歌词滚动
      if (lyricsIndex.value < props.lyric.length) {
        if (currentTime >= props.lyric[lyricsIndex.value][0]) {
          lyricsIndex.value += 1;
          lyricScroll(lyricsIndex.value);
        }
      }
    }) 

    // 监听vuex中的musicId 重置歌词索引
    watch(()=>store.state.musicId,(musicId?:any)=>{
      lyricsIndex.value = 0;
    })

    watch(props.lyric,(current:any)=>{
      console.log("获取了歌词");
      // 大于一秒，说明歌词在1秒后才请求成功 歌词可能不能马上跳转到当前时间 这里进行校准
      if (store.state.currentTime > 1) {
        // 处理播放时间跳转时歌词位置的校准
        if (props.lyric.length > 1) {
          getCurrentLyricsIndex(store.state.currentTime);
          nextTick(() => {
            // 滑动到当前歌词
            lyricScroll(lyricsIndex.value);
          });
        }
      }
    })

</script>

<style lang="scss" scoped>
.lyrics {
  width: 100%;
  height: 275px;
  font-size: 12px;
  text-align: center;
  overflow-y: scroll;
  /* overflow: scroll; */
}

.lyrics::-webkit-scrollbar {
  display: none;
}

.lyricsItem {
  font-size: 12px;
  /* height: 20px; */
  margin: 25px 20px;
  transition: all 0.5s;
  line-height: 20px;
}

.currentLyric {
  font-weight: 600;
  font-size: 14px;
  color: black;
}

.placeholder {
  width: 100%;
  height: 40%;
}
</style>