<template>
  <div class="callme">
      <div class="title">联系方式：</div>
      
    <div class="mui-card">
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
            <p>姓名：{{name}}</p>
            <p>手机：{{phone}}</p>
            <p>e-mail:{{email}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            name:'郑先生',
            phone:17806734827,
            email:'376577086@qq.com'
        }
    },
};
</script>
<style lang="less" scoped>
.callme{
    // background-color: #666;
   
    margin-top: 200px;
    .title{
         padding-left:10px;
         font-size: 19px;
    }
    .mui-card{
        border:2px solid black;
        p{
            font-size: 16px;
        }
    }
}
</style>

