<template>
  <div class="search-result" :class="{hide: hide}">
    <div class="top">
      <span class="go-back" @click="goBackHandle">
        <i class="el-icon-arrow-left"></i>
      </span>
      <i @click="hide=!hide" class="el-icon-minus"></i>
      <i @click="closeHandle" class="el-icon-close"></i>
    </div>
    <div class="result-list">
      <map-poi :keyword="keyword"></map-poi>
    </div>
  </div>
</template>

<script>
  import MapPoi from '../map-poi'
  export default {
    name: "search-result",
    props: ['keyword'],
    data () {
      return {
        hide: false
      }
    },
    methods: {
      closeHandle () {
        this.$emit('close')
      },
      goBackHandle () {
        this.$emit('back')
      }
    },
    components: {
      MapPoi
    }
  }
</script>

<style lang="stylus" scoped>
.search-result
  position relative
  margin-top 8px
  height 560px
  background-color #fff
  border-radius 4px
  padding 12px
  box-shadow 0 2px 12px 0 rgba(0,0,0,0.1)
  transition height 0.2s
  overflow hidden
  &.hide
    height 18px
    overflow hidden
  .top
    background-color #fff
    text-align right
    border-top-left-radius 4px
    border-top-right-radius 4px
    user-select none
    margin-bottom 5px
    color #666
    position relative
    i
      margin-left 10px
      cursor pointer
      font-size 16px
    .go-back
      position absolute
      left -15px
      cursor pointer
  .result-list
    height 535px
    overflow auto
</style>
