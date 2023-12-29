<script setup lang="ts">
import { reactive } from "vue";
const versions = reactive({ ...window.electron.process.versions });
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron: {{ versions.electron }}</li>
    <li class="chrome-version">Chromium: {{ versions.chrome }}</li>
    <li class="node-version">Node: {{ versions.node }}</li>
    <li class="v8-version">V8: {{ versions.v8 }}</li>
  </ul>
</template>
