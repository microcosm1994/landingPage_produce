<template>
  <div style="width: 100%;">
    <el-table
      :data="this.users"
      style="width: 90%;">
      <el-table-column
        label="date"
        width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Head portrait"
        width="160">
        <template slot-scope="scope">
          <img :src="scope.row.portrait" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="NickName">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="UserName">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="type">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="operate">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row._id)"> </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row._id)"></el-button>
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
    <el-dialog
      title="loading"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="50%">
      <el-steps :active="this.steps" align-center>
        <el-step title="Connecting the server" ></el-step>
        <el-step title="Packing project"></el-step>
        <el-step title="Downloaded to local"></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'users',
  data () {
    return {
      titile: '',
      users: []
    }
  },
  computed: {},
  mounted () {
    this.getusers()
  },
  methods: {
    getusers () {
      this.$http.get('/api/account/all').then((response) => {
        if (response.data.status === 0) {
          this.users = response.data.data
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style>
  .cell{
    text-align: center;
  }
  .cell img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
</style>
