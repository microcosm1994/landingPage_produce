<template>
  <div class="edit">
    <div class="edit-container">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="视频替换" name="1">
          <el-alert
            title="仅适用于页面只有一个视频需要替换，为空则不替换。"
            type="info"
            :closable="false">
          </el-alert>
          <el-upload
            class="avatar-uploader"
            style="padding-top: 30px;"
            action="/api/file/uploadimg"
            list-type="picture"
            name="img"
            :data="{
              name: this.template_name,
              type: 'video'
            }"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-progress="progress"
            :before-upload="beforeAvatarUpload">
            <video
              v-if="this.videoUrl"
              :src="this.videoUrl"
              class="avatar"
              controls="controls" ></video>
            <i class="el-icon-plus avatar-uploader-icon"
               v-if="!this.videoUrl"
               v-loading="this.loading"
               element-loading-text="拼命上传中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"></i>
          </el-upload>
        </el-collapse-item>
        <el-collapse-item title="正则替换图片" name="2">
          <el-alert
            title="使用正则表达式全局匹配图片路径，实现替换，上传图片之前请先输入原网页中的图片src。"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请输入原网页中图片路径"
            v-model="imgurl_regex"
            clearable>
          </el-input>
          <el-upload v-if="this.imgurl_regex"
                     class="upload-demo"
                     drag
                     action="/api/file/uploadimg"
                     name="img"
                     :data="{
              name: this.template_name,
              imgurl_regex: this.imgurl_regex,
              type: 'regex'
            }"
                     :headers="headers"
                     :on-success="img_success"
                     list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-collapse-item>
        <el-collapse-item title="正则全局替换文字" name="3">
          <el-alert
            title="输入页面要替换的内容，可以是文字、数字、代码，修改代码内容请慎重。"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请填写要替换的内容"
            v-model="regexp_text.text_before"
            clearable>
          </el-input>
          <el-alert
            title="输入新的内容进行替换"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请输入新的内容"
            v-model="regexp_text.text_after"
            clearable>
          </el-input>
          <el-alert
            title="提交内容并预览效果"
            type="info"
            :closable="false">
          </el-alert>
          <el-button type="primary" @click="revise_text">提交</el-button>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            普通修改<i class="header-icon el-icon-info"></i>
          </template>
          <div style="width: 102%;overflow:auto;padding-left: 10px;padding-right: 25px;box-sizing: border-box" v-if="this.mytext.length > 0">
            <h2>content</h2>
            <vue-html5-editor
              v-for="(item, index) in this.mytext"
              :content="template.text[index]"
              @change="ontextChange($event, index)"
              :key="index"
              :height="200">
            </vue-html5-editor>
          </div>
          <div style="width: 102%;overflow:auto;padding-left: 10px;padding-right: 25px;box-sizing: border-box" v-if="this.myimg">
            <h2>img</h2>
            <div  v-for="(item, index) in this.myimg"
                  :key="index"
                  style="margin-top: 50px;border-bottom: 1px solid #e2e2e2;padding-bottom: 30px;"
            >
              <div style="display: inline-block;vertical-align: top;width: 20%;margin-top: 50px;margin-right: 50px;">
                <img style="width: 100%;height:100%;" :src="'http://' + item" alt="">
              </div>
              <el-upload
                class="upload-demo"
                drag
                action="/api/file/uploadimg"
                name="img"
                :data="{
              name: template_name,
              type: 'index',
              index: index
            }"
                :headers="headers"
                :on-success="img_success"
                list-type="picture">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </div>
          </div>
          <div style="width: 102%;overflow:auto;padding-left: 10px;padding-right: 25px;box-sizing: border-box" v-if="this.mylink">
            <h2>link</h2>
            <div v-for="(item, index) in this.mylink"
                 :key="index">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                style="width:70%;"
                v-model="template.link[index]">
              </el-input>
              <el-button style="width: 15%;margin-left: 30px;" type="primary" @click="onlinkChange(template.link[index], index)">save</el-button>
            </div>
          </div>
          <div style="width: 102%;overflow:auto;padding-left: 10px;padding-right: 25px;box-sizing: border-box" v-if="this.mybtn">
            <h2>button</h2>
            <div  v-for="(item, index) in this.mybtn"
                  :key="index">
              <vue-html5-editor
                :content="template.btn[index]"
                @change="onbtnChange($event, index)"
                :height="200">
              </vue-html5-editor>
            </div>
          </div>
          <el-alert
            title="确认无误后提交修改内容并预览效果"
            type="info"
            :closable="false">
          </el-alert>
          <el-button @click="dialogVisible = true" type="primary">保存</el-button>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="show-container">
      <div class="iframe-box">
        <iframe :src="this.myiframe" frameborder="0" ref="iframe"></iframe>
      </div>
      <el-button @click="deletedir()" type="primary">删除模板</el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>Your landingPage Name</span>
      <div>
        <el-input
          placeholder="landingPage Name"
          v-model="lander.name"
          clearable>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" style="width: 40%;">取 消</el-button>
    <el-button type="primary" @click="save()" style="width: 40%;margin-left: 65px;">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'edit',
  data () {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'enctype': 'multipart/form-data'
      },
      loading: false,
      videoUrl: '',
      activeName: '4',
      template_url: '',
      imgurl_regex: '',
      template_name: '',
      template: {
        text: [],
        img: [],
        link: [],
        btn: []
      },
      text: 'asdasd',
      regexp_text: {
        text_before: '',
        text_after: ''
      },
      dialogVisible: false,
      lander: {
        name: '',
        title: ''
      }
    }
  },
  computed: {
    mytext () {
      return this.$store.state.text
    },
    myimg () {
      return this.$store.state.img
    },
    mybtn () {
      return this.$store.state.btn
    },
    mylink () {
      return this.$store.state.link
    },
    myiframe () {
      return this.$store.state.iframe
    }
  },
  mounted () {
    this.init()
    this.read_file()
  },
  methods: {
    init () {
      this.template.text = this.mytext
      this.template.img = this.myimg
      this.template.btn = this.mybtn
      this.template.link = this.mylink
      this.template_name = this.$route.query.filename
      this.template_url = this.$route.query.url
      this.template_url = 'http://' + this.template_url.slice(this.template_url.indexOf('demo.eago.world'), this.template_url.length)
      this.$store.commit('setiframe', this.template_url)
    },
    deletedir () {
      this.$http.get('/api/file/deletedir?name=' + this.template_name).then((response) => {
        if (response.data.status === 0) {
          this.$router.push({path: '/'})
        }
      })
    },
    img_success () {
      this.$refs.iframe.contentWindow.location.reload(true)
    },
    revise_text () {
      let data = this.regexp_text
      data.name = this.template_name
      this.$http.post('/api/file/revise_text', data).then((response) => {
        if (response.data.status === 0) {
          this.img_success()
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.videoUrl = URL.createObjectURL(file.raw)
      this.loading = false
      this.img_success()
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'video/mp4'
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isJPG) {
        this.$message.error('上传视频只能是 mp4 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
      }
      return isJPG && isLt2M
    },
    progress () {
      this.videoUrl = ''
      this.loading = true
    },
    ontextChange (value, index) {
      console.log(value)
      let data = {}
      data.html = value
      data.name = this.$route.query.filename
      data.index = index
      data.type = 'text'
      this.$http.post('/api/file/revise_view', data).then((response) => {
        if (response.data.status === 0) {
          this.$refs.iframe.contentWindow.location.reload(true)
          console.log(response)
        }
      })
    },
    onlinkChange (value, index) {
      let data = {}
      data.html = value
      data.name = this.$route.query.filename
      data.index = index
      data.type = 'link'
      this.$http.post('/api/file/revise_view', data).then((response) => {
        this.$refs.iframe.contentWindow.location.reload(true)
      })
    },
    onbtnChange (value, index) {
      let data = {}
      data.html = value
      data.name = this.$route.query.filename
      data.index = index
      data.type = 'btn'
      this.$http.post('/api/file/revise_view', data).then((response) => {
        this.$refs.iframe.contentWindow.location.reload(true)
      })
    },
    read_file () {
      this.template_name = this.$route.query.filename
      this.$http.get('/api/file/template_read?filename=' + this.$route.query.filename).then((response) => {
        if (response.data.status === 0) {
          this.$store.commit('settext', response.data.data.text)
          this.$store.commit('setimg', response.data.data.img)
          this.$store.commit('setbtn', response.data.data.btn)
          this.$store.commit('setlink', response.data.data.link)
          this.init()
        }
      })
    },
    save () {
      let data = {}
      data.template_name = this.template_name
      data.name = this.lander.name
      data._id = this.$cookies.get('_id')
      if (data.name.length > 0) {
        this.$http.post('/api/file/save', data).then((response) => {
          if (response.data.status === 0) {
            this.dialogVisible = false
            this.lander.name = ''
            this.$message({
              message: response.data.message,
              type: 'success'
            })
            this.$router.push({name: 'pagelist'})
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            })
          }
        })
      } else {
        this.$message('Names can\'t be empty.')
      }
    }
  }
}
</script>
<style>
  html, body{
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  .edit{
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    padding-top: 100px;
    padding-bottom: 100px;
    box-sizing: border-box;
  }
  .show-container{
    display: inline-block;
    vertical-align: top;
    width: 350px;
    height: 750px;
    margin-left: 50px;
    position: fixed;
    top:55%;
    right:150px;
    transform: translateY(-50%);
  }
  .show-container .iframe-box{
    border:2px solid #e2e2e2;
    width: 100%;
    height: 690px;
    overflow: hidden;
  }
  .show-container .iframe-box iframe{
    width: 104%;
    height: 100%;
  }
  .show-container button{
    width: 80%;
    margin-top: 10px;
  }
  .edit-container{
    display: inline-block;
    vertical-align: top;
    width: 40%;
    /*height: 750px;*/
    overflow: hidden;
    margin-left: -50%;
    transform: translateX(50px);
  }
  .edit-container button{
    margin-top: 20px;
    width: 70%;
  }
  .upload-demo{
    padding-top: 20px;
    display: inline-block;
    vertical-align: top;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 220px;
    display: block;
  }
  .el-loading-spinner{
    top: 0 !important;
    margin-top: 0 !important;
  }
  .el-loading-spinner .el-loading-text {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
  .dashboard-font button{
    width: auto;
  }
  .dashboard button{
    width: auto;
  }
</style>
