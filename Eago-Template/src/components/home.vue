<template>
  <div class="home">
    <div class="bg"></div>
    <div class="header">
      <el-dropdown @command="handleCommand"  trigger="click">
        <span class="el-dropdown-link">
          welcome {{this.user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a" disabled="true">user</el-dropdown-item>
          <el-dropdown-item command="b" disabled="true">seting</el-dropdown-item>
          <el-dropdown-item command="c">Sign out</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="sidebar">
      <el-col>
        <el-menu
          :default-active="this.active"
          class="el-menu-vertical-demo"
          background-color="transparent"
          text-color="#fff"
          :router="true"
          active-text-color="#ffd04b">
          <el-menu-item index="1" :route="{path: '/home'}">
            <i class="el-icon-menu"></i>
            <span slot="title">Template</span>
          </el-menu-item>
          <el-menu-item index="2" :route="{path: '/lander'}">
            <i class="el-icon-document"></i>
            <span slot="title">My lander</span>
          </el-menu-item>
          <el-menu-item index="3" :route="{path: '/register'}"
          :disabled="this.dissabled">
            <i class="el-icon-plus"></i>
            <span slot="title">Generating account</span>
          </el-menu-item>
          <el-menu-item index="4" :route="{path: '/users'}" :disabled="this.dissabled">
            <i class="el-icon-tickets"></i>
            <span slot="title">User list</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </div>
    <div class="home-container">
      <div class="home-container-box">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      isCollapse: true,
      active: '',
      activeIndex: 1,
      dissabled: false
    }
  },
  computed: {
    user () {
      return this.$store.state.users
    }
  },
  mounted () {
    if (this.$cookies.get('_name') !== 'admin') {
      this.dissabled = true
    }
    if (this.$route.path === '/home') {
      this.active = '1'
    }
    if (this.$route.path === '/lander') {
      this.active = '2'
    }
    if (this.$route.path === '/register') {
      this.active = '3'
    }
    if (this.$route.path === '/users') {
      this.active = '4'
    }
    if (this.$route.params.active) {
      this.active = '4'
    }
  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
      if (command === 'c') {
        this.$http.get('/api/account/logout').then((response) => {
          if (response.data.status === 0) {
            this.$cookies.remove('_name', {
              domain: 'demo.eago.world',
              path: '/'
            })
            this.$store.commit('setloginstatus', false)
            this.$store.commit('setuser', {})
            this.$router.push({name: 'login'})
          }
        })
      }
    }
  }
}
</script>

<style>
  .home{
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .bg{
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
  .header{
    width: 100%;
    height:80px;
    position: fixed;
    top:0px;
    left:0;
    z-index: 2;
    background: rgba(0,0,0,0.8);
  }
  .header .el-dropdown{
    float: right;
    margin-right: 4%;
    line-height:80px;
    color:#f5f5f5;
    font-size: 18px;
  }
  .sidebar{
    width: 200px;
    height:100%;
    position: fixed;
    top:80px;
    left:0;
    z-index: 2;
    background: rgba(0,0,0,0.8);
  }
  .home-container{
    width: 100%;
    height:100%;
    padding-left: 200px;
    padding-top: 80px;
    background: #f5f5f5;
    overflow: hidden;
  }
  .home-container .home-container-box{
    width: 100%;
    height:100%;
    position: relative;
  }
</style>
