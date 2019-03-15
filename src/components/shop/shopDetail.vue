<template>
  <div class="shopDetail mui-content">
    <dir class="mui-content">
      <!-- 轮播图部分 -->
      <div class="mui-card mui-card-first">
        <div class="mui-card-content">
          <div class="mui-card-content-inner">
            <lunbo :lunbolist="lunbolist" :lunboflag="lunboflag"></lunbo>
          </div>
        </div>
      </div>

      <div class="mui-card">
        <div class="mui-card-header">{{shopDetailList.title}}</div>
        <div class="mui-card-content">
          <div class="mui-card-content-inner">
            <p class="money">
              市场价:
              <span class="mackey-money">
                <del>￥{{shopDetailList.market_price}}</del>&nbsp;&nbsp;
              </span>
              销售价:
              <span
                class="sel-money"
                style="color:red"
              >￥{{shopDetailList.sell_price}}</span>
            </p>
            <div class="buy-munber">
              <span>购买数量：</span>
              <numberbox :maxValue="shopDetailList.stock_quantity" @getBuyValue="getBuyValue"></numberbox>
            </div>
            <p>
              <mt-button type="primary" size="small">立刻购买</mt-button>
              <mt-button type="danger" size="small" @click="buyNow(shopValue)">加入购物车</mt-button>
            </p>
          </div>
        </div>
      </div>

      <div class="mui-card">
        <div class="mui-card-header">商品数量</div>
        <div class="mui-card-content">
          <div class="mui-card-content-inner">
            <p>
              商品货号：
              <span>{{shopDetailList.goods_no}}</span>
            </p>
            <p>
              库存情况：
              <span>{{shopDetailList.stock_quantity}}</span>件
            </p>
            <p>
              上架时间：
              <span>{{shopDetailList.add_time|dateFormat}}</span>
            </p>
          </div>
        </div>
        <div class="mui-card-footer">
          <mt-button type="danger" size="large" @click="searchShopDetail(id)">查看详情</mt-button>
          <mt-button type="primary" size="large" @click="shopComment(id)">发表评论</mt-button>
        </div>
      </div>
    </dir>

    <!-- 绘制小球用于放入购物车 -->
    <transition @beforeEnter="beforeEnter" @enter="enter" @afterEnter="afterEnter">
      <div class="toCarBall" v-if="ballFlag" ref="carBall"></div>
    </transition>
  </div>
</template>
<script>
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      id: this.$route.params.id, //路由的id
      lunbolist: [], //轮播图列表
      lunboflag: true, //轮播图是否宽高100%时使用
      shopDetailList: {}, //商品详情对象
      ballFlag: false, //半场小球动画
      shopValue: 1 //要加入购物车的数量
    };
  },
  created() {
    this.getLunBoList();
    this.getShopDetailList();
  },

  methods: {
    //定义获取轮播数组的方法
    getLunBoList() {
      this.axios.get("/api/getthumimages/" + this.id).then(res => {
        if (res.data.status == 0) {
          this.lunbolist = res.data.message;
          this.lunbolist.forEach(item => {
            item.img = item.src;
          });
        } else {
          Toast("获取轮播图失败");
        }
      });
    },
    //获取商品详情数据
    getShopDetailList() {
      this.axios.get("/api/goods/getinfo/" + this.id).then(res => {
        if (res.data.status == 0) {
          this.shopDetailList = res.data.message[0];
        } else {
          Toast("获取商品详情失败");
        }
      });
    },
    //点击事件：到达商品详情
    searchShopDetail(id) {
      this.$router.push({ name: "searchShopDetail", params: { id } });
    },
    //点击事件：点击到达商品中的发表评论
    shopComment(id) {
      this.$router.push({ name: "shopComment", params: { id } });
    },
    //下面三个是小球半场动画事件
    beforeEnter(el) {
      el.style.transform = "translate(0,0)";
    },
    enter(el, bind) {
      el.offsetWidth;
      const startY = this.$refs.carBall.getBoundingClientRect().top;
      const startX = this.$refs.carBall.getBoundingClientRect().left;
      var lastBall = document.getElementById("lastBall");
      const lastY = lastBall.getBoundingClientRect().top;
      const lastX = lastBall.getBoundingClientRect().left;
      const sumY = lastY - startY;
      const sumX = lastX - startX;
      el.style.transform = `translate(${sumX}px,${sumY}px)`;
      el.style.transition = "all 0.5s cubic-bezier(.4,-0.3,1,.68) ";
      bind();
    },
    afterEnter(el) {
      this.ballFlag = !this.ballFlag;
    },
    //点击事件：改变底部小球的数值
    buyNow(value) {
      //两件事 1.改变小球Flag
      this.ballFlag = !this.ballFlag;
      //2.获取到一个对象，传递给vuex,对象需要传递四个值，
      //商品的id，商品的数量，商品的价格，商品是否被选中,默认是选中
      this.$store.commit("getObjCar", {
        id: this.id,
        count: this.shopValue,
        price: this.shopDetailList.sell_price,
        select:true
      });
    },
    //子传父，获取数字栏的值
    getBuyValue(value) {
      this.shopValue = value;
    }
  }
};
</script>
<style lang='less' scope>
.shopDetail {
  margin: 0;
  .mui-content {
    margin: 0;
    padding: 10px;
    display: block;
    .mui-card {
      margin: 0;
      margin-bottom: 10px;
      .buy-munber {
        margin-bottom: 10px;
        display: flex;
        span {
          margin-top: 5px;
        }
      }
    }
    .mui-card-footer {
      display: block;
      .mint-button {
        margin-bottom: 5px;
      }
    }
  }
  .toCarBall {
    width: 15px;
    height: 15px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    left: 152px;
    top: 390px;
    z-index: 100;
    //   transform: translate(84px,230px)
  }
}
</style>
