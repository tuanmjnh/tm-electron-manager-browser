<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue"
import stores from "./stores"
const storeSetting = stores.setting()
const storeAuthenticate = stores.authenticate()
// init setting
storeSetting.initialize()
const component = computed(() => {
  // if (true) {
  if (storeAuthenticate.user) {
    return defineAsyncComponent(() => import(`./layouts/index.vue`));
  } else {
    return defineAsyncComponent(() => import("./layouts/fake-layout.vue"));
  }
});
</script>

<template>
  <component :is="component">
    <router-view />
  </component>
</template>

<style scoped></style>
