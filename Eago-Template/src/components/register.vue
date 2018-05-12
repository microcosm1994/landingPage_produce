<template>
  <div style="padding-bottom: 100px">
    <div class="register" >
      <h1 style="transform:translateX(12%)">{{title}}</h1>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <el-form-item label="nickname" prop="nickname">
          <el-input v-model="ruleForm.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="username" prop="username">
          <el-input v-model="ruleForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm the password" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitform('ruleForm')">submit</el-button>
          <el-button @click="resetForm('ruleForm')">clear</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="Verifying administrator information"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :modal="false"
        width="60%">
        <el-input
          placeholder="Administrator password"
          v-model="admin_psd"
          type="password"
          clearable>
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="register()">submit</el-button>
    <el-button @click="dialogVisible = false">cancel</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'register',
  data () {
    let validatenickname = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('The nickname can not be empty'))
      } else {
        if (value.length > 16) {
          return callback(new Error('nickname over length'))
        } else {
          callback()
        }
      }
    }
    let validateusername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('The username can not be empty'))
      }
      if (value.length > 16 || value.length < 6) {
        return callback(new Error('The length of the username is kept between 6-16'))
      } else {
        if (/.*[\u4e00-\u9fa5]+.*/.test(value)) {
          return callback(new Error('username Contain Chinese characters'))
        } else {
          callback()
        }
      }
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6 || value.length > 16) {
          return callback(new Error('The length of the username is kept between 6-16'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else {
        if (value.length < 6 || value.length > 16) {
          return callback(new Error('The length of the username is kept between 6-16'))
        } else {
          if (value !== this.ruleForm.password) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      title: 'Generating account',
      dialogVisible: false,
      ruleForm: {
        nickname: '',
        username: '',
        password: '',
        checkPass: '',
        portrait: 'http://eago.oss-cn-hongkong.aliyuncs.com/portrait/timg.jpg',
        type: 'user'
      },
      rules: {
        nickname: [
          { validator: validatenickname, trigger: 'blur' }
        ],
        username: [
          { validator: validateusername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      admin_psd: ''
    }
  },
  mounted () {},
  methods: {
    register () {
      if (this.admin_psd) {
        let admin = {}
        admin.username = 'admin'
        admin.password = this.admin_psd
        let users = {}
        users.nickname = this.ruleForm.nickname
        users.username = this.ruleForm.username
        users.password = this.ruleForm.password
        users.portrait = this.ruleForm.portrait
        users.type = this.ruleForm.type
        this.$http.post('/api/account/login', admin).then((response) => {
          if (response.data.status === 0) {
            this.$http.post('api/account/register', users).then((response) => {
              if (response.data.status === 0) {
                this.$message({
                  message: response.data.message,
                  type: 'success'
                })
                this.$router.push({
                  path: '/users',
                  params: {
                    active: 4
                  }
                })
              } else {
                this.$message({
                  message: response.data.message,
                  type: 'error'
                })
              }
            })
          } else {
            this.$message({
              message: 'Administrator password error',
              type: 'error'
            })
          }
        })
      }
    },
    submitform (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = true
        } else {
          this.$message({
            message: 'error submit!!',
            type: 'error'
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style>
  .register{
    width: 40%;
    padding: 30px 8% 30px 3%;
    margin: 0px auto;
    transform: translateX(-20%) translateY(20%);
    background: rgba(0,0,0,0.8);
    box-sizing: border-box;
    color:#e2e2e2;
    border-radius:10px;
  }
  .el-form-item__label{
    color:#e2e2e2;
  }
  .el-input{
    width: 100%;
    height:40px;
    margin-top:4px;
  }
</style>
