<template>
    <div id="sys-basic">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="部门管理" name="depMana">
          <DepMana/>
        </el-tab-pane>
        <el-tab-pane label="职位管理" name="posMana">
          <PosMana/>
        </el-tab-pane>
        <el-tab-pane label="职称管理" name="jobLevelMana">
          <JobLevelMana/>
        </el-tab-pane>
        <el-tab-pane label="奖惩规则" name="ecMana">
          <EcMana/>
        </el-tab-pane>
        <el-tab-pane label="权限组" name="permissMana">
          <PermissMana/>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import DepMana from '../../components/sys/basic/DepMana.vue';
import PosMana from '../../components/sys/basic/PosMana.vue';
import JobLevelMana from '../../components/sys/basic/JobLevelMana.vue';
import EcMana from '../../components/sys/basic/EcMana.vue';
import PermissMana from '../../components/sys/basic/PermissMana.vue';

export default {
  name: 'SysBasic',
  data() {
    return {
      activeName: 'depMana',
    };
  },
  components: {
    PermissMana,
    DepMana,
    PosMana,
    EcMana,
    JobLevelMana,
  },
};
</script>

<style scoped>

</style>
