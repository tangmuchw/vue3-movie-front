<template>
  <div class="pay-view">
    <van-row class="nav-bar-box">
      <van-col class="back" @click.native="back">
        <i class="el-icon-back"></i>
      </van-col>
      <van-col class="title-box">
        <van-row class="name-box">
          <van-row class="cinema-name name">
            收银台
          </van-row>
        </van-row>
        <van-row class="name-box">
          <van-row class="film-name name">
            <!-- 距离完成支付时间还剩{{residualTime}} -->
          </van-row>
        </van-row>
      </van-col>
    </van-row>
    <van-row class="top-view">
      <van-row class="label-tips">您需要支付</van-row>
      <van-row class="label-price">¥ {{totalPrice}}</van-row>
      <van-row class="label3">{{cinemaName}}--订单号：{{orderCodePay}}</van-row>
    </van-row>
    <van-row class="tip-view">
      <van-row class="title">
        选择支付方式
      </van-row>
    </van-row>
    <van-row class="pay-method">
      <van-row class="pay-item">
        <van-row>
          <van-col class="pay-image">
            <img src="@img/weixinpay_icon@3x.png" alt="">
          </van-col>
          <van-col class="pay-label">微信支付</van-col>
          <van-col class="select-image">
            <img src="@img/list_selected_icon.png" alt="">
          </van-col>
        </van-row>
      </van-row>
    </van-row>
    <van-row class="footer-button-box">
      <van-row class="btn-box" @click.native="buyTicketBtnClick">
        <van-button size="large" class="btn">确认支付</van-button>
      </van-row>
    </van-row>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    orderDetailPayMockData
  } from '@/config/mock'
  import {
    disposeResidualPayTime,
    isWeixinBrowser
  } from '@/config/utils'
  import {
    Dialog,
    Toast
  } from 'vant'

  export default {
    name: 'pay-view',
    data() {
      return {
        orderType: this.$route.query.orderType || 'ticket', // ticket cardCharge
        orderNo: this.$route.params.orderCode,
        orderDetailPay: orderDetailPayMockData,
        payInfo: null,
        orderDownTimer: null,
        residualTime: '10:00',
        totalPrice: '2',
        orderCodePay: '15271877120622001017526',
        cinemaName: '天津理工'
      }
    },
    components: {
      Dialog
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
      getOrderType() {
        console.log(this.orderType)
        if (this.orderType === 'ticket') {
          return '影票订单'
        } else {
          return '充值订单'
        }
      }
    },
    mounted() {
      this.cinemaName = this.cinemaInfo.name
      this.orderCodePay = this.orderCode
      this.totalPrice = this.planInfo.totalPrice
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
      buyTicketBtnClick() {
        let orderCode = this.orderCode
        this.$api.payOrder(orderCode).then(res => {
          let data = res.data
          if (res.status == 200) {
            Toast.success({
              message: '支付成功，请前往我的订单查看！',
              duration: 0
            })
            let second = 2;
            const timer = setInterval(() => {
              second--
              if (!second) {
                clearInterval(timer)
                Toast.clear()
                this.$router.push({
                  name: 'FilmView'
                })
              }
            }, 1000);

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
      onBridgeReady() {
        Toast.clear()
        this.pay(this.payInfo)
      },

      pay(payInfo) {
        let wxPayInfo = {
          'appId': payInfo.appId, // 公众号名称，由商户传入
          'timeStamp': payInfo.timeStamp, // 时间戳，自 1970 年以来的秒数
          'nonceStr': payInfo.nonceStr, // 随机串
          'package': payInfo.package,
          'signType': payInfo.signType, // 微信签名方式：
          'paySign': payInfo.paySign // 微信签名
        }
        WeixinJSBridge.invoke('getBrandWCPayRequest', wxPayInfo,
          res => {
            // alert(JSON.stringify(res))
            // 使用以下方式判断前端返回, 微信团队郑重提示：res.err_msg 将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              this.onPaySuccess()
            } else {
              alert(JSON.stringify(res))
              this.onPayFail()
            }
          }
        )
      },

      onPaySuccess() {
        console.log('支付成功')
        if (this.orderType === 'cardCharge') {
          this.$router.push({
            name: 'CardRechargeSuccess'
          })
        } else {
          this.$router.push({
            // name:'CardRechargeSuccess'
            name: 'PaySuccess',
            // name:'FilmTicket',
            params: {
              orderNo: this.orderNo
            }
          })
        }
      },
      onPayFail() {
        console.log('支付失败')
        Dialog.alert({
          message: '支付失败'
        })
      }
    },

  }

</script>

<style scoped lang='scss'>
  @import 'src/style/_vars.scss';

  .pay-view {
    background: $bg-color;
    width: 100%;
    height: 100%;
    .nav-bar-box {
      width: 100%;
      padding-top: 10px;
      border-bottom: 1px solid $main-color;
      line-height: 52px;
      background: #fff;
      .back {
        margin-left: 18px;
        width: 28px;
        height: 52px;
        display: flex;
        align-items: center;
        img {
          width: 28px;
          height: 28px;
        }
      }
      .title-box {
        width: 80%;
        .name-box {
          width: 100%;
          display: flex;
          justify-content: center;
          .name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .cinema-name {
            color: $text-color;
            font-size: 16px;
            line-height: 16px;
            max-width: 10em;
            margin-top: 7px;
          }
          .film-name {
            margin-top: 6px;
            color: $main-color;
            font-size: 14px;
            line-height: 14px;
            width: 15em;
          }
        }
      }
    }
    .top-view {
      margin-top: 20px;
      background: #fff;
      width: 100%;
      height: 148px;
      text-align: center;
      .label-tips {
        padding-top: 30px;
        font-size: 13px;
        color: $text-tips-color;
      }
      .label-price {
        padding-top: 5px;
        font-size: 27px;
        color: $main-color;
      }
      .label3 {
        padding-top: 15px;
        font-size: 10px;
        color: $text-color;
      }
    }
    .tip-view {
      margin-top: 15px;
      background: $base-view-color; //   height: 30px;
      text-align: left; //   padding: 15px 15px 0 15px;
      font-size: 13px;
      .title {
        // padding-bottom: 15px;
        margin: 0 15px;
        padding: 15px 0;
        border-bottom: 1px solid $border-color;
      }
    }
    .pay-method {
      background: #fff;
      width: 100%;
      height: 54px;
      .pay-item {
        height: 54px; // border-bottom: 1px solid $border-color;
        .pay-image {
          margin-left: 15px;
          img {
            padding-top: 15px;
            width: 28px;
            height: 22px;
          }
        }
        .pay-label {
          padding-left: 10px;
          padding-top: 15px;
          color: $text-color;
          font-size: 14px;
        }
        .select-image {
          float: right;
          margin-right: 15px;
          img {
            padding-top: 15px;
            width: 20px;
            height: 20px;
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
