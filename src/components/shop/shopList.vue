<template>
  <div class="shopListCmt">
    <!-- 商品列表 -->
    <div class="shop-list">
      <router-link :to="{name:'shopDetail',params:{id:item.id}}"
       class="shop-item" v-for="(item, index) in shopList" :key="index" tag='div'>
        <div class="shop-img-and-title">
          <img :src="item.img_url" alt>
          <h4 class="shop-title">{{item.title}}</h4>
        </div>
        <div class="shop-money-box">
          <div class="shop-money">
            <span class="new">￥{{item.market_price}}</span>
            <span class="old">￥{{item.sell_price}}</span>
          </div>
          <div class="shop-re">
            <span>热卖中</span>
            <span>剩{{item.stock_quantity}}件</span>
          </div>
        </div>
      </router-link>
    </div>
    <!-- 加载更多按钮 -->
    <mt-button type="danger" size="large" @click="loadMore">加载更多</mt-button>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      shopList: [],
      pageindex: 1
    };
  },
  created() {
    this.getShopList();
  },
  methods: {
    //获取商品列表的数据
    getShopList() {
      this.axios.get("/api/getgoods?pageindex=" + this.pageindex).then(res => {
        if (res.data.status == 0) {
          this.shopList = this.shopList.concat(res.data.message);
        } else {
          Toast("获取商品列表失败，请稍后重试");
        }
      });
    },
    //定义加载更多的方法
    loadMore(){
        this.pageindex++;
        this.getShopList();
        if(this.pageindex > 2){
            Toast("没有更多的商品了");
        }
    }
  }
};
</script>
<style lang="less" scoped>
.shopListCmt {
  .shop-list {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 0px;
    justify-content: space-between;
    .shop-item {
      border: 1px solid #ccc;
      box-shadow: 0 0 3px #666;
      width: 49%;
      margin-bottom: 7px;
      min-height: 275px;
      position: relative;
      .shop-img-and-title {
        img {
          width: 100%;
          text-align: center;
        }
        .shop-title {
          font-size: 15px;
          text-align: center;
        }
      }
      .shop-money-box {
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: #ccc;
        .shop-money {
          .new {
            font-size: 14px;
            color: red;
            padding-right: 10px;
          }
          .old {
            font-size: 14px;
            text-decoration: line-through;
          }
        }
      }
      .shop-re {
        font-size: 13px;
        color: #666;
        display: flex;
        justify-content: space-between;
        padding: 0 3px;
      }
    }
  }
}
</style>
