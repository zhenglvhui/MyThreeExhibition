<template>
  <div class="photoDetailCmt">
    <div class="title">
      <div class="photoTitle">{{photoDetailList.title}}</div>
      <div class="dateAndClick">
        <span class="date">发表时间：{{photoDetailList.add_time | dateFormat}}</span>
        <span class="click">点击：{{photoDetailList.click}}次</span>
      </div>
      <hr>
    </div>

    <!-- 中间浓缩图 -->
      <vue-preview
        :list="list"
        :thumbImageStyle=
        "{width: '80px', height: '80px', margin: '10px',marginRight:'22px',marginLeft:'22px',
         boxShadow:'3px 3px 5px #666'}"
        :tapToClose="true"
      />

    <div class="content" v-html="photoDetailList.content"></div>
    <comment :id="id"></comment>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      id: this.$route.params.id,
      photoDetailList: {},
      list:[]
    };
  },
  created() {
    this.getPhotoDetailList();
    this.getPhotoSuoList();
     window.scrollTo(0,0);
  },
  methods: {
    //获取图片详情的对象的方法
    getPhotoDetailList() {
      this.axios.get("/api/getimageInfo/" + this.id).then(res => {
        if (res.data.status == 0) {
          this.photoDetailList = res.data.message[0];
        } else {
          Toast("获取图片详情失败，请稍后重试");
        }
      });
    },
    //获取缩略图要用到的数组的方法
    getPhotoSuoList(){
        this.axios.get('/api/getthumimages/' + this.id).then(res => {
            if(res.data.status == 0){
                this.list = res.data.message;
                this.list.forEach(item => {
                    item.w = 600;
                    item.h = 600;
                });
            }
        })
    }
  }
};
</script>
<style lang="less" scoped>
.photoDetailCmt {
  .title {
    padding: 10px 3px;
    .photoTitle {
      color: #26a2ff;
      margin-bottom: 15px;
      font-size: 17px;
      text-align: center;
    }
    .dateAndClick {
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      color: #999;
    }
  }
  .content {
    padding: 0 5px;
    font-size: 16px;
    
  }
  //修改缩略图的样式
}
</style>
