<template>
  <div class="container">
    <h1>Template List</h1>
    <div class="card-container">
      <el-row>
        <el-col :span="8" v-for="(o, index) in this.template_list" :key="o.filename" :offset="index > 0 ? 2 : 2">
          <el-card :body-style="{ padding: '0px' }">
            <iframe :src="o.fileurl" frameborder="0"></iframe>
            <div style="padding: 14px;">
              <span>{{o.filename}}</span>
              <div class="bottom clearfix">
                <el-button type="text" class="button" @click="read_file(o.filename)">use it</el-button>
                <el-button type="text" class="button">Preview</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      template_list: []
    }
  },
  mounted () {
    this.get_filesList()
  },
  methods: {
    get_filesList () {
      this.$http.get('/api/file/template_list').then((response) => {
        if (response.data.status === 0) {
          let data = response.data.data
          this.template_list = data
        }
      })
    },
    read_file (filename) {
      this.$http.get('/api/file/template_read?filename=' + filename).then((response) => {
        if (response.data.status === 0) {
          this.$store.commit('settext', response.data.data.text)
          this.$store.commit('setimg', response.data.data.img)
          this.$store.commit('setbtn', response.data.data.btn)
          this.$store.commit('setlink', response.data.data.link)
          this.$router.push({
            name: 'edit',
            path: '/edit',
            query: {
              filename: filename,
              url: response.data.url
            }
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../../static/css/stars.css";

  .container {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-bottom: 100px;
    overflow: hidden;
    background: #f5f5f5;
  }

  h1 {
    width: 100%;
    text-align: center;
    font-size: 50px;
    font-weight: 700;
    color: #333;
  }

  .card-container {
    width: 100%;
    margin: 0 auto;
  }

  .views_box {
    width: 350px;
    height: 550px;
    overflow: hidden;
    margin: 0 auto;
  }

  .views_box iframe {
    display: block;
    width: 104%;
    height: 550px;
  }

  .el-carousel__item h3 {
    color: #fff;
    font-size: 14px;
    opacity: 0.75;
    line-height: 50px;
    margin: 0;
    background: #333333;
  }

  .el-col-8 {
    height: 600px;
    margin-top: 50px;
    width: 18%;
    min-width: 300px;
  }
  .el-col-offset-2{
    margin-left:60px;
  }

  .el-card {
    height: 100%;
  }

  .el-card .el-card__body {
    height: 100%;
  }

  .el-card .el-card__body iframe {
    display: block;
    height: 500px;
    width: 104%;
  }

  .el-button {
    margin-top: 20px;
    font-size: 20px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>
