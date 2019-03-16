<template>
    <div class="loginCmt">
        <h3>登录成功</h3>
        <p>你好!{{userName}}</p>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userName:this.$route.params.userName
        }
    },
}
</script>
<style lang='less' scoped>
.loginCmt{
    h3{
        text-align: center;
    }
    p{
        text-align: center;
        font-size: 16px;
        margin: 10px;
        color: red;
    }
}
</style>
