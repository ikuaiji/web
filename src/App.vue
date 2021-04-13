<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeNav" mode="horizontal" :router="true">
        <el-menu-item index="Home" :route="{name: 'Home'}">Home</el-menu-item>
        <el-menu-item index="Bills" :route="{name: 'Bills'}">Bills</el-menu-item>
        <el-menu-item index="Accounts" :route="{name: 'Accounts'}">Accounts</el-menu-item>
        <el-menu-item index="About" :route="{name: 'About'}">About</el-menu-item>
      </el-menu>
    </el-header>
    <el-main><router-view/></el-main>
  </el-container>
</template>

<script>
export default{
  computed: {
    activeNav() {
      return this.$route.name
    }
  }
}
</script>
