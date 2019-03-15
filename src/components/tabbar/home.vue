<template>
  <div>
    <!-- 中间轮播图 -->
    <!-- <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(item, index) in lunbolist" :key="index">
        <a href="https://www.baidu.com">
          <img :src="item.img" alt>
        </a>
      </mt-swipe-item>
    </mt-swipe> -->
    <lunbo :lunbolist="lunbolist" :lunboflag="lunboflag"></lunbo>
    <!-- 实现中间六宫格 -->
    <ul class="mui-table-view mui-grid-view mui-grid-9">
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <router-link to="/home/newsInfo">
          <img src="../../images/menu1.png" alt>
          <div class="mui-media-body">新闻资讯</div>
        </router-link>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3" @click='shuaxin'>
        <router-link to="/home/photoHome">
          <img src="../../images/menu2.png" alt>
          <div class="mui-media-body">图文分享</div>
        </router-link>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <router-link :to="{'name':'shopList'}">
          <img src="../../images/menu3.png" alt>
          <div class="mui-media-body">商品购买</div>
        </router-link>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <a href="#">
          <img src="../../images/menu4.png" alt>
          <div class="mui-media-body">留言反馈</div>
        </a>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <a href="#">
          <img src="../../images/menu5.png" alt>
          <div class="mui-media-body">视频专区</div>
        </a>
      </li>
      <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
        <a href="#">
          <img src="../../images/menu6.png" alt>
          <div class="mui-media-body">联系我们</div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      lunbolist: [],
      lunboflag:false
    };
  },
  methods: {
    getlunbo() {
      this.axios.get("/api/getlunbo").then(res => {
        if (res.data.status == 0) {
          this.lunbolist = res.data.message;
        } else {
          Toast("获取轮播图失败。");
        }
      });
    },
    shuaxin(){
      this.$router.go(0);
    }
  },
  created() {
    this.getlunbo();
  }
};
</script>
<style scope>
.mint-swipe-items-wrap {
  height: 200px;
}
/* 下面是设置六宫格的样式 */
.mint-swipe-items-wrap .mint-swipe-item img {
  height: 100%;
  width: 100%;
}
.mui-grid-view.mui-grid-9 .mui-media {
  background-color: #fff;
  border: none;
  font-size: 14px;
}
.mui-grid-view.mui-grid-9 .mui-media img {
  height: 50%;
  width: 50%;
}
.mui-grid-view.mui-grid-9 {
  background-color: #fff;
}
</style>