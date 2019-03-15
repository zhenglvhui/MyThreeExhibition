<template>
  <div class="signInCmt">
    <div class="signInTitle">
      <h3 class="active">签到活动</h3>
      <div class="signIn">
        <div class="integral">
          <p>当前积分</p>
          <span class="count">{{record}}
            <span>分</span>
          </span>
        </div>
        <div class="title">
          <mt-button :type="flag?'danger':'primary'" class="btn" @click="signIn" ref="btn">签到</mt-button>
          <p>已经连续签到了{{count}}天</p>
        </div>
      </div>
    </div>
    <h3 class="record">签到记录</h3>
    <div class="record-list" v-for="(item, index) in recordList" :key="index">
      <div class="record-item">
        <span>签到领取1积分</span>
        <span>签到日期：{{item.date|dateFormat}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
// localStorage.setItem('signIn',JSON.stringify({record:0,date:'2019-3-15',count:0}));
// localStorage.removeItem('date')
// localStorage.removeItem('flag')
// localStorage.removeItem('count')
// localStorage.removeItem('record')
// var lastObj = obj.pop();
var date = JSON.parse(localStorage.getItem('date'))  || [{date:'2019-03-15'}];
// import moment from 'moment';
export default {
    data() {
        return {
            record:0,
            count:0,
            recordList:date,
            flag:false//用于判断签到按钮是否被点击过
        }
    },
    created(){
        this.count = localStorage.getItem('count')  || 0;
        this.record = localStorage.getItem('record') || 0;
        this.flag = localStorage.getItem('flag') || false;
    },
    methods: {
        //实现登录签到功能
        signIn(){
            console.log(this.count)
            if(this.$refs.btn.type == 'danger'){
                Toast('今天你已经签到过了，明天再来吧');
                return;
            }
            this.record++;
            this.count++;
            this.recordList.push({'date':new Date()});
            localStorage.setItem('date',JSON.stringify(this.recordList));
            // this.recordList = JSON.parse(localStorage.getItem('date')); 

            localStorage.setItem('record', this.record);
            this.record = JSON.parse(localStorage.getItem('record')); 

             localStorage.setItem('count', this.count);
            this.count = JSON.parse(localStorage.getItem('count'));  

            //签到按钮颜色的改变
            localStorage.setItem('flag',true);
            this.flag = JSON.parse(localStorage.getItem('flag')); 
            // this.$router.go(0);  
        }
    }
    // watch:{
    //     // flag : function (newVal) {
    //     //     this.flag = newVal
    //     // }
    // }
};
</script>
<style lang="less" scope>
.signInCmt {
  .signInTitle {
    background-color: #ff002bc9;
    .signIn {
      display: flex;
      justify-content: space-between;

      .integral {
        width: 43%;
        background-color: aliceblue;
        border-radius: 5px;
        margin: 15px;
        p {
          padding: 10px 10px 0 10px;
          color: black;
        }
        .count {
          padding-left: 10px;
          font-size: 30px;
          font-weight: 700;
          span {
            font-size: 15px;
            font-weight: 400;
            padding-left: 5px;
          }
        }
      }
      .title {
        width: 43%;
        background-color: aliceblue;
        margin: 15px;
        border-radius: 5px;
        .btn {
          border-radius: 5px;
          // padding:10px 0;
          display: block;
          margin: 10px auto 0;
        }
        p {
          text-align: center;
          font-size: 15px;
          font-weight: 400;
          color: black;
        }
      }
    }
    .active {
      text-align: center;
      margin: 0;
      padding: 10px 0;
      color: aliceblue;
    }
  }
  .record{
      text-align: center;
  }
  .record-list{
      padding: 3px;
      .record-item{
          padding: 0 3px;
          display: flex;
          justify-content: space-between;
          border: 1px solid #ccc;
          font-size: 13px;
      }
  }
}
</style>

