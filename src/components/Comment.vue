<template>
  <div class="hotComments">
    <div class="comments" v-if="props.commentType != '' && props.commentType != 'music' && props.isHotComment">
      <el-input type="textarea" class="commentArea" maxlength="140" show-word-limit v-model="commentInput"
        placeholder="留下你的评论" @input="inputComment"></el-input>
      <div class="submitCommentButton">
        <el-button size="small" round class="submitComment">评论</el-button>
      </div>
    </div>
    <!-- 音乐单曲评论 -->
    <div class="musicComment" v-else-if="props.commentType != '' && props.commentType == 'music'">
      <el-button class="commentCardSwitch" size="small" round><i class="iconfont icon-ziyuan"></i> 发表我的音乐评论</el-button>
      <el-dialog :visible="isCommentDialogShow" width="400px" @close="closeCommentDialog" append-to-body
        class="commentDialog">
        <div class="musicTitle">歌曲：{{ musicTitle }}</div>
        <el-input type="textarea" class="commentArea musicCommentArea" maxlength="140" show-word-limit
          v-model="commentInput" @input="inputComment" placeholder="留下你的评论"></el-input>
        <!-- 提交评论 -->
        <div class="submitCommentButton">
          <el-button size="small" round class="submitComment musicSubmitComment">评论</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="commentHeader">
      <slot name="title"></slot>
    </div>
    <div class="commentItem" v-for="(item, index) in props.comments" :key="index">
      <div class="commentCreatorAvatar">
        <img :src="item.user.avatarUrl + '?param=100y100'" alt="" />
      </div>
      <div class="commentMain">
        <div class="commentContent">
          <span class="commentUserNickName">{{ item.user.nickname }}:&nbsp;</span>
          <span>{{ item.content }}</span>
        </div>
        <div class="replied">
          <div class="repliedItem" v-for="(item1, index1) in item.beReplied" :key="index1">
            <span class="repliedUser">@{{ item1.user.nickname }}:&nbsp;</span>
            <span class="repliedContent">{{ item1.content }}</span>
          </div>
        </div>
        <div class="commentButtons">
          <div :class="item.liked ? 'likeCurrentComment' : ''">
            <i class="iconfont icon-good"></i> {{ item.likedCount }}
          </div>
          <div><i class="iconfont icon-zhuanfa"></i></div>
          <div>
            <i class="iconfont icon-pinglun"></i>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  comments: any
  commentType: String
  commentId: String
  musicTitle?: String
  isHotComment?: Boolean
}>()
//评论
let commentInput = ref('')
// 是否显示评论dialog
let isCommentDialogShow = ref(false)
// 评论模式   true是常规评论   false是楼层评论
let commentMode = ref(true)
// 楼层回复前面几个字的长度
let floorCommentInputLength = ref(0)
// 用于暂存楼层评论id
let floorCommentId = ref("")
// 监听键盘事件
const inputComment = () => {
  // 如果是楼层回复
  if (commentMode.value == false) {
    if (commentInput.value.length < floorCommentInputLength.value) {
      // 当长度小于当前楼层评论前面默认的字时
      commentMode.value = true;
      console.log("修改mode");
    }
  }
}

// 关闭评论dialog的回调
const closeCommentDialog = () => {
  isCommentDialogShow.value = false;
  commentInput.value = "";
  floorCommentId.value = "";
  commentMode.value = true;
  floorCommentInputLength.value = 0;
}

</script>

<style lang="scss" scoped>
.hotComments {
  margin-bottom: 20px;
  width: 100%;
}

.commentHeader {
  font-size: 14px;
  color: rgb(26, 26, 26);
  font-weight: 600;
  padding: 10px 0;
}

.commentItem {
  display: flex;
  margin: 5px 0;
  padding: 10px 0 20px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.commentCreatorAvatar {
  width: 35px;
  height: 35px;
  margin: 0px 10px 0 0;
}

.commentCreatorAvatar img {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.commentMain {
  width: calc(100% - 50px);
}

.commentUserNickName {
  color: #5a8ab9;
  cursor: pointer;
}

.commentBottom {
  margin-top: 2px;
  color: rgb(172, 172, 172);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commentButtons {
  display: flex;
  align-items: center;
}

.commentButtons div {
  margin-top: -3px;
  padding: 0 8px;
  transform: scale(0.85);
}

.commentButtons div:nth-child(1) {
  font-size: 14px;
}

.replied {
  background-color: #f4f4f4;
  margin: 7px 0;
  border-radius: 5px;
}

.repliedItem {
  padding: 7px 10px;
  line-height: 20px;
}

.repliedUser {
  color: #5a8ab9;
  cursor: pointer;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.commentContent>span {
  line-height: 20px;
}


.submitCommentButton {
  width: 100%;
  text-align: right;
  margin: 10px 0;
}

.el-button:hover {
  background-color: #f2f2f2;
}

.el-button {
  transform: scale(0.9) translateX(5%);
}

.submitComment:focus {
  background-color: #fff;
}

.commentCardSwitch {
  position: fixed;
  left: 50%;
  top: calc(80vh - 105px);
  transform: translateX(-50%) scale(0.9);
  border: none;
  background-color: #f1f1f1;
  line-height: 15px;
  padding: 10px 10px 10px 30px;
}

.commentCardSwitch:hover {
  background-color: #e1e1e1;
}

.commentCardSwitch i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.musicTitle {
  width: 100%;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 10px;
}


.musicSubmitComment {
  padding: 8px 20px;
  font-size: 13px;
  background-color: #ec4141;
  color: white;
  border: none;
}

.musicSubmitComment:hover {
  background-color: #eb2e2e;
  color: white;
}

.musicSubmitComment:focus {
  color: white;
  background-color: #ec4141;
}


.likeCurrentComment,
.likeCurrentComment i {
  color: #ec4141 !important;
}
</style>