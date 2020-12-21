<template>
  <div class="stat-and-poi-panel" :class="{hide: hide}">
    <div class="top">
      <span class="go-back" @click="goBackHandle">
        <i class="el-icon-arrow-left"></i>
      </span>
      <span class="subject-name">{{currentSubject.name}}</span>
      <span class="change-btn">
        <svg-icon :icon-class="currentTab==='stat' ? 'stat-active' : 'stat'"
                  class-name="stat-icon"
                  @click.native="currentTab='stat'" />
        <svg-icon :icon-class="currentTab==='poi' ? 'list-active' : 'list'"
                  class-name="list-icon"
                  @click.native="currentTab='poi'" />
      </span>
      <i @click="hide=!hide" class="el-icon-minus"></i>
      <i @click="closeHandle" class="el-icon-close"></i>
    </div>
    <div class="panel-container">
      <stat v-if="currentTab==='stat'"></stat>
      <map-poi v-if="currentTab==='poi'" :subjects="[currentSubject]"></map-poi>
    </div>
  </div>
</template>

<script>
  import Stat from './stat'
  import MapPoi from '../../map-poi'

  export default {
    name: "stat-and-poi",
    data () {
      return {
        hide: false,
        currentTab: 'stat'
      }
    },
    computed: {
      currentSubject () {
        return this.$store.state.currentSubject
      }
    },
    methods: {
      closeHandle () {
        this.$emit('close')
        this.$store.commit('setCurrentSubject', null)
      },
      goBackHandle () {
        this.$emit('back')
        this.$store.commit('setCurrentSubject', null)
      }
    },
    components: {
      Stat,
      MapPoi
    }
  }
</script>

<style lang="stylus" scoped>
.stat-and-poi-panel
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
      .text
        font-size 14px
        vertical-align top
    .subject-name
      font-size 13px
      vertical-align top
    .change-btn
      font-size 12px
      vertical-align top
      margin-right 20px
      .stat-icon,.list-icon
        margin-left 10px
        cursor pointer
  .panel-container
    height 535px
    overflow-y auto
    overflow-x hidden
</style>
