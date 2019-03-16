<template>
  <div class="regiestCmt">
    <h2 class="title">账号注册</h2>
    <hr>
    <form class="form">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="userName"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="passWord"></mt-field>
      <mt-field label="邮箱" placeholder="请输入邮箱" type="input" v-model="email"></mt-field>
      <input type="submit" value="提交" class="submit" @click="submit">
    </form>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import async from "async";
// localStorage.removeItem('user')
export default {
  data() {
    return {
      userName: "",
      email: "",
      passWord: "",
      verifList: []
    };
  },
  created() {},
  methods: {
    //提交，讲信息保存到本地储存
    submit() {
      //对表单进行验证
      if (this.userName == "") {
        Toast("用户名不能为空");
        return;
      } else if (this.passWord == "") {
        Toast("密码不能为空");
        return;
      } else if (this.email == "") {
        Toast("邮箱不能为空");
      } else if (
        !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)
      ) {
        Toast("邮箱格式非法");
        return;
      }
      this.verifList = JSON.parse(localStorage.getItem("user")) || [
        { userName: "zhangsan", passWord: "123456" },
        { userName: "lisi", passWord: "123456" }
      ];
      this.verifList.push({
        userName: this.userName,
        passWord: this.passWord
      });
      localStorage.setItem("user", JSON.stringify(this.verifList));
      Toast("注册成功");
      this.sleep(1200, "that.$router.push({name:'my'})");
      // this.$router.push({name:'my'});
    },

    sleep(d, fun) {
      let time = null;
      let i = 0;
      let that = this;
      time = setInterval(() => {
        if (i >= 0) {
          clearInterval(time);
          eval(fun);
        }
        i++;
      }, d);
    }
  }
};
</script>
<style lang="less" scoped>
.submit {
  display: block;
  width: 100%;
  margin: 10px auto;
}
</style>

