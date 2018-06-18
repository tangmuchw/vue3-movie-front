<template>
  <div class="better-slider">
    <!--最外层wrapper-->
    <div class="slider" ref="slider">
      <!--content层-->
      <div class="slider-group" ref="sliderGroup" :style="{width: boxWidth * wrapperSize+'rem'}">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'better-slider',
    props: {
      size: {
        type: [String, Number],
        default: 10
      },
      width: {
        type: [String, Number],
        default: 5.12
      },
      allowScrollX: {
        type: [String, Boolean],
        default: true
      },
      allowScrollY: {
        type: [String, Boolean],
        default: true
      }
    },
    data() {
      return {
        wrapperSize: this.size,
        boxWidth: this.width,
        isScrollX:this.allowScrollX,
        isScrollY:this.allowScrollY
      }
    },
    watch: {
      size(newVal) {
        this.wrapperSize = newVal
      },
      width(newVal) {
        this.boxWidth = newVal
      }
    },
    components: {},
    mounted() {
      let _this = this
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.slider, {
          scrollX: _this.isScrollX,
          scrollY: _this.isScrollY,
          eventPassthrough: 'vertical',
          click: true
        })
      })
    },
    methods: {}
  }
</script>

<style scoped>
  .better-slider {
    .slider {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .slider-group {
        height: 100%;
        padding-right: 20px;
        overflow: hidden;
      }
    }
  }
</style>
