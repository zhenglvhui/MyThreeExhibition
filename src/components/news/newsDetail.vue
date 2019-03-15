<template>
    <div class="news-detail-com">
        <h3>{{newsDetail.title}}</h3>
        <div class="newsDateAndClick">
            <span class="newsCommentDate">发表时间：{{newsDetail.add_time | dateFormat}}</span>
            <span class="newsClick">
                点击{{newsDetail.click}}次
            </span>
        </div>
        <hr>
        <div class="connet" v-html="newsDetail.content"> </div>
        <comment :id="id"></comment>
    </div>
</template>
<script>
// import comment from '../subComponents/comment.vue'
import { Toast } from "mint-ui";
export default {
    data () {
        return {
            id:this.$route.params.id, //获取url中的id，用于后面查询数据
            newsDetail:{}
        }
    },
    created() {
        //调用获取行文详情
        this.getNewDetail();
    },
    methods:{
        //这里是用于获取新闻详情的方法
        getNewDetail(){
            this.axios.get('/api/getnew/' + this.id).then(res=>{
                if(res.data.status==0){
                    this.newsDetail = res.data.message[0]
                }else{
                    Toast('获取新闻详情失败');
                }
            })
        }
    },
    // components:{
    //     comment
    // }
}
</script>
<style scoped>
.news-detail-com{
    padding: 0 6px;
}
.news-detail-com h3{
    font-size: 16px;
    text-align: center;
    margin: 10px 0;
    color: red;
}
.news-detail-com .newsDateAndClick{
    font-size: 14px;
    color: #26a2ff;
    display: flex;
    justify-content:space-between;
}
</style>
