<template>
  <div class="m-3 text-center">
    <a-pagination
      size="small"
      :default-current="pageNumber"
      :total="total"
      show-less-items
      @change="onChange"
      :page-size="itemsPerPage"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    itemsPerPage: {
      type: Number,
      default: () => 10,
    },
    total: {
      type: Number,
      default: () => 0,
    },
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30', '40', '50'],
    },
    pageNumber: {
      type: Number,
      default: () => 1,
    },
  },
  emits: ['changePagination'],
  setup(props, { emit }) {
    const onChange = (newPageNumber, newItemsPerPage) => {
      // console.log(newPageNumber, newItemsPerPage);
      if (props.pageNumber != newPageNumber) {
        emit('changePagination', {
          pageNumber: newPageNumber,
        })
      } else if (props.itemsPerPage != newItemsPerPage) {
        emit('changePagination', {
          itemsPerPage: newItemsPerPage,
        })
      }
    }

    return {
      onChange,
    }
  },
}
</script>

