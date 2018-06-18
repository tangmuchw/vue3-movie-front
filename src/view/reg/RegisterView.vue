<template>
  <div class="register-view">
    <h1 class="title">欢迎加入抠电影</h1>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="手机号" clearable>
        </el-input>
      </el-form-item>
      <el-form-item prop="nickName">
        <el-input v-model="ruleForm.nickName" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" clearable v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" placeholder="确认密码" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%;height:40px;background:#e23f3d;color:#fff;" @click="submitForm('ruleForm')" class="submit_btn">注册</el-button>
      </el-form-item>
    </el-form>
    <div class="footer">
      <div class="agreement">点击「注册」代表你已阅读并同意用户使用协议</div>
      <div class="btns">
        <router-link :to="{ name: 'FilmView'}">返回首页</router-link>
        <span class="or-span">or</span>
        <router-link :to="{ name: 'LoginView'}" class="go-login">已有账号，前往登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    checkMobile
  } from '@/config/utils'
import {
    Toast
  } from 'vant'
import md5 from 'js-md5'

  export default {
    name: 'register-view',
    data() {

      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        registerState: '立即注册',
        ruleForm: {
          phone: '',
          password: '',
          nickName: '',
          checkPass: ''
        },
        rules: {
          phone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }],
          nickName: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePassCheck,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let accountId = this.ruleForm.phone
            let password = this.ruleForm.password
            let nickName = this.ruleForm.nickName
            let md5Pwd = md5(password)
            
            if (checkMobile(accountId)) {
              _this.$api.register(accountId, md5Pwd, nickName).then(res => {
                let data = res.data
                if (res.status == 200) {
                  Toast.loading({
                    message: '注册成功，为你跳转登录页',
                    duration: 0
                  })
                  let second = 2;
                  const timer = setInterval(() => {
                    second--
                    if (!second) {
                      clearInterval(timer)
                      Toast.clear()
                      this.$router.replace({
                        name: 'LoginView'
                      })
                    }
                  }, 1000)


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
              this.$router.replace({
                name: 'LoginView'
              })
            } else {
              this.$toast('手机号格式不正确')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import 'src/style/_vars.scss';
  .register-view {
    h1 {
      margin: 10% 0 9%;
      font-size: 40px;
      font-weight: 300;
      color: $main-color;
      text-align: center;
    }
    form {
      padding: 20px 15px;
      .form-name,
      .form-pwd,
      .form-submit {
        margin-top: 10px;
      }
      .submit {
        cursor: pointer;
        width: 100%;
        padding: 12px 26p;
        margin-top: 10px;
        font-size: 17px;
        text-align: center;
        color: #fff;
        background: $main-color;
        border: 1px solid $main-color;
        border-radius: 30px;
      }
      .disabled {
        cursor: not-allowed;
        background: #eee;
        border: none;
      }
      .tip {
        font-size: 14px;
        color: #aaa;
      }
      .error {
        color: #ff8040;
      }
    }
    .footer {
      .agreement {
        font-size: 14px;
        color: #aaa;
        text-align: center;
      }
      .btns {
        margin-top: 40px;
        text-align: center;
        font-size: 15px;
        a {
          color: #42bd56;
          margin-right: 15px;
        }
        .or-span {
          color: $text-tips-color;
        }
        .go-login {
          color: $main-color;
          margin-left: 10px;
        }
      }
    }
  }

</style>
