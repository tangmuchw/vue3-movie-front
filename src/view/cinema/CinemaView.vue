<template>
  <div class="cinema">
    <el-row class="title-bar">
      <el-row class="title">
        影院详情
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <!-- <el-row class="query-box">
      <el-input class="search-input" placeholder="请输入搜索内容" size="small" v-model="filterCinema" clearable>
      </el-input>
    </el-row> -->
    <!-- <el-row class="list" v-if='cinemaList.length != 0'>
      <el-row plain="true" class="item-wrapper" v-for="(item ,index) in cinemaList" :key="index" :class="{'item-border-bottom': ++index < cinemaList.length ? true : false,'touch-active': index == isTouchedIndex}"
        @click.native="goHome(item.cinemaId, item.cinemaName,index)" @touchstart.native="touchstartChange(index)" @touchend.native="touchendChange(index)">
        <el-row class="list-item">
          <el-row class="cinema-name text-cut">
            {{item.cinemaName}}
          </el-row>
          <el-row class="address text-cut">
            <i class="el-icon-location-outline"></i> {{item.address}}
          </el-row>
          <el-row class="selected-icon" v-if="cinemaInfo !=null? cinemaInfo.id == item._id: 0">
            <img src="../../assets/list_selected_icon.png">
          </el-row>
        </el-row>
      </el-row>
    </el-row> -->
    <el-row class="list" v-if="cinemaList != ''">
      <el-row plain="true" class="item-wrapper">
        <el-row class="list-item">
          <el-row class="cinema-name text-cut">
            {{cinemaList.cinemaName}}
          </el-row>
          <el-row class="address text-cut">
            <i class="el-icon-location-outline"></i> {{cinemaList.address}}
          </el-row>
          <van-row class="detail-box">
            <van-row class="left-title">
              影院介绍：
            </van-row>
            <van-row class="right-text">
              {{cinemaList.cinemaBrief}}
            </van-row>
          </van-row>
        </el-row>
      </el-row>
    </el-row>
    <el-row class="no-List" v-else>
      {{tipsStatement}}
    </el-row>
  </div>
</template>

<script>
  import {
    cinemaMockData
  } from '@/config/mock'
  import * as types from '@/store/types'
  import {
    mapGetters
  } from 'vuex'

  var saveCinemaList = cinemaMockData //保存影院列表
  export default {
    data() {
      return {
        filterCinema: '',
        cinemaList: [],
        tipsStatement: '服务器有点小脾气~',
        isTouchedIndex: ''
      };
    },
    components: {},
    computed: {
      ...mapGetters({
        cinemaInfo: 'getCinemaInfo'
      })
    },
    watch: {
      filterCinema(newVal) {
        if (saveCinemaList.length != 0) {
          this.queryFilterCinemas(newVal)
        }
      }
    },
    mounted() {
      // this.getCinemas()
      this.cinemaList = cinemaMockData
      this.getCinemas()
    },
    methods: {
      back() {
        this.$router.push({
          name: 'FilmView'
        })
      },
      goHome(cinemaId, cinemaName) {
        // this.$store.commit(types.SET_CINEMA_INFO, {
        //   id: cinemaId,
        //   name: cinemaName
        // })
        // this.$router.push({
        //   name: 'FilmView',
        // })
      },
      getCinemas() {
        let _this = this
        let cinemaId = this.cinemaInfo.id
        this.$api.getCinemaDetail(cinemaId).then(res => {
          console.log(res)
          let data = res.data
          if (res.status == 200) {
            _this.cinemaList = data
          } else {
            _this.cinemaList = ''
          }
          saveCinemaList = data
        }).catch(error => {
          console.log(error)
        })
      },
      queryFilterCinemas(filterCinemaName) {
        let showCinemaListTemp = saveCinemaList
        let showCinemaList = showCinemaListTemp.filter((value) => {
          return (value.cinemaName.indexOf(filterCinemaName) > -1)
        })
        this.cinemaList = showCinemaList
        if (this.cinemaList.length == 0) {
          this.tipsStatement = '很抱歉，你所查询的影院被外星人占领了，请重新查询！'
        }
      },
      touchstartChange(index) {
        this.isTouchedIndex = index
      },
      touchendChange(index) {
        this.isTouchedIndex = -1
      }
    }
  }

</script>
<style lang='scss' scoped>
  @import 'src/style/_vars.scss';
  .cinema {
    .title-bar {
      line-height: 52px;
      background: $nav-bar-color;
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
    .query-box {
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: center;
      .search-input {
        width: 250px;
      }
    }
    .list {
      margin-top: 10px;
      .item-wrapper {

        .list-item {
          padding: 15px 0;
          position: relative;
          border-bottom: 1px solid $dark-color;
          margin: 0 15px;
          .detail-box {
            height: 15px;
            margin-top: 7px;
            font-size: 13px;
            .left-title {
              color: $text-tips-color;
            }
            .right-text {
              color: $text-color;
              margin: 5px 0 0 0;
              .seats-select-detail {
                .split-line-italic {
                  color: #cfcfcf;
                }
              }
            }
          }
          .text-cut {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .cinema-name {
            font-size: 16px;
            height: 18px;
            line-height: 18px;
            color: $text-color;
            max-width: 15em;
          }
          .address {
            line-height: 17px;
            max-width: 15em;
            font-size: 14px;
            height: 17px;
            color: $text-tips-color;
            margin-top: 5px
          }
          .selected-icon {
            position: absolute;
            right: 45px;
            z-index: 2;
            width: 20px;
            height: 20px;
            margin-top: -32px;
            img {
              max-width: 100%;
              height: auto;
            }
          }
        }

      }
      .item-wrapper:last-child .list-item {
        border-bottom: 0;
      }
    }
    .touch-active {
      background: $bg-color;
    }
    .no-List {
      padding-top: 118px;
      font-size: 14px;
      text-align: center;
      color: $text-tips-color;
    }
  }

</style>
