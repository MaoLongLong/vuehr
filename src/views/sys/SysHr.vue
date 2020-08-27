<template>
  <div id="sys-hr">
    <el-row type="flex" justify="center" :gutter="20">
      <el-col :span="6" :offset="1">
        <el-input v-model="keywords" placeholder="通过用户名搜索用户"
                  size="small" prefix-icon="el-icon-search"/>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small">搜索</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col v-for="(hr, i) in hrs" :key="i" :span="8">
        <el-card class="box-card">
          <div slot="header" class="card-header">
            <h3>{{ hr.name }}</h3>
            <el-button @click="deleteHr(hr.id)" type="text"
                       icon="el-icon-delete" style="color: red"/>
          </div>
          <div class="box-body">
            <div class="avatar-container">
              <img :src="hr.avatar" class="avatar"/>
            </div>
            <div class="hr-info-container">
              <div><strong>用户名:</strong>{{ hr.name }}</div>
              <div><strong>手机号码:</strong>{{ hr.phone }}</div>
              <div><strong>电话号码:</strong>{{ hr.telephone }}</div>
              <div><strong>地址:</strong>{{ hr.address }}</div>
              <div><strong>是否启用:</strong>
                <el-switch v-model="hr.enabled"
                           @change="enabledChange(hr)"
                           active-color="#13ce66"
                           inactive-color="#ff4949"/>
              </div>
              <div><strong>角色:</strong>
                <el-tag size="small" type="success" v-for="(role, i) in hr.roles" :key="i">
                  {{ role.nameZh }}
                </el-tag>
                <el-popover
                  placement="right"
                  title="角色列表"
                  width="200"
                  @show="showPop(hr)"
                  @hide="hidePop(hr)"
                  trigger="click">
                  <el-select v-model="selectedRoles" multiple placeholder="请选择">
                    <el-option
                        v-for="(role, i) in allRoles"
                        :key="i"
                        :label="role.nameZh"
                        :value="role.id">
                    </el-option>
                  </el-select>
                  <el-button slot="reference" type="text" icon="el-icon-more" size="small"/>
                </el-popover>
              </div>
              <div><strong>备注:</strong></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'SysHr',
  data() {
    return {
      visible: false,
      hrs: [],
      keywords: '',
      allRoles: [],
      selectedRoles: [],
    };
  },
  methods: {
    showPop(hr) {
      this.initAllRoles();
      this.selectedRoles = [];
      hr.roles.map((role) => this.selectedRoles.push(role.id));
    },
    hidePop(hr) {
      this.$http.put(`/system/hr/roles/${hr.id}`, this.selectedRoles)
        .then((value) => {
          if (value) {
            this.initHrs();
          }
        });
    },
    deleteHr(id) {
      this.$http.delete(`/system/hr/${id}`)
        .then((value) => {
          if (value) {
            this.initHrs();
          }
        });
    },
    enabledChange(hr) {
      this.$http.put('/system/hr/enabled', {
        id: hr.id,
        enabled: hr.enabled,
      })
        .then((value) => {
          if (value) {
            this.initHrs();
          }
        });
    },
    initHrs() {
      this.$http.get('/system/hr')
        .then((value) => {
          if (value) {
            this.hrs = value;
          }
        });
    },
    initAllRoles() {
      this.$http.get('/system/hr/roles')
        .then((value) => {
          if (value) {
            this.allRoles = value;
          }
        });
    },
  },
  mounted() {
    this.initHrs();
  },
};
</script>

<style lang="scss" scoped>
  #sys-hr {

    .box-card {
      margin: 20px 0;

      /deep/ .el-card__header {
        padding: 10px 20px;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }

      .box-body {

        .avatar-container {
          display: flex;
          justify-content: center;
          align-items: center;

          .avatar {
            width: 80px;
            border-radius: 50%;
          }
        }

        .hr-info-container {
          margin-top: 20px;

          div {
            margin-bottom: 4px;
          }

          strong {
            color: #409EFF;
            margin-right: 20px;
          }

          .el-tag {
            margin-right: 4px;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
</style>
