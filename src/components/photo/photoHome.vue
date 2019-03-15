<template>
  <div class="photoHomeCmt">
    <!-- 顶部分类列表 -->
    <div id="slider" class="mui-slider mui-scroll-wrapper">
      <div
        id="sliderSegmentedControl"
        class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted"
      >
        <div class="mui-scroll">
          <a
            :class="['mui-control-item', item.id==0?'mui-active':'']"
            href="#item1mobile"
            data-wid="tab-top-subpage-1.html"
            v-for="(item, index) in classifyNames"
            :key="index"
            @click="getPhotoList(item.id)"
          >{{item.title}}</a>
        </div>
      </div>
    </div>

    <!-- <ul>
      <li v-for="item in list" :key="item.img_url">
        <img v-lazy="item">
      </li>
    </ul>-->
    <!-- 后面的图片列表 -->
    <ul class="photo-list">
      <li class="photo-item" v-for="(item, index) in list" :key="index">
        <router-link :to="'/home/photoHome/photoDetail/' + item.id">
          <img v-lazy="item.img_url">
          <div class="photo-content">
            <div class="large-title">{{item.title}}</div>
            <div class="small-title">{{item.zhaiyao}}</div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import mui from "../../MUI/js/mui.min.js";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      classifyNames: [],
      list: []
    };
  },
  created() {
    //在初始化时调用
    this.getClassifyNames();
    this.getPhotoList(0);
  },
  mounted() {
    //在mounted的时候吧滑动栏，加上mui的js行为
    mui(".mui-scroll-wrapper").scroll({
      deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
  },
  methods: {
    //使用axios获取分类名称，并且定义成方法
    getClassifyNames() {
      this.axios.get("/api/getimgcategory").then(res => {
        if (res.data.status == 0) {
          this.classifyNames = res.data.message;
          this.classifyNames.unshift({
            title: "全部",
            id: 0
          });
        } else {
          Toast("获取分类列表失败");
        }
      });
    },
    //获取照片分享图片的方法
    getPhotoList(id) {
      this.axios.get("/api/getimages/" + id).then(res => {
        if (res.data.status == 0) {
          this.list = res.data.message;
        } else {
          Toast("获取图片失败，请稍后再试");
        }
      });
    }
  },
  
};
</script>
<style lang='less' scoped>
* {
  touch-action: pan-x;
  .photoHomeCmt {
    .photo-list {
      padding: 0px 12px 0px 8px;
      margin: 0PX;
    }

    .photo-item {
      background-color: #666;
      position: relative;
      margin-bottom: 10px;
      box-shadow: 3px 3px 5px #666;
      height: 355px;
      list-style: none;

      img[lazy="loading"] {
        width: 40px;
        height: 300px;
        margin: auto;
      }
      img {
        width: 100%;
        height: 100%;
        padding-bottom: 0px;
      }
      overflow: hidden;

      .photo-content {
        position: absolute;
        bottom: 0px;
        max-height: 80px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.4);
        color: white;
        .large-title {
          font-size: 14px;
        }
        .small-title {
          font-size: 13px;
        }
      }
    }
  }
}
</style>

