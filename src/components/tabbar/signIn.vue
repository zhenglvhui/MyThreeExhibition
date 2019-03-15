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
          <mt-button type="primary" class="btn">签到</mt-button>
          <p>已经连续签到了{{count}}天</p>
        </div>
      </div>
    </div>
    <h3 class="record">签到记录</h3>
    <div class="record-list">
      <div class="record-item">
        <span>签到领取1积分</span>
        <span>签到日期：{{date}}</span>
      </div>
    </div>
  </div>
</template>
<script>
var obj = JSON.parse(localStorage.getItem('signIn'))  || {record:0,date:'2019-3-15',count:0};
// localStorage.setItem('signIn',JSON.stringify({record:0,date:'2019-3-15',count:0}));
localStorage.removeItem('signIn')
import moment from 'moment';
export default {
    data() {
        return {
            record:obj.record,
            date:obj.date,
            count:obj.count
        }
    },
    methods: {
        
    }
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
      }
  }
}
</style>

