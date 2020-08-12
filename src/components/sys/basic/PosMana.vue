<template>
  <div id="pos-mana">
    <el-form size="small" :inline="true" :model="pos" @submit.native.prevent>
      <el-form-item>
        <el-input prefix-icon="el-icon-plus" style="width: 300px"
                  v-model="pos.name" placeholder="添加职位" @keyup.enter.native="addPosition"/>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="addPosition" :disabled="disabled">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="positions"
      stripe
      border
      style="width: 70%">
      <el-table-column
        prop="id"
        label="编号"
        width="50">
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
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PosMana',
  data() {
    return {
      pos: {
        name: '',
      },
      positions: [],
    };
  },
  mounted() {
    this.$http.get('/system/basic/pos')
      .then((value) => {
        this.positions = value;
      });
  },
  methods: {
    addPosition() {
      if (this.pos.name !== '') {
        this.$http.post('/system/basic/pos', this.pos)
          .then((value) => {
            this.positions.push(value.obj);
            this.pos.name = '';
          });
      } else {
        this.$message.warning('职位名称不能为空');
      }
    },
  },
  computed: {
    disabled() {
      return this.pos.name === '';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
