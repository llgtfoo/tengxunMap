<template>
  <div class="map-container">
    <div id="container"></div>
    <div v-if="ready" class="slot-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "map-container",
    provide () {
      return {
        getMap: () => this.tmap
      }
    },
    data () {
      return {
        ready: false
      }
    },
    created () {
      this.tmap = null
    },
    mounted () {
      this.initMap()
    },
    methods: {
      initMap () {
        this.tmap = new TMap.Map("container", {
          pitch: 0,
          zoom: 12,
          center: new TMap.LatLng(39.984104, 116.307503),
          showControl: false
        });
        this.ready = true
      }
    }
  }
</script>

<style lang="stylus" scoped>
.map-container
  #container
    width 100vw
    height 100vh
    z-index 0
  .slot-wrapper
    position absolute
    top 0
    left 0
    width 100%
</style>
