<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useRoute } from "vue-router"
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import stores from '../../stores'

const storeProfiles = stores.profiles()
const { t } = useI18n({ useScope: 'global' })
const formRef = ref<FormInstance>()
const formData = ref({ txt: '' }) as any
const $route = useRoute()

const onReset = () => {
  return new Promise((resolve, reject) => {
    resolve(true)
  }).then(() => {
    if (!formRef.value) return
    formRef.value.resetFields()
  })
}
onReset()


const onSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
      storeProfiles.import(toRaw(formData.value)).then(x => {
        if (x) {
          ElMessage.success(t('success.insert'))
          onReset()
        }
      }).catch((e) => { ElMessage.error(t('error.invalid')) })
    }
  })
}
</script>
<template>
  <el-form ref="formRef" :model="formData" label-position="right">
    <el-card shadow="never" class="el-card-add-tab">
      <template #header>
        <div class="card-header">
          <span class="title">{{ $t('route.import') }}</span>
          <div class="el-space" />
          <el-button type="primary" class="el-button-square" @click="onSubmit">
            {{ $t('global.update') }}
          </el-button>
          <el-button class="el-button-square" @click="$router.push({ name: 'profiles-view' })">
            {{ $t('global.back') }}
          </el-button>
        </div>
      </template>
      <el-scrollbar>
        <el-form-item prop="txt" :rules="[{ required: true, message: $t('error.required') }]">
          <el-input v-model.trim="formData.txt" autofocus required :rows="12" type="textarea"
            placeholder="ProfileName:BrowserType:UserAgent:ProxyType:ProxyHost:ProxyPort:ProxyUsername:ProxyPassword:AccountType:AccountUsername:AccountPassword" />
        </el-form-item>
      </el-scrollbar>
    </el-card>
  </el-form>
</template>
<style scoped></style>
