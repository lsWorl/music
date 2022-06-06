<template>
  <div class="navigation_left">
    <div class="pic">
      <img src="../assets/images/logo.jpg" />
    </div>
    <div class="list_left">
      <span>在线音乐</span>
      <ul>
        <!-- 因为前期用css修饰里面后向用路由包裹太麻烦了就懒得改了 -->
        <router-link to="/recommend/musicMuseum">
          <li :class="{ 'active': index === 0 }" @click="changeBtn(0)">
            <a>
              <i class="iconfont icon-star iconfont_size" />音乐馆</a>
          </li>
        </router-link>
        <router-link to="/recommend/vedioPage">
          <li :class="{ 'active': index === 1 }" @click="changeBtn(1)"><a><i
                class="iconfont icon-shipintianchong iconfont_size" />视频</a></li>
        </router-link>
        <router-link to="/recommend/audio">
          <li :class="{ 'active': index === 2 }" @click="changeBtn(2)"><a><i
                class="iconfont icon-diantai iconfont_size" />电台</a></li>
        </router-link>
      </ul>
      <span>我的音乐</span>
      <ul>
        <router-link to="/recommend/like">
          <li :class="{ 'active': index === 3 }" @click="changeBtn(3)"><a><i
                class="iconfont icon-xihuanfill iconfont_size" />我喜欢</a></li>
        </router-link>
        <router-link to="/recommend/recentPlay">
          <li :class="{ 'active': index === 4 }" @click="changeBtn(4)"><a><i class="iconfont icon-zuijinliulan iconfont_size" />最近播放</a></li>
        </router-link>
        <router-link to="/recommend/LiseningList">
          <li :class="{ 'active': index === 5 }" @click="changeBtn(5)"><a><i class="iconfont icon-24gf-playlistMusic4 iconfont_size" />试听列表</a>
          </li>
        </router-link>
      </ul>
      <span>创建的歌单</span>
      <ul>
        <router-link to="/">
          <li :class="{ 'active': index === 6 }" @click="changeBtn(6)"><a>李荣浩</a></li>
        </router-link>
        <router-link to="/">
          <li :class="{ 'active': index === 7 }" @click="changeBtn(7)"><a>周杰伦</a></li>
        </router-link>
      </ul>
      <span>收藏的歌单</span>
      <ul v-for="item in saveMenu" :key="item.index">
        <li><a>{{ item }}</a></li>
      </ul>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRef } from 'vue'
//收藏歌单的字段
const saveMenu: any = ref([])

//切换菜单栏
let index = ref(0)
//切换菜单栏事件
const changeBtn = (value: number) => {
  index.value = value
}

</script>

<style lang="scss" scoped>
*{
  //用户禁止选中
  user-select: none;
}
.navigation_left {
  height: 100vh;
  background-color: #f0f0f0;
  overflow: hidden;
  width: 13rem;

  .pic>img {
    margin-top: 20px;
    margin-left: 30px;
  }
}

.list_left {
  margin-top: 10px;

  span {
    margin-left: 30px;
    display: block;
    color: #787878;
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0px 10px;

    li {
      margin-top: 5px;
      height: 3rem;
      line-height: 3rem;
      border-radius: 10px;
      width: 100%;
      color: #303030;
      cursor: pointer;

      a {
        margin-left: 30px;
      }
    }

    li:hover {
      display: block;
      background-color: #1ecf9d;

      a {
        color: #fff;
      }
    }
  }
}

.iconfont_size {
  text-align: center;
  font-size: 18px;
  margin-right: 4px;
}

.active {
  display: block;
  background-color: #1ecf9d;

  a {
    color: #fff;
  }
}
</style>