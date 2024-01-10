<script setup lang="ts">
import debounce from 'lodash.debounce'
import stores from '@renderer/stores'
import { ref, toRaw, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router"
import { generateRoutesRoles } from '../../utils/tree'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance, ElTree } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { AllowDropType, NodeDropType } from 'element-plus/es/components/tree/src/tree.type'

const storeRoles = stores.roles()
const { t } = useI18n({ useScope: 'global' })
const formRef = ref<FormInstance>()
const formData = ref(null) as any
const treeRef = ref<InstanceType<typeof ElTree>>()
const $router = useRouter()
const $route = useRoute()
const routes = generateRoutesRoles($router.options.routes)

onMounted(() => treeRef.value!.setCheckedKeys(formData.value.routes, false))

const onReset = () => {
  return new Promise((resolve, reject) => {
    if (!$route.params.id) storeRoles.set()
    if (storeRoles.item) formData.value = JSON.parse(JSON.stringify(storeRoles.item))
    resolve(true)
  }).then(() => {
    if (!formRef.value) return
    formRef.value.resetFields()
    treeRef.value!.setCheckedKeys(formData.value.routes, false)
  })
}
onReset()

const handleDrop = (draggingNode: Node, dropNode: Node, dropType: NodeDropType, ev: DragEvents) => {
  console.log('tree drop:', dropNode.label, dropType)
}

const onCheckExist = debounce(() => {
  storeRoles.find({ key: formData.value.key }).then(x => {
  })
}, 500)

const onSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
      formData.value.routes = toRaw(treeRef.value!.getCheckedKeys(false) as any)
      if (formData.value._id) {
        console.log('update')
      } else {
        storeRoles.post({ data: toRaw(formData.value) }).then(x => {
          if (x) {
            ElMessage.success(t('success.insert'))
            onReset()
          }
        }).catch((e) => {
          console.log(e)
          ElMessage.error(t('error.invalid'))
        })
      }
    }
  })
}
</script>
<template>
  <el-form ref="formRef" :model="formData" label-position="right" label-width="130px">
    <el-card shadow="never" class="el-card-add">
      <template #header>
        <div class="card-header">
          <span class="title">{{ $t('roles.add') }}</span>
          <div class="el-space" />
          <div class="el-space" />
          <el-button type="primary" class="el-button-square" @click="onSubmit">
            {{ formData._id ? $t('global.update') : $t('global.insert') }}
          </el-button>
          <!-- <el-button class="el-button-square" @click="onReset">{{ $t('global.reset') }}</el-button> -->
        </div>
      </template>
      <el-scrollbar>
        <el-form-item prop="key" :label="$t('roles.key')" :rules="[{ required: true, message: $t('error.required') }]">
          <!-- <el-tooltip class="box-item" effect="dark" :content="$t('roles.key')" placement="left"> -->
          <el-input v-model.trim="formData.key" autofocus clearable required :placeholder="$t('roles.key')"
            @input="onCheckExist(formData.key)" />
          <!-- </el-tooltip> -->
        </el-form-item>
        <el-form-item prop="name" :label="$t('roles.name')" :rules="[{ required: true, message: $t('error.required') }]">
          <el-col :span="22">
            <!-- <el-tooltip class="box-item" effect="dark" :content="$t('roles.name')" placement="left"> -->
            <el-input v-model.trim="formData.name" clearable required :placeholder="$t('roles.name')"
              :input-style="{ color: formData.color }" />
            <!-- <template #append>
              </template> -->
            <!-- <template #suffix>
                <i class="el-icon"><span class="fa-solid fa-file-signature" /></i>
              </template> -->
            <!-- </el-tooltip> -->
          </el-col>
          <el-col :span="2" class="text-right">
            <!-- <el-tooltip class="box-item" effect="dark" :content="$t('global.color')" placement="left"> -->
            <el-color-picker v-model="formData.color" />
            <!-- </el-tooltip> -->
          </el-col>
        </el-form-item>
        <el-form-item prop="desc" :label="$t('global.desc')">
          <!-- <el-tooltip class="box-item" effect="dark" :content="$t('global.desc')" placement="left"> -->
          <el-input v-model="formData.desc" type="textarea" autosize :placeholder="$t('global.desc')" />
          <!-- </el-tooltip> -->
        </el-form-item>
        <!-- <el-form-item prop="routes"> -->
        <el-form-item :label="$t('roles.list')" />
        <el-tree ref="treeRef" node-key="name" :data="routes" show-checkbox check-strictly draggable default-expand-all
          @node-drop="handleDrop">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ $t(`route.${node.label}`) }}</span>
            </span>
          </template>
        </el-tree>
        <!-- </el-form-item> -->
      </el-scrollbar>
    </el-card>
  </el-form>
</template>
<style scoped></style>
