<script setup lang="ts">
const onOpenWindowChrome = (message: any) => {
  // Send information to the main process
  // if a listener has been set, then the main process
  // will react to the request !
  window.electron.ipcRenderer.send('window-chrome', { sync: true })
}
const onOpenSeleniumChrome = (message: any) => {
  window.electron.ipcRenderer.send('selenium-chrome', { sync: true })
}
const onOpenSeleniumFirefox = (message: any) => {
  window.electron.ipcRenderer.send('selenium-firefox', { sync: true })
}
const onOpenPuppeteerChrome = (message: any) => {
  window.electron.ipcRenderer.send('puppeteer-chrome', { sync: true })
}
</script>
<template>
  <el-row class="mb-4">
    <el-button type="primary" @click="onOpenWindowChrome">Open Window Chrome</el-button>
    <el-button type="success" @click="onOpenSeleniumChrome">Open Selenium Chrome</el-button>
    <el-button type="info" @click="onOpenSeleniumFirefox">Open Selenium Firefox</el-button>
    <el-button type="warning" @click="onOpenPuppeteerChrome">Open Puppeteer Chrome</el-button>
    <!-- <el-button type="danger">Danger</el-button> -->
  </el-row>
</template>
<style scoped></style>
