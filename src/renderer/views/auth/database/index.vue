<template>
  <div>
    <vb-database-select
      v-if="mode == 'null'"
      @auto="setMethod('auto')"
      @existing="setMethod('existing')"
    />
    <vb-create-database v-if="mode == 'auto'" @back="mode = 'null'" />
    <vb-existing-database v-if="mode == 'existing'" @back="mode = 'null'" />
  </div>
</template>
<script>
import VbExistingDatabase from '@/@vb/components/Auth/DatabaseExisting'
import VbCreateDatabase from '@/@vb/components/Auth/DatabaseCreate'
import VbDatabaseSelect from '@/@vb/components/Auth/DatabaseSelect'
export default {
  components: {
    VbExistingDatabase,
    VbCreateDatabase,
    VbDatabaseSelect,
  },
  props: {
    modeParam: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mode: this.modeParam,
    }
  },
  methods: {
    setMethod(mode) {
      this.mode = mode
    },
  },
}
</script>
