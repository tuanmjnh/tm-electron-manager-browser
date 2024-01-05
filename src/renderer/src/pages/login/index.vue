<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import stores from '@renderer/stores'
const storeApplication = stores.application()
const storeSetting = stores.setting()
const languages = computed(() => storeApplication.languages)
window.darkMode.toggle([storeSetting.darkMode])
const onToggleDarkMode = async () => {
  const darkMode = !storeSetting.darkMode
  await window.darkMode.toggle([darkMode])
  storeSetting.setDarkMode(darkMode)
}
const onSetLanguage = (item) => {
  if (storeSetting.language !== item) {
    storeSetting.setLanguage(`${item.cc_iso}-${item.cc}`)
  }
}
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{
  username: string,
  password: string
}>({
  username: '',
  password: ''
})

interface DomainItem {
  key: number
  value: string
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{ $t('authenticate.title') }}</span>
        <div class="el-space" />
        <el-dropdown class="mr-3">
          <el-button text circle>
            <span :class="`fi fi-${storeSetting.language}`" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(e, i) in languages" :key="i"
                :class="`${e.cc_iso}-${e.cc}` === storeSetting.language ? 'selected' : ''" @click="onSetLanguage(e)">
                <span :class="`fi fi-${e.cc_iso}-${e.cc}`" />
                <span class="custom-title">{{ e.name_l }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button text circle @click="onToggleDarkMode">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </el-button>
      </div>
    </template>
    <el-form ref="formRef" :model="dynamicValidateForm" class="demo-dynamic">
      <el-form-item prop="username" :rules="[{ required: true, message: 'Please input username' }]">
        <el-tooltip class="box-item" effect="dark" :content="$t('authenticate.username')" placement="top">
          <el-input v-model.trim="dynamicValidateForm.username" required :placeholder="$t('authenticate.username')" />
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
        <el-button @click="resetForm(formRef)">Reset</el-button>
      </el-form-item>
    </el-form>
    <template #footer>Footer content</template>
  </el-card>
</template>
<style scoped></style>
