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
            <el-button type="text" icon="el-icon-delete" style="color: red"/>
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
                <el-button type="text" size="small" icon="el-icon-more"/>
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
      hrs: [],
      keywords: '',
    };
  },
  methods: {
    enabledChange(hr) {
      this.$http.put('/system/hr', {
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
