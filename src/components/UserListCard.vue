<template>
  <div class="UserListCard" v-infinite-scroll="load" infinite-scroll-distance = "0px" :infinite-scroll-disabled="disabled"  :infinite-scroll-immediate="false">
    <div class="userItemContainer" v-for="(item, index) in userList" :key="index" @click="clickUser(item.userId)">
      <div class="userItem">
        <div class="left">
          <img :src="item.avatarUrl + '?param=200y200'" alt="" class="avatar" />
        </div>
        <div class="right">
          <div class="nickName">{{ item.nickname }}</div>
          <div class="signature">
            {{ item.signature }}
          </div>
          <div class="nums" v-if="userType == 'personalPage'">
            <div class="musicListNum">{{ "歌单: " + item.playlistCount }}</div>
            <div class="fenge">|</div>
            <div class="followedsNum">{{ "粉丝: " + item.followeds }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { inject, onBeforeMount, onBeforeUpdate, reactive, ref, watch } from 'vue';

let router = useRouter()
// 无限滚动是否可用
let disabled = ref(true)

// 点击useritem的事件
const clickUser = (id: number) => {
  // console.log(id);
  router.push({ name: "personal", params: { uid: id } });
}

// 上拉触底触发
const emit = defineEmits<{
  (event: 'bottomLoad'): void
}>()
const load = () => {
  console.log("滑动到底部");
  emit('bottomLoad');
  // 触发load后加载数据 期间不允许再次触发load事件
  disabled.value = true;
}
const props = defineProps<{
  userList: any
  isLoad: boolean
  userType: String
}>()
//   数据更新后，可再次运行触发load事件
watch(props.userList, () => {
  if (props.isLoad == true) {
    if (props.userList.length != 0) {
      disabled.value = false;
    } else {
      disabled.value = true;
    }
  }
})

</script>

<style scoped>
.UserListCard {
  display: flex;
  flex-wrap: wrap;
}

.userItemContainer {
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  overflow: auto;
}

.userItem {
  display: flex;
  width: 350px;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
}

.userItem:hover {
  background-color: #f9f9f9;
}

.avatar {
  height: 70px;
  width: 70px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #eee;
  margin-right: 10px;
}

.nickName {
  margin: 10px 0 5px;
  font-size: 13px;
  color: #373737;
}

.signature {
  font-weight: lighter;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 250px;
  height: 13px;
  margin: 5px 0;
}

.nums {
  display: flex;
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
  color: #888;
}

.fenge {
  color: #ddd;
  margin: 0 10px;
}
</style>
