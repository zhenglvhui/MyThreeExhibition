<template>
  <div class="tootipsModelPage">
    <div class="title">{{ title }}</div>
    <div class="detail" v-if="modelName && modelName !== 'none'">点击前方模型可以查看模型详情</div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
let props = defineProps({
  title: String,
  modelName: String,
});
</script>
<style scoped lang="less">
.tootipsModelPage {
  position: fixed;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  div {
    padding: 6px;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, 0.7);
    width: fit-content;
  }

  .detail {
    margin-top: 5px;
  }
}

@media screen and (max-width: 750px) {
  .tootipsModelPage{
    div{
      font-size: 0.7rem;
    }
  }
 
}
</style>
