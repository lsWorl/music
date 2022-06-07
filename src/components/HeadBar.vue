<template>
  <div class="headNav">
    <div>
      <div class="arrowGroup">
        <div>
          <el-icon size="18px" @click="before">
            <ArrowLeftBold />
          </el-icon>
        </div>
        <div>
          <el-icon size="18px" @click="after">
            <ArrowRightBold />
          </el-icon>
        </div>
      </div>
      <div class="searchMusic">
        <el-input maxlength="14" :prefix-icon="Search" v-model="input" placeholder="搜索音乐" />
      </div>
    </div>
    <div class="login">
      <div><img src="../assets/images/profile.jpg" alt=""></div>
      <span>点击登录</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Search } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
const router = useRouter()
const before = ()=>{
  console.log(router)
  router.back()
}
const after = ()=>{
  router.forward()
}
console.log(router)
const input = ref('')
</script>

<style lang="scss" scoped>
*{
  //用户禁止选中
  user-select: none;
}
.headNav {
  width: 100%;
  height: 60px;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  >div{
    display: flex;
  }

  .arrowGroup {
    width: 3rem;
    line-height: 3rem;
    display: flex;
    justify-content: space-between;
  }

  i {
    cursor: pointer;
  }

  i:hover {
    color: #1ecf9d;
  }

  .searchMusic {
    margin-left: 20px;
    padding: 4px;
  }
  
  .login{
    margin-top: 10px;
    width: 7rem;
    display: flex;
    justify-content: space-between;
    >div,span{
      cursor: pointer;
      color: #7b7b7b;
    }
  }
}
</style>