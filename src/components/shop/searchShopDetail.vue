<template>
    <div class="searchShopDetailCmt">
        <h3>{{searchShopDetail.title}}</h3>
        <hr>
        <div v-html="searchShopDetail.content"></div>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
    data() {
        return {
            id:this.$route.params.id,
            searchShopDetail:{}
        }
    },
    methods:{
        //获取商品详情的详情
        getSearchShopDetail(){
            this.axios.get('/api/goods/getdesc/' + this.id).then(res=>{
                if(res.data.status == 0){
                    this.searchShopDetail = res.data.message[0];
                }else{
                    Toast('列表获取失败');
                }
            })
        }
    },
    created(){
        this.getSearchShopDetail();
    }
}
</script>
<style lang="less" >
.searchShopDetailCmt{
    padding: 5px;
    h3{
        font-size: 17px;
        color: #26a2ff;
        margin: 10px auto 15px;
        text-align: center;
    }
    img{
        width: 100%;
        height: 100%;
    }
}
</style>
