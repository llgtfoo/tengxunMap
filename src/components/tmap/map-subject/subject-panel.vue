<template>
  <div v-loading="loading" class="subject-panel" :class="{hide: hide}">
    <div class="top">
      <i @click="hideHandle" class="el-icon-minus"></i>
      <i @click="closeHandle" class="el-icon-close"></i>
    </div>
    <div class="subject-category" v-for="category in subjects"
         :title="category.name"
         :name="category.id"
         :key="category.id">
      <p class="category-name">{{category.name}}</p>
      <div class="subject" v-for="subject in category.children"
           :class="{active: subject.id === currentSubject.id}"
           @click="clickSubjectHandle(subject)"
           :key="subject.id">
        <img class="subject-image" width="48" height="48" :src="subject.imageUrl">
        <p class="subject-name">{{subject.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSubject } from "../../../api/subject";

  export default {
    name: "subject-panel",
    data () {
      return {
        subjects: [],
        hide: false,
        loading: true
      }
    },
    computed: {
      currentSubject () {
        return this.$store.state.currentSubject || {}
      }
    },
    created () {
      this.getSubject()
    },
    methods: {
      getSubject () {
        this.loading = true
        getSubject(this.$route.params.id).then(res => {
          this.subjects = res.data || []
        }).finally(() => {
          this.loading = false
        })
      },
      clickSubjectHandle (subject) {
        this.$store.commit('setCurrentSubject', subject)
      },
      hideHandle () {
        this.hide = !this.hide
      },
      closeHandle () {
        this.$store.commit('setCurrentSubject', null)
        this.$emit('close')
      }
    }
  }
</script>

<style lang="stylus" scoped>
.subject-panel
  margin-top 8px
  height 560px
  overflow auto
  background-color #fff
  border-radius 4px
  padding 12px 12px 12px 0
  box-shadow 0 2px 12px 0 rgba(0,0,0,0.1)
  transition height 0.2s
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
    i
      color #666
      margin-left 10px
      cursor pointer
  .subject-category
    font-size 12px
    color #333333
    font-weight 400
    margin-bottom 16px
    .category-name
      padding 2px 14px 14px 0
      margin-left 12px
      color #666
      font-weight bold
      border-bottom 1px solid #ececec
    .subject
      width 98px
      height 70px
      margin-top 12px
      margin-left 12px
      text-align center
      display inline-block
      cursor pointer
      padding-top 5px
      border-radius 1px
      &.active
        background-color #f5f7fd
      .subject-name
        padding-top 3px
</style>
