<template>
  <span class="tag is-small">
    <i
      class="fas"
      :class="{
        'fa-sort-up': !this.sort,
        'fa-sort-down': this.sort,
      }"
    ></i>
  </span>
</template>

<script>
export default {
  props: {
    sort: Boolean,
  },
}
</script>
