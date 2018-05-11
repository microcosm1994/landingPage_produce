<template>
  <div>
    <el-table
      :data="this.mylander"
      style="width: 80%;left:50%;transform:translateX(-58%);">
      <el-table-column
        label="date"
        width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="landerName">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="operate">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row.url)"> preview</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row._id)">deleted</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="width: 80%;position: relative;left:50%;transform:translateX(-58%);"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="this.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
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
      total: ''
    }
  },
  computed: {
    mylander () {
      return this.$store.state.mylander
    }
  },
  mounted () {
    this.getlander(this.$cookies.get('_name'), this.currentPage, this.pagesize)
  },
  methods: {
    getlander (username, page, size) {
      this.$http.get('/api/file/mylander?username=' + username + '&page=' + page + '&size=' + size).then((response) => {
        this.$store.commit('setmylander', response.data.data)
        this.total = response.data.count
      })
    },
    handleEdit (index, row) {
      window.open(row, '_blank', 'width=375,height=700,menubar=no,toolbar=no,status=no,scrollbars=yes')
    },
    handleDelete (index, row) {
      console.log(index, row)
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
    text-align: center;
  }
</style>
