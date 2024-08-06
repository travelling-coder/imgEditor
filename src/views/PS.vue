<template>
  <div>
    <Toolbar :id="id" />
    <div class="ps-box" ref="matting"></div>
  </div>
</template>

<script lang="ts" setup>
import { Container } from '@/domain/container'
import { onMounted, ref } from 'vue'
import Toolbar from '@/application/Toolbar.vue'
import redo from '@/assets/icons/redo.svg'

const id = Math.random().toString(36).substr(2, 9)
const matting = ref<HTMLDivElement>()

onMounted(() => {
  const s = new Container(matting.value!, id)
})
</script>

<style scoped lang="less">
.ps-box {
  height: 100vh;
  width: 100vw;
  display: flex;
}
</style>
