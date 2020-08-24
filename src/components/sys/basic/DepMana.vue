<template>
  <div id="dep-mana">
    <el-input
      prefix-icon="el-icon-search"
      placeholder="输入部门名称进行搜索"
      class="search-input"
      size="small"
      style="width: 300px"
      v-model="filterText">
    </el-input>

    <el-tree
      class="filter-tree"
      default-expand-all
      :data="deps"
      :props="props"
      :filter-node-method="filterNode"
      ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            @click.stop
            @click="() => showAddDialog(data)">
            添加部门
          </el-button>
          <el-button
            :disabled="data.parentId === -1"
            type="danger"
            size="mini"
            @click.stop
            @click="() => delDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog title="添加部门" :visible.sync="dialogFormVisible" width="30%"
               @opened="$refs.updateInput.focus()">
      <el-form :model="dep">
        <el-form-item label="部门名称">
          <el-input ref="updateInput" @keyup.enter.native="addDep" v-model="dep.name"/>
        </el-form-item>
        <el-form-item label="上级部门">
          <el-input v-model="pname" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDep">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DepMana',
  data() {
    return {
      dep: {
        name: '',
        parentId: -1,
      },
      pname: '',
      dialogFormVisible: false,
      filterText: '',
      deps: [],
      props: {
        label: 'name',
        children: 'children',
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    showAddDialog(data) {
      this.dep.name = '';
      this.dep.parentId = data.id;
      this.pname = data.name;
      this.dialogFormVisible = true;
    },
    addDep() {
      if (this.dep.name !== '') {
        this.$http.post('/system/basic/department', this.dep)
          .then((value) => {
            if (value) {
              this.dialogFormVisible = false;
              this.addDep2Deps(this.deps, value.obj);
            }
          });
      } else {
        this.$message.error('部门名称不能为空');
      }
    },
    addDep2Deps(deps, dep) {
      for (let i = 0; i < deps.length; i += 1) {
        const d = deps[i];
        if (d.id === dep.parentId) {
          d.children = d.children.concat(dep);
          return;
        }
        this.addDep2Deps(d.children, dep);
      }
    },
    removeDep(deps, id) {
      for (let i = 0; i < deps.length; i += 1) {
        const d = deps[i];
        if (d.id === id) {
          deps.splice(i, 1);
          return;
        }
        this.removeDep(d.children, id);
      }
    },
    delDep(data) {
      this.$confirm(`此操作将删除部门【${data.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`/system/basic/department/${data.id}`)
            .then((value) => {
              if (value) {
                this.removeDep(this.deps, data.id);
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    initDeps() {
      this.$http.get('/system/basic/department')
        .then((value) => {
          if (value) {
            this.deps = value;
          }
        });
    },
  },
  mounted() {
    this.initDeps();
  },
};
</script>

<style lang="scss" scoped>
  #dep-mana {
    width: 700px;

    .search-input {
      margin-bottom: 10px;
    }

    .custom-tree-node {
      width: 100%;

      span:nth-child(2) {
        float: right;

        .el-button {
          padding: 4px;
        }
      }
    }
  }
</style>
