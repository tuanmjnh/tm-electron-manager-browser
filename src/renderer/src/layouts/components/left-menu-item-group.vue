<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router';
const props = defineProps({
  group: { type: Object, default: {} },
  items: { type: Array<RouteRecordRaw>, default: [] },
});
</script>
<template>
  <el-menu-item-group>
    <template #title>
      <i v-if="group.icon" class="el-icon"><span :class="['fa-solid', group.icon]" /></i>
      {{ $t(`route.${group.title}`) }}
    </template>
    <el-menu-item v-for="(e, i) in items" :key="i">
      <i v-if="e.meta && e.meta.icon" class=" el-icon"><span :class="['fa-solid', e.meta.icon]" /></i>
      {{ e.meta ? $t(`route.${e.meta.title}`) : '' }}
    </el-menu-item>
  </el-menu-item-group>
</template>
<style scoped></style>
