<template>
  <div class="wait-status">
    <van-row class="detail-cont">
      <van-row class="status-box">
        <img :src="loadingPicSrc" class="no-pic">
      </van-row>
      <van-row class="no-tips-reason">
        {{sentence}}
      </van-row>
    </van-row>
  </div>
</template>

<script>

  export default {
    props: {
      title: String,
      loadingPicSrc: String
    },
    data() {
      return {
        sentence: this.title
      }
    },
    components: {}
  }
</script>

<style scoped lang='scss'>
     @import 'src/style/_vars.scss';

  .wait-status {
    .detail-cont {
      .status-box {
        width: 158px;
        /*margin-top:22px;*/
        margin: 0 auto;
        .no-pic {
          max-width: 100%;
          height: auto;
        }
      }
      .no-tips-reason {
        width: 100%;
        font-size: 16px;
        margin-top: 10px;
        text-align: center;
        color: #666;
      }
    }
  }
</style>
