<template>
  <div id="pos-mana">
    <el-form size="small" :inline="true" :model="pos" @submit.native.prevent>
      <el-form-item>
        <el-input prefix-icon="el-icon-plus" style="width: 300px"
                  v-model="pos.name" placeholder="添加职位" @keyup.enter.native="addPosition"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addPosition">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="positions"
      stripe
      border
      @selection-change="handleSelectionChange"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="width: 70%">
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
        label="职位名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
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
               :disabled="multipleSelection.length === 0">批量删除</el-button>
    <el-dialog width="30%" title="编辑职位信息"
               @opened="$refs.updateInput.focus()" :visible.sync="dialogFormVisible">
      <el-form :model="updatePos" @submit.native.prevent>
        <el-form-item label="职位名称">
          <el-input ref="updateInput" v-model="updatePos.name"
                    @keyup.enter.native="updatePosition"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePosition">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PosMana',
  data() {
    return {
      dialogFormVisible: false,
      pos: {
        name: '',
      },
      updatePos: {},
      positions: [],
      loading: false,
      disabled: false,
      multipleSelection: [],
    };
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    deleteMany() {
      this.$confirm(`此操作将删除【${this.multipleSelection.length}】个职位, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const ids = [];
          this.multipleSelection.forEach((value) => {
            ids.push(value.id);
          });
          this.$http.delete('/system/basic/pos', { data: ids })
            .then((value) => {
              if (value) {
                this.initPositions();
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
    updatePosition() {
      this.$http.put('/system/basic/pos', this.updatePos)
        .then((value) => {
          if (value) {
            this.dialogFormVisible = false;
            this.initPositions();
          }
        });
    },
    handleEdit(index, row) {
      this.updatePos = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm(`此操作将删除职位【${row.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`/system/basic/pos/${row.id}`)
            .then((value) => {
              if (value) {
                this.initPositions();
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
    initPositions() {
      this.loading = true;
      this.disabled = true;
      this.$http.get('/system/basic/pos')
        .then((value) => {
          this.positions = value;
        })
        .finally(() => {
          this.loading = false;
          this.disabled = false;
        });
    },
    addPosition() {
      if (this.pos.name !== '') {
        this.$http.post('/system/basic/pos', this.pos)
          .then((value) => {
            if (value) {
              this.initPositions();
              this.pos.name = '';
            }
          });
      } else {
        this.$message.error('职位名称不能为空');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
