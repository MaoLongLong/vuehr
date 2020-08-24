<template>
    <div id="permiss-mana">
      <el-form size="small" :inline="true" :model="role">
        <el-form-item>
          <el-input style="width: 300px" v-model="role.name" placeholder="角色英文名称">
            <template slot="prepend">ROLE_</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 300px" v-model="role.nameZh" placeholder="角色中文名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRole">添加</el-button>
        </el-form-item>
      </el-form>

      <el-collapse v-model="activeName" accordion style="width: 700px" @change="collapseOpen">
        <el-collapse-item v-for="(role, index) in roles" :key="index"
                          :title="role.nameZh" :name="role.id">
          <el-card>
            <div slot="header">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: red"
                         circle icon="el-icon-delete" type="text" @click="delRole(role)"/>
            </div>
            <el-tree :data="allMenus"
                     node-key="id"
                     ref="tree"
                     :key="index"
                     :default-checked-keys="selectedMenus"
                     :props="props"
                     show-checkbox/>
            <div style="display: flex; justify-content: flex-end">
              <el-button size="mini" @click="activeName = -1">取消修改</el-button>
              <el-button type="primary" size="mini"
                         @click="doUpdate(role.id, index)">确认修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>

<script>
export default {
  name: 'PermissMana',
  data() {
    return {
      activeName: -1,
      role: {
        name: '',
        nameZh: '',
      },
      roles: [],
      allMenus: [],
      props: {
        label: 'name',
        children: 'children',
      },
      selectedMenus: [],
    };
  },
  methods: {
    delRole(role) {
      this.$confirm(`此操作将删除角色【${role.nameZh}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http.delete(`/system/basic/permiss/role/${role.id}`)
            .then((value) => {
              if (value) {
                this.activeName = -1;
                this.initRoles();
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
    addRole() {
      if (this.role.name !== '' && this.role.nameZh !== '') {
        this.$http.post('/system/basic/permiss/role', {
          name: `ROLE_${this.role.name}`,
          nameZh: this.role.nameZh,
        })
          .then((value) => {
            if (value) {
              this.role.name = '';
              this.role.nameZh = '';
              this.initRoles();
            }
          });
      } else {
        this.$message.error('角色信息不能为空');
      }
    },
    doUpdate(id, index) {
      const tree = this.$refs.tree[index];
      const checkedKeys = tree.getCheckedKeys(true);
      this.$http.put(`/system/basic/permiss/menu_role/${id}`, checkedKeys)
        .then((value) => {
          if (value) {
            this.activeName = -1;
          }
        });
    },
    collapseOpen(id) {
      if (id) {
        this.allMenus = [];
        this.selectedMenus = [];
        this.initMenus();
        this.initSelectedMenus(id);
      }
    },
    initSelectedMenus(id) {
      this.selectedMenus = [];
      this.$http.get(`/system/basic/permiss/menu_ids/${id}`)
        .then((value) => {
          if (value) {
            this.selectedMenus = value;
          }
        });
    },
    initMenus() {
      this.$http.get('/system/basic/permiss/menus')
        .then((value) => {
          if (value) {
            this.allMenus = value;
          }
        });
    },
    initRoles() {
      this.$http.get('/system/basic/permiss')
        .then((value) => {
          if (value) {
            this.roles = value;
          }
        });
    },
  },
  mounted() {
    this.initRoles();
  },
};
</script>

<style lang="scss" scoped>

</style>
