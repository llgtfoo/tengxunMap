<template>
  <div class="camera-play-contaner">
    <play-video :video="item" v-for="item in list"
                :style-obj="videoStyle"
                :fullscreen="list.length === 1"
                :key="item.id"></play-video>
  </div>
</template>

<script>
  import PlayVideo from '../../base/play-video'
  export default {
    name: "camera-play-contaner",
    props: {
      list: {
        default() {
          return [];
        }
      }
    },
    computed: {
      videoStyle () {
        if (this.list.length === 0) {
          return {
            width: 0,
            height: 0
          }
        }
        if (this.list.length > 1) {
          return {
            width: '320px',
            height: '180px'
          }
        }
        return {
          width: '640px',
          height: '360px'
        }
      }
    },
    components: {
      PlayVideo
    }
  }
</script>

<style lang="stylus" scoped>
.camera-play-contaner
  position relative
</style>
