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
    users: {}
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
    }
  }
})
