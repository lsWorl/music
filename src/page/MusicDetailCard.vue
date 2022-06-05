<template>

</template>

<script lang="ts" setup>

</script>

<style lang="scss">
.glassCard {
  // 火狐默认不支持backdrop-filter 可以手动激活，这里不折腾了，火狐关闭玻璃背景功能，反正这个功能特别吃性能，字体也看不清了，没必要
  backdrop-filter: blur(50px) brightness(95%) !important;
  background-color: unset !important;
  background-image: unset !important;

  * {
    color: rgb(37, 37, 37);

    .commentComponent /deep/ * {
      color: rgb(37, 37, 37);
      border-color: rgb(143, 143, 143);

      .replied {
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.musicDetailCard {
  position: fixed;
  width: 100%;
  // height: calc(100vh - 55px);
  height: calc(80vh - 55px);
  bottom: 55px;
  left: 0;
  z-index: 1000;
  transition: bottom 0.5s ease;
  background-color: white;
  background-image: linear-gradient(to bottom, #e3e2e3, white);
}

.closeCard .iconfont {
  position: absolute;
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
  bottom: calc(-80vh + 55px);
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

.bottom /deep/ .el-loading-spinner {
  top: 40px;
}

.album,
.singer {
  cursor: pointer;
}
</style>