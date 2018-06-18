<template>
  <div class="mine-setting-view">
    <el-row class="title-bar">
      <el-row class="title">
        用户信息
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <van-cell-group>
      <van-cell class="id" title="用户ID" v-bind:value="userInfo.accountId"></van-cell>
      <van-cell class="avatar" is-link>
        <template slot="title">
          <span class="van-cell-text">头像</span>
          <div class="rounder">
            <van-uploader :after-read="onReadUploadFace">
              <img class="avatar" :src='userAvatar' />
            </van-uploader>
          </div>
        </template>
      </van-cell>
      <van-cell class="nickname" title="昵称" v-bind:value="userInfo.nickName" is-link @click="goEditUserNickName"></van-cell>
      <van-cell class="sex" title="性别" v-bind:value="sexString" is-link @click="showSexPicker"></van-cell>
      <van-cell class="birthday" title="年龄" v-bind:value="birthdayDateString" is-link @click="showBirthdayPicker"></van-cell>
    </van-cell-group>
    <van-popup class="popup" v-model="showPickerEnable" position="bottom" :overlay="true">
      <van-datetime-picker class="birthday-date-picker" v-if="popupContentType === 'birthday'" v-model="startDateForBirthDayPicker"
        type="date" :min-hour="birthdayDatePickerConfig.minHour" :max-hour="birthdayDatePickerConfig.maxHour" :min-date="birthdayDatePickerConfig.minDate"
        :max-date="birthdayDatePickerConfig.maxDate" v-on:confirm="confirmBirthdayDate" v-on:cancel="cancelBirthdayPicker"></van-datetime-picker>
      <van-picker class="sex-picker" v-else-if="popupContentType === 'sex'" show-toolbar :columns="sexPickerConfig.sexItems" @cancel="cancelSexPicker"
        @confirm="confirmSexPicker"></van-picker>

    </van-popup>
  </div>
</template>

<script>
  //   import {
  //     Cell,
  //     CellGroup,
  //     DatetimePicker,
  //     Picker,
  //     Popup
  //   } from 'vant'
  import * as types from '@/store/types'
  import {
    formatDate
  } from '@/config/utils'
  import {
    userInfoMockData
  } from '@/config/mock'

  export default {
    name: 'mine-setting-view',
    data() {
      //   let userInfo = this.$store.getters.getUserInfo
      let userInfoMock = userInfoMockData
      return {
        userInfo: userInfoMock,
        startDateForBirthDayPicker: this.getDateForBirthDayPicker(userInfoMock),
        showPickerEnable: false,
        popupContentType: null,
        birthdayDatePickerConfig: {
          birthdayDate: new Date(),
          minHour: 0,
          maxHour: 23,
          minDate: new Date(1960, 1, 1),
          maxDate: new Date()
        },
        sexPickerConfig: {
          sexItems: [{
            text: '男'
          }, {
            text: '女'
          }]
        },
        birthdayDateString: userInfoMock.age,
        sexString: userInfoMock.sex,
        userAvatar: userInfoMock != null ? userInfoMock.face : 'static/img/user/default_avatar.png'
      }
    },
    components: {
      //   [Cell.name]: Cell,
      //   [CellGroup.name]: CellGroup,
      //   [DatetimePicker.name]: DatetimePicker,
      //   [Popup.name]: Popup,
      //   [Picker.name]: Picker
    },

    computed: {},
    methods: {
      back() {
        this.$router.replace({
          name: 'FilmView'
        })
      },
      onReadUploadFace(file) {
        console.log(file.content)
      },
      showBirthdayPicker() {
        this.popupContentType = 'birthday'
        this.showPickerEnable = true
      },
      confirmBirthdayDate(date) {
        this.birthdayDatePickerConfig.birthdayDate = date
        let dateStr = formatDate(date, 'yyyy-MM-dd')
        let now = new Date()
        let nowYear = now.getFullYear()
        let age = parseInt(nowYear) - parseInt(dateStr.substr(0, 4))
        this.showPickerEnable = false
        this.birthdayDateString = age
      },

      cancelBirthdayPicker() {
        this.showPickerEnable = false
      },
      showSexPicker() {
        this.popupContentType = 'sex'
        this.showPickerEnable = true
      },
      confirmSexPicker(value, index) {
        console.log(`Value: ${value.text}, Index: ${index}`)
        this.showPickerEnable = false
        this.sexString = value.text
      },
      cancelSexPicker() {
        this.showPickerEnable = false
      },
      goEditUserNickName() {
        this.$router.push({
          name: 'MineNickNameView'
        })
      },
      getDateForBirthDayPicker(userInfo) {
        if (!userInfo || !userInfo.age) {
          let date = new Date()
          date.setFullYear(date.getFullYear() - 18)
          return date
        }
        let date = new Date()
        date.setFullYear(date.getFullYear() - userInfo.age)
        return date
      },
      imageInputChange(e) {
        console.log(e)
        let selectedFiles = e.target.files
        if (selectedFiles.length > 1) {
          console.log('much selected')
        }
      }
    }
  }

</script>
<style scoped lang="scss">
  @import 'src/style/_vars.scss';

  .mine-setting-view {
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
    .rounder {
      height: 20px;
      width: 20px;
      display: inline;
      border-radius: 50%;
      overflow: hidden;
      float: right;
      margin-right: 14px;
      .avatar {
        height: 20px;
        width: 20px;
      }
      .imageInput {
        display: none;
      }
    }
    .popup {
      .birthday-date-picker {
        font-size: 17px;
      }
      .sex-picker {
        font-size: 17px;
      }
    }
  }

</style>
