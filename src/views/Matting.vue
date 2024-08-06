<script setup lang="ts">
import Matting from '../components/Matting/Matting.vue'
</script>

<template>
  <div class="matting-box">
    <Matting />
  </div>
</template>

<style scoped lang="less">
.matting-box {
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;

  & > * {
    width: 100%;
  }
}
</style>
