<script setup lang="ts">
import debounce from 'lodash.debounce'
import { ref, toRaw } from 'vue'
import { useRoute } from "vue-router"
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import stores from '../../stores'

import chromePNG from '../../assets/chrome.png'
import firefoxPNG from '../../assets/firefox.png'

const storeProfiles = stores.profiles()
const { t } = useI18n({ useScope: 'global' })
const formRef = ref<FormInstance>()
const formData = ref(null) as any
const $route = useRoute()
const tab = ref('basic')
const passwordType = ref('password')

// const accountUrlOptions = ref<[{
//   label: string,
//   key: string,
//   value: string,
// }]>([{
//   label: 'Gmail',
//   key: 'gmail',
//   value: 'https://accounts.google.com/ServiceLogin?service=mail',
// }])

const onReset = () => {
  return new Promise((resolve, reject) => {
    if (!$route.params.id) storeProfiles.set()
    if (storeProfiles.item) formData.value = JSON.parse(JSON.stringify(storeProfiles.item))
    resolve(true)
  }).then(() => {
    if (!formRef.value) return
    formRef.value.resetFields()
  })
}
onReset()

const onChangeProxyDetail = debounce(() => {
  // const proxy = proxyDetail.value.split(':')
  // formData.value.proxyHost = proxy.length > 0 ? proxy[0] : ''
  // formData.value.proxyPort = proxy.length > 1 ? proxy[1] : ''
  // formData.value.proxyUsername = proxy.length > 2 ? proxy[2] : ''
  // formData.value.proxyPassword = proxy.length > 3 ? proxy[3] : ''
}, 300)

const proxiesType = storeProfiles.proxyType
const proxyDetail = ref('')
const proxyType = ref(proxiesType.length > 0 ? proxiesType[0] : '')
const onUpdateProxy = () => {
  const proxy = proxyDetail.value.split(':')
  if (proxy.length > 3) {
    formData.value.proxies.push({
      type: proxyType.value,
      host: proxy[0],
      port: proxy[1],
      username: proxy[2],
      password: proxy[3]
    })
    proxyDetail.value = ''
  }
}


// watch(() => formData.value.key, (now, prev) => {
//   console.log(now)
// })//deep: true, immediate: true

// watch(() => formData.value.key, debounce(() => {
//   storeProfiles.find({ key: formData.value.key }).then(x => {
//     isExist.value = x ? true : false
//     console.log(x)
//   })
// }, 500))

const account = ref('')
const accountUrlOptions = storeProfiles.accountType
const accountUrl = ref(accountUrlOptions[0])
const onUpdateAccount = () => {
  const acc = account.value.split(':')
  if (acc.length > 1) {
    // if (!formData.value.accounts) formData.value.accounts = []
    formData.value.accounts.push({
      type: accountUrl.value.key,
      // url: accountUrl.value.value,
      username: acc[0],
      password: acc[1]
    })
    account.value = ''
  }
}

const onCheckExist = async () => {
  if (!formData.value._id) return (await storeProfiles.find({ key: formData.value.key })) ? true : false
  else return false
}
const onKeyGenerateByName = debounce(() => {
  if (!formData.value._id && !formData.value.key)
    formData.value.key = formData.value.name.removeCharsFolder()
}, 300)

const onKeyCreateByName = debounce(() => {
  formData.value.key = formData.value.name.removeCharsFolder()
}, 300)

const onKeyConvertToAscii = debounce(() => {
  formData.value.key = formData.value.name.removeCharsFolder()
}, 300)

const onSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
      if (formData.value._id) {
        storeProfiles.put(toRaw(formData.value)).then(x => {
          if (x) ElMessage.success(t('success.update'))
        }).catch((e) => { ElMessage.error(t('error.invalid')) })
      } else {
        storeProfiles.post(toRaw(formData.value)).then(x => {
          if (x) {
            ElMessage.success(t('success.insert'))
            onReset()
          }
        }).catch((e) => { ElMessage.error(t('error.invalid')) })
      }
    }
  })
}
</script>
<template>
  <el-form ref="formRef" :model="formData" label-position="right" label-width="125px">
    <el-card shadow="never" class="el-card-add-tab">
      <template #header>
        <div class="card-header">
          <span class="title">{{ formData._id ? $t('profiles.edit') : $t('profiles.add') }}</span>
          <div class="el-space" />
          <el-button type="primary" class="el-button-square" @click="onSubmit">
            {{ formData._id ? $t('global.update') : $t('global.insert') }}
          </el-button>
          <el-button class="el-button-square" @click="$router.push({ name: 'profiles-view' })">
            {{ $t('global.back') }}
          </el-button>
        </div>
      </template>
      <el-tabs v-model="tab">
        <el-tab-pane name="basic" :label="$t('global.basic')">
          <el-scrollbar>
            <el-form-item prop="name" :label="$t('profiles.name')"
              :rules="[{ required: true, message: $t('error.required') }]">
              <el-input v-model.trim="formData.name" autofocus clearable required :placeholder="$t('profiles.name')"
                @blur="onKeyGenerateByName" />
            </el-form-item>
            <el-form-item prop="key" :label="$t('profiles.key')" :rules="[
              { required: true, message: $t('error.required') },
              {
                asyncValidator: async (rule: any, value: any, callback: any) => {
                  if (await onCheckExist()) callback(true)
                  else callback()
                }, message: $t('error.exist')
              }
            ]">
              <el-input v-model.trim="formData.key" clearable required :readonly="formData._id ? true : false"
                :placeholder="$t('profiles.key')" @input="onKeyConvertToAscii">
                <template v-if="!formData._id" #append>
                  <el-button class="el-button-append" type="primary" @click="onKeyCreateByName">
                    {{ $t('profiles.createByName') }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="browserType" :label="$t('profiles.browserType')">
              <div :class="['el-avatar-select', formData.browserType == 'chrome' ? 'selected' : '']">
                <el-avatar :size="50" :src="chromePNG" @click="formData.browserType = 'chrome'" />
              </div>
              <div :class="['el-avatar-select', formData.browserType == 'firefox' ? 'selected' : '']">
                <el-avatar :size="50" :src="firefoxPNG" @click="formData.browserType = 'firefox'" />
              </div>
            </el-form-item>
            <el-form-item prop="userAgent" :label="$t('profiles.userAgent')">
              <el-input v-model.trim="formData.userAgent" clearable :placeholder="$t('profiles.userAgent')">
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
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="proxy" label="Proxy">
          <el-scrollbar>
            <el-input v-model.trim="proxyDetail" :disabled="!proxyType.length" clearable
              placeholder="host:port:username:password">
              <template #prepend>
                <el-select v-model="proxyType" placeholder="No Proxy" style="width: 115px">
                  <el-option v-for="(ops, i) in proxiesType" :key="i" :label="ops.label" :value="ops.value" />
                  <!-- <el-option label="Google Mail" value="1" /> -->
                  <!-- <el-option label="Outlook Mail" value="2" /> -->
                </el-select>
              </template>
              <template #append v-if="proxyType.length">
                <el-button class="el-button-append" type="primary" @click="onUpdateProxy">
                  {{ $t('global.update') }}
                </el-button>
              </template>
            </el-input>
            <el-table :data="formData.proxies" style="width: 100%">
              <el-table-column prop="type" :label="$t('profiles.proxyType')" />
              <el-table-column prop="host" label="Host" />
              <el-table-column prop="port" label="Port" />
              <el-table-column prop="username" label="Username" />
              <el-table-column prop="password" label="Password" />
              <el-table-column align="center" label="#" width="100">
                <!-- <template #default="scope">
                  <el-button type="success" text circle @click="onEditAccount(scope.row)">
                    <i class="el-icon"><span class="fa-solid fa-pen-to-square" /></i>
                  </el-button>
                  <el-popconfirm title="Are you sure to delete this?">
                    <template #reference>
                      <el-button type="warning" text circle @click="onRemoveAccount(scope.row)">
                        <i class="el-icon"><span class="fa-solid fa-recycle" /></i>
                      </el-button>
                    </template>
                  </el-popconfirm>
                </template> -->
              </el-table-column>
            </el-table>
            <!-- <el-form-item prop="proxyType" :label="$t('profiles.proxyType')">
              <el-select v-model="proxy.type" placeholder="No Proxy">
                <el-option label="No Proxy" value="" />
                <el-option label="HTTP" value="http" />
                <el-option label="HTTPS" value="https" />
                <el-option label="SOCKS v4" value="socks4" />
                <el-option label="SOCKS v5" value="socks5" />
              </el-select>
            </el-form-item>
            <el-form-item label="Proxy">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb-2">
                <el-input v-model.trim="proxyDetail" placeholder="Host:Port:Username:Password"
                  @input="onChangeProxyDetail">
                  <template #append>
                    <el-switch v-model="proxyIsDetail" />
                  </template>
                </el-input>
              </el-col>
            </el-form-item> -->
            <!-- <template v-if="proxyIsDetail">
              <el-form-item :label="$t('profiles.proxyHost')">
                <el-col :sm="24" :md="12" :lg="6" :xl="6" class="mb-2">
                  <el-input v-model.trim="formData.proxyHost" :placeholder="$t('profiles.proxyHost')" readonly disabled />
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('profiles.proxyPort')">
                <el-col :sm="24" :md="12" :lg="6" :xl="6" class="mb-2">
                  <el-input v-model.trim="formData.proxyPort" :placeholder="$t('profiles.proxyPort')" readonly disabled />
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('profiles.proxyUsername')">
                <el-col :sm="24" :md="12" :lg="6" :xl="6" class="mb-2">
                  <el-input v-model.trim="formData.proxyUsername" :placeholder="$t('profiles.proxyUsername')" readonly
                    disabled />
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('profiles.proxyPassword')">
                <el-col :sm="24" :md="12" :lg="6" :xl="6" class="mb-2">
                  <el-input v-model.trim="formData.proxyPassword" :placeholder="$t('profiles.proxyPassword')" readonly
                    disabled />
                </el-col>
              </el-form-item>
            </template> -->
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="location-time" :label="$t('global.regionTime')">
          <el-scrollbar>
            <el-form-item prop="name" :label="$t('profiles.timezone')">
              <el-switch v-model="formData.timezone.auto" inline-prompt :active-text="$t('global.auto')"
                :inactive-text="$t('global.manual')" />
            </el-form-item>
            <el-form-item v-if="!formData.timezone.auto" prop="name" :label="$t('profiles.timezoneManual')">
              <el-input v-model.trim="formData.timezone.TZ" clearable :placeholder="$t('profiles.timezone')" />
            </el-form-item>
            <el-form-item prop="name" :label="$t('profiles.location')">
              <el-switch v-model="formData.location.auto" inline-prompt :active-text="$t('global.auto')"
                :inactive-text="$t('global.manual')" />
            </el-form-item>
            <el-form-item v-if="!formData.location.auto" prop="name" :label="$t('profiles.locationManual')">
              <el-col :sm="24" :md="11" :lg="11" :xl="11" class="mb-2">
                <el-input v-model="formData.location.latitude" type="number" placeholder="Latitude" />
              </el-col>
              <el-col :md="2" :lg="2" />
              <el-col :sm="24" :md="11" :lg="11" :xl="11" class="mb-2">
                <el-input v-model="formData.location.longitude" type="number" placeholder="Longitude" />
              </el-col>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="advanced" :label="$t('global.advanced')">
          <el-scrollbar>
            <el-form-item prop="name" :label="$t('profiles.startUrl')">
              <el-input v-model.trim="formData.startUrl" clearable :placeholder="$t('profiles.startUrl')" />
            </el-form-item>
            <el-form-item prop="name" :label="$t('profiles.extensions')">
              <el-input v-model.trim="formData.extensions" clearable :placeholder="$t('profiles.extensions')" />
            </el-form-item>
            <el-form-item prop="name" :label="$t('profiles.webRTC')">
              <el-input v-model.trim="formData.webRTC" clearable :placeholder="$t('profiles.webRTC')" />
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="accounts" :label="$t('global.account')">
          <el-scrollbar>
            <!-- <el-form-item prop="account"> -->
            <el-input v-model.trim="account" clearable placeholder="username:password">
              <template #prepend>
                <el-select v-model="accountUrl" :placeholder="$t('global.type')" style="width: 115px">
                  <el-option v-for="(ops, i) in accountUrlOptions" :key="i" :label="ops.label" :value="ops.value" />
                  <!-- <el-option label="Google Mail" value="1" /> -->
                  <!-- <el-option label="Outlook Mail" value="2" /> -->
                </el-select>
              </template>
              <template #append>
                <el-button class="el-button-append" type="primary" @click="onUpdateAccount">
                  {{ $t('global.update') }}
                </el-button>
              </template>
            </el-input>
            <!-- </el-form-item> -->
            <!-- <el-form-item prop="name" :label="$t('users.username')">
              <el-input v-model.trim="account.username" clearable :placeholder="$t('users.username')" />
            </el-form-item>
            <el-form-item prop="name" :label="$t('users.password')">
              <el-input v-model.trim="account.password" :type="passwordType" required :placeholder="$t('users.password')">
                <template #append>
                  <el-button v-if="passwordType === 'password'" @click="passwordType = 'text'">
                    <i class="el-icon"><span class="fa-solid fa-eye-slash" /></i>
                  </el-button>
                  <el-button v-else @click="passwordType = 'password'">
                    <i class="el-icon"><span class="fa-solid fa-eye" /></i>
                  </el-button>
                </template>
              </el-input>
            </el-form-item> -->
            <el-table :data="formData.accounts" style="width: 100%">
              <el-table-column prop="type" :label="$t('global.type')" width="180" />
              <el-table-column prop="username" :label="$t('users.username')" />
              <el-table-column prop="password" :label="$t('users.password')" />
              <el-table-column align="center" label="#" width="100">
                <!-- <template #default="scope">
                  <el-button type="success" text circle @click="onEditAccount(scope.row)">
                    <i class="el-icon"><span class="fa-solid fa-pen-to-square" /></i>
                  </el-button>
                  <el-popconfirm title="Are you sure to delete this?">
                    <template #reference>
                      <el-button type="warning" text circle @click="onRemoveAccount(scope.row)">
                        <i class="el-icon"><span class="fa-solid fa-recycle" /></i>
                      </el-button>
                    </template>
                  </el-popconfirm>
                </template> -->
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-form>
</template>
<style scoped></style>
