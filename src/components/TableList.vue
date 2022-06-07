<template>
  <div class="officalItem" v-if="props.officialListDetailItem">
    <div class="listCover">
      <img :src="props.officialListDetailItem.coverImgUrl" alt="" @click="
        props.officialListDetailItem.coverImgUrl
          ? clickCheckAll(props.officialListDetailItem.id)
          : ''
      " />
    </div>
    <div class="listContainer">
      <table>
        <h3>{{ props.officialListDetailItem.name }}</h3>
        <tr @click="handleRowClick" class="listRows" v-for="(item, index) in (props.officialListDetailItem.tracks &&
        props.officialListDetailItem.tracks.slice(0, 5))" :key="index">
          <td class="index">{{ index + 1 }}</td>
          <td class="musicName">{{ item.name }}</td>
          <td class="singer">{{ item.ar[0].name }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, toRefs, reactive } from "vue";
const props = defineProps<{
  officialListDetailItem?: any
  listId?: any

}>()
const emit = defineEmits<{
  (event: 'clickCheckAll', { id, listId }): void,
  (event:'handleRowClick', path:any):void
}>()

const clickCheckAll = (id: any) => {
  let listId = props.listId;
  emit("clickCheckAll", { id, listId });
}
</script>

<style lang="scss" scoped>
.officalItem {
  display: flex;
  // flex-wrap: wrap;
  width: 33%;
  margin: 20px 60px 0px 100px;
  // background-color: aqua;
}

.listCover {
  width: 270px;
  height: 270px;
  margin-right: 0px;
  cursor: pointer;
}

.listCover img {
  width: 100%;
  border-radius: 10px;
}

.listContainer {
  width: calc(100% - 200px);
}

h3 {
  margin: 10px;
  font-size: 22px;
}

.listRows {
  height: 30px;
  font-size: 12px;
  color: rgb(153, 153, 153);
  width: 220px;
  display: flex;
  align-items: center;
  position: relative;
}

.listRows:nth-child(odd) {
  background-color: #f9f9f9;
}

.listRows:hover {
  background-color: #f4f4f4;
}

.listRows td {
  transform: scale(0.9);
}

.listRows .musicName {
  color: rgb(31, 31, 31);
  transform: translate(-5%, -5%) scale(0.9);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 80%;
}

.index {
  text-align: center;
  line-height: 28px;
  width: 30px;
}

.singer {
  text-align: right;
  position: absolute;
  right: 10px;
}
</style>