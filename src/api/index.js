import axios, {
  MovieServer
} from '@/http'
import * as context from './context'
import store from '@/store/store'

class Api {
  /**
   * 获取影院详情
   * @param cinemaId
   */
  getCinemaDetail(cinemaId) {
    return MovieServer.post(context.MOVIE_API.CINEMA_DETAIL, {
      cinemaId: cinemaId
    })
  }

  getFilmList() {
    return MovieServer.get(context.MOVIE_API.FILM_LIST)
  }

  getFilmLDetail(filmId) {
    return MovieServer.post(context.MOVIE_API.FILM_DETAIL, {
      filmId: filmId
    })
  }

  login(accountId, password) {
    return MovieServer.post(context.MOVIE_API.LOGIN, {
      accountId: accountId,
      password: password
    })
  }

  register(accountId, password, nickName) {
    return MovieServer.post(context.MOVIE_API.REGISTER, {
      accountId: accountId,
      password: password,
      nickName: nickName
    })
  }

  getDateList(filmId, screenId) {
    return MovieServer.post(context.MOVIE_API.GET_DATE_LIST, {
      filmId: filmId,
      screenId: screenId
    })
  }

  getTimeList(showDate,filmId) {
    return MovieServer.post(context.MOVIE_API.GET_TIME_LIST, {
      showDate: showDate,
      filmId:filmId
    })
  }


  getSeatsMap(screenId,scheduleId) {
    return MovieServer.post(context.MOVIE_API.GET_SEATS_MAP, {
      screenId: screenId,
      scheduleId:scheduleId
    })
  }

  /**
   *
   *
   * @param {*} filmId
   * @param {*} screenId
   * @param {*} accountId
   * @param {*} filmMongoId
   * @param {*} screenMongoId
   * @param {*} accountMongoId
   * @param {*} price 
   * @param {*} seatsIds String  以','隔开
   * @returns
   * @memberof Api
   */
  createOrder(filmId, screenId, accountId, filmMongoId, screenMongoId, accountMongoId, price, seatsIds) {
    return MovieServer.post(context.MOVIE_API.CREAT_ORDER, {
      filmId: filmId,
      screenId: screenId,
      accountId: accountId,
      filmMongoId: filmMongoId,
      screenMongoId: screenMongoId,
      accountMongoId: accountMongoId,
      price: price,
      seatsIds: seatsIds
    })
  }


  cancelOrder(orderCode) {
    return MovieServer.post(context.MOVIE_API.CANCEL_ORDER, {
      orderCode: orderCode
    })
  }

  getOrderDetail(orderCode) {
    return MovieServer.post(context.MOVIE_API.GET_ORDER_DETAIL, {
      orderCode: orderCode
    })
  }

  /**
   *
   *payOrder
   * @param {*} orderCode
   * @param {*} payState String  '已完成/未支付'
   * @returns
   * @memberof Api
   */
  payOrder(orderCode) {
    return MovieServer.post(context.MOVIE_API.PAY_ORDER, {
      orderCode: orderCode
    })
  }

  getUserOrderList(accountId) {
    return MovieServer.post(context.MOVIE_API.GET_USER_ORDER_LIST, {
      accountId: accountId
    })
  }


}

export default new Api()
