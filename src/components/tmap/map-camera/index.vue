<template>
  <div class="map-camera">
    <div v-drag="'#top'" class="camera-list-wrap" :class="{hide: hide}">
      <div class="top" id="top">
        <p class="text">摄像头</p>
        <i @click="hideHandle" class="el-icon-minus"></i>
        <i @click="closeHandle" class="el-icon-close"></i>
      </div>
      <camera-list></camera-list>
    </div>
  </div>
</template>

<script>
  import CameraList from './camera-list'
  export default {
    name: "map-camera",
    data () {
      return {
        hide: false
      }
    },
    methods: {
      hideHandle () {
        this.hide = !this.hide
      },
      closeHandle () {
        this.$emit('close')
      }
    },
    components: {
      CameraList
    }
  }
</script>

<style lang="stylus" scoped>
  .map-camera
    .camera-list-wrap
      width 342px
      height 590px
      position absolute
      overflow hidden
      right 30px
      top 80px
      background-color #fff
      border-radius 4px
      box-shadow 0 2px 4px rgba(0, 0, 0, 0.12)
      transition height 0.2s
      &.hide
        height 40px
        overflow hidden
      .top
        position relative
        background-color #fff
        padding 0 15px
        margin-bottom 3px
        height 40px
        line-height 40px
        border-top-left-radius 4px
        border-top-right-radius 4px
        display flex
        color #fff
        user-select none
        border-bottom 1px solid #ececec
        cursor move
        .text
          margin 0
          padding 0
          color #333333
        .el-icon-close, .el-icon-minus
          position absolute
          top 12px
          cursor pointer
          color #999999
        .el-icon-close
          right 15px
        .el-icon-minus
          right 40px
</style>
