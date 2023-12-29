<script setup lang="ts">
import { RouteRecordRaw, useRouter } from "vue-router";
const $router = useRouter();
import MenuItemGroup from "./left-menu-item-group.vue";
import MenuItem from "./left-menu-item.vue";
const props = defineProps({
  items: { type: Array<RouteRecordRaw>, default: [] },
});
const onclick = (item: any) => {
  $router.push({ name: item.name }).catch((e) => {
    console.log(e);
  });
};
</script>
<template>
  <el-menu>
    <template v-for="(e, i) in items" :key="i">
      <el-sub-menu v-if="e.children && e.children.length > 0" :index="`${i}`">
        <template #title>
          <i class=" el-icon"><span :class="['fa-solid', e.meta ? e.meta.icon : '']" /></i>
          {{ e.meta ? $t(`route.${e.meta.title}`) : '' }}
        </template>
        <menu-item-group v-if="e.meta && e.meta.group" :group="e.meta.group" :items="e.children" />
        <template v-else>
          <menu-item v-for="(child, ii) in e.children" :key="ii" :item="child" @click="onclick(child)" />
        </template>
      </el-sub-menu>
      <menu-item v-else :item="e" @click="onclick(e)" />
    </template>
  </el-menu>
</template>
<style scoped></style>
