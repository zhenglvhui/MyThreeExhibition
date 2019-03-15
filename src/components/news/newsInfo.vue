<template>
  <div>
    <ul class="mui-table-view">
      <li class="mui-table-view-cell mui-media" v-for="(item, index) in newsList" :key="index">
        <router-link :to="'/home/newsDetail/' + item.id">
          <img class="mui-media-object mui-pull-left" :src="item.img_url">
          <div class="mui-media-body">{{item.title}}
            <p class="mui-ellipsis">
                <span>{{item.add_time}}</span>
                <span>点击：{{item.click}}次</span>
            </p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      newsList: []
    };
  },
  methods: {
    getNewsList() {
      this.axios.get("/api/getnewslist").then(res => {
        if (res.data.status == 0) {
          this.newsList = res.data.message;
        } else {
          Toast("获取新闻列表失败");
        }
      });
    }
  },
  created() {
    this.getNewsList();
  }
};
</script>
<style scoped>
.mui-table-view .mui-media-body{
    font-size: 13px;
}
.mui-table-view .mui-ellipsis {
    color: #26a2ff;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
}

</style>
