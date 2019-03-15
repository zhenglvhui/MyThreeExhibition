<template>
  <div class="regiestCmt">
    <h2 class="title">账号注册</h2>
    <hr>
    <form class="form">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="userName"></mt-field>
      <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="email"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="passWord"></mt-field>
      <input type="submit" value="提交" class="submit" @click="submit">
    </form>
  </div>
</template>
<script>
// localStorage.removeItem('user')
export default {
  data() {
    return {
      userName: "",
      email: "",
      passWord: "",
      verifList:[]
    };
  },
  created() {
      
  },
  methods: {
    //提交，讲信息保存到本地储存
    submit() {
      this.verifList = JSON.parse(localStorage.getItem("user")) || [
        { userName: "zhangsan", passWord: "123456" },
        { userName: "lisi", passWord: "123456" }
      ];
      console.log(typeof this.verifList)
      this.verifList.push({
        userName: this.userName,
        passWord: this.passWord
      });
      localStorage.setItem("user", JSON.stringify (this.verifList ));
      this.$router.push({name:'my'})
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

