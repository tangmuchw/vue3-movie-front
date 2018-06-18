<template>
  <div class="mine-order-view">
    <el-row class="title-bar">
      <el-row class="title">
        我的所有订单
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <van-row v-if="orderList.length != 0" class="order-list" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400">
      <van-row v-if="orderList.length != 0" v-for="(item , index) in orderList" :key="index" class="order-item">
        <van-row class="order-info-box">
          <van-row class="name-box">
            <van-col class="name">
              {{item.filmName}}
            </van-col>
            <van-col class="ticket-amount-box">
              <van-row class="ticket-amount">
                订单共{{item.count}}张票
              </van-row>
            </van-col>
          </van-row>
          <van-row class="type-box">
            <van-col class="labels">
              <van-row class="label-box type">
                <van-col class="label">
                  {{item.filmType}}
                </van-col>
              </van-row>
            </van-col>
          </van-row>
          <van-row class="detail-box">
            <van-col class="left-title">
              订单号
            </van-col>
            <van-col class="right-text">
              <van-row class="seats-select-detail">
                <van-col>
                  {{item.orderCode}}
                </van-col>
              </van-row>
            </van-col>
          </van-row>
        </van-row>
        <van-row class="detail-box">
          <van-col class="left-title">
            影厅
          </van-col>
          <van-col class="right-text">
            {{item.screenName}}
          </van-col>
        </van-row>
        <van-row class="detail-box">
          <van-col class="left-title">
            座位
          </van-col>
          <van-col class="right-text">
            <van-row class="seats-select-detail">
              <van-col>
                {{item.seatInfo}}
              </van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="detail-box">
          <van-col class="left-title">
            支付状态
          </van-col>
          <van-col class="right-text">
            {{item.payState }}
          </van-col>
        </van-row>
        <van-row class="total-price-box">
          <van-col class="left-title">
            票价总计
          </van-col>
          <van-col class="right-text">
            <van-row class="text-box">
              <van-row class="total-price">
                ￥{{item.totalPrice}}
              </van-row>
            </van-row>
          </van-col>
        </van-row>
      </van-row>
    </van-row>
     <van-row class="wait-box" v-else>
      <wait-status title="很抱歉~您还没有买过电影票" :loading-pic-src="noStatusPicture"></wait-status>
    </van-row>
  </div>
</template>

<script>
  import {
    orderListMockData
  } from '@/config/mock'
  import {
    Waterfall
  } from 'vant'
  import {
    mapGetters
  } from 'vuex'
  import WaitStatus from '@/components/common/WaitStatus'

  export default {
    name: 'mine-order-view',
    data() {
      return {
        orderList: [],
        disabled: false,
        noStatusPicture: '/static/img/wait_status_film.png',                
      }
    },
    directives: {
      WaterfallLower: Waterfall('lower')
    },
    components: {
      WaitStatus
    },
    computed: {
      ...mapGetters({
        cinemaInfo: 'getCinemaInfo',
        filmInfo: 'getFilmInfo',
        planInfo: 'getPlanInfo',
        selectedSeats: 'getSelectedSeats',
        userInfo: 'getUserInfo',
        orderCode: 'getOrderCode'
      }),
    },
    mounted() {
      this.getUserOrderList()
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      loadMore() {
        // this.disabled = true;
        // setTimeout(() => {
        //   let item = {
        //     orderCode: '15271877120622001017526',
        //     cinemaName: 'CGV影城(黄河道店)',
        //     orderCreateTime: '2018-06-02',
        //     getOrderPrice: '22',
        //     payState: '已完成',
        //     filmName: '完美陌生人',
        //     count: '2',
        //     filmType: '动作',
        //     playTime: '2018-06-22 10:40',
        //     screenName: '5号厅',
        //     seatInfo: '1排1座/2排3座',
        //     serviceCharge: '1',
        //     totalPrice: '22'
        //   }
        //   for (let i = 0; i < 5; i++) {
        //     this.orderList.push(item);
        //   }
        //   this.disabled = false;
        // }, 200);
      },
      getUserOrderList() {
        let _this = this
        let accountId = this.userInfo.accountId
        this.$api.getUserOrderList(accountId).then(res => {
          let data = res.data
          if (res.status == 200) {
            _this.orderList = data
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

  .mine-order-view {
    width: 100%;
    height: 100%;
    background: $bg-color;
    .title-bar {
      width: 100%;
      line-height: 52px;
      background: $nav-bar-color;
      border-bottom: 1px solid $border-color;
      position: fixed;
      top: 0;
      left: 0;
      background: $base-view-color;
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
    .order-list {
      padding-top: 60px;
      background: $bg-color;
      padding-bottom: 15px;
      .order-item {
        margin: 10px 5px 0 5px;
        padding: 7px 15px 0 15px;
        border: 1px solid $dark-color;
        border-radius: 5px;
        background: $base-view-color;
        .order-info-box {
          background: $base-view-color;
          overflow: hidden;
          .name-box {
            height: 28px;
            .name {
              font-size: 18px;
              line-height: 28px;
            }
            .ticket-amount-box {
              float: right;
              height: 100%;
              display: flex;
              align-items: center;
              .ticket-amount {
                height: 15px;
                padding: 2px 6px;
                font-size: 12px;
                line-height: 15px;
                border-radius: 2px;
                color: #fff;
                background: $main-color;
              }
            }
          }
          .type-box {
            height: 24px;
            .labels {
              margin-right: 3px;
              height: 24px;
              display: flex;
              align-items: center;
              .label-box {
                font-size: 10px;
                border-radius: 5px;
                .label {
                  padding: 0 4px;
                  position: relative;
                }
                .border-right:after {
                  content: "";
                  display: inline-block;
                  width: 1px;
                  height: 10px;
                  background: #cc9900;
                  position: absolute;
                  top: 50%;
                  right: 0;
                  margin-top: -5px;
                }
              }
              .type {
                background: $labels-type-color;
                color: $text-color;
                font-weight: bold;
                padding: 3px 0 2px 0px;
              }
            }
          }
         
          .total-price-box {
            margin-top: 14px;
            overflow: hidden;
            border-top: 1px solid $border-color;
            .left-title {
              font-size: 16px;
              line-height: 56px;
            }
            .right-text {
              float: right;
              height: 56px;
              /* line-height: 56px; */
              display: flex;
              align-content: center;
              .text-box {
                /* line-height: 56px; */
                margin-top: 15px;
                .total-price {
                  font-size: 14px;
                  height: 16px;
                  line-height: 16px;
                  color: $main-color;
                  text-align: right;
                }
                .service-price {
                  font-size: 12px;
                  height: 14px;
                  line-height: 14px;
                  color: $text-tips-color;
                }
              }
            }
          }
        }
        .total-price-box {
            margin-top: 14px;
            overflow: hidden;
            border-top: 1px solid $border-color;
            .left-title {
              font-size: 16px;
              line-height: 56px;
            }
            .right-text {
              float: right;
              height: 56px;
              /* line-height: 56px; */
              display: flex;
              align-content: center;
              .text-box {
                /* line-height: 56px; */
                margin-top: 15px;
                .total-price {
                  font-size: 14px;
                  height: 16px;
                  line-height: 16px;
                  color: $main-color;
                  text-align: right;
                }
                .service-price {
                  font-size: 12px;
                  height: 14px;
                  line-height: 14px;
                  color: $text-tips-color;
                }
              }
            }
          }
         .detail-box {
            height: 15px;
            margin-top: 7px;
            font-size: 13px;
            .left-title {
              color: $text-reverse-color;
            }
            .right-text {
              color: $text-color;
              margin-left: 10px;
              .seats-select-detail {
                .split-line-italic {
                  color: #cfcfcf;
                }
              }
            }
          }
      }
      .tips {
        margin-top: 50px;

        padding-top: 40px;
        text-align: center;
        font-size: 16px;
        color: $text-tips-color;
      }
    }
    .wait-box {
      // height: 100%;
      padding-top: 200px;
    }
  }

</style>
