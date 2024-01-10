<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { setWindowSize } from "@renderer/utils/window"
import { generateRoutes } from '@renderer/utils/tree'
import NavBar from "./components/nav-bar.vue"
import LeftMenu from "./components/left-menu.vue"
onMounted(() => {
  setWindowSize('[class*="app-container"]')
  window.addEventListener("resize", (e) => {
    setWindowSize('[class*="app-container"]')
  }, true)
})
const $router = useRouter()
const routesMenu = generateRoutes($router.options.routes)//$router.options.routes.filter((x) => x.meta && !x.meta.hidden)
</script>
<template>
  <el-container class="app-container">
    <el-aside class="left-menu">
      <el-scrollbar>
        <left-menu :items="routesMenu" />
      </el-scrollbar>
    </el-aside>

    <el-container class="is-vertical">
      <nav-bar />
      <el-main>
        <el-scrollbar>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped></style>
