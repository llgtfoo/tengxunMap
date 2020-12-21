<template>
  <div class="grid-map">
    <map-container>
      <map-org-choose></map-org-choose>
      <map-subject></map-subject>
      <nav-tools @click="clickNavToolsHandle"></nav-tools>
      <map-grid-user v-if="showGridUser" @close="showGridUser=false"></map-grid-user>
      <map-camera v-if="showCamera" @close="showCamera=false"></map-camera>
    </map-container>
  </div>
</template>

<script>
  import MapContainer from '../components/tmap/map-container'
  import MapOrgChoose from '../components/tmap/map-org-choose'
  import NavTools from '../components/base/nav-tool'
  import MapGridUser from '../components/tmap/map-grid-user'
  import MapCamera from '../components/tmap/map-camera'
  import MapSubject from '../components/tmap/map-subject'

  export default {
    name: "GridMap",
    data () {
      return {
        showCamera: false,
        showGridUser: false
      }
    },
    created () {
      const mapId = this.$route.params.id
      this.$store.dispatch('getSubject', mapId).then(res => {
        console.log(res)
      })
    },
    methods: {
      clickNavToolsHandle (name) {
        switch (name) {
          case 'camera':
            this.showCamera = true
            break
          case 'gridUser':
            this.showGridUser = true
            break
        }
      }
    },
    components: {
      MapContainer,
      MapOrgChoose,
      NavTools,
      MapGridUser,
      MapCamera,
      MapSubject
    }
  }
</script>

<style lang="stylus" scoped>

</style>
