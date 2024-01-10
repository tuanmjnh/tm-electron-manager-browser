<script setup lang="ts">
import { ref, toRaw, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable } from 'element-plus'
import stores from '@renderer/stores'
const storeRoles = stores.roles()
const $router = useRouter()
const rows = computed(() => storeRoles.items)
const pagination = ref({
  filter: '',
  sortBy: 'level',
  flag: 1,
  page: 1,
  descending: false,
  rowsPerPage: 4,
  rowsNumber: 1,
  totalPage: 0
})
const onFetch = async (pagination) => {
  // if (!opt.scroll && refScrollTarget.value) {
  //   document.getElementById('scroll-items').scroll(0, 0)
  //   refScrollTarget.value.reset()
  // }
  // return $store.dispatch('roles/get', { params: opt.pagination, scroll: opt.scroll })
  const rs = await storeRoles.get(toRaw(pagination.value))
  pagination.value = { ...pagination.value, ...{ rowsNumber: rs.rowsNumber, totalPage: Math.ceil(rs.rowsNumber / pagination.value.rowsPerPage) } }
}
onFetch(pagination)

const onPaginationChange = (val: number) => {
  pagination.value.page = val
  onFetch(pagination)
}
const tableRef = ref<InstanceType<typeof ElTable>>()

const onEdit = (index, row) => {
  storeRoles.set(row)
  $router.push(`edit/${row._id}`)
}

const onDelete = (index, row) => {

}
</script>
<template>
  <el-card shadow="never" :body-style="{ padding: 0 }">
    <template #header>
      <div class="card-header">
        <span class="title">{{ $t('roles.list') }}</span>
        <div class="el-space" />
      </div>
    </template>
    <el-table ref="tableRef" :data="rows" style="width:100%;height:calc(100vh - 238px)">
      <el-table-column align="center" prop="key" :label="$t('roles.key')" />
      <el-table-column align="center" prop="name" :label="$t('roles.name')" />
      <el-table-column align="center" prop="level" :label="$t('global.level')" width="80" />
      <el-table-column align="center" :label="$t('global.createdAt')" width="150">
        <template #default="scope">
          {{ $createdAt(scope.row.created.at) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="#" width="100">
        <template #default="scope">
          <el-button type="warning" text circle @click="onEdit(scope.$index, scope.row)">
            <i class="el-icon"><span class="fa-solid fa-pen-to-square" /></i>
          </el-button>
          <el-button type="danger" text circle>
            <i class="el-icon"><span class="fa-solid fa-trash" /></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="flex text-right">
        <el-pagination background layout="prev, pager, next" :page-count="pagination.totalPage"
          @current-change="onPaginationChange" />
      </div>
    </template>
  </el-card>
</template>
<style scoped></style>
