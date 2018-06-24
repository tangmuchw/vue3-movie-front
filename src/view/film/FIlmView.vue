<template>
  <div class="film-view">
    <van-row class="wrapper" v-if="filmList.length != 0">
      <van-row class="list-box">
        <el-row class="item-box" v-for="(item , index) in filmList" :key="index">
          <el-row class="item" @click.native="goFilmDetail(item, index)">
            <el-row class="pic-box">
              <el-row class="pic">
                <img v-lazy="wrapperFilmPoster(item.poster)">
                <!-- <img src="/static/img/film/ic_home_movie_default.png"> -->
              </el-row>
            </el-row>
            <el-row class="name-box">
              <el-row class="name">
                {{item.filmName}}
              </el-row>
            </el-row>
          </el-row>
        </el-row>
      </van-row>
    </van-row>
    <van-row class="wait-box" v-else>
      <wait-status title="请等待一段时间~" :loading-pic-src="noStatusPicture"></wait-status>
    </van-row>
  </div>
</template>

<script>
  import {
    filmMockData
  } from '@/config/mock'
  import WaitStatus from '@/components/common/WaitStatus'
  import * as types from '@/store/types'
  import {
    mapGetters
  } from 'vuex'
  import CinemaParam from '@/config/cinema.param'

  export default {
    naem: 'film-view',
    data() {
      return {
        filmList: [],
        noStatusPicture: '/static/img/wait_status_film.png',
      };
    },
    components: {
      WaitStatus
    },
    computed: {},
    mounted() {
      this.$store.commit(types.CLEAR_NEEDLESS_INFO)
      this.getFilmList()
      let cinemaId = CinemaParam.cinemaId
      // let cinemaName = CinemaPara.cinemaName
      this.$api.getCinemaDetail(cinemaId).then(res => {
        console.log(res)
        let data = res.data
        if (res.status == 200) {
          let cinemaId = data.cinemaId
          let cinemaName = data.cinemaName
          let mongoId = data._id
          this.$store.commit(types.SET_CINEMA_INFO, {
            id: cinemaId,
            name: cinemaName,
            mongoId:mongoId
          })
        } else {
            this.$dialog.alert({
            message: res.message
          })
        }
        saveCinemaList = data
      }).catch(error => {
        console.log(error)
      })
    },
    methods: {
      wrapperFilmPoster(postUrl) {
        return {
          src: postUrl,
          error: '/static/img/film/ic_home_movie_default.png',
          loading: '/static/img/film/ic_home_movie_default.png'
        }
      },
      getFilmList() {
        let _this = this
        this.$api.getFilmList().then(res => {
          let data = res.data
          if (res.status == 200) {
            _this.filmList = data
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
      // 存储当前影片的信息到store
      goFilmDetail(item, index) {
        let filmId = item.filmId
        let _id = item._id
        let duration = item.duration
        let filmName = item.filmName
        this.$store.commit(types.SET_FILM_INFO, {
          id: filmId,
          name: filmName,
          duration: duration,
          mongoId: _id
        })
        this.$router.push({
          name: 'FilmDetailView'
        })
      },
    },
  }

</script>

<style lang='scss' scoped>
  @import 'src/style/_vars.scss';
  .film-view {
    width: 100%;
    height: 100%;
    .wrapper {
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-top: 70px;
      .list-box {
        width: 549px;
        display: flex;
        flex-wrap: wrap;
        margin: 0 15px;
        margin: 0 auto;
        .item-box {
          width: 33.33%;
          height: 186px;
          margin-top: 14px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          .item {
            width: 108px;
            vertical-align: middle;
            display: table-cell;
            text-align: center;
            .pic-box {
              width: 108px;
              height: 162px;
              border: 1px solid #e0e0e0;
              border-radius: 5px;
              overflow: hidden;
              position: relative;
              background: $bg-color;
              .pic {
                width: 100%;
                img {
                  max-width: 100%;
                  min-width: 100%;
                  height: 162px;
                }
                /*加载时,过渡效果*/
                // img[lazy=loading] {
                //   background: #e0e0e0 url("../../../assets/movie_nopic.png") center center no-repeat;
                //   background-size: 50%;
                // }
              }
              .discount-box {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
                width: 34px;
                height: 34px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .labels-box {
                position: absolute;
                bottom: 6px;
                right: 0;
                z-index: 3;
                .label-item {
                  line-height: 14px;
                  font-size: 12px;
                  border-radius: 3px;
                  padding: 3px;
                  overflow: hidden;
                  text-align: center;
                }
                .type {
                  color: $base-view-color;
                  background: #333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  max-width: 5em;
                  margin-right: 5px;
                }
                .evaluation {
                  background: #ffcc00;
                  color: $text-color;
                  margin-right: 5px;
                }
              }
            }
            .name-box {
              width: 100%;
              height: 18px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 6px;
              .name {
                max-width: 6em;
                height: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: $text-tips-color;
                font-size: 12px;
              }
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
