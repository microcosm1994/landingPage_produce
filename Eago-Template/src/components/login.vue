<template>
  <div>
    <h1 style="margin: 150px auto;text-align: center;">{{title}}</h1>
    <div class="login">
      <el-input
        placeholder="account"
        v-model="username"
        clearable>
      </el-input>
      <el-input
        placeholder="password"
        v-model="password"
        type="password"
        clearable>
      </el-input>
      <el-button type="primary" @click="login">登陆</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loging',
  data () {
    return {
      title: 'Template',
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      let user = {}
      user.username = this.username
      user.password = this.password
      this.$http.post('/api/account/login', user).then((response) => {
        if (response.data.status === 0) {
          console.log(response.data)
        }
      })
    }
  }
}
</script>

<style>
  .login{
    width: 300px;
    height: 200px;
    margin: 0px auto;
  }
  .el-input{
    width: 100%;
    height:40px;
    margin-top:4px;
  }
  .el-button{
    width: 100%;
    margin-top: 30px;
  }
</style>
