<template>
  <div class="org-choose">
    <el-button class="org-btn" size="small" @click="clickOrgButtonHandle">
      <svg-icon icon-class="position-icon" icon-name="position-icon"></svg-icon>
      <span class="text">{{currentOrg.orgName}}</span>
      <i class="el-icon-arrow-down" style="margin-left:5px;margin-right:2px"></i>
    </el-button>
    <div v-show="showTab" class="tab-wrap">
      <el-tabs v-model="activeChild.orgCode" v-loading="loading" type="card" @tab-click="clickTabHandle">
        <el-tab-pane v-for="item in tabList" :key="item.id" :label="item.orgName" :name="item.orgCode">
          <div class="children-wrap">
            <span @click="clickChildHandle(child)" class="child" v-for="child in item.children" :key="child.id">{{child.orgName}}</span>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="buttom-wrap">
        <el-button @click="confirmHandle" size="small" type="primary">确定</el-button>
        <el-button @click="cancelHandle" size="small">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getOrgDetail } from "../../../api/org";
  import { OK } from "../../../api/code";

  const CHINA_ORG_CODE = '1.'

  export default {
    name: 'org-choose',
    props: {
      orgCode: {
        default () {
          return CHINA_ORG_CODE
        }
      }
    },
    data () {
      return {
        showTab: false,
        currentOrg: {}, // button上显示的组织机构，也就是当前的组织机构
        tabList: [],
        activeChild: {}, // tab栏顶部显示的选中的一行
        loading: false
      }
    },
    created () {
      this.init(this.orgCode)
    },
    methods: {
      init (orgCode) {
        getOrgDetail(orgCode).then(res => {
          if (res.code === OK) {
            const org = res.data
            console.log(org,'org---')
            this.currentOrg = org
            this.activeChild = org
            this.tabList.push(org)
            this.$emit('choose', this.currentOrg)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      clickOrgButtonHandle () {
        this.showTab = !this.showTab
      },
      clickTabHandle (tab) {
        const orgCode = tab.name
        const clickIndex = tab.index
        this.tabList.splice(Number(clickIndex) + 1)
        this.activeChild = this.tabList[this.tabList.length - 1]
        getOrgDetail(orgCode).then(res => {
          if (res.code === OK) {
            const clickOrg = res.data
            console.log(clickOrg,'clickOrg')
            this.activeChild.bizId = clickOrg.bizId
            this.$set(this.activeChild, 'children', clickOrg.children)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      clickChildHandle (child) {
        this.loading = true
        getOrgDetail(child.orgCode).then(res => {
          if (res.code === OK) {
            const org = res.data
            this.activeChild = org
            this.tabList.push(org)
            if (!org.children || org.children.length === 0) {
              this.confirmHandle()
            }
          } else {
            this.$message.error(res.msg)
          }
          this.loading = false
        })
      },
      confirmHandle () {
        this.currentOrg = this.activeChild
        this.showTab = false
        this.$emit('choose', this.currentOrg)
      },
      cancelHandle () {
        this.showTab = false
      },
      setOrg (orgCode) {
        this.tabList = []
        getOrgDetail(orgCode).then(res => {
          if (res.code === OK) {
            const org = res.data
            const pathList = this.parsePath(org)
            this.currentOrg = this.activeChild = org
            pathList[pathList.length - 1] = org
            this.tabList = pathList
            this.$emit('choose', this.currentOrg)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      parsePath (org) {
        const orgNameList = org.orgPath.split('->')
        const orgCodeList = org.orgCode.split('.')
        const pathList = []
        orgNameList.forEach((item, index) => {
          const org = {
            orgCode: orgCodeList.slice(0, index + 1).join('.') + '.',
            orgName: item
          }
          pathList.push(org)
        })
        let path = [] // 截取当前登陆者组织机构范围内的路径
        for (let i = 0; i < pathList.length; i++) {
          if (pathList[i].orgCode === this.orgCode) {
            path = pathList.slice(i, pathList.length)
            break
          }
        }
        return path
      }
    },
    components: {
    }
  }
</script>

<style lang="stylus">
  .org-choose
    position relative
    .org-btn
      border none
      color #fff
      font-weight normal
      font-size 14px
      min-width 60px
      height 40px
      background linear-gradient(180deg, #ff6228, #df2205)
      border-radius 4px
      box-shadow: 0 2px 4px 0 rgba(95,26,26,0.36)
      .position-icon
        display inline-block
        vertical-align middle
      .text
        display inline-block
        vertical-align middle
        padding 5px
      &:hover
        color #fff
        font-weight 500
      &:focus
        color #fff
        font-weight normal
  .tab-wrap
      background-color #fff
      width 500px
      position relative
      box-shadow 0 2px 4px 0 #dddfe5x
      border-radius 4px
      .el-tabs__item
        height 36px
        line-height 36px
      .children-wrap
        font-size 13px
        padding 0 10px 15px 10px
        .child
          padding 5px 10px
          cursor pointer
          line-height 28px
          color #666
      .buttom-wrap
        text-align right
        padding 15px 15px 15px 0
        border-top 1px solid #f5f5f5
</style>
