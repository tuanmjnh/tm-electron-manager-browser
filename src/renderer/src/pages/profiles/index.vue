<script setup lang="ts">
import { ref, toRaw, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable } from 'element-plus'
import stores from '../../stores'
const storeProfiles = stores.profiles()
const storeSettings = stores.settings()
const $router = useRouter()
const isDialog = ref(false)

const tableRef = ref<InstanceType<typeof ElTable>>()
const tableData = computed(() => storeProfiles.items)
const pagination = ref({
  filter: '',
  sortBy: 'order',
  flag: 1,
  page: 1,
  descending: false,
  rowsPerPage: 5,
  rowsNumber: 1,
  totalPage: 0
})
const onFetch = async (pagination) => {
  const rs = await storeProfiles.get(toRaw(pagination.value))
  pagination.value = { ...pagination.value, ...{ rowsNumber: rs.rowsNumber, totalPage: Math.ceil(rs.rowsNumber / pagination.value.rowsPerPage) } }
}
onFetch(pagination)

const onChangePage = (val: number) => {
  pagination.value.page = val
  onFetch(pagination)
}

const onChangeFlag = (val: number) => {
  pagination.value.flag = val
  onFetch(pagination)
}

const onEdit = (index, row) => {
  storeProfiles.set(row)
  $router.push(`edit/${row._id}`)
}
const onTrash = (row) => {
  tableRef.value?.toggleRowSelection(row, true)
  isDialog.value = true
}
const onTrashConfirm = () => {
  const rows = tableRef.value?.getSelectionRows()
  storeProfiles.patch(rows.map(x => x._id))
  isDialog.value = false
}

const onRun = (row) => {
  const args = toRaw(row) as any
  console.log(args)
  args.profile = {
    path: storeSettings.profile.directory,
    name: ''
  }
  window.Puppeteer.Chrome(args).then(x => {
    console.log(x)
  })
}
</script>
<template>
  <el-card shadow="never" class="el-card-index">
    <template #header>
      <div class="card-header">
        <span class="title">{{ $t('profiles.list') }}</span>
        <div class="el-space" />
        <el-col :span="8" style="margin-right: 5px;">
          <el-input v-model="pagination.filter" :placeholder="$t('global.search')" />
        </el-col>
        <el-tooltip class="box-item" effect="dark" :content="$t('global.add')" placement="top">
          <el-button text circle type="primary" @click="$router.push({ name: 'profiles-add' })">
            <i class="el-icon"><span class="fa-solid fa-plus" /></i>
          </el-button>
        </el-tooltip>
        <el-tooltip v-if="pagination.flag == 1 && tableRef?.getSelectionRows().length > 0" class="box-item" effect="dark"
          :content="$t('global.trash')" placement="top">
          <el-button text circle type="danger" @click="isDialog = true">
            <i class="el-icon"><span class="fa-solid fa-trash" /></i>
          </el-button>
        </el-tooltip>
        <el-tooltip v-if="pagination.flag == 0 && tableRef?.getSelectionRows().length > 0" class="box-item" effect="dark"
          :content="$t('global.recover')" placement="top">
          <el-button text circle type="warning" @click="isDialog = true">
            <i class="el-icon"><span class="fa-solid fa-recycle" /></i>
          </el-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" :content="$t('global.status')" placement="top">
          <el-dropdown trigger="click">
            <el-button text circle>
              <i class="el-icon"><span class="fa-solid fa-ellipsis-vertical" /></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :class="pagination.flag == 1 ? 'selected' : ''" @click="onChangeFlag(1)">
                  <i class="el-icon"><span class="fa-solid fa-check-to-slot" /></i>
                  {{ $t('global.working') }}
                </el-dropdown-item>
                <el-dropdown-item :class="pagination.flag == 0 ? 'selected' : ''" @click="onChangeFlag(0)">
                  <i class="el-icon"><span class="fa-solid fa-circle-exclamation" /></i>
                  {{ $t('global.drafts') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </template>
    <el-table ref="tableRef" :data="tableData" :empty-text="$t('global.updating')"
      style="width:100%;height:calc(100vh - 238px)">
      <el-table-column type="selection" width="55" />
      <el-table-column align="left" prop="name" sortable :label="$t('profiles.name')">
        <template #default="scope">
          <span :style="{ color: scope.row.color }">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="order" sortable :label="$t('global.order')" width="110" />
      <el-table-column align="center" sortable :label="$t('global.createdAt')" width="150">
        <template #default="scope">
          {{ $createdAt(scope.row.created.at) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Run" width="100">
        <template #default="scope">
          <el-button type="primary" text circle @click="onRun(scope.row)">
            <i class="el-icon"><span class="fa-solid fa-circle-play" /></i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="#" width="100">
        <template #default="scope">
          <el-button type="success" text circle @click="onEdit(scope.$index, scope.row)">
            <i class="el-icon"><span class="fa-solid fa-pen-to-square" /></i>
          </el-button>
          <el-button v-if="pagination.flag == 1" type="danger" text circle @click="onTrash(scope.row)">
            <i class="el-icon"><span class="fa-solid fa-circle-minus" /></i>
          </el-button>
          <el-button v-else type="warning" text circle @click="onTrash(scope.row)">
            <i class="el-icon"><span class="fa-solid fa-recycle" /></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="flex text-right">
        <el-pagination background layout="prev, pager, next" :page-count="pagination.totalPage"
          @current-change="onChangePage" />
      </div>
    </template>
  </el-card>
  <el-dialog v-model="isDialog" :title="$t('messageBox.confirm')" width="50%" @close="tableRef?.clearSelection()">
    <span>{{ pagination.flag == 1 ? $t('messageBox.trash') : $t('messageBox.recover') }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onTrashConfirm">{{ $t('global.confirm') }}</el-button>
        <el-button @click="isDialog = false">{{ $t('global.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped></style>
