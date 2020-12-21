<template>
  <div class="nav-tool">
    <el-popover
        placement="bottom"
        trigger="click">
      <el-radio-group v-model="viewType" @change="changeViewHandle">
        <el-radio label="current">看本级</el-radio>
        <el-radio label="children">看下辖</el-radio>
      </el-radio-group>
      <div class="nav-tool-item" slot="reference">
        <span class="text">视图切换</span>
      </div>
    </el-popover>
    <div @click="clickHandle('camera')" class="nav-tool-item">
      <svg-icon icon-class="camera"></svg-icon>
      <span class="text">摄像头</span>
    </div>
    <div @click="clickHandle('gridUser')" class="nav-tool-item">
      <svg-icon icon-class="griduser"></svg-icon>
      <span class="text">网格员</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "nav-tool",
    data () {
      return {
        viewType: this.$store.state.currentView
      }
    },
    computed: {
      currentView () {
        return this.$store.state.currentView
      }
    },
    methods: {
      clickHandle (name) {
        this.$emit('click', name)
      },
      changeViewHandle (view) {
        this.$store.commit('setCurrentView', view)
      }
    },
    components: {
    }
  }
</script>

<style lang="stylus" scoped>
.nav-tool
  position absolute
  top 24px
  right 30px
  background linear-gradient(180deg,#ff6228, #df2205)
  border-radius 4px
  box-shadow 0 4px 8px 0 rgba(95,26,26,0.36)
  padding 8px 0 10px 0
  .nav-tool-item
    display inline-block
    font-size 12px
    border-left 1px solid rgba(255, 255, 255, 0.5)
    padding 0 18px
    cursor pointer
    user-select none
    &:first-child
      border-left none
    .text
      color #fff
      margin-left 8px
</style>
