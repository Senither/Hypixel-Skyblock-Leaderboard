<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination" v-if="hasMoreThanOnePage">
    <a v-on:click="navigateTo(currentPage - 1)" :disabled="currentPage <= 1" class="pagination-previous">Previous</a>
    <a v-on:click="navigateTo(currentPage + 1)" :disabled="currentPage >= lastPage" class="pagination-next">Next page</a>
    <ul class="pagination-list">
      <li v-for="link of generateLinks()">
        <a
          v-if="link != '...'"
          class="pagination-link"
          :class="{ 'is-current': currentPage == link }"
          :aria-label="'Goto page ' + link"
          v-on:click="navigateTo(link)"
          >{{ link }}</a
        >

        <span v-else class="pagination-ellipsis">&hellip;</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pagination: Object,
  },

  computed: {
    currentPage() {
      return this.pagination.current_page
    },
    lastPage() {
      return this.pagination.last_page
    },
    hasMoreThanOnePage() {
      return this.pagination.last_page > 1
    },
  },

  methods: {
    generateLinks() {
      let pages = [1]

      if (this.lastPage < 8) {
        for (let i = 2; i <= this.lastPage; i++) {
          pages.push(i)
        }
        return pages
      }

      if (this.currentPage < 4) {
        return [1, 2, 3, 4, 5, '...', this.lastPage]
      }

      if (this.currentPage == this.lastPage) {
        pages.push('...')
        for (let i = this.lastPage - 4; i <= this.lastPage; i++) {
          pages.push(i)
        }
        return pages
      }

      pages.push(this.currentPage > 2 ? '...' : 2)

      let start = this.currentPage - 1
      let end = this.currentPage + 1

      if (start == 1 || start - 1 == 1) {
        start = 3
        end = 5
      }

      if (end == this.lastPage || end + 1 == this.lastPage) {
        start = this.lastPage - 4
        end = this.lastPage - 1
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (this.currentPage + 2 < this.lastPage) {
        pages.push('...')
      }

      pages.push(this.lastPage)

      return pages
    },

    navigateTo(page) {
      page = Math.min(Math.max(page, 1), this.lastPage)

      if (page == this.currentPage) {
        return
      }

      this.$emit('go-to-page', page)
    },
  },
}
</script>
