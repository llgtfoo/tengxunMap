<template>
  <div class="search-input">
    <el-input v-model="keyword" clearable @keyup.enter.native="searchHandle"
              placeholder="搜索名称、姓名、地址"
              class="poi-input"
              @focus="focusHandle"
              @clear="clearHandle"
              size="large"
              style="width: 100%">
      <el-button slot="append" @click="searchHandle" icon="el-icon-search"></el-button>
    </el-input>
  </div>
</template>

<script>
  export default {
    name: "search-input",
    data () {
      return {
        keyword: ''
      }
    },
    methods: {
      searchHandle () {
        this.$emit('search', this.keyword)
      },
      focusHandle () {
        this.$emit('focus')
      },
      clearHandle () {}
    }
  }
</script>

<style lang="stylus">
@import "../../../styl/mixins.styl"
.search-input
  .el-input.poi-input
    vertical-align top
    input
      border none
      box-shadow 0px 2px 4px 0px #dddfe5
    .el-input-group__append,.el-input-group__prepend
      border none
      .preblock
        cursor pointer
        user-select none
        .text
          display inline-block
          width 60px
          vertical-align middle
          no-wrap()
        i
          position absolute
          right 10px
          top 12px
        &:after
          content ''
          border-right 1px solid #C1C4CB
          margin-left 20px
          position relative
          top 1px
    .el-input-group__prepend
      background-color #fff
      padding 0
      .preblock
        .text
          padding-left 20px
    .el-input-group__append
      background linear-gradient(180deg,#df2205, #ff6228)
      .el-button
        .el-icon-search
          color #fff
    .el-input__inner
      padding 0 30px 0 10px
</style>
