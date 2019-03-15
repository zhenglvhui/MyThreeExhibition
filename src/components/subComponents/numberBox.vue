<template>
  <div>
    <div class="mui-numbox" data-numbox-min="1" ref="number">
      <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
      <input id="test" class="mui-input-numbox" type="number" value="1"
       @change="getChange" ref="ipt">
      <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
    </div>
  </div>
</template>
<script>
import mui from '../../MUI/js/mui.min.js'
export default {
  data() {
    return {};
  },
  methods: {
      getChange(){
        this.$emit('getBuyValue',this.$refs.ipt.value);
      }
  },
  mounted() {
    mui(this.$refs.number).numbox();
  },
  props:['maxValue'],
  watch: {
      maxValue: function (val, oldVal) {
        mui(this.$refs.number).numbox().setOption('max',parseInt(val));
     },
  }
};
</script>
<style lang="less" scoped>
</style>
