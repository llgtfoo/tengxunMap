<template>
  <div class="play-video">
    <p class="name">{{video.name}}</p>
    <section
        :id="'video-'+video.id"
        :style="styleObj"
        class="chimee-container">
    </section>
  </div>
</template>

<script>
  import 'chimee-player/lib/chimee-player.min.css'
  import ChimeePlayer from 'chimee-player'

  export default {
    name: "play-video",
    props: ['video', 'styleObj', 'fullscreen'],
    data () {
      return {
        loading: true,
        loadError: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.player = this.initPlayer()
        if (this.fullscreen) {
          this.player.$fullscreen(true)
        }
        this.addEventListener()
      })
    },
    beforeDestroy () {
      this.player.destroy()
    },
    methods: {
      initPlayer () {
        return new ChimeePlayer({
          wrapper: `#video-${this.video.id}`,
          src: this.video.url,
          box: 'hls',
          isLive: true,
          autoplay: true
        })
      },
      addEventListener () {
        this.player.on('play', () => {
          this.loading = false
        })
        this.player.on('error', () => {
          this.loading = false
          this.loadError = true
          console.log('视频加载出错', this.video)
        })
        this.player.on('dblclick', () => {
          this.player.$fullscreen(!this.player.isFullscreen)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.play-video
  display inline-block
  vertical-align top
  margin 20px
  .name
    font-size 16px
    font-weight bold
    margin-bottom 5px
  .chimee-container
    position relative
    border-radius 4px
    overflow hidden
</style>
