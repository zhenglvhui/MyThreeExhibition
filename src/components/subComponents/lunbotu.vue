<template>
    <!-- 调用这个子组件，需要传递两个参数，一个是lunbolist用来发送给img轮播图的地址，对象名称是src
    第二个参数是lunboflage true表示高自适应，宽居中，false表示宽高都100%
     -->
  <div>
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(item, index) in lunbolist" :key="index">
        <a href="https://www.baidu.com">
          <img :src="item.img" :class="{lunboflag}">
        </a>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
export default {
  data() {
    return {
    //   lunboflag: false
    };
  },
  props: ["lunbolist", "lunboflag"]
};
</script>
<style lang="less" scoped>
    .mint-swipe-items-wrap .mint-swipe-item .lunboflag {
        height: 100%;
        width: auto;
        display: block;
        margin: 0 auto;
    }
</style>
