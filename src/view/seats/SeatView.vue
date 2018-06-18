<template>
  <div class="seat-view">
    <el-row class="title-bar">
      <el-row class="title">
        {{titleName}}
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <el-row class="film-detail">
      <el-row class="film-name">
        {{filmNameForSeat}}
      </el-row>
      <el-row class="plan-message">
        <van-col class="detail-date">{{planMessage.detailDate}}</van-col>
        <van-col class="detail-date">{{planMessage.startTime}}</van-col>
        <van-col class="detail-date">{{planMessage.screenName}}</van-col>
      </el-row>
    </el-row>
    <div class="info-padding"></div>
    <van-row class="central-screen-box">
      <van-row class="screen-location">
        银幕中央
      </van-row>
    </van-row>
    <van-row class="seats-map" v-if="seatsItem.length != 0">

      <!--座位图-->
      <div class="number" :style="{'margin-top': (0 - scrollTop) + 'px'}">
        <div v-for="(row, rIdx) in seatsItem.seatsSumRows" :key="rIdx" class="row-num">{{row}}</div>
      </div>
      <seat-scroll :scroll-top.sync="scrollTop" hide-horizontal resize>
        <div v-for="(row, rIdx) in seatsItem.seats" :key="rIdx" class="row">
          <span class="seats"></span>
          <span v-for="(col, cIdx) in row" :key="cIdx" :class="{
                          seats: true,
                          booked: col.seatState === '2',
                          available: col.seatState === '0',
                          selected: col.seatState === '1',
                          }" @click="selectSeat(col)">
          </span>
          <span class="seats"></span>
        </div>
        <div class="seat-padding"></div>
      </seat-scroll>
    </van-row>
    <van-row class="no-status-box" v-else>
      <wait-status title="影厅座位加载中" loading-pic-src="/static/img/seats/seatsLoading_icon.png"></wait-status>
    </van-row>
    <van-row class="help-select-box" v-if="selectedSeats.length === 0">
      <van-row class="content">
        <van-row class="bottom">
          <van-row class="seats-type-info-box">
            <van-col v-for="(item , index ) in seatType" :key="index" class="info-item">
              <van-col v-if=" index == 0">
                <van-row class="pic-box">
                  <van-row class="available-label"></van-row>
                </van-row>
              </van-col>
              <van-col v-else-if=" index <= 2">
                <van-row class="pic-box">
                  <img :src="item.picSrc">
                </van-row>
              </van-col>
              <van-col v-else>
                <van-row class="pic-box">
                  <van-col>
                    <img :src="item.picSrcLeft">
                  </van-col>
                  <van-col>
                    <img :src="item.picSrcRight">
                  </van-col>
                </van-row>
              </van-col>
              <van-col class="type-name">
                {{item.typeName}}
              </van-col>
            </van-col>
          </van-row>
        </van-row>
      </van-row>
    </van-row>
    <van-row class="sure-btn-box" v-else>
      <van-row class="selected-box">
        <van-col class="item-selected" v-for="(item , index) in selectedSeats" :key="index">
          {{item.rowNum}}排{{item.columnsNum}}座
        </van-col>
      </van-row>
      <van-row class="btn-box" @click.native="confirm">
        <van-button size="large" class="btn">确认选择</van-button>
      </van-row>
    </van-row>
  </div>
</template>

<script>
  import Scroll from '@/components/scroll/scroll'
  import WaitStatus from '../../components/common/WaitStatus'
  import {
    mapGetters
  } from 'vuex'
  import * as types from '@/store/types'
  import {
    Toast
  } from 'vant'
  import {
    seatItemMockData
  } from '@/config/mock'

  const seatType = [{
      picSrc: '/static/img/seats/ic_seat_available.png',
      typeName: '可选'
    },
    {
      picSrc: '/static/img/seats/ic_seat_booked.png',
      typeName: '已售'
    },
    {
      picSrc: '/static/img/seats/ic_seat_selected.png',
      typeName: '已选'
    },
    {
      picSrcLeft: '/static/img/seats/ic_seat_lover_normal_l.png',
      picSrcRight: '/static/img/seats/ic_seat_lover_normal_r.png',
      typeName: '情侣座'
    }
  ]

  export default {
    name: 'seat-view',
    data() {
      return {
        titleName: '',
        filmNameForSeat: '',
        planMessage: '',
        noStatus: false,
        seatType: seatType,
        maxSelectedNum: 4,
        seatsItem: [],
        showsData: [],
        curIndex: 0,
        curShows: {
          filmInfo: ''
        },
        scrollTop: 0,
      }
    },
    computed: {
      ...mapGetters({
        cinemaInfo: 'getCinemaInfo',
        filmInfo: 'getFilmInfo',
        planInfo: 'getPlanInfo',
        selectedSeats: 'getSelectedSeats',
        userInfo: 'getUserInfo'
      }),
    },
    components: {
      WaitStatus,
      SeatScroll: Scroll
    },
    mounted() {
      this.titleName = this.cinemaInfo.name
      this.filmNameForSeat = this.filmInfo.name
      this.planMessage = this.planInfo
      this.getSeatsMap()
      // this.seatsItem =  seatItemMockData
      this.$store.commit(types.CLEAR_SELECTED_SEAT)
    },
    methods: {
      back() {
        this.$router.go(-1)
        this.$store.commit(types.CLEAR_SELECTED_SEAT)
      },
      selectShows(v, idx) {

      },
      getSeats(planId) {

      },
      selectSeat(v) {
        if (v.seatState == '2') {
          return
        }
        let rowNumSelected = v.rowNum - 1
        let columnsNumSelected = v.columnsNum - 1
        let seatStatus = parseInt(v.seatState)
        console.log(typeof seatStatus, seatStatus)
        if (!seatStatus) {
          //  座位可选
          if (this.selectedSeats.length >= this.maxSelectedNum) {
            this.$toast('最多选' + this.maxSelectedNum + '座~')
            return
          } else {
            this.seatsItem.seats[rowNumSelected][columnsNumSelected].seatState = '1'
            this.$store.commit(types.ADD_SELECTED_SEAT, v)
          }
        } else {
          this.seatsItem.seats[rowNumSelected][columnsNumSelected].seatState = '0'
          this.$store.commit(types.REMOVE_SELECTED_SEAT, v)
        }
      },
      confirm() {
          let _this = this        
        let userInfo = this.userInfo
        if (userInfo == null) {
          this.$router.push({
            name: 'LoginView'
          })
        } else {
          let seatIds = ''
          for (let i = 0; i < this.selectedSeats.length; i++) {
            seatIds += this.selectedSeats[i].seatId + ','
          }
          seatIds = seatIds.substring(0, seatIds.length - 1)
          console.log('seatIds ==>',seatIds)
        let filmId = _this.filmInfo.id
        let filmMongoId = _this.filmInfo.mongoId
        let accountId = _this.userInfo.accountId
        let accountMongoId = _this.userInfo.mongoId
        let screenId = _this.planInfo.screenId
        let screenMongoId = _this.planInfo.screenMongoId
        let price = _this.planInfo.price
        let seatsIds = seatIds
        
          _this.$api.createOrder(filmId, screenId, accountId, filmMongoId, screenMongoId, accountMongoId, price,
            seatsIds).then(res => {
            let data = res.data
            if (res.status == 200) {
              _this.$store.commit(types.SET_ORDER_CODE, data.orderCode)
              Toast.loading({
                message: '下单中...',
                duration: 0
              })
              let second = 2;
              const timer = setInterval(() => {
                second--
                if (!second) {
                  clearInterval(timer)
                  Toast.clear()
                  this.$router.push({
                    name: 'OrderView'
                  })
                }
              }, 1000)
            } else {
              this.$dialog.alert({
                message: res.message
              })
            }
          }).catch(error => {
            this.$dialog.alert({
              message: error.message
            })
          })
        }
      },
      isPlanExpired(plan) {
        return (new Date(plan.startTime).getTime() - new Date().getTime()) < (15 * 60 * 1000)
      },
      getSeatsMap() {
        let screenId = this.planInfo.screenId
        let scheduleId = this.planInfo.id
        this.$api.getSeatsMap(screenId,scheduleId).then(res => {
          let data = res.data
          if (res.status == 200) {
            this.seatsItem = data
          } else {
            this.$dialog.alert({
              message: res.message
            })
          }
        }).catch(error => {
          this.$dialog.alert({
            message: error.message
          })
        })
      }
    }
  }

</script>

<style lang='scss' scoped>
  @import 'src/style/_vars.scss';

  .seat-view {
    background: $bg-color;
    width: 100%;
    height: 100%;
    .title-bar {
      line-height: 52px;
      background: $nav-bar-color;
      border-bottom: 1px solid $border-color;
      .title {
        color: $text-color;
        font-size: 16px;
        padding-left: 65px;
        font-weight: normal;
      }
      .left {
        position: absolute;
        top: 0;
        left: 18px;
        .el-icon-back {
          color: $main-color;
        }
      }
    }
    .film-detail {
      padding: 10px 15px;
      background: $base-view-color;
      .film-name {
        font-size: 16px;
        font-weight: 500;
      }
      .plan-message {
        margin-top: 6px;
        height: 16px;
        line-height: 16px;
        .detail-date {
          font-size: 12px;
          color: $text-tips-color;
          margin-right: 15px;
        }
      }
    }
    .central-screen-box {
      background: $bg-color;
      padding: 15px;
      height: 40px;
      display: flex;
      justify-content: center;
      .screen-location {
        font-size: 14px;
        line-height: 16px;
        height: 16px;
        padding: 5px;
        color: #fff;
        background: #adadad;
        border-radius: 5px;
      }
    }
    .seats-map {
      position: relative; // top: 200px;
      // left: 0;
      // right: 0;
      // bottom: 0;
      background-color: $bg-color;
      .happy-scroll{
        height: 500px!important;
      }
      .number {
        position: absolute;
        left: 15px;
        width: 20px;
        height: 100%;
        top: 0;
        .row-num {
          width: 20px;
          height: 40px;
          font-size: 12px;
          line-height: 40px;
          text-align: center;
          background-color: #b2b2b2;
          color: white;
          opacity: 0.8;
        }
      }
      .row {
        white-space: nowrap;
        height: 40px;
        position: relative;
        .seats {
          display: inline-block;
          width: 40px;
          height: 40px;
          background-size: 40px 40px;
        }
        .booked {
          background-image: url('../../../static/img/seats/ic_seat_booked.png');
        }
        .available {
          background-image: url('../../../static/img/seats/ic_seat_available.png');
        }
        .selected {
          background-image: url('../../../static/img/seats/ic_seat_selected.png');
        }
        .booked.lover-l {
          background-image: url('../../../static/img/seats/ic_seat_lover_booked_l.png');
        }
        .booked.lover-r {
          background-image: url('../../../static/img/seats/ic_seat_lover_booked_r.png');
        }
        .available.lover-l {
          background-image: url('../../../static/img/seats/ic_seat_lover_normal_l.png');
        }
        .available.lover-r {
          background-image: url('../../../static/img/seats/ic_seat_lover_normal_r.png');
        }
        .selected.lover-l {
          background-image: url('../../../static/img/seats/ic_seat_lover_selected_l.png');
        }
        .selected.lover-r {
          background-image: url('../../../static/img/seats/ic_seat_lover_selected_r.png');
        }
      }
    }
    .no-status-box {
      margin-top: 100px;
    }
    .help-select-box {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #fff;
      opacity: .9;
      .content {
        padding: 20px 15px 0 15px;
        .top {
          width: 100%;
          overflow: hidden;
          .statement {
            .tips {
              font-size: 13px;
              color: $text-tips-color;
            }
            .population {
              font-size: 10px;
              color: $text-color;
              margin-top: 5px;
            }
          }
          .number-list {
            float: right;
            margin-right: 15px;
            .number-item {
              width: 40px;
              height: 30px;
              font-size: 15px;
              color: $text-color;
              border: 1px solid $border-color;
              line-height: 30px;
              text-align: center;
              margin-right: 4px;
            }
          }
        }
        .bottom {
          width: 100%;
          height: 43px;
          overflow: hidden;
          background: #fff;
          display: flex;
          justify-content: center;
          .seats-type-info-box {
            padding-top: 17px;
            overflow: hidden;
            margin: 0 auto;
            .info-item {
              margin-right: 30px;
              line-height: 20px;
              .pic-box {
                margin-right: 4px;
                img {
                  width: 20px;
                }
                .available-label {
                  width: 12px;
                  height: 12px;
                  border: 1px solid $text-tips-color;
                  border-radius: 2px;
                  margin-top: 4px;
                }
              }
              .type-name {
                font-size: 10px;
                color: $text-color;
                /*line-height: 15px;*/
              }
            }
          }
        }
      }
    }
    .sure-btn-box {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 66;
      .selected-box {
        width: 100%;
        height: 30px;
        padding: 10px 15px;
        border-top: 1px solid $border-color;
        background: #fff;
        .item-selected {
          width: 66px;
          line-height: 12px;
          font-size: 12px;
          color: $text-color;
          padding: 9px 7px;
          border: 1px solid $border-color;
          border-radius: 2px;
          margin-right: 5px;
        }
      }
      .btn-box {
        width: 100%;
        background: $main-color;
        .btn {
          color: #fff;
          font-size: 18px;
          background: $main-color;
          border: none;
          border-radius: 0;
        }
        .description {
          color: #fff;
          font-size: 18px;
          text-align: center;
          line-height: 49px;
        }
      }
    }
  }

</style>
