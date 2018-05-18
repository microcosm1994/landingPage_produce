<template>
  <div style='width: 100%'>
    <el-table
      :data='this.mylander'
      style='width: 90%'>
      <el-table-column
        label='date'
        width='200'>
        <template slot-scope='scope'>
          <i class='el-icon-time'></i>
          <span style='margin-left: 10px'>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label='landerName'>
        <template slot-scope='scope'>
          <span style='margin-left: 10px'>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label='operate'>
        <template slot-scope='scope'>
          <el-button
            size='mini'
            icon='el-icon-view'
            @click='handleEdit(scope.$index, scope.row.url)'> </el-button>
          <el-button
            size='mini'
            icon='el-icon-download'
            @click='handleDownload(scope.$index, scope.row.name)'> </el-button>
          <el-button
            size='mini'
            type='danger'
            icon='el-icon-delete'
            @click='handleDelete(scope.$index, scope.row._id)'></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style='width: 80%;position: relative;left:50%;transform:translateX(-58%)'
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page='this.currentPage'
      :page-sizes='[10, 20, 30, 50]'
      :page-size='this.pagesize'
      layout='total, sizes, prev, pager, next, jumper'
      :total='this.mylander_count'>
    </el-pagination>
    <el-dialog
      title='loading'
      :visible.sync='dialogVisible'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      width='50%'>
      <el-steps :active='this.steps' align-center>
        <el-step title='Connecting the server' :status='this.steps_status'></el-step>
        <el-step title='Packing project' :status='this.steps_status'></el-step>
        <el-step title='Downloaded to local' :status='this.steps_status'></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'lander',
  data () {
    return {
      title: 'sss',
      currentPage: 1,
      pagesize: 10,
      count: '',
      dialogVisible: false,
      steps: 1,
      steps_status: 'success'
    }
  },
  computed: {
    mylander () {
      return this.$store.state.mylander
    },
    mylander_count () {
      return this.$store.state.mylander_count
    }
  },
  mounted () {
    this.getlander(this.$cookies.get('_name'), this.currentPage, this.pagesize)
  },
  methods: {
    getlander (username, page, size) {
      this.$http.get('/api/file/mylander?username=' + username + '&page=' + page + '&size=' + size).then((response) => {
        this.$store.commit('setmylander', response.data.data)
        this.$store.commit('setmylander_count', response.data.count - 0)
      })
    },
    handleEdit (index, row) {
      window.open(row, '_blank', 'width=375,height=700,menubar=no,toolbar=no,status=no,scrollbars=yes')
    },
    handleDownload (index, val) {
      this.dialogVisible = true
      this.steps = 1
      this.$http.get('/api/file/clear').then((response) => {
        if (response.data.status === 0) {
          this.$http.get('/api/file/zip?filename=' + val).then((response) => {
            if (response.data.status === 0) {
              let file = {}
              file.name = val
              file.data = response.data.data
              this.steps = 2
              this.$http.post('/api/file/download', file).then((response) => {
                if (response.data.status === 0) {
                  var iframe = document.getElementById('myIframe')
                  if (iframe) {
                    iframe.src = response.data.url
                  } else {
                    iframe = document.createElement('iframe')
                    iframe.style.display = 'none'
                    iframe.src = response.data.url
                    iframe.id = 'myIframe'
                    document.body.appendChild(iframe)
                  }
                  this.steps = 3
                  this.steps_status = 'success'
                  this.dialogVisible = false
                } else {
                  this.steps_status = 'error'
                }
              })
            } else {
              this.steps_status = 'error'
              this.$message({
                message: response.data.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDelete (index, row) {
      this.$http.get('/api/file/deletelander?_id=' + row).then((response) => {
        if (response.data.status === 0) {
          this.$message({
            message: response.data.message,
            type: 'success'
          })
          this.getlander(this.$cookies.get('_name'), this.currentPage, this.pagesize)
        }
      })
    },
    // 改变每页显示条数时触发
    handleSizeChange (val) {
      this.pagesize = val
      this.getlander(this.$cookies.get('_name'), this.currentPage, val)
    },
    // 改变页数时触发
    handleCurrentChange (val) {
      this.currentPage = val
      this.getlander(this.$cookies.get('_name'), val, this.pagesize)
    }
  }
}
</script>

<style>
  .cell{
    text-align: center
  }
</style>
