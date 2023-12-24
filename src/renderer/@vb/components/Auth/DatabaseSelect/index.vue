/* eslint-disable vue/script-setup-uses-vars */
<template>
  <div class="card card-top card-top-primary" :class="$style.container">
    <div class="text-dark font-size-32 mb-3">Database Configuration</div>
    <div class="row mt-2">
      <div class="col-6">
        <div class="card p-5 card-button" @click="$emit('auto')">
          <i class="fas fa-database icon"></i>
          <h5 class="text-dark">Create New Database</h5>
        </div>
      </div>
      <div class="col-6">
        <div class="card p-5 card-button" @click="$emit('existing')">
          <i class="fas fa-link icon"></i>
          <h5 class="text-dark">Use Existing Database</h5>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VbDatabaseIntro',
  emits: ['auto', 'existing'],
}
</script>
<style scoped>
.card-button {
  cursor: pointer;
  transition: 0.3s all ease-in-out;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  text-align: center;
}

.card-button:hover {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transform: translateY(-5px);
}

.icon {
  font-size: 40px;
  margin: 10px;
}
</style>
<style lang="scss" module>
@import '@/@vb/components/Auth/style.module.scss';

.container {
  max-width: rem(950);
  min-width: rem(950);
}
</style>
