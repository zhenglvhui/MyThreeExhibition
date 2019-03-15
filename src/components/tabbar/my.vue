<template>
  <div class="my">
    <h2 class="header">登录</h2>

    <form class="mui-input-group">
      <div class="mui-input-row">
        <label>用户名：</label>
        <input type="text" placeholder="请输入账号" v-model="userName">
      </div>
      <div class="mui-input-row">
        <label>密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
        <input type="password" class="mui-input-clear" placeholder="请输入密码" v-model="passWord">
      </div>
    </form>
    <div class="btn">
      <mt-button type="primary" size="large" @click="login(userName,passWord)">登录</mt-button>
      <mt-button type="danger" size="large" @click="regiest">注册</mt-button>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
    data() {
        return {
           verifList:[],
           userName:'',
           passWord:''
        }
    },
    created(){
        // //初始化验证数据库
        this.verifList = JSON.parse(localStorage.getItem('user')) || 
        [{userName:"zhangsan",passWord:"123456"},{userName:"lisi",passWord:"123456"}];
    },
    methods: {
        //登录用户验证方法
        login(userName,passWord){
            var i = 0;
            this.verifList.some(item => {
                i++;
                if(userName.trim() == item.userName && passWord.trim() == item.passWord){
                    Toast('登录成功');
                    return true;
                }
            });
            if(i < this.verifList.length){
                Toast('用户名或者密码错误');
            }
        },
        //注册方法,前往注册页面
        regiest(){
            this.$router.push({name:'regiest'});
        }
    }
};
</script>
<style lang='less' scope>
.my {
  background-color: #ccc;
   .header{
    margin: 0 0 10px 0;
    text-align: center;
    padding: 5px 0 10px;
    width: 100%;
    background-color: #f1dedefb;
  }
  .mui-input-row{
      label{
          width: 25%;
          padding-right: 0px;
      }
      input{
          width: 75%;
      }
  }
}
</style>