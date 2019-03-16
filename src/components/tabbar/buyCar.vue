<template>
  <div class="buyCarCmt">
      <!-- 购物列表的物品栏 -->
    <div class="buy-car-list">
      <div class="mui-card" v-for="(item, index) in shopCarList" :key="index">
        <div class="mui-card-content">
          <div class="mui-card-content-inner">
              <mt-switch @change="switchChange()"
                v-model="$store.state.objCar[index].select"></mt-switch>
                <img :src="item.thumb_path" >
                <div class="content">
                    <h3>{{item.title}}</h3>
                    <p>
                        <span>￥{{item.sell_price}}</span>
                        <shopmunberbox :count="countForId[item.id]" :id="item.id"></shopmunberbox>
                        <a href="#" @click.prevent="delShop({id:item.id,index:index})">删除</a>
                    </p>
                </div>
          </div>
        </div>
      </div>     
    </div>
    <!-- 购物车组件下方价格列表 -->
        <div class="mui-card">
				<div class="mui-card-content">
					<div class="mui-card-content-inner">
						<h3 class="detail">购买详情</h3>
                        
                        <div class="price">
                            你准备购买<span>{{$store.getters.getCountAndPriceForSelect.count}}</span>件，
                            购买的价格是<span>￥{{$store.getters.getCountAndPriceForSelect.price}}</span>元
                        </div>
					</div>
				</div>
		</div> 

  </div>
</template>
<script>
import { Toast } from "mint-ui";
import shopMunberBox from '../subComponents/shopMunberBox.vue';
export default {
    data() {
        return {
            shopCarList:[],
            countForId:this.$store.getters.getCountForId,
            
            carList:this.$store.getters.getCarCount
        }
    },
    created(){
        this.getShopCarList();
    },
    methods: {
        //获取购物车组件的商品数据
        getShopCarList(){
            if(this.$store.getters.getShopCarIds === ''){
                this.shopCarList = [];
                return;
            }
            this.axios.get('/api/goods/getshopcarlist/' + this.$store.getters.getShopCarIds)
            .then(res=>{
                if(res.data.status==0){
                    this.shopCarList = res.data.message;
                    // console.log(this.shopCarList)
                }else{
                    Toast('无法获取购物车里的商品')
                }
            })
        },
        //删除购物车组件中要购买的商品
        delShop(obj){
            this.$store.commit('delShopBox',obj);
            this.getShopCarList();
        },
        //定义switch改变事件
        switchChange(){
            this.$store.commit('changeSwitch');
        }
    },
    components:{
        shopmunberbox:shopMunberBox
    }
};
</script>
<style lang='less' scope>
    .buyCarCmt{
        background-color: #eee;
        margin:0;
        padding: 5px;
        .buy-car-list{
            .mui-card-content-inner{
                display:flex;
                align-items: center;
                img{
                    margin-left: 10px;
                    margin-right: 10px;
                    height: 50px;
                    width: 50px;
                }
                h3{
                    font-size: 13px;
                }
                p{
                    display: flex;
                    align-items: center;
                    span{
                        color:red;
                    }
                
                }
                
            }
        }
        .detail{
            font-size: 18px;
        }
        .price{
            span{
                color: red;
                font-size: 18px;
                font-weight: 700;
            }
        }
    }
</style>