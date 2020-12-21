<template>
  <div class="map-subject">
    <search-input ref="search" @focus="focusHandle" @search="searchHandle"></search-input>
    <subject-panel v-if="showSubject" @close="closeHandle"></subject-panel>
    <stat-and-poi v-if="showStatAndPoi" @back="backHandle"></stat-and-poi>
    <search-result v-if="showSearchResult"
                   :keyword="keyword"
                   :key="keyword"
                   @back="backHandle"
                   @close="closeHandle"></search-result>
  </div>
</template>

<script>
  import SearchInput from './search-input'
  import SubjectPanel from './subject-panel'
  import StatAndPoi from './stat-and-poi'
  import SearchResult from './search-result'

  export default {
    name: "map-subject",
    data () {
      return {
        showSubject: true,
        showStatAndPoi: false,
        showSearchResult: false,
        keyword: ''
      }
    },
    computed: {
      currentSubject () {
        return this.$store.state.currentSubject
      }
    },
    watch: {
      currentSubject (val) {
        if (val) {
          this.showSubject = false
          this.showStatAndPoi = true
        } else {
          this.showStatAndPoi = false
        }
      }
    },
    methods: {
      closeHandle () {
        this.$refs.search.keyword = ''
        this.showStatAndPoi = false
        this.showSubject = false
        this.showSearchResult = false
      },
      backHandle () {
        this.showSearchResult = false
        this.showStatAndPoi = false
        this.showSubject = true
      },
      focusHandle () {
        if (!this.showStatAndPoi && !this.showSearchResult) {
          this.showSubject = true
        }

      },
      searchHandle (keyword) {
        this.showSubject = false
        this.showStatAndPoi = false
        this.showSearchResult = true

        this.keyword = keyword
      }
    },
    components: {
      SearchInput,
      SubjectPanel,
      StatAndPoi,
      SearchResult
    }
  }
</script>

<style lang="stylus" scoped>
.map-subject
  width 360px
  position absolute
  left 24px
  top 24px
</style>
