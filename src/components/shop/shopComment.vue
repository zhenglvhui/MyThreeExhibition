<template>
    <div>
        <comment :id='id'></comment>
    </div>
</template>
<script>
export default {
    data() {
        return {
            id:this.$route.params.id
        }
    },
}
</script>
<style lang="less" scoped>

</style>
