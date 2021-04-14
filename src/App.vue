<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeNav" mode="horizontal" :router="true">
        <el-menu-item index="Home" :route="{name: 'Home'}">概览</el-menu-item>
        <el-menu-item index="Bills" :route="{name: 'Bills'}">记一笔</el-menu-item>
        <el-menu-item index="Accounts" :route="{name: 'Accounts'}">账户</el-menu-item>
      </el-menu>
    </el-header>
    <el-main><router-view/></el-main>
  </el-container>
</template>

<style>
*{font-family:'monaco';}
</style>

<script>
export default{
  computed: {
    activeNav() {
      return this.$route.name
    }
  }
}
</script>
