<template>
  <div class="grid-user-detail">
    <infowindow :map="map" ref="infowindow" :offset="[-105, -70]">
      <div v-if="user" class="grid-user-infowindow">
        <div class="poi-item">
          <p class="name">名称：</p><div class="content">{{user.userLabel}}</div>
        </div>
        <div class="poi-item">
          <p class="name">地址：</p><div class="content">{{user.address}}</div>
        </div>
        <div class="poi-item">
          <p class="name">设备ID：</p><div class="content">{{user.deviceId}}</div>
        </div>
        <div class="poi-item">
          <p class="name">时间：</p><div class="content">{{user.originTime | formatDate }}</div>
        </div>
        <p class="btn-wrap">
          <span @click="detailHandle">详情</span>
        </p>
      </div>
    </infowindow>
  </div>
</template>

<script>
  import Infowindow from '../infowindow/infowindow'
  import { formatDate } from "../../common/js/date"

  export default {
    name: "grid-user-detail",
    props: ['map'],
    data () {
      return {
        user: null
      }
    },
    methods: {
      open (user) {
        this.user = user
        this.$refs.infowindow.setPosition([user.centerLon, user.centerLat])
      },
      close () {
        this.user = null
        this.$refs.infowindow.close()
      },
      closeHandle () {
        this.user = null
        this.$emit('close', true)
      },
      detailHandle () {
        this.$parent.clickDetailHandle(this.user)
        const obj = { type: 'clickGridPerson', target: { id: this.user.id } }
        window.parent.postMessage(obj, '*')
      }
    },
    filters: {
      formatDate (date) {
        if (!date) { return }
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      }
    },
    components: {
      Infowindow
    }
  }
</script>

<style lang="stylus" scoped>
  .grid-user-infowindow
    .poi-item
      display flex
      font-size 12px
      line-height 24px
      &:first-child
        margin-top 10px
      .name
        width 50px
        flex 0 0 50px
        color #606266
        font-weight bold
        text-align left
      .content
        flex 1
        color #606266
        line-height 18px
        padding-top 3px
        text-align left
    .btn-wrap
      display flex
      margin-top 10px
      padding 0 5px
      &>span
        flex 1
        text-align right
        font-size 12px
        color #409EFF
        cursor pointer
        &:hover
          opacity 0.6
          color #3198e2
</style>
