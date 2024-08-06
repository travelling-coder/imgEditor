<template>
  <div ref="matting"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const matting = ref<HTMLDivElement>()

onMounted(() => {
  console.log(matting.value)
})
</script>

<style lang="less" scoped></style>
