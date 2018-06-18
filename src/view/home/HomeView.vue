<template>
  <div class="home-view">
    <!-- <cinema-select></cinema-select> -->
    <el-row class="header">
      <header-nav></header-nav>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
  import HeaderNav from '@/components/HeaderBar'

  export default {
    name: 'Home',
    data() {
      return {};
    },

    components: {
      HeaderNav
    },

    computed: {},

    // mounted: {},

    methods: {}
  }

</script>
<style lang='scss' scoped>
  .home-view {
    width: 100%;
    overflow: hidden;
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
    }
  }

</style>
