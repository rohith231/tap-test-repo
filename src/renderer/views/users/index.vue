<template>
  <div>
   <router-view v-slot="{ Component }" >
        <transition>
          <component :is="Component" />
        </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'VbApps',
  components: {},
}
</script>
