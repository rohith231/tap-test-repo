<template>
  <template v-if="data?.length > 0">
    <div class="row">
      <div class="col-lg-6">
        <h5>Installed apps</h5>
      </div>
    </div>
    <a-table :columns="columns" :data-source="data">
      <template #renderItem="{ item }">
        <a>{{ item }}</a>
      </template>
    </a-table>
  </template>
</template>

<script>
const columns = [
  {
    title: 'Publisher',
    dataIndex: 'Publisher',
    key: 'publisher',
  },
  {
    title: 'Name',
    dataIndex: 'DisplayName',
    key: 'name',
  },
  {
    title: 'Version',
    dataIndex: 'DisplayVersion',
    key: 'version',
  },
  {
    title: 'Date',
    dataIndex: 'InstallDate',
    key: 'date',
  },
]

export default {
  name: 'DeviceInstalledApps',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      columns,
    }
  },
}
</script>
