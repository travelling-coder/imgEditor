<script setup lang="ts">
import { onMounted } from 'vue'
import './service'
import { test } from './service/matting'

onMounted(test)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
