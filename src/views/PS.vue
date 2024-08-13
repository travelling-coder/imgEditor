<template>
  <div>
    <!-- <div style="position: absolute; z-index: 9999">
      <input type="file" @change="handleChange" />
    </div> -->
    <div class="ps-box" ref="matting"></div>
  </div>
</template>

<script lang="ts" setup>
import { Container } from '@/domain/container'
import { onMounted, ref } from 'vue'
import background from '@/assets/test/background.png'

const id = Math.random().toString(36).substr(2, 9)
const matting = ref<HTMLDivElement>()
const ps = ref<Container>()

const handleChange = (e: any) => {
  console.log(e.target.files[0])
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    const base64 = e.target!.result as string
    ps.value?.initWorkspace(base64)
  }

  reader.readAsDataURL(file)
}

onMounted(() => {
  ps.value = new Container(matting.value!, id)
  ps.value.initWorkspace(background)
})
</script>

<style scoped lang="less">
.ps-box {
  height: 100vh;
  width: 100vw;
  display: flex;
}
</style>
