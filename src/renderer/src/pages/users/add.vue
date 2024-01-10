<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
const passwordType = ref('password')
const formRef = ref<FormInstance>()
const formData = ref<{
  _id?: string,
  username: string,
  password: string,
}>({
  _id: undefined,
  username: '',
  password: '',
})
console.log(formData.value)
const onSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
    }
  })
}
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>
<template>
  <el-form ref="formRef" :model="formData" class="demo-dynamic">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">{{ $t('users.add') }}</span>
          <div class="el-space" />
          <div class="el-space" />
          <el-button type="primary" class="el-button-square" @click="onSubmit">
            {{ formData._id ? $t('global.update') : $t('global.insert') }}
          </el-button>
          <el-button class="el-button-square" @click="resetForm">{{ $t('global.reset') }}</el-button>
        </div>
      </template>
      <el-form-item prop="username" :rules="[{ required: true, message: $t('error.required') }]">
        <el-tooltip class="box-item" effect="dark" :content="$t('users.username')" placement="right">
          <el-input v-model.trim="formData.username" autofocus required :placeholder="$t('users.username')" />
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
      <!-- <template #footer>
        <div class="flex">
        </div>
      </template> -->
    </el-card>
  </el-form>
</template>
<style scoped></style>
