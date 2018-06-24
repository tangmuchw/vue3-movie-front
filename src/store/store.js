/**
 * Created by superman on 17/2/16.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'
import * as types from './types'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 用户经纬度， lat: 纬度 lng: 经度
    location: {
      lat: null,
      lng: null
    },
    userInfo: null,
    openId: null,
    token: null,
    // 只存id和name，详细信息通过接口获取
    cityInfo: null,
    /**
     *cinemaInfo: id, name, cityId,cityName
     * 影院信息
     */
    cinemaInfo: null,
    bindCard: {
      isBindCard: false
    },
    cardCityInfo: null,
    cardCinemaInfo: null,
    /**
     *filmInfo: id, name, point, duration, initSlide
     * 场次前的影片信息
     */
    filmInfo: null,
    /**
     *filmInfoForSeat: id, name
     * 选座时的影片信息
     */
    filmInfoForSeat: null,
    // planInfo:id,date
    planInfo: null,
    orderCode: null,
    /**
     *goodsData: Array （比接口多了一个字段 amount）
     * 确认订单时的影片信息
     */
    goodsData: [],
    /**
     *selectedMembershipCard: cardIndex，cardNo，cardTypeId，cardTypeName，balance
     * 确认订单时的影片信息
     */
    selectedMembershipCard: null,
    /**
     *selectedDiscountInfo: id，name，discountTabIndex，selectedDiscountIndex
     * 确认订单时的已选优惠信息
     */
    selectedDiscountInfo: [],
    /**
     *selectedActivitiesInfo: id，name，discountTabIndex，selectedDiscountIndex,payLimit
     * 确认订单时的已选活动信息
     */
    selectedActivitiesInfo: null,
    selectedSeats: [],
    // filmTabIndexStore:  0 => 正在热映, 1 => 即将上映
    filmTabIndexStore: 0,
    // ticketTabIndexStore:  0 => 影片(购票进入), 1 => 影院(购票进入) 2 => 首页进入
    ticketTabIndexStore: 0,
    //futureFilmFilterPublishDate: 购票影片过滤的排期
    futureFilmFilterPublishDate: 'all',
    // getMembershipMaxBalanceTimes: 1 => 表示不需要获得 0 => 表示需要获得
    membershipCardMaxBalanceTimes: 0,
    //设备信息
    devicesInfo: null
  },
  plugins: [createPersistedState({
    filter: mutation => {
      // console.log('--------------', mutation)
      if (mutation.type === types.DEVICES_INFO) {
        return false
      }
      return true
    }
  })],
  mutations: {
    // 用户登录
    [types.LOGIN]: (state, data) => {
      state.userInfo = data
    },
    // 用户登出
    [types.LOGOUT]: (state) => {
      state.userInfo = null
    },
    // 刷新用户信息
    [types.REFRESH_USER]: (state, userInfo) => {
      state.userInfo = userInfo
    },
    [types.SET_USER_LOCATION]: (state, location) => {
      state.location = location
    },
    [types.SET_OPEN_ID]: (state, openId) => {
      state.openId = openId
    },
    // 城市信息
    [types.SET_CITY_INFO]: (state, city) => {
      state.cityInfo = city
    },
    // 影院信息
    [types.SET_CINEMA_INFO]: (state, cinema) => {
      cinema.id = cinema.cinemaId || cinema.id
      cinema.name = cinema.cinemaName || cinema.name
      state.cinemaInfo = cinema
    },
    // 是否是绑卡入口
    [types.SET_BIND_CARD]: (state, isBindCard) => {
      state.bindCard = isBindCard
    },
    // 绑卡城市信息
    [types.SET_CARD_CITY_INFO]: (state, city) => {
      state.cardCityInfo = city
    },
    // 绑卡影院信息
    [types.SET_CARD_CINEMA_INFO]: (state, cinema) => {
      state.cardCinemaInfo = cinema
    },
    // 未选座前的影片信息
    [types.SET_FILM_INFO]: (state, film) => {
      state.filmInfo = film
    },
    [types.CLEAR_FILM_INFO]: (state) => {
      state.filmInfo = null
    },
    // 排期信息
    [types.SET_PLAN_INFO]: (state, plan) => {
      state.planInfo = plan
    },
    [types.SET_PLAN_ID]: (state, id) => {
      state.planInfo.id = id
    },
    [types.SET_PLAN_DATE]: (state, date) => {
      state.planInfo.date = date
    },
    // 已选座位
    [types.ADD_SELECTED_SEAT]: (state, seat) => {
      let index = '_' + seat.seatId
      state.selectedSeats.splice(index, 0, seat)
    },
    [types.REMOVE_SELECTED_SEAT]: (state, seat) => {
      let index = '_' + seat.seatId
      state.selectedSeats.splice(index,1)
    },
    [types.CLEAR_SELECTED_SEAT]: (state) => {
      state.selectedSeats = []
    },
    // 订单信息
    [types.SET_ORDER_CODE]: (state, code) => {
      state.orderCode = code
    },
    [types.CLEAR_ORDER_CODE]: (state) => {
      state.orderCode = null
    },
    // 正在热映或即将上映的选项状态
    [types.SET_FILM_TAB_INDEX]: (state, tabIndex) => {
      state.filmTabIndexStore = tabIndex
    },
    // 购片--影片或影院的选项状态
    [types.SET_TICKET_TAB_INDEX]: (state, tabIndex) => {
      state.ticketTabIndexStore = tabIndex
    },
    // 选座时的影片信息
    [types.SET_FILM_INFO_FOR_SEAT]: (state, selectedFilmInfo) => {
      state.filmInfoForSeat = selectedFilmInfo
    },
    // 确认订单--会员卡
    [types.SET_SELECTED_MEMBERSHIP_CARD]: (state, selectedMembershipCard) => {
      state.selectedMembershipCard = selectedMembershipCard
    },
    [types.CLEAR_SELECTED_MEMBERSHIP_CARD]: (state) => {
      state.selectedMembershipCard = null
    },
    // 确认订单--添设置优惠
    [types.SET_SELECTED_DISCOUNT_INFO]: (state, selectedDiscountInfo) => {
      let index = '_' + selectedDiscountInfo.id
      state.selectedDiscountInfo.splice(index, 0, selectedDiscountInfo)
    },
    // 确认订单--删除优惠
    [types.DELETE_SELECTED_DISCOUNT_INFO]: (state, selectedDiscountInfo) => {
      let index = '_' + selectedDiscountInfo.id
      state.selectedDiscountInfo.splice(index, 1)
    },
    // 确认订单--清空优惠
    [types.ClEAR_SELECTED_DISCOUNT_INFO]: (state) => {
      state.selectedDiscountInfo = []
    },
    // 确认订单--设置活动
    [types.SET_SELECTED_ACTIVITIES_INFO]: (state, selectedActivitiesInfo) => {
      state.selectedActivitiesInfo = selectedActivitiesInfo
    },
    // 确认订单--清空活动
    [types.ClEAR_SELECTED_ACTIVITIES_INFO]: (state) => {
      state.selectedActivitiesInfo = null
    },
    // 在选座清空订单对应保存的支付状态信息
    [types.CLEAR_ORDER_PAY_INFO]: (state) => {
      state.selectedMembershipCard = null
      state.selectedDiscountInfo = []
      state.selectedActivitiesInfo = null
      state.goodsData = []
    },
    // 在首页清空不必要的信息
    [types.CLEAR_NEEDLESS_INFO]: (state) => {
      state.filmInfo = null
      state.filmInfoForSeat = null
      state.planInfo = null
      state.orderCode = null
      state.selectedSeats = []
    },
    // 确认订单--只获得一次余额最大的会员卡
    [types.SET_MEMBERSHIP_CARD_MAX_BALANCE_TIMES]: (state, membershipCardMaxBalanceTimes) => {
      state.membershipCardMaxBalanceTimes = membershipCardMaxBalanceTimes
    },
    [types.DEVICES_INFO]: (state, devices) => {
      state.devicesInfo = devices
    },
    //增加已选卖品
    [types.SET_GOODS_DATA]: (state, goods) => {
      let index = '_' + goods.id
      state.goodsData.splice(index, 0, goods)
    },
    [types.REMOVE_GOODS_DATA]: (state, goods) => {
      let index = '_' + goods.id
      state.goodsData.splice(index, 1)
    },
    [types.CLEAR_GOODS_DATA]: (state) => {
      state.goodsData = []
    },
    [types.SET_FUTURE_FILM_FILTER_PUBLISH_DATE]: (state, futureFilmFilterPublishDate) => {
      state.futureFilmFilterPublishDate = futureFilmFilterPublishDate
    }
  },
  getters: {
    getUserLocation: state => state.location,
    getUserInfo: state => state.userInfo,
    getOpenId: state => state.openId,
    getCityInfo: state => state.cityInfo,
    getCinemaInfo: state => state.cinemaInfo,
    getFilmInfo: state => state.filmInfo,
    getPlanInfo: state => state.planInfo,
    getSelectedSeats: state => state.selectedSeats,
    getOrderCode: state => state.orderCode,
    getBindCard: state => state.bindCard,
    getCardCityInfo: state => state.cardCityInfo,
    getCardCinemaInfo: state => state.cardCinemaInfo,
    getFilmTabIndexStore: state => state.filmTabIndexStore,
    getTicketTabIndexStore: state => state.ticketTabIndexStore,
    getFilmInfoForSeat: state => state.filmInfoForSeat,
    getSelectedMembershipCard: state => state.selectedMembershipCard,
    getSelectedDiscountInfo: state => state.selectedDiscountInfo,
    getSelectedActivitiesInfo: state => state.selectedActivitiesInfo,
    getMembershipCardMaxBalanceTimes: state => state.membershipCardMaxBalanceTimes,
    getDevicesInfo: state => state.devicesInfo,
    getGoodsDataInfo: state => state.goodsData,
    getFutureFilmFilterPublishDate: state => state.futureFilmFilterPublishDate
  }
})
