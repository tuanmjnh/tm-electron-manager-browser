<script setup lang="ts">
const props = defineProps({
  item: { type: Object, default: {} },
});
</script>
<template>
  <el-menu-item>
    <i v-if="item.meta.icon" class=" el-icon"><span :class="['fa-solid', item.meta.icon]" /></i>
    {{ item.meta ? $t(`route.${item.meta.title}`) : '' }}
  </el-menu-item>
</template>
<style scoped></style>
