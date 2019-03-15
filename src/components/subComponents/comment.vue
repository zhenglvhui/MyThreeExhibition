<template>
  <div class="comment">
    <h3>发表评论</h3>
    <textarea placeholder="请输入你要评论的内容（最多120个字）" 
    maxlength="120" v-model="commentConnent"></textarea>
    <mt-button type="primary" size="large" @click="sendComment">发表评论</mt-button>
    <div class="comment-list">
      <div class="comment-item" v-for="(item, index) in commentList" :key="index">
        <div class="comment-user-and-date">
            第{{index+1}}楼&nbsp;&nbsp;用户：{{item.user_name}}&nbsp;&nbsp;
            发表时间：{{item.add_time | dateFormat}}</div>
        <div class="comment-content" v-text="item.content=='undefined'?'该用户未作出评论':item.content"></div>
      </div>
    </div>
    <mt-button type="danger" size="large" @click="loadMore">加载更多</mt-button>
    
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
    data() {
        return {
            pageindex:1,
            commentList:[],
            commentConnent:''
        }
    },
    created(){
        //在初始化的时候调用获取评论的方法
        this.getCommentList();
    },
    methods:{
        //定义获取评论的方法
        getCommentList(){
            this.axios.get('/api/getcomments/'+ this.id+ '?pageindex=' + this.pageindex)
            .then(res=>{
                if(res.data.status==0){
                    this.commentList = this.commentList.concat(res.data.message);
                }else{
                    Toast('获取评论列表失败');   
                }
            })
        },
        //定义加载过多按钮后触发这个事件
        loadMore(){
            this.pageindex++;
            this.getCommentList();
        },
        //定义发表内容时的按钮事件
        sendComment(){
            this.commentConnent = this.commentConnent.trim();
            if(this.commentConnent!=''){
                this.axios.post('/api/postcomment/' + this.id,'content=' + this.commentConnent)
                .then(res=>{
                    if(res.data.status==0){
                        Toast(res.data.message);
                    }else{
                        Toast('发表评论失败');
                    }
                })
                this.commentList.unshift({
                    user_name:'匿名用户',
                    add_time:new Date(),
                    content:this.commentConnent
                })
            }else{
                Toast('发表的评论内容不能为空哦');
            }
            this.commentConnent='';
        }
        
    },
    props: ['id']
};
</script>
<style scoped>
.comment h3 {
  font: 20px;
}
.comment textarea {
  height:100px;
  margin: 0px;
}
.comment .comment-list .comment-user-and-date{
    background-color:#999;
    font-size: 11px;
    height: 30px;
    line-height: 30px;
}
.comment .comment-list .comment-content{
    font-size: 13px;
    height: 40px;
    line-height: 40px;
}
.mint-button--primary{
    margin-bottom: 5px;
}
</style>
