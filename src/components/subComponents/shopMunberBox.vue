<template>
  <div>
    <div class="mui-numbox" data-numbox-min="1" ref="number" style="height:25px">
      <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
      <input id="test" class="mui-input-numbox" type="number" :value="count"
       @change="getChange" ref="ipt" disabled="true">
      <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
    </div>
  </div>
</template>
<script>
import mui from '../../MUI/js/mui.min.js'
export default {
  data() {
    return {
    };
  },
  created(){
  },
  methods: {
      getChange(){
        // this.$emit('getBuyValue',this.$refs.ipt.value);
        this.$store.commit('getValueChange', {
            id:this.id,
            count : this.$refs.ipt.value
        })
      }
  },
  mounted() {
    mui(this.$refs.number).numbox();
  },
  props:['count','id'],
//   watch: {
//       maxValue: function (val, oldVal) {
//         mui(this.$refs.number).numbox().setOption('max',parseInt(val));
//      },
//   }
};
</script>
<style lang="less" scoped>
</style>