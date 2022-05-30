<template>
  <!-- 导航栏部分布局 -->
  <nav>
    <ul>
      
      <li v-for="item in MusicMuseumnav" :key="item"><router-link :to="item.router"><span :class="{ 'isAcitveText': item.show }" @click="changeActive(item)">{{item.navName}}</span></router-link>
        <div :class="{ 'isAcitve': item.show}"></div>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { inject, onBeforeUpdate, ref } from "vue";


//接收音乐馆组件的数据
let MusicMuseumnav:any = inject('MusicMuseumnav')
// 判断导航栏是否为当前所选
const changeActive = (value:any)=>{
  if(value.show) return
  for( let i of MusicMuseumnav.value){
    i.show = false
  }
  value.show = true
}
</script>

<style lang="scss" scoped>
//导航栏部分样式
h2 {
  font-size: 30px;
}

nav {
  margin-top: 16px;

  ul {
    width: 33%;
    height: 28px;
    line-height: 28px;
    display: flex;
    justify-content: space-around;

    li>span {

      cursor: pointer;
    }
    li>a{
      color: #535353;
    }
    li>a:hover {
      color: #1ecc94;
    }

  }
}

.isAcitve {
  user-select: none;
  width: 20px;
  margin: 1px auto;
  border-radius: 20px;
  border-bottom: 4px solid #1ecc94;
}

.isAcitveText {
  color: #1ecc94;
}
</style>