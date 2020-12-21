<template>
  <div class="stat" v-loading="loading">
    <div class="item" v-for="item in statData" :key="item.orgCode">
      <span class="name">{{item.orgName}}</span>
      <span class="value">{{item.count}}</span>
    </div>
  </div>
</template>

<script>
  import { getStatData } from "../../../../api/poi";

  export default {
    name: "stat",
    data () {
      return {
        loading: true,
        statData: []
      }
    },
    computed: {
      currentOrg () {
        return this.$store.state.currentOrg
      },
      currentSubject() {
        return this.$store.state.currentSubject
      }
    },
    created () {
      this._getStatData()
    },
    watch: {
      currentOrg () {
        this._getStatData()
      }
    },
    methods: {
      _getStatData () {
        this.loading = true
        const orgCodes = this.currentOrg.children.map(item => item.orgCode)
        const { id, tableId, typeCode } = this.currentSubject
        const statParam = [{ id, tableId, typeCode }]
        getStatData({ orgCodes, statParam }).then(res => {
          const results = res.data[0].results || []
          this.statData = results.map(item => {
            const orgCode = Object.keys(item)[0]
            const { orgName } = this.currentOrg.children.find(org => org.orgCode === orgCode)
            return { orgCode, orgName, count: item[orgCode] }
          })
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.stat
  margin-top 10px
  font-size 12px
  color #666666
  border-radius 3px
  border 1px solid #dddfe5
  .item
    line-height 40px
    padding 0 10px
    border-bottom 1px solid #dddfe5
    &:last-child
      border-bottom none
    display flex
    justify-content space-between
    .name
      flex 1
    .value
      flex 0 0 70px
      width 70px
      border-left 1px solid #dddfe5
      text-align center
</style>
