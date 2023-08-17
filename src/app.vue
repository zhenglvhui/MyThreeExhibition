<template>
  <div class="app">
    <router-view />
  </div>
</template>
<script setup lang="ts"></script>
<style lang="less">
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
}
* {
  margin: 0;
  padding: 0;
}
*:focus {
  outline: none;
}
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
