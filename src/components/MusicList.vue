<template>
  <div class="recommendCard">
    <div class="recommendList" v-infinite-scroll="load" 
      >
      <ul>
        <li v-for="item in  musicList.value" @click="clickListCardItem(item.id)" :key="item.id">
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
import { inject, onBeforeMount, onBeforeUpdate, reactive, ref, watch } from 'vue';
import { request } from '../network/request'
//接收从父组件收到的数据
let musicList: any = inject('musicList')
onBeforeMount(() => {
  //判断是否是SingerList组件传来的数据
  if (typeof musicList.value === 'number') {
    musicList.value = musicList
  }
})

onBeforeUpdate(()=>{
  //判断是否是SingerList组件传来的数据
  if (typeof musicList.value === 'number') {
    musicList.value = musicList
  }
})

const props = defineProps<{
  isLoad?: boolean
}>()

// 无限滚动是否可用
let disabled = ref(false)
// 监听滑到底部是否要触发加载
watch(musicList, (newValue, oldValue) => {
  if (props.isLoad === true) {
    if (musicList.value.length != 0) {
      disabled.value = false;
    } else {
      disabled.value = true;
    }
  }
}, { deep: true })

onBeforeUpdate(() => {
  console.log(musicList)
  if (musicList.value.playlists) {
    musicList.value = musicList.value.playlists
  }
})

const emit = defineEmits<{
  (event: 'clickListCardItem', id: number): void,
  (event: 'bottomLoad'): void
}>()

const clickListCardItem = (id: number) => {
  emit('clickListCardItem', id)
}
// 上拉触底触发
const load = () => {
  // console.log("滑动到底部")
  emit('bottomLoad')
  // 触发load后加载数据 期间不允许再次触发load事件
  disabled.value = true
}
</script>

<style lang="scss" scoped>
//歌单部分
.recommendCard {

  .recommendList {
    margin-top: 20px;
  }

  ul {

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 10px;

    li {
      width: 18%;
      margin: 0 2% 20px 0;
      // text-align: center;
    }

    li>span {
      // width: 12rem;
      font-size: 16px;
      line-height: 17px;
      white-space: pre-wrap;
      text-overflow: ellipsis;
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
    border-radius: 10px;

    img {
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }

  }
}
</style>