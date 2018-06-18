<template>
  <div class="feed-back-view">
    <el-row class="title-bar">
      <el-row class="title">
        意见反馈
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <div class="advice">
      <textarea ref="adviceInput" class="input" placeholder="用的不爽？有好的想法？请大声说出来……"></textarea>
    </div>
    <div class="button-contain">
      <van-button class="submit-btn" type="primary" size="large" v-on:click="submitFeedback">提交</van-button>
    </div>

  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    Dialog,
    Toast
  } from 'vant'

  export default {
    name: 'feed-back-view',
    components: {},
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo'
      })
    },
    methods: {
      back(){
        this.$router.replace({
          name:'FilmView'
        })
      },
      submitFeedback() {
        console.log(this.userInfo)
        let adviceContent = this.$refs.adviceInput.value
        if (adviceContent) {
          Toast.loading(indeterminateLoading)
          this.$api.userFeedback(this.userInfo.nickName, adviceContent).then(response => {
            Toast.clear()
            Dialog.alert({
              message: '提交成功，感谢您的反馈'
            })
          }).catch(error => {
            Toast.clear()
            Dialog.alert({
              message: error.message
            })
          })
        } else {
          Dialog.alert({
            message: '内容不能为空'
          })
        }
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "src/style/_vars.scss";

  .feed-back-view {
    .title-bar {
      line-height: 52px;
      background: $base-view-color;
      border-bottom: 1px solid $border-color;
      .title {
        color: $main-color;
        font-size: 18px;
        text-align: center;
      }
      .left {
        position: absolute;
        top: 0;
        left: 18px;
      }
    }
    .advice {
      padding: 16px;
      .input {
        padding: 8px;
        width: 100%;
        height: 180px;
        font-size: 13px;
        border: 1px solid red;
        box-sizing: border-box;
      }
    }
    .button-contain {
      padding: 0 16px;
      .submit-btn {
        background: $main-color;
        border: none;
      }
    }
  }
</style>
