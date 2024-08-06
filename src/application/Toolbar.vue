<template>
  <div ref="dom"></div>
</template>

<script lang="ts" setup>
import { Toolbar } from '@/domain/toolbar'
import { onMounted, ref } from 'vue'

const dom = ref<HTMLDivElement>()
const { id } = defineProps<{ id: string }>()
const toolbar = ref<Toolbar>()

onMounted(() => {
  toolbar.value = new Toolbar(id, dom.value!)
})
</script>

<style lang="less" scoped></style>
