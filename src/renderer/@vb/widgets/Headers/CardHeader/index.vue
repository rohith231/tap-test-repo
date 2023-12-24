<template>
    <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
      <h5 class="mb-0">
        <div class="vb__utils__heading">
          <strong>
            {{ data.title }}
          </strong>
        </div>
      </h5>
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          title: 'Basic header',
        }
      },
    },
  },
}
</script>
