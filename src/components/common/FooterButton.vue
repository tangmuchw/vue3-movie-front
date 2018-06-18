<template>
    <div class="footer-button"  >
        <el-row class="button-box">
            <el-button size="large"@click.native="goNext" class="btn" :class="{ 'change-bg-color': btnStatus}">
                {{titleName}}
            </el-button>
        </el-row>
    </div>
</template>

<script>
export default {
  props: {
    title: String,
    // noStatus:true表示无状态下，按钮灰色呈现，false表示正常显示
    status: [String, Boolean],
    // 点击按钮后的跳转地址
    address: String
  },
  data () {
    return {
      typeName: this.type,
      titleName: this.title,
      btnStatus: this.status,
      site: this.address
    }
  },
  methods: {
    goNext () {
        console.log('fdfd')
        this.$emit('clickBtn')
    }
  }
}
</script>

<style scoped lang="scss">
     @import 'src/style/_vars.scss';

    .footer-button {
        width: 100%;
        .button-box {
            width: 100%;
            height: 46px;
            .btn {
                width:100%;
                color: #fff;
                font-size: 18px;
                background: $btn-bg-color;
                border: none;
                border-radius: 0;
            }
            .change-bg-color {
                background: $bg-color;
                color: $text-color;
            }
        }
    }
</style>
