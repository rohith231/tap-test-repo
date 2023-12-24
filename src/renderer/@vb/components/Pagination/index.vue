<template>
  <div class="pull-right m-3">
    <a-pagination
      size="small"
      show-quick-jumper
      :page-size-options="pageSizeOptions"
      show-size-changer
      :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
      :default-current="pageNumber"
      :total="total"
      @showSizeChange="onChange"
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

