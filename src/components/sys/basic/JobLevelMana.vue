<template>
  <div id="job-level-mana">
    <el-form size="small" :inline="true" :model="jl">
      <el-form-item>
        <el-input prefix-icon="el-icon-plus" style="width: 300px"
                  v-model="jl.name" placeholder="添加职称"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="jl.titleLevel" placeholder="职称等级">
          <el-option v-for="item in titleLevels"
                     :key="item"
                     :label="item"
                     :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addJobLevel">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="jls"
      stripe
      border
      @selection-change="handleSelectionChange"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="width: 80%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="编号"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="职称名称">
      </el-table-column>
      <el-table-column
        prop="titleLevel"
        label="职称级别">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        label="是否启用">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
          <el-tag type="danger" v-else>未启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="danger" size="small" style="margin-top: 8px" @click="deleteMany"
               :disabled="multipleSelection.length === 0">批量删除
    </el-button>
    <el-dialog width="30%" title="编辑职称信息"
               @opened="$refs.updateInput.focus()" :visible.sync="dialogFormVisible">
      <el-form :model="updateJl">
        <el-form-item label="职称名称">
          <el-input ref="updateInput" v-model="updateJl.name"></el-input>
        </el-form-item>
        <el-form-item label="职称等级">
          <el-select v-model="updateJl.titleLevel">
            <el-option v-for="item in titleLevels"
                       :key="item"
                       :label="item"
                       :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="updateJl.enabled"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateJobLevel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'JobLevelMana',
  data() {
    return {
      dialogFormVisible: false,
      jl: {
        name: '',
        titleLevel: '',
      },
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级',
      ],
      updateJl: {},
      jls: [],
      loading: false,
      disabled: false,
      multipleSelection: [],
    };
  },
  mounted() {
    this.initJobLevels();
  },
  methods: {
    deleteMany() {
      this.$confirm(`此操作将删除【${this.multipleSelection.length}】个职称, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const ids = [];
          this.multipleSelection.forEach((value) => {
            ids.push(value.id);
          });
          this.$http.delete('/system/basic/jl', { data: ids })
            .then((value) => {
              if (value) {
                this.initJobLevels();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateJobLevel() {
      this.$http.put('/system/basic/jl', this.updateJl)
        .then((value) => {
          if (value) {
            this.dialogFormVisible = false;
            this.initJobLevels();
          }
        });
    },
    handleEdit(index, row) {
      this.updateJl = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm(`此操作将删除职称【${row.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`/system/basic/jl/${row.id}`)
            .then((value) => {
              if (value) {
                this.initJobLevels();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    initJobLevels() {
      this.loading = true;
      this.disabled = true;
      this.$http.get('/system/basic/jl')
        .then((value) => {
          this.jls = value;
        })
        .finally(() => {
          this.loading = false;
          this.disabled = false;
        });
    },
    addJobLevel() {
      if (this.jl.name !== '' && this.jl.titleLevel !== '') {
        this.$http.post('/system/basic/jl', this.jl)
          .then((value) => {
            if (value) {
              this.initJobLevels();
              this.jl.name = '';
              this.jl.titleLevel = '';
            }
          });
      } else {
        this.$message.error('职称信息不能为空');
      }
    },
  },
};
</script>

<style scoped>

</style>
