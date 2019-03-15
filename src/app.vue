<template>
  <div class="headerPadding">
    <!-- 头部 -->
    <mt-header fixed title="vue移动端" class="header">
      <div slot="left" v-show="flag">
        <mt-button icon="back" @click="goback">返回</mt-button>
      </div>
    </mt-header>
    <transition name="shou">
      <router-view></router-view>
    </transition>
    <!-- 导入底部导航栏 -->
    <nav class="mui-bar mui-bar-tab">
      <router-link to="/home" class="mui-tab-item-hui" href="#tabbar">
        <span class="mui-icon mui-icon-home"></span>
        <span class="mui-tab-label">首页</span>
      </router-link>
      <router-link to="/member" class="mui-tab-item-hui" href="#tabbar-with-chat">
        <span class="mui-icon mui-icon-contact"></span>
        <span class="mui-tab-label">会员</span>
      </router-link>
      <router-link to="/buyCar" class="mui-tab-item-hui" href="#tabbar-with-contact">
        <span class="mui-icon mui-icon-extra mui-icon-extra-cart">
          <span class="mui-badge" id="lastBall">{{$store.getters.getCarCount}}</span>
        </span>
        <span class="mui-tab-label">购物车</span>
      </router-link>
      <router-link to="/search" class="mui-tab-item-hui" href="#tabbar-with-map">
        <span class="mui-icon mui-icon-search"></span>
        <span class="mui-tab-label">搜索</span>
      </router-link>
    </nav>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: false
    };
  },
  created() {
	  //初始化返回键
    if (this.$route.path != "/home") {
      this.flag = true;
    } else {
      this.flag = false;
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    }
  },
  watch: {
	  //用于监测返回键
    "$route.path"(newVal) {
      if (newVal != "/home") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
  }
};
</script>
<style scoped>
.headerPadding {
  padding-top: 40px;
  background-color: #ffffff;
  overflow-x: hidden;
  padding-bottom: 50px;
}
.headerPadding .header {
  z-index: 99;
}
/* 设置首页切换其他页面时的动画 */
.shou-enter {
  opacity: 0;
  transform: translateX(100%);
}
.shou-leave-to {
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
}
.shou-enter-active,
.shou-leave-active {
  transition: all 0.5s ease;
  /* position:absolute; */
}
/* .mui-bar{
	position: absolute;
}
.mint-header.is-fixed{
	position: absolute;
} */
.mui-bar .mui-tab-item-hui {
  display: table-cell;
  overflow: hidden;
  width: 1%;
  height: 50px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #929292;
}
.mui-bar-tab .mui-tab-item-hui.mui-active {
  color: #007aff;
}
.mui-bar-tab .mui-tab-item-hui .mui-icon {
  top: 3px;
  width: 24px;
  height: 24px;
  padding-top: 0;
  padding-bottom: 0;
}
.mui-bar-tab .mui-tab-item-hui .mui-icon ~ .mui-tab-label {
  font-size: 11px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

