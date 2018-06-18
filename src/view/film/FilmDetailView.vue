<template>
  <div class="film-detail">
    <el-row class="header">
      <el-row class="audio-picture-horizon">
        <img :src="filmPosterHorizon">
      </el-row>
       <el-row class="play-icons">
        <el-row class="back-box" @click.native="back">
          <img src="/static/img/left_white.png" class="back-icon">
        </el-row>
      </el-row>
      <el-row class="name-box" >
        <el-row class="cn-name">
          {{movieDetail.filmName}}
        </el-row>
      </el-row>
    </el-row>
    <el-row class="content">
      <el-row class="introduction-box">
        <el-col class="info-left">
          <el-row class="pic-min-box">
            <img v-lazy="wrapperFilmPoster(movieDetail.poster)" class="pic-min">
          </el-row>
        </el-col>
        <el-col class="info-middle">
          <el-row class="info-box">
            <!--题材-->
            <el-row class="stuff space-margin">
              类型:&nbsp;&nbsp;{{movieDetail.filmType}}
            </el-row>
            <el-row class="duration space-margin">
              时长:&nbsp;&nbsp;{{ movieDetail.duration }}分钟
            </el-row>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="detail-content" v-if="movieDetail.filmBreif != null">
        <el-row class="info-box">
          <el-row  class="title-bar film-des hot-title-des">剧情介绍</el-row>
          <el-row class="box-padding">
            {{movieDetail.filmBreif}}
          </el-row>
        </el-row>
      </el-row>
      <el-row class="detail-content" v-else>
        <el-row class="no-status-box">
          影片信息尚未公布
          <!-- <wait-status title="影片信息尚未公布" :loading-pic-src="noStatusPicture"></wait-status> -->
        </el-row>
      </el-row>
    </el-row>
    <el-row class="footer">
      <el-row class="btn-box">
        <footer-button title="立即购票" @clickBtn="goPurchase"></footer-button>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import {
    filmDetailMockData
  } from '@/config/mock'
   import {
    mapGetters
  } from 'vuex'
  import * as types from '@/store/types'
import FooterButton from '@/components/common/FooterButton'

  export default {
    name: 'film-detail',
    data() {
      return {
        movieDetail: filmDetailMockData,
        filmPosterHorizon: '/static/img/film/poster_horizon_default.jpg'
      }
    },
    components: {
        FooterButton
    },
    computed: {
      ...mapGetters({
        filmInfo: 'getFilmInfo'
      })
    },
    mounted() {
      this.getFilmDetail()
    },
    methods: {
      wrapperFilmPoster(postUrl) {
        return {
          src: postUrl,
          error: '/static/img/film/ic_home_movie_default.png',
          loading: '/static/img/film/ic_home_movie_default.png'
        }
      },
       back() {
         this.$store.commit(types.CLEAR_FILM_INFO)
           this.$router.go(-1)
       },
       goPurchase(){
         this.$router.push({
           name: 'FilmTimeView'
         })
       },
       getFilmDetail(){
         let _this = this
         let filmId = _this.filmInfo.id
        this.$api.getFilmLDetail(filmId).then(res => {
          let data = res.data
          if (res.status == 200) {
            _this.movieDetail = data
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
  .film-detail {
    /*margin-bottom: 53px;*/
    height: 100%;
    .header {
      width: 100%;
      height: 197px;
      position: relative;
      overflow: hidden;
      background: $bg-content-color;
      .audio-picture-horizon {
        filter: brightness(45%);
        img {
          width: 100%;
          height: auto;
        }
      }
      .play-icons {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 196px;
        .back-box {
          position: absolute;
          left: 15px;
          top: 17px;
          .back-icon {
            width: 22px;
            height: 22px;
          }
        }
      }
      .name-box {
        position: absolute;
        bottom: 15px;
        left: 120px;
        .cn-name {
          height: 100%;
          color: #fff;
          font-size: 18px;
          max-width: 15em;
           white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
      }
    }
    .content {
      /*margin-bottom: 36px;*/
      .introduction-box {
        padding: 15px 15px 20px 15px;
        position: relative;
        .info-left {
          width: 90px;
          height: 136px;
          position: absolute;
          left: 15px;
          top: -48px;
          z-index: 100;
          .pic-min-box {
            width: 100%;
            height: 100%;
            border-radius: 4px;
            overflow: hidden;
            background-color: var(--base-page-color);
            .pic-min {
              width: 90px;
              height: 136px;
            }
          }
        }
        .info-middle {
          margin-left: 107px;
          .info-box {
            color: #999;
            font-size: 12px;
            .space-margin {
              margin-bottom: 2px;
            }
            .labels {
              .label-item {
                background: #333;
                margin-left: 5px;
                padding: 1px 2px;
                border-radius: 3px;
                color: #fff;
              }
            }
          }
        }
        .info-right {
          float: right;
          .grade {
            font-size: 19px;
            padding-right: 14px;
            text-align: right;
            background: url('../../assets/film/start.png') right center no-repeat;
            background-size: 12px;
          }
        }
      }
      .detail-content {
        margin-top: 20px;
        overflow: hidden;
        .info-box {
          width: 100%;
          color: var(--text-description-color);
          font-size: 13px;
          /*-webkit-box适用于移动端或WebKit浏览器*/
          .title-bar {
            line-height: 16px;
            color: $text-color;
            padding-left: 5px;
            border-left: 4px solid $main-color;
            font-size: 14px;
            margin: 20px 0 15px 15px;
          }
          .statement {
            isplay: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
          }
          .box-padding {
            padding: 0 15px;
          }
        }
        .no-message-box {
          margin-top: 25px;
        }
      }
    }
    .footer {
      width: 100%;
      height: 46px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 200;
    }
  }

</style>
