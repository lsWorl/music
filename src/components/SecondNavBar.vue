<template>
  <div class="navBar">
    <div class="barItem" :class="index === activeNum ? 'active' : ''" v-for="(item, index) in SecondNavBarData"
      :key="index" @click="clickSecondBarItem(index)">{{ item.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
defineProps({ SecondNavBarData: Object })
const activeNum = ref(0)
//向父组件发射事件
const emit = defineEmits<{
  (event: 'clickSecondBarItem', index: number): void
}>()

const clickSecondBarItem = (index: number) => {
  if (activeNum.value === index) return
  activeNum.value = index
  emit('clickSecondBarItem', index)
}


</script>

<style lang="scss" scoped>
.navBar {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.barItem {
  margin: 6px 2px;
  padding: 6px 10px;
  font-size: 14px;
  width: 80px;
  text-align: center;
  // box-sizing: content-box;
  transform: scale(0.9, 0.9);
  cursor: pointer;
  border-radius: 11px;
}
.barItem:hover{
    background-color: #f1f1f1;
    color: #1ece9b;
  }

.active {
  background-color: #1ece9b;
  color: #fff;
  border-radius: 11px;
}
.active:hover{
  background-color: #1ece9b;
  color: #fff;
}
</style>