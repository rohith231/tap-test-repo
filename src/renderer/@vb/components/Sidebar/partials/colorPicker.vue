<template>
  <div :class="$style.vb__sidebar__fixColorPicker">
    <template v-for="item in colors" :key="item">
      <a
        href="javascript: void(0);"
        :class="{
          [$style.vb__sidebar__select__item]: true,
          [$style.vb__sidebar__select__item__active]: value === item,
          [$style.vb__sidebar__select__item__black]: item === 'dark',
          [$style.vb__sidebar__select__item__white]: item === 'white',
          [$style.vb__sidebar__select__item__gray]: item === 'gray',
          [$style.vb__sidebar__select__item__blue]: item === 'blue',
          [$style.vb__sidebar__select__item__green]: item === 'green',
          [$style.vb__sidebar__select__item__red]: item === 'red',
          [$style.vb__sidebar__select__item__antiquewhite]: item === 'antiquewhite',
          [$style.vb__sidebar__select__item__aqua]: item === 'aqua',
          [$style.vb__sidebar__select__item__orange]: item === 'orange',
          [$style.vb__sidebar__select__item__purple]: item === 'purple',
          [$style.vb__sidebar__select__item__img]: item === 'image',
        }"
        @click="colorPickerHandler(setting, item)"
      />
    </template>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  props: {
    organizationColorType: {
      type: String,
      default: '',
    },
    setting: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    colors: {
      type: Array,
      default: () => [],
    },
  },
   setup(props, { emit }) {
     const store = useStore()

     const colorPickerHandler = (setting, value) => {
  
      store.commit('organization/SET_STATE', { [props.organizationColorType]:value})
      store.commit('CHANGE_SETTING', { setting, value })
    }

    return {
      colorPickerHandler
    }
  },
  methods: {
 
  },
}
</script>

<style lang="scss" module>
@import '../style.module.scss';
</style>
