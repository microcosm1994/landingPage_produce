import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    text: [],
    img: [],
    btn: [],
    link: [],
    iframe: '',
    users: {},
    mylander: [],
    mylander_count: 0,
    users_count: 0,
    loginstatus: false
  },
  mutations: {
    // 文字
    settext (state, array) {
      state.text = array
    },
    // 图片
    setimg (state, array) {
      state.img = array
    },
    // 按钮
    setbtn (state, array) {
      state.btn = array
    },
    // 链接
    setlink (state, array) {
      state.link = array
    },
    // iframe链接
    setiframe (state, string) {
      state.iframe = string
    },
    // 用户数据
    setusers (state, data) {
      state.users = data
    },
    // 用户lander列表
    setmylander (state, array) {
      state.mylander = array
    },
    // 用户lander总数
    setmylander_count (state, number) {
      state.mylander_count = number
    },
    // 用户总数
    setusers_count (state, number) {
      state.users_count = number
    },
    // 用户登录状态
    setloginstatus (state, boolean) {
      state.loginstatus = boolean
    }
  }
})
