<script setup lang="ts">
import { computed } from 'vue'
import stores from '@renderer/stores'
const storeApplication = stores.application()
const storeSettings = stores.settings()
const languages = computed(() => storeApplication.languages)
window.DarkMode.Toggle([storeSettings.darkMode])
const onToggleDarkMode = async () => {
  const darkMode = !storeSettings.darkMode
  await window.DarkMode.Toggle([darkMode])
  storeSettings.setDarkMode(darkMode)
}
const onSetLanguage = (item) => {
  if (storeSettings.language !== item) {
    storeSettings.setLanguage(`${item.cc_iso}-${item.cc}`)
  }
}
// import IconEpApple from '~icons/ep/apple'
</script>
<template>
  <el-header>
    <div class="el-space" />
    <el-button text circle class="mr-3" @click="$router.push({ name: 'settings' })">
      <i class="el-icon"><span class="fa-solid fa-gears" /></i>
    </el-button>
    <el-dropdown class="mr-3">
      <el-button text circle>
        <span :class="`fi fi-${storeSettings.language}`" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(e, i) in languages" :key="i"
            :class="`${e.cc_iso}-${e.cc}` === storeSettings.language ? 'selected' : ''" @click="onSetLanguage(e)">
            <span :class="`fi fi-${e.cc_iso}-${e.cc}`" />
            <span class="custom-title">{{ e.name_l }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button text circle @click="onToggleDarkMode">
      <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg> -->
      <i v-if="storeSettings.darkMode" class="el-icon"><span class="fa-solid fa-moon" /></i>
      <i v-if="!storeSettings.darkMode" class="el-icon"><span class="fa-solid fa-moon" /></i>
      <!-- <i v-if="!storeSettings.darkMode" class="el-icon"><span class="fa-solid fa-sun" /></i> -->
    </el-button>
    <el-button text circle>
      <i class="el-icon"><span class="fa-solid fa-user" /></i>
      <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg> -->
    </el-button>
    <!-- <button>
    </button> -->
    <!-- <el-dropdown>
      <el-icon style="margin-right: 8px; margin-top: 1px">
        <i-ep-setting />
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>View</el-dropdown-item>
          <el-dropdown-item>Add</el-dropdown-item>
          <el-dropdown-item>Delete</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span>Tom</span> -->
  </el-header>
</template>
<style scoped></style>
