<template>
  <a-table :columns="columns" :data-source="data" :pagination="false"> 
    <template #actionView="{record}">
        <a-radio-group class="ml-2" :options="options" :default-value="record.answer" @change="onChange" :name="record.title"/>
    </template>
  </a-table>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    columns: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup() {
    const options = [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ]

    return {
      options
    }
  },
  methods: {
    onChange(e) {
      this.emitter.emit('ssp-system_is_cloud', {name: e.target.name, value: e.target.value})
    }
  },
}
</script>
