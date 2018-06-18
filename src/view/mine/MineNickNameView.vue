<template>
  <div class="mine-nick-name-view">
    <el-row class="title-bar">
      <el-row class="title">
        修改昵称
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <div class="content">
      <el-input class="search-input" placeholder="请输入想好的昵称..." size="small" v-model="nickName" clearable>
      </el-input>
      <van-button class="btn-change" size="large" type="primary" @click="changeNickName">修改</van-button>
    </div>
  </div>
</template>

<script>
  import {
    Field
  } from 'vant'
  import * as types from '@/store/types'

  export default {
    name: 'mine-nick-name-view',
    data() {
      // let userInfo = this.$store.getters.getUserInfo
      let userInfo = {}
      return {
        userInfo: userInfo,
        nickName: userInfo.nickName
      }
    },
    components: {
      [Field.name]: Field,
    },
    computed: {},
    watch: {
      nickName(newVal) {
        console.log(newVal)
       
      }
    },
    methods: {
      changeNickName() {
        let nickName = this.nickName
         if (nickName.length > 8) {
          this.$dialog.alert({
            message: '最多可以输入8个字符'
          })
        }
        // this.$api.modifyNickName(this.userInfo.id, this.nickName).then(response => {
        //   this.userInfo.nickName = this.nickName
        //   this.$store.commit(types.REFRESH_USER, this.userInfo)
        //   this.$router.go(-1)
        // })
      },
      back(){
         this.$router.go(-1)        
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "src/style/_vars.scss";
  .mine-nick-name-view {
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
    .content {
      padding: 12px;
      .input {
        padding: 0 12px;
        width: 100%;
        height: 37px;
        border: 1px solid #e5e5e5;
        border-radius: 3px;
        box-sizing: border-box;
      }
      .btn-change {
        height: 37px;
        line-height: 37px;
        margin-top: 27px;
        text-align: center;
        background: $main-color;
        border: none;
      }
    }
  }

</style>
