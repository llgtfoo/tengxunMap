<template>
  <div class="map-grid-user">
    <div v-drag="'#top'" class="grid-user-list-wrap" :class="{hide: hide}">
      <div class="top" id="top">
        <p class="text">
          网格员 <span v-if="showTaskList"> {{currentUser.userLabel}}</span>
        </p>
        <i @click="hideHandle" class="el-icon-minus"></i>
        <i @click="closeHandle" class="el-icon-close"></i>
      </div>
      <grid-user-list v-if="!showTaskList"
                      ref="grid-user-list"
                      @click-track-btn="openTrackListPanel"></grid-user-list>
      <transition name="child-slip">
        <grid-task-list
            v-if="showTaskList"
            :user="currentUser"
            @back="backHandle"
        ></grid-task-list>
      </transition>
    </div>
  </div>
</template>

<script>
  import GridTaskList from './grid-task-list'
  import GridUserList from './grid-user-list'
  export default {
    name: "map-grid-user",
    data () {
      return {
        hide: false,
        showTaskList: false,
        currentUser: null
      }
    },
    methods: {
      hideHandle () {
        this.hide = !this.hide
      },
      closeHandle () {
        this.$emit('close')
      },
      openTrackListPanel (row) {
        this.currentUser = row
        this.showTaskList = true
      },
      backHandle () {
        this.currentUser = null
        this.showTaskList = false
      }
    },
    components: {
      GridTaskList,
      GridUserList,
      // GridUserDetail
    }
  }
</script>

<style lang="stylus" scoped>
.map-grid-user
  .grid-user-list-wrap
    width 348px
    height 560px
    position absolute
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
    .grid-user-list
      position relative
      overflow hidden
    .child-slip-enter-active, .child-slip-leave-active
      transition all 0.2s linear
      transform translate(0, 0, 0)
    .child-slip-enter, .child-slip-leave-to
      transform translate3d(100%, 0, 0)
</style>
