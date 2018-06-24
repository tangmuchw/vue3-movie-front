<template>
  <div class="film-time-view">
    <el-row class="title-bar">
      <el-row class="title">
        选择场次
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <el-row class="times-box" v-if="dateList.length != 0">
      <el-row class="times-scroll">
        <el-row class="items-list">
          <better-slider :size="wrapperSizeTimes" :width="wrapperWidthTimes">
            <el-col class="item-wrapper" :class="{'slide-active':  slideActiveIndex === _indexTimes }" v-for="(timesItem, _indexTimes) in dateList"
              :key="_indexTimes" @click.native="changePlanDate(timesItem.key,timesItem.value, timesItem.scheduleId,_indexTimes)">
              <el-row class="item-box">
                <el-row class="item">
                  {{timesItem.value}}
                </el-row>
              </el-row>
            </el-col>
          </better-slider>
        </el-row>
      </el-row>
      <el-row class="ticket-box">
        <el-row class="purchase-info-list" v-if="timesList != '' || timesList.length != 0">
          <el-row class="item-box" v-for="(item, _indexList) in timesList" :key="_indexList" :class="{'change-bg-active':touchStartIndex === _indexList}">
            <el-row class="item-content" @touchstart.native="touchstartChange(_indexList)" @touchend.native="touchendChange" @click.native="purchase(item)">
              <el-col class="temps-box" :span="5">
                <el-row class="start-time">
                  {{item.startTime.substr(11,6)}}
                </el-row>
                <el-row class="end-time">
                  {{item.endTime.substr(11,6)}}散场
                </el-row>
              </el-col>
              <el-col class="type-box" :span="5">
                <el-row class="labels">
                  <el-row class="icon-box">
                    <el-row class="label-icon type">
                      {{item.filmType}}
                    </el-row>
                  </el-row>
                </el-row>
                <el-row class="screen-name" :span="5">
                  {{item.screenName}}
                </el-row>
              </el-col>
              <el-col class="purchase-btn-box" :span="5">
                <el-row class="btn purchase" :class="{ 'purchase-active': touchStartIndex === _indexList, 'purchase-unavailable': isPlanExpired(item)}"
                  @touchstart.native="touchstartChange(_indexList)" @touchend.native="touchendChange">
                  购票
                </el-row>
              </el-col>
              <el-col class="price-box" :span="4">
                <el-row class="sale-price">
                  ￥{{item.price}}
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
        <el-row class="no-purchase-info" v-else>
          <el-row class="picture-box">
            <img src="/static/img/no_content_tips.png"> {{noMessageTips}}
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <van-row class="wait-box" v-else>
      <wait-status title="很抱歉~该影片暂时没有排期" :loading-pic-src="noStatusPicture"></wait-status>
    </van-row>
  </div>
</template>

<script>
  import BetterSlider from '@/components/common/BetterSlider'
  import {
    mapGetters
  } from 'vuex'
  import * as types from '@/store/types'
  import {
    dateListMockData,
    timeListMockData
  } from '@/config/mock'
  import {
    disposePlanDate
  } from '@/config/utils'
  import WaitStatus from '@/components/common/WaitStatus'

  export default {
    name: 'film-time',
    data() {
      return {
        wrapperSizeTimes: 5,
        wrapperWidthTimes: 4.48,
        noMessageTips: '亲，暂无排期(￣▽￣)',
        noStatusPicture: '/static/img/wait_status_film.png',
        dateList: '',
        timesList: '',
        slideActiveIndex: 0,
        touchStartIndex: '',
        planDateSelected: '',
      }
    },
    components: {
      BetterSlider,
      WaitStatus
    },
    computed: {
      ...mapGetters({
        filmInfo: 'getFilmInfo',
        planInfo: 'getPlanInfo'
      })
    },
    mounted() {
      this.getDateList()
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      changePlanDate(planDate, planValue, scheduleId, index) {
        // let cinemaId = this.cinemaInfo == null ? '' : this.cinemaInfo.id
        // let filmId = this.filmInfoForSeat == null ? '' : this.filmInfoForSeat.id
        this.getTimeList(planDate)
        this.slideActiveIndex = index
        let planValueChanged = planValue
        let planDateChanged = planDate
        let date = {}
        date.planDate = planDateChanged
        date.planValue = planValueChanged
        date.planActiveIndex = index
        this.planDateSelected = date
      },
      touchstartChange(index) {
        this.touchStartIndex = index
      },
      touchendChange() {
        this.touchStartIndex = ''
      },
      isPlanExpired(plan) {
        return (new Date(plan.startTime).getTime() - new Date().getTime()) < (15 * 60 * 1000)
      },
      purchase(plan) {
        let planDateSelected = this.planDateSelected
        let planDateChange = planDateSelected.planDate
        let planValueChange = planDateSelected.planValue
        let planActiveIndex = planDateSelected.planActiveIndex
        let screenNameSelected = plan.screenName
        let screenIdSelected = plan.screenId
        let screenMongoId = plan.screenMongoId
        let price = plan.price
        // console.log('------------planDate', planDate)
        let startTime = plan.startTime.substr(11, 6)
        this.$store.commit(types.SET_PLAN_INFO, {
          id: plan.scheduleId,
          startTime: startTime,
          detailDate: planValueChange,
          startDate: planDateChange,
          screenName: screenNameSelected,
          screenId: screenIdSelected,
          screenMongoId: screenMongoId,
          price: price,
          planActiveIndex: planActiveIndex
        })
        this.$router.push({
          name: 'SeatView'
        })
      },
      getDateList() {
        let _this = this
        let filmId = this.filmInfo.id
        this.$api.getDateList(filmId).then(res => {
          let data = res.data
          if (res.status == 200) {
            if (data.length != 0) {
              _this.dateList = disposePlanDate(data)
              let date = {}
              let planInfo = _this.planInfo
              if (planInfo != null) {
                let planDateKey = planInfo.planActiveIndex
                _this.slideActiveIndex = planDateKey
                date.planDate = _this.dateList[planDateKey].key
                date.planValue = _this.dateList[planDateKey].value
              } else {
                date.planDate = _this.dateList[0].key
                date.planValue = _this.dateList[0].value
              }
              _this.planDateSelected = date
              // _this.timesList = timeListMockData
              _this.getTimeList(_this.dateList[0].key)
            }
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
      },
      getTimeList(showDate) {
        let _this = this
        let filmId = this.filmInfo.id
        this.$api.getTimeList(showDate, filmId).then(res => {
          let data = res.data
          if (res.status == 200) {
            _this.timesList = data
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
  .film-time-view {
    width: 100%;
    overflow: hidden;
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
    .times-box {
      margin-top: 20px;
      .times-scroll {
        border-top: 1px solid $dark-color;
        border-bottom: 1px solid $dark-color;
        .items-list {
          padding-left: 15px;
          .item-wrapper {
            width: 105px;
            .item-box {
              padding-top: 10px;
              .item {
                width: 100%;
                font-size: 14px;
                color: $text-tips-color;
                text-align: center;
                margin-right: 15px;
                padding-bottom: 8px;
                white-space: nowrap;
              }
            }
          }
          .slide-active {
            border-bottom: 2px solid $main-color;
            .item-box {
              .item {
                color: $text-color;
              }
            }
          }
        }
      }
      .ticket-box {
        margin-top: 7px;
        width: 100%;
        border-top: 1px solid $dark-color;
        .purchase-info-list {
          font-size: 12px;
          .change-bg-active {
            background: $bg-color;
          }
          .item-box {
            padding: 17px 15px 0 15px;
            .item-content {
              padding-bottom: 16px;
              border-bottom: 1px solid $border-color;

              .temps-box {
                text-align: center;
                .start-time {
                  font-size: 16px;
                  line-height: 16px;
                  color: $text-color;
                }
                .end-time {
                  font-size: 10px;
                  line-height: 10px;
                  color: $text-tips-color;
                  margin-top: 4px;
                }
              }
              .type-box {
                /*width: 4.736rem;*/
                margin-left: 17px;
                .labels {
                  .icon-box {
                    .label-icon {
                      margin-right: 3px;
                      padding: 2px 5px;
                      border-radius: 2px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      word-wrap: nowrap;
                      line-height: 12px;
                      font-size: 10px;
                    }
                    .type {
                      max-width: 3em;
                      background: #ffcc00;
                      color: #333;
                      font-weight: bold;
                    }
                    .lang {
                      background: #333;
                      color: #fff;
                    }
                  }
                }
                .screen-name {
                  font-size: 10px;
                  line-height: 10px;
                  color: #333;
                  margin-top: 4px;
                }
              }
              .purchase-btn-box {
                float: right;
                height: 100%;
                .btn {
                  width: 50px;
                  line-height: 25px;
                  text-align: center;
                  border-radius: 2px;
                  border: 1px solid $main-color;
                  border-radius: 2px;
                  margin: 2px 0;
                }
                .purchase {
                  color: $main-color;
                  background: $base-view-color;
                }
                .purchase-active {
                  color: $base-view-color;
                  background: $main-color;
                }

                .discount {
                  color: $base-view-color;
                  background: $main-color;
                }
                .purchase-unavailable {
                  color: white;
                  background: #d3d3d3;
                }
              }
              .price-box {
                float: right;
                margin: 2px 15px 0 0;
                .sale-price {
                  font-size: 14px;
                  line-height: 18px;
                  color: $main-color;
                }
              }
            }
            .special-offer-box {
              width: 100%;
              margin-top: 13px;
              .activities {
                /*margin-bottom: .810666rem;*/
                .icon {
                  margin-right: 4px;
                  img {
                    width: 16px;
                    height: 16px;
                  }
                }
                .statement {
                  font-size: 13px;
                  line-height: 16px;
                }
                .show-more {
                  height: 16px;
                  float: right;
                  display: flex;
                  align-items: center;
                  img {
                    width: 10px;
                    height: 6px;
                  }
                }
              }
              .space {
                margin: 15px 0;
              }
            }
          }
        }
        .no-purchase-info {
          margin-top: 40px;
          width: 100%;
          display: flex;
          justify-content: center;
          .picture-box {
            width: 135px;
            height: 121px;
            text-align: center;
            color: $text-tips-color;
            font-size: 14px;
            img {
              max-width: 100%;
              height: auto;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
    .wait-box {
      margin-top: 200px;
    }
  }

</style>
