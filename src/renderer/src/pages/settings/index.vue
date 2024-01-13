<script setup lang="ts">
import debounce from 'lodash.debounce'
import { ref, toRaw, computed } from 'vue'
import { useRoute } from "vue-router"
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import stores from '../../stores'

const storeSettings = stores.settings()
const { t } = useI18n({ useScope: 'global' })
const tab = ref('profiles')
const formRef = ref<FormInstance>()
const profile = computed(() => storeSettings.profile)
const onDialogOpenFolder = (args: any) => {
  window.Dialog.OpenFolder({ title: 'Folder profiles', sync: true }).then((x) => {
    if (x && x.length > 0) {
      storeSettings.profile.directory = x[0]
      window.Config.Set({ profile: storeSettings.profile.directory })
    }
  })
}
const onGetConfig = (args: any) => {
  window.Config.Get().then(x => {
    console.log(x)
  })
}
</script>
<template>
  <el-form ref="formRef" label-position="right" label-width="100px">
    <el-card shadow="never" class="el-card-add-tab">
      <template #header>
        <div class="card-header">
          <span class="title">{{ $t('route.setting') }}</span>
          <div class="el-space" />
          <!-- <el-button type="primary" class="el-button-square" @click="onSubmit">
            {{ formData._id ? $t('global.update') : $t('global.insert') }}
          </el-button>
          <el-button class="el-button-square" @click="$router.push({ name: 'settings-view' })">
            {{ $t('global.back') }}
          </el-button> -->
        </div>
      </template>
      <el-tabs v-model="tab">
        <el-tab-pane name="profiles" label="Profiles">
          <el-scrollbar>
            <el-form-item :label="$t('global.directory')">
              <el-input v-model.trim="profile.directory" required readonly :placeholder="$t('global.directory')">
                <template #append>
                  <el-button class="el-button-append" type="primary" @click="onDialogOpenFolder">
                    {{ $t('global.select') }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <!-- <el-button class="el-button-append" type="primary" @click="onGetConfig">
              {{ $t('global.select') }}
            </el-button> -->
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="layout" :label="$t('global.layout')">
          <el-scrollbar>
            <!-- <el-form-item prop="name" :label="$t('records.name')"
              :rules="[{ required: true, message: $t('error.required') }]">
              <el-input v-model.trim="formData.name" autofocus clearable required :placeholder="$t('records.name')" />
            </el-form-item>
            <el-form-item prop="userAgent" :label="$t('records.userAgent')">
              <el-input v-model.trim="formData.userAgent" clearable :placeholder="$t('records.userAgent')">
                <template #append>
                  <el-select v-model="formData.userAgent" placeholder="Select" style="width: 115px">
                    <el-option label="Restaurant" value="1" />
                    <el-option label="Order No." value="2" />
                    <el-option label="Tel" value="3" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="desc" :label="$t('global.desc')">
              <el-input v-model="formData.desc" type="textarea" autosize :placeholder="$t('global.desc')" />
            </el-form-item> -->
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="advanced" :label="$t('global.advanced')">
          <el-scrollbar>
            <!-- <el-form-item prop="name" :label="$t('records.startUrl')">
              <el-input v-model.trim="formData.startUrl" clearable :placeholder="$t('records.startUrl')" />
            </el-form-item>
            <el-form-item prop="name" :label="$t('records.extensions')">
              <el-input v-model.trim="formData.extensions" clearable :placeholder="$t('records.extensions')" />
            </el-form-item>
            <el-form-item prop="name" :label="$t('records.webRTC')">
              <el-input v-model.trim="formData.webRTC" clearable :placeholder="$t('records.webRTC')" />
            </el-form-item> -->
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-form>
</template>
<style scoped></style>
