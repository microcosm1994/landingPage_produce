<template>
  <div style="overflow: hidden;">
    <h1 style="margin: 150px auto;text-align: center;">{{title}}</h1>
    <div class="login">
      <el-input
        placeholder="username"
        v-model="username"
        clearable>
      </el-input>
      <el-input
        placeholder="password"
        v-model="password"
        type="password"
        clearable>
      </el-input>
      <el-button type="primary" @click="login">sign in</el-button>
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
  mounted () {
    this.remind()
  },
  methods: {
    login () {
      let user = {}
      user.username = this.username
      user.password = this.password
      this.$http.post('/api/account/login', user).then((response) => {
        if (response.data.status === 0) {
          this.$message(response.data.message)
          this.$store.commit('setusers', response.data.data)
          this.$store.commit('setloginstatus', true)
          this.$cookies.set('_name', response.data.data.username, {
            domain: 'demo.eago.world',
            path: '/'
          })
          this.$router.push({path: '/home'})
        }
      })
    },
    remind: function () {
      let id = this.$cookies.get('_id')
      if (id) {
        this.$store.commit('setloginstatus', true)
        this.$message({
          message: '检测到您已登陆',
          type: 'success'
        })
        this.$router.push({path: './home'})
      }
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
  .login .el-button{
    width: 100%;
    margin-top: 30px;
  }
</style>
