<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import stores from '@renderer/stores'

const { t } = useI18n({ useScope: 'global' })
const $route = useRoute()
const $router = useRouter()

const storeApplication = stores.application()
const storeSettings = stores.settings()
const storeAuthenticate = stores.authenticate()

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

const passwordType = ref('password')
const isCapsTooltip = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<{
  username: string,
  password: string,
  remember: boolean
}>({
  username: 'admin',
  password: 'admin',
  remember: true
})

// interface DomainItem {
//   key: number
//   value: string
// }
const fullscreenLoading = ref(false)

const onSubmit = () => {
  fullscreenLoading.value = true
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
      storeAuthenticate.login({ ...{}, ...formData }).then(x => {
        if (x) $router.push('/').catch((e) => { })
        fullscreenLoading.value = false
      }).catch((e) => {
        ElMessage.error(t('error.system'))
        fullscreenLoading.value = false
      })
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
onMounted(() => {
  window.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      onSubmit()
    }
  }, true)
})
</script>
<template>
  <div class="login-container">
    <el-form ref="formRef" :model="formData" class="demo-dynamic">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span class="title">{{ $t('authenticate.title') }}</span>
            <div class="el-space" />
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
              <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg> -->
              <i v-if="storeSettings.darkMode" class="el-icon"><span class="fa-solid fa-moon" /></i>
              <i v-if="!storeSettings.darkMode" class="el-icon"><span class="fa-solid fa-sun" /></i>
            </el-button>
          </div>
        </template>
        <el-form-item prop="username" :rules="[{ required: true, message: $t('error.required') }]">
          <el-tooltip class="box-item" effect="dark" :content="$t('authenticate.username')" placement="right">
            <el-input v-model.trim="formData.username" autofocus required :placeholder="$t('authenticate.username')" />
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="password" :rules="[{ required: true, message: $t('error.required') }]">
          <el-tooltip class="box-item" effect="dark" :content="$t('authenticate.password')" placement="right">
            <el-input v-model.trim="formData.password" :type="passwordType" required
              :placeholder="$t('authenticate.password')">
              <template #append>
                <el-button v-if="passwordType === 'password'" @click="passwordType = 'text'">
                  <i class="el-icon"><span class="fa-solid fa-eye-slash" /></i>
                </el-button>
                <el-button v-else @click="passwordType = 'password'">
                  <i class="el-icon"><span class="fa-solid fa-eye" /></i>
                </el-button>
              </template>
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="remember">
          <el-checkbox v-model="formData.remember" :label="$t('authenticate.remember')" />
        </el-form-item>
        <template #footer>
          <div class="flex">
            <div class="el-space" />
            <el-button type="primary" class="el-button-square" v-loading.fullscreen.lock="fullscreenLoading"
              @click="onSubmit">
              {{ $t('authenticate.login') }}
            </el-button>
            <el-button class="el-button-square" @click="resetForm">{{ $t('global.reset') }}</el-button>
          </div>
        </template>
      </el-card>
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 20px);

  .el-card {
    width: 500px;
  }
}
</style>
