<template>
  <div>
    <!-- <div style="position: absolute; z-index: 9999">
      <input type="file" @change="handleChange" />
    </div> -->
    <div class="ps-box" ref="matting"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import background from '@/assets/test/background.jpg'
import { Container } from '@/domain/container'

const matting = ref<HTMLDivElement>()
const ps = ref<ReturnType<InstanceType<typeof Container>['createWorkspace']>>()

const handleChange = (e: any) => {
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
  ps.value = new Container(matting.value!).createWorkspace()
  ps.value.initWorkspace(background)
})
</script>

<style scoped lang="less">
.ps-box {
  height: 100vh;
  width: 100vw;
}
</style>
