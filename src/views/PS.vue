<template>
  <div>
    <Toolbar />
    <div class="ps-box" ref="matting"></div>
  </div>
</template>

<script lang="ts" setup>
import { Container } from '@/domain/container'
import { onMounted, ref } from 'vue'
import Toolbar from '@/application/Toolbar.vue'

const matting = ref<HTMLDivElement>()

onMounted(() => {
  const s = new Container(matting.value!)
})
</script>

<style scoped lang="less">
.ps-box {
  height: 100vh;
  width: 100vw;
  display: flex;
}
</style>
