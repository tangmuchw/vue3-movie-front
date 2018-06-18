<template>
  <div class="header-bar">
    <el-row class="drop-down">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <a href="#">{{loginName}}</a>
          <i class="el-icon-setting el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="LoginView" v-if="userInfo == null">登录</el-dropdown-item>
          <el-dropdown-item command="RegisterView" v-if="userInfo == null">注册</el-dropdown-item>
          <el-dropdown-item command="MineOrderView" v-if="userInfo != null">我的订单</el-dropdown-item>
          <!-- <el-dropdown-item command="MineSettingView" v-if="userInfo  != null">设置</el-dropdown-item> -->
          <!-- <el-dropdown-item command="FeedBackView" v-if="userInfo != null">意见反馈</el-dropdown-item> -->
          <el-dropdown-item command="LogOut" v-if="userInfo != null">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <el-row class="cinema-name">
      <el-row class="location-box">
        <el-col class="location-cont" @click.native="relocation">
          <el-col class="mall-name">
            {{cinemaName}}
          </el-col>
        </el-col>
      </el-row>
    </el-row>
    <!--    
    <el-row class="list">
        <span class="talion" @click="showTalion"></span>
      </el-row> -->
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import * as types from '@/store/types'

  export default {
    name: 'header-bar',
    data() {
      return {
        cinemaName: '上海嘉定宝龙横店电影城',
        loginName: '请登录...'
      }
    },
    computed: {
      ...mapGetters({
        cinemaInfo: 'getCinemaInfo',
        userInfo: 'getUserInfo'
      }),
    },
    wacth: {

    },
    mounted() {
      this.cinemaName = this.cinemaInfo.name
      let userInfo = this.userInfo
      if (userInfo == null) {
        this.loginName = '请登录..'
      } else {
        this.loginName = userInfo.name
      }
    },
    methods: {
      showTalion: function () {
        this.$emit('showTalion')
      },
      relocation() {
        this.$router.replace({
          name: 'CinemaView'
        })
      },
      handleCommand(command) {
        console.log('command---', command)
        if (command == 'LogOut') {
          this.$store.commit(types.LOGOUT)
          this.loginName = '请登录..'
        } else {
          this.$router.push({
            name: command
          })
        }

      }
    }
  }

</script>

<style lang="scss" scoped>
  @import 'src/style/_vars.scss';

  .header-bar {
    width: 100%;
    padding: 0 15px;
    background: $base-view-color;
    border-bottom: 1px solid $main-color;
    padding: 15px 0;
    position: relative;
    .title {
      position: absolute;
      left: 12px;
      top: 12px;
      line-height: 20px;
      height: 60px;
      font-size: 20px;
      color: $main-color;
      word-break: break-all;
      float: left;
      a {
        color: $main-color;
        font-size: 20px;
      }
    }
    .cinema-name {
      width: 100%; // height: 60px;
      .location-box {
        display: flex;
        justify-content: center;
        align-items: center;
        .location-cont {
          max-width: 12em;
          height: 26px;
          line-height: 24px;
          border: 1px solid $main-color;
          border-radius: 26px;
          font-size: 16px;
          padding: 0 26px;
          background: url("../assets/home/title_location@3x.png") 5% center no-repeat;
          background-size: 14px;
          .mall-name {
            padding-left: 5px;
            color: $main-color;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 12em;
          }
        }
      }
    }
    .drop-down {
      position: absolute;
      z-index: 100;
      right: 15px;
      bottom: 10px;
      .el-dropdown-link {
        font-size: 14px;
        color: $text-color;
      }
    }
    .talion {
      font-size: 0;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABACAYAAACA2YBxAAAABGdBTUEAALGPC/xhBQAABu1JREFUeAHtW2mIHEUU/mp2N4nKxitoUFQ8UGPceJ9LVtfNbnY2hiAaEF2DGBEU9IcYxB/+kiiKFyoYMCDBO2I0HruzR1xMNMQkokFjNEbMeq145HAl7iY7037V7Uz6qOqenpnG6bEfNF31qup11TevX796r0agBwZqgbogqmkZqWqaTC3NJQE2ol8zATYBNiIEIhKbaGxEwCZiEwQSBBIEEgQSBBIEEgQSBCJFoKoCF5Gt1EAd+nAM5R+FHMZwCH5CK+8RUm0C24czCWCauHXxmsX43TTe7ZuhLGNhX5H3Ga9PCPtr6MDPLFeMagdYg1BlcB1BvJ/oNIVCSGCC/d8m9MsI8CAllR1KrQ1g+6idWTxCcM4OBaiqs8AHhHUxdf1bVXOxvHgDO4R6WsqHCMQ9xS64yH77qLX3oRNPl6q98QV2EMdiP94gUM1FghW+m8ALBPdmgpsLOziewPZgKhe7lpp6TtgFl9D/ZRqaRXxeNszY+v885xU2V9WDyVzk6kBQBcYJxBr27eF9E+8jmITd5DZS/5r4oTqXMhbwujwAsBv4UZSgLgro52iWjy37C+iQGLYSFtheLOeMF/s8Zj9BXE4QH0Qb/dUg6qU7BnoSBj0KPxK4iZr7ol8Xe1u8gM1gNrVtrX0BjrLAd9TEhZhL3zQsZXAtZS/jMOnzqmgPmU30Fn5UNbp5dqfZ3VZddekBGHhWOymBjZiC80sCVQrt5IewAS0s/aJ5xhHk65/vGhQfYMdwC4Gd6Zp/vrqdoM7jNlVqVenUjm00I1fy2qsRcjVN51maNgc7PsBCY1flrqmOr3ErfnesrNRKGl8T2Du1wwXu0rbZGuLhbmWoqTl8YZv3waLAo/yoLDnIqFCpx/QmZLzBTfsYxDk+6O2Ih8YauNG9OrMuXSrBnVc09LBG7KF86hWatgI7HsACFxVm7Cys5kdnl5NVoVoXYwbA50ppBi5V8m3MuAArfU0VvaliVownMKCRVQPAypiAYQapvWusxxYvs6KcDRppuh+60L36NXZC47DLmOkcbC+sJIqCgR1KsQaduwCqfmD9gh9+bQELL6q5wQyAq7rWq5h2XnyBlRkDeUVJOT5BTTUAbB2jrjoaxAm6pgrxT1PKEfhLybcxq19jr8IP1Ev1Qg7gYttaKl/MmpEvr1yDW98Aqn5grej9ZuU6BPc/UZLgnk5FKWxVse286gfWmu0m+6Rt5W58yMB1FDSAGbSwan81h4+CHhkPYAX6lQsxmKIZxa3KtnKZE7hXKUIGfVJ4S9lmY0b7VbU9qKyidWZgGzXoDIWcUdrgWXxpdyraSmP5BdQFz9SkuZEOoHjkvKRjlWEq2sAzivU0kr8Cm7lduBAHFO3hWEOYzpT6Cp9BT/i0FZriYQrkdCdzsQJ/FGbuLLTgN2YAtjLTVQ4N4HD8jV7+UCcrxQha9DQ1tgiKD7CtdLkE7tCuycB8fM8Yaj+O0/bxa8gwlT5BvQezt2rK0baq7a6if3yAlZPvxEqC+6piHRbLYF42iy+pc7cVrb3rcCT7P0At3cBLvSGwpC9lPm299tmuhnhlaeXkM+ZRzE9ZOtG1FmdV0DjAtJUZhky2OFI3gziaP4DM+Eo/9XoCOtU52FP7mD2b+aMWfWgjfsDKNffRBmYxxNJJHgh0DMs+jxPEaewS1hbvZo74Ep5E/EYn3s2Ph7vlnrWsryGo43ifpVNUzRXnCSYZp3DDUGQmOF421o5WG4apRbP5eqo3D/a+lShLH3oMr/M9CYxsycfFF1g5e3kKO81PSopnDlDmmQIpz6LRfMFzl6H1cTzl4SsY8QY2v6BOPM+U9AwCvJQaPJJnh7rLcQJ3Mwk0nXe955HD7XTq9OcO/n1ofG2sDjXrMPJ8Ni/kdR4/Vqfz7lUguZuTqRfrOOhKar48mWh99YdoTcfMk926sKT8D8M8jtFuFmoPWDfg66nLe3mE3qAmpugNCPzJLrtY3oF27VEi0JbKre1GjlMH0+UxpHpcRhnK2GztA+sGOky9n7uwLLexBg5TDhP8n0ID3bA53q229xVRSvifMjv4d6UUuqnl6tyXgVOZOFrFjXCDG6EEWDci7vpcxl4N/tFDTy08jifP1TooMQUOOHwqPeb2WH9cPsV/7nTisbyEBNg8EkF3GZIcNnd6zZquOR4nXUCv+l3ZnpgCDUoe9kwzDX8N7e1OT5vFSDGo8wpPezXJaqKxGpS07D66blkzfNio6TNM3b4gAVaDji+7l3/xMPAO+6jf+BSerPMVkDSqEXiJ4cNu5odBi6qmSWrE1Z0Trh2BNGRS8Tk7y1YeSUyBDY3QRbkx+BXvcVx7Yax17qAtAbaASIkFK+izhKM7aHf30Oo+Tn923T/4y2eW0vj+TQAAAABJRU5ErkJggg==) no-repeat;
      background-size: cover;
      width: 30px;
      height: 22px;
    }
  }

</style>
