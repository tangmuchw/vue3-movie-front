<template>
  <div class="login-view">
    <h1>
      <router-link :to="{name: 'FilmView'}">取消</router-link>登录抠电影
    </h1>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="手机号" clearable>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" clearable v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%;height:40px;background:#e23f3d;color:#fff;" @click="submitForm('ruleForm')" class="submit_btn btns">登陆</el-button>
      </el-form-item>
    </el-form>
    <!-- <form method="get" @submit.prevent="onSubmit()">
      <p v-if="error" class="tip error">{{error}}</p>
      <div class="form-user">
        <el-input placeholder="请输入手机号" v-model="phone" clearable>
        </el-input>
      </div>
      <div class="form-pwd">
        <el-input placeholder="请输入密码" v-model="password" clearable>
        </el-input>
      </div>
      <div class="btns">
        <button class="submit" type="submit" :disabled="isDisabled" :class="{disabled: isDisabled}">
          {{loginState}}
        </button>
      </div>
    </form> -->
    <div class="footer">
      <div class="more-login">使用其他方式登录 &amp; 找回密码</div>
      <div class="btns">
        <router-link :to="{name: 'RegisterView'}">注册抠电影帐号</router-link>
        <a href="#">下载抠电影App</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import {
    checkMobile
  } from '@/config/utils'
  import * as types from '@/store/types'
import md5 from 'js-md5'

  export default {
    name: 'login-view',
    data() {
      return {
        loginState: '登录',
        isDisabled: false, // Disabled submit button
        isShow: 0, // Show pwd
        passType: 'password',
        error: '', // Verification results
        ruleForm: {
          phone: '',
          password: '',
        },
        rules: {
          phone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
        }
      }
    },
    computed: {

    },
    methods: {
      submitForm(formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let accountId = _this.ruleForm.phone
            let password = _this.ruleForm.password
            let md5Pwd = md5(password)
            if (checkMobile(accountId)) {
              _this.$api.login(accountId, md5Pwd).then(res => {
                let data = res.data
                if (res.status == 200) {
                  let mongoId = data._id
                  let nickName = data.nickName
                  _this.$store.commit(types.LOGIN, {
                    accountId: accountId,
                    password: password,
                    mongoId:mongoId,
                    name:nickName
                  })
                  _this.$toast('登录成功')                  
                  _this.$router.go(-1)                  
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
            } else {
              this.$toast('手机号格式不正确')
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    }

  }

</script>

<style lang="scss" scoped>
  @import 'src/style/_vars.scss';
  .login-view {
    h1 {
      height: 54px;
      margin: 0 0 12px 0;
      padding: 0 22px;
      line-height: 54px;
      background: #fff;
      border-bottom: 1px solid #eee;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      a {
        position: absolute;
        left: 18px;
        top: 0;
        color: $main-color;
        font-size: 15px;
      }
    }
    form {
      padding: 20px 15px;
      .submit {
        cursor: pointer;
        width: 100%;
        padding: 12px 26px;
        margin-top: 10px;
        font-size: 17px;
        text-align: center;
        color: #fff;
        background: $main-color;
        border: 1px solid $main-color;
        border-radius: 3px;
      }
      .form-pwd {
        margin-top: 10px;
      }
      .disabled {
        cursor: not-allowed;
        background: #eee;
        border: none;
      }
      input {
        outline: none;
      }
      .tip {
        font-size: 14px;
        color: #aaa;
      }
      .error {
        color: #ff0000;
      }
    }

    .footer {
      .more-login {
        font-size: 15px;
        color: #aaa;
        text-align: center;
      }

      .btns {
        margin-top: 40px;
        text-align: center;
        font-size: 15px;

        a {
          color: $main-color;
          margin-right: 15px;
        }
      }
    }
  }

</style>
