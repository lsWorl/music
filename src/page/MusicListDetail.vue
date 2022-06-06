<template>
  <div class="musicListDetail" v-if="musicListDetail.value">
    <div class="scrollBar">
      <el-scrollbar>
        <!-- 歌单信息 -->
        <div class="listInfo">
          <!-- 歌单封面 -->
          <div class="listAvatar">
            <img :src="musicListDetail.value.coverImgUrl" alt="" />
          </div>
          <div class="right">
            <!-- 标题 -->
            <div class="title">
              <div class="titleContent">{{ musicListDetail.value.name }}</div>
            </div>
            <!-- 用户信息 -->
            <div class="user">
              <div class="userAvatar">
                <img :src="musicListDetail.value.creator.avatarUrl" alt="" />
              </div>
              <!-- 点击用户信息跳转 -->
              <div class="userName" @click="
                $router.push({
                  name: 'personal',
                  params: { uid: musicListDetail.value.creator.userId },
                })
              ">
                {{ musicListDetail.value.creator.nickname }}
              </div>
              <div class="createTime">
                {{ showDate }} 创建
              </div>
            </div>
            <!-- 操作按钮 -->
            <div class="buttons">
              <div class="buttonItem playAll" @click="playAll">
                <i class="iconfont icon-arrow_right_fat playAll"></i>
                <span>播放全部</span>
              </div>
              <div class="buttonItem" v-if="!isCreated" @click="collectList">
                <i class="iconfont icon-xihuan" :class="isSub ? 'red' : ''"></i>
                <span>{{ isSub ? "已收藏" : "收藏" }}</span>
              </div>
              <div class="buttonItem">
                <i class="iconfont icon-zhuanfa"></i>
                <span>分享</span>
              </div>
            </div>
            <!-- 标签 -->
            <div class="tags">
              标签：
              <div class="tagItem" v-for="(item, index) in musicListDetail.value.tags" :key="index">
                {{ item }}
              </div>
              <div v-if="musicListDetail.value.tags.length == 0">暂无标签</div>
            </div>
            <!-- 歌曲列表的歌曲数量和播放量 -->
            <div class="otherInfo">
              <div class="musicNum">
                歌曲 : {{ trackCount }}
              </div>
              <div class="playCount">
                播放 : {{ playCount }}
              </div>
            </div>
            <!-- 歌单简介 -->
            <div class="desc">
              简介 :
              {{
                  musicListDetail.value.description
                    ? musicListDetail.value.description
                    : "暂无简介"
              }}
            </div>
          </div>
        </div>
        <!-- 歌曲列表 -->
        <div class="musicList">
          <el-tabs v-model="activeName" @tab-click="clickTab">
            <el-tab-pane label="歌曲列表" name="first">
              <!-- 表格 -->
              <el-table :data="musicListDetail.value.tracks" size="mini" highlight-current-row stripe lazy
                style="width: 100%" @row-dblclick="clickRow" :row-key="row => row.id">
                <el-table-column label="" width="50" type="index" :index="handleIndex">
                </el-table-column>
                <el-table-column prop="name" label="音乐标题" min-width="350">
                </el-table-column>
                <el-table-column prop="ar[0].name" label="歌手" min-width="120">
                </el-table-column>
                <el-table-column prop="al.name" label="专辑" min-width="170">
                </el-table-column>
                <el-table-column prop="dt" label="时长" min-width="100">
                </el-table-column>
              </el-table>
              <!-- 登录后查看更多 -->
              <div class="loadMore" @click="loadMore">加载更多</div>

              <div class="placeholder"></div>
            </el-tab-pane>
            <el-tab-pane label="评论" name="second">
              <div class="commentList" v-if="comments.value" v-loading="isCommentLoading">
                <!-- 精彩评论 -->
                <Comment :commentType="'musicList'" :comments="comments.value.hotComments"
                  :commentId="musicListDetail.value.id + ''" ref="hotComments">
                  <template v-slot:title>
                    <div>精彩评论</div>
                  </template>
                </Comment>
                <!-- 最新评论 -->
                <comment :comments="comments.value.comments" :commentType="'musicList'"
                  :commentId="musicListDetail.value.id + ''" :isHotComment="comments.value.hotComments ? false : true"
                  @getComment="getMusicListComment">
                  <template v-slot:title>
                    <div>最新评论</div>
                  </template>
                </comment>
                <!-- 分页 -->
                <div class="page" v-if="comments.value.comments && comments.value.comments.length != 0">
                  <el-pagination background layout="prev, pager, next" :total="comments.value.total" small
                    :page-size="50" :current-page="currentCommentPage" @current-change="commentPageChange">
                  </el-pagination>
                </div>
              </div>

            </el-tab-pane>
            <el-tab-pane label="收藏者" name="third">
              <user-list-card userType="musicListDetailPage" :userList="followedsListData.followedsList"
                :isLoad="followedsListData.isMore" @bottomLoad="bottomLoad">
              </user-list-card>
              <div class="tips" v-if="
                followedsListData.followedsList.length == 0 &&
                followedsListData.isLoaded == true
              ">
                暂无收藏者
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, toRef } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { request } from "../network/request";
import { handleMusicTime, formatDate } from "../plugins/utils";
import '../components/UserListCard.vue'
import { ref } from "vue";
import "../components/UserListCard.vue";
import "../components/Comment.vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const store = useStore()

//点击歌单默认为歌单列表
const activeName = ref('first')
//歌单数据
let musicListDetail: any = reactive({})
const router = useRouter()
const route = useRoute()
//评论
let comments: any = reactive({})
// 当前评论页数
let currentCommentPage = ref(1)
// 是否还有更多音乐
let isMore = ref(false)
// 用户是否收藏了当前歌单
let isSub = ref(false)
// 是否是用户创建的歌单
let isCreated = false
// 评论是否在加载
let isCommentLoading = ref(false)
// 是否禁止滚动加载
let scrollLoadDisabled = ref(false)
// 收藏者列表的变量
let followedsListData = reactive({
  // 当前页数
  currentPage: 1,
  // 列表
  followedsList: [],
  // 是否还有更多
  isMore: false,
  // 是否已经加载过列表数据 （用于点击收藏者tab后第一次加载数据）
  isLoaded: false,
})

// 点击播放全部按钮的回调
const playAll = () => {
  store.commit("updateMusicId", musicListDetail.value.tracks[0].id);
  store.commit("updateMusicList", {
    musicList: musicListDetail.value.tracks,
    musicListId: musicListDetail.value.id,
  });
}

// 双击table的row的回调
async function clickRow(row: any) {
  console.log(row);
  // 将musicId提交到vuex中 供bottomControl查询歌曲url和其它操作
  store.commit("updateMusicId", row.id);
  // 如果歌单发生变化,则提交歌单到vuex
  if (musicListDetail.value.id != store.state.musicListId) {
    // 将歌单传到vuex
    store.commit("updateMusicList", {
      musicList: musicListDetail.value.tracks,
      musicListId: musicListDetail.value.id,
    });
  }
}


//展示时间
let showDate = computed((value = new Date()) => {
  // 1、先将时间戳转成Date对象
  const date = new Date(value);
  formatDate(date, "yyyy-MM-dd")
  // 2、将date进行格式化
  return formatDate(date, "yyyy-MM-dd");
})
//监听歌曲数量
let trackCount: any = computed((num = musicListDetail.value.trackCount) => {
  return num
})
//监听播放数量
let playCount = computed((num = musicListDetail.value.playCount) => {
  return num
})

// 事件函数
const handleIndex = (index: any) => {
  // console.log(index);
  index += 1;
  if (index < 10) {
    return "0" + index;
  } else {
    return index;
  }
}

// 根据传来的 id 查询歌单
getMusicListDetail()
async function getMusicListDetail() {
  const date = new Date()
  var timestamp: any = Date.parse(date);
  let result = await request("/playlist/detail", {
    id: route.params.id,
    timestamp
  });
  console.log(result);
  musicListDetail.value = result.data.playlist;
  // console.log(musicListDetail.value.tracks.length != musicListDetail.value.trackIds.length)
  // 判断是否还有更多音乐
  if (musicListDetail.value.tracks.length != musicListDetail.value.trackIds.length) {
    isMore.value = true;
  }
  // 处理播放时间
  musicListDetail.value.tracks.forEach((item: any, index: any) => {
    musicListDetail.value.tracks[index].dt = handleMusicTime(item.dt);
  });
}

// 获取歌单评论
async function getMusicListComment(type?: any) {
  // 获取时间戳
  const date = new Date()
  var timestamp = Date.parse(date);
  isCommentLoading.value = true;

  if (type == "changePage") {
    scrollToComment();
  }
  let res = await request("/comment/playlist", {
    id: route.params.id,
    offset: (currentCommentPage.value - 1) * 50,
    limit: 50,
    timestamp,
  });
  console.log(res);
  if (res.data.code !== 200) {
    ElMessage.error("获取评论失败,请稍后重试!")
  }
  comments.value = res.data;
  isCommentLoading.value = false;
  console.log("重新歌单获取评论");
}

const scrollToComment = () => {
  let musicListDetail: any = document.querySelector(".musicListDetail");
  let listInfo: any = document.querySelector(".listInfo");
  console.log("执行了这里 滚动到精彩评论", [listInfo]);
  musicListDetail.scrollTo({
    behavior: "smooth",
    top: listInfo.clientHeight - 20,
  });
}

// 评论点击翻页的回调
const commentPageChange = (page: any) => {
  currentCommentPage.value = page;
  getMusicListComment("changePage");
}
// 获取歌单收藏者
async function getMusicListFolloweds() {
  let res = await request("/playlist/subscribers", {
    id: route.params.id,
    offset: (followedsListData.currentPage - 1) * 20,
  });
  console.log(res.data.subscribers);
  followedsListData.isMore = res.data.more;
  followedsListData.followedsList.push(...res.data.subscribers);
}
// 收藏者列表触底的回调
const bottomLoad = () => {
  // console.log('回调执行了',followedsListData)
  followedsListData.currentPage += 1;
  getMusicListFolloweds();
}

// 获取歌曲详情
async function getMusicDetail(ids: string) {
  if (isMore.value === false) return;
  scrollLoadDisabled.value = true;

  let res = await request("/song/detail", {
    ids,
    fee: 0
  });
  // 处理时间
  console.log(res);
  res.data.songs.forEach((item: any, index: any) => {
    res.data.songs[index].dt = handleMusicTime(item.dt);
  });
  musicListDetail.value.tracks.push(...res.data.songs);
  // 判断是否还有更多音乐
  if (
    musicListDetail.value.tracks.length <
    musicListDetail.value.trackIds.length
  ) {
    isMore.value = true;
    scrollLoadDisabled.value = false;
  } else {
    isMore.value = false;
  }
}


// 点击加载所有音乐
const loadMore = () => {
  console.log("加载所有音乐");
  // isMore.value = false;

  let arr = musicListDetail.value.trackIds.slice(
    musicListDetail.value.tracks.length
  );
  if (arr.length > 100) {
    arr = arr.slice(0, 100);
  }
  // console.log(arr.length);
  let ids = "";
  arr.forEach((item: any) => {
    ids += item.id + ",";
  });
  ids = ids.substring(0, ids.length - 1);
  // console.log(ids);
  ElMessage('正在加载更多歌曲中，请稍后')
  getMusicDetail(ids);
}

// 点击el-tab-pane的回调
const clickTab = (e: any) => {

  if (e.index == 1 && !comments.comments) {
    getMusicListComment();
    console.log(comments.comments);
  } else if (e.index == 2 && !followedsListData.isLoaded) {
    getMusicListFolloweds();

    followedsListData.isLoaded = true;
  }
}


</script>

<style lang="scss" scoped>
.scrollBar {
  // background-color: aqua;
  height: calc(100vh - 186px);
  width: 100%;
}

.musicListDetail {
  // overflow-y: scroll;
}

.listInfo {
  display: flex;
  padding: 25px 15px;
  align-items: center;
}

.listAvatar {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 15px;
  position: relative;
}

.listAvatar::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  // background: url("~assets/img/imgLoading.png") no-repeat;
  background-size: contain;
  z-index: -1;
}

.listAvatar img {
  width: 100%;
}

.right {
  width: calc(100% - 200px);
}

.title {
  display: flex;
  align-items: center;
}

.titleContent {
  font-size: 24px;
  font-weight: 600;
  color: #373737;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.userAvatar {
  height: 25px;
  width: 25px;
  margin-right: 8px;
}

.userAvatar img {
  width: 100%;
  border-radius: 50%;
}

.userName {
  color: #6191c2;
  margin-right: 8px;
  cursor: pointer;
}

.createTime {
  transform: scale(0.9);
}

.buttons {
  margin: 8px 0 0 -5px;
  display: flex;
}

.buttonItem {
  font-size: 12px;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transform: scale(0.9);
  cursor: pointer;
}

.buttonItem i {
  font-size: 12px;
  margin-right: 3px;
  transform: scale(0.9);

}

.playAll {
  background-color: #1ecf9d;
  color: white;
}

.tags {
  margin: 8px 0 0 -30px;
  display: flex;
  font-size: 14px;
  transform: scale(0.9);
}

.tagItem {
  color: #6191c2;
  margin-right: 5px;
}

.otherInfo {
  margin: 5px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.musicNum {
  font-size: 14px;
  margin-right: 13px;
}

.playCount {
  font-size: 14px;
  margin-right: 13px;
}

.desc {
  margin: 5px 0 0 -30px;
  font-size: 14px;
  transform: scale(0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.musicList {
  margin: -15px 15px 0;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
  margin: 0px 40%;
}

.placeholder {
  width: 100%;
  height: 50px;
}

.loadMore {
  width: 100%;
  height: 50px;
  font-size: 12px;
  color: #aaa;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  transform: scale(0.9);
}

.tips {
  font-size: 14px;
  margin: 30px 0;
  text-align: center;
}
</style>