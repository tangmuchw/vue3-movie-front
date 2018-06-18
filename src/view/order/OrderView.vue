<template>
  <div class="order-view">
    <el-row class="title-bar">
      <el-row class="title">
        确认订单
      </el-row>
      <el-row class="left" @click.native="back">
        <i class="el-icon-back"></i>
      </el-row>
    </el-row>
    <van-row class="content">
      <van-row class="timer-box">
        <van-row class="timer">
          <!-- 剩余支付时间 {{residualTime}} -->
        </van-row>
      </van-row>
      <van-row class="order-info-box">
        <van-row class="name-box">
          <van-col class="name">
            {{orderTicket.filmName}}
          </van-col>
          <van-col class="ticket-amount-box">
            <van-row class="ticket-amount">
              订单共{{orderTicket.count}}张票
            </van-row>
          </van-col>
        </van-row>
        <van-row class="type-box">
          <van-col class="labels">
            <van-row class="label-box type">
              <van-col class="label">
                {{orderTicket.filmType}}
              </van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="detail-box">
          <van-col class="left-title">
            时间
          </van-col>
          <van-col class="right-text">
            {{orderTicket.playTime}}
          </van-col>
        </van-row>
        <van-row class="detail-box">
          <van-col class="left-title">
            影厅
          </van-col>
          <van-col class="right-text">
            {{orderTicket.screenName}}
          </van-col>
        </van-row>
        <van-row class="detail-box">
          <van-col class="left-title">
            座位
          </van-col>
          <van-col class="right-text">
            <van-row class="seats-select-detail">
              <van-col>
                {{orderTicket.seatInfo}}
              </van-col>
            </van-row>
          </van-col>
        </van-row>
        <van-row class="total-price-box">
          <van-col class="left-title">
            票价总计
          </van-col>
          <van-col class="right-text">
            <van-row class="text-box">
              <van-row class="total-price">
                {{orderTicket.subTotalPrice}}
              </van-row>
              <van-row class="service-price">
                不包含服务费{{orderTicket.serviceCharge}}元/张
              </van-row>
            </van-row>
          </van-col>
        </van-row>
      </van-row>
      <van-row class="supposed-pay-box">
        <van-col class="left-pay-total-box">
          <van-row class="pay-text">
            应付
          </van-row>
          <van-row class="pay-total">
            ￥{{orderTicket.totalPrice}}
          </van-row>
        </van-col>
        <van-col class="right-tips-box">
          <van-row class="tips">
            不支持退票、改签
          </van-row>
        </van-col>
      </van-row>
    </van-row>
    <van-row class="footer-button-box">
      <van-row class="btn-box" @click.native="confirm">
        <van-button size="large" class="btn">前往支付</van-button>
      </van-row>
    </van-row>
  </div>
</template>

<script>
  import {
    orderTicketMockData
  } from '@/config/mock'
  import {
    mapGetters
  } from 'vuex'
  import * as types from '@/store/types'
import {
    Dialog,
    Toast
  } from 'vant'

  export default {
    name: 'order-view',
    data() {
      return {
        residualTime: '10:00', // 剩余支付时间
        orderTicket: ''
      }
    },
    components: {},
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
      this.getOrderDetail()
    },
    methods: {
      back() {
        Dialog.confirm({
          message: '您真的要将失去此次支付机会吗？',
          confirmButtonText: '容朕想想',
          cancelButtonText: '去意已决'
        }).then(() => {
          Dialog.close()
        }).catch(() => {
        let orderCode = this.orderCode
          this.$api.cancelOrder(orderCode).then(res => {
            let data = res.data
            if (res.status == 200) {
              this.$router.replace({
                name: 'FilmView'
              })
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

        })
      },
      getOrderDetail() {
        let _this = this
        let orderCode = this.orderCode
        this.$api.getOrderDetail(orderCode).then(res => {
          let data = res.data
          if (res.status == 200) {
            _this.orderTicket = data
            _this.$store.commit(types.SET_PLAN_INFO, {
              totalPrice: data.totalPrice
            })

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
      confirm() {
        this.$router.push({
          name: 'PayView'
        })
      }
    }
  }

</script>

<style lang='scss' scoped>
  @import 'src/style/_vars.scss';

  .order-view {
    width: 100%;
    height: 100%;
    background: $bg-color;
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
      //   padding: 0 0 50px 0;
      .timer-box {
        width: 100%;
        line-height: 33px;
        height: 33px;
        text-align: center;
        background: $bg-color;
        .timer {
          font-size: 13px;
          color: $text-color;
        }
      }
      .order-info-box {
        background: #fff;
        padding: 7px 15px 0 15px;
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
        .total-price-box {
          margin: 14px 0;
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
      .supposed-pay-box {
        margin-top: 6px;
        padding: 9px 15px;
        height: 39px;
        background: $base-view-color; // border-top: 1px solid $border-color;
        .left-pay-total-box {
          width: 20%;
          .pay-text {
            font-size: 10px;
            line-height: 16px;
          }
          .pay-total {
            margin-top: 3px;
            font-size: 18px;
            color: $main-color;
            line-height: 20px;
          }
        }
        .right-tips-box {
          float: right;
          width: 80%;
          text-align: right;
          .tips {
            font-size: 12px;
            color: $text-tips-color;
            line-height: 39px;
            height: 39px;
          }
          .add-down-background {
            background: url("../../assets/down.png") right 48% no-repeat;
            background-size: 12px 7px;
          }
          .add-up-background {
            background: url("../../assets/up.png") right 48% no-repeat;
            background-size: 12px 7px;
          }
        }
      }
    }
    .footer-button-box {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      z-index: 100;
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
