<template>
  <el-form label-width="120px" label-position="left">
    <el-form-item label="账户名称"><el-input v-model="account.Name" style="width:213px"/></el-form-item>

    <el-form-item label="账户类型">
      <el-select v-model="account.Type">
        <el-option label="借贷账户" value="debt"></el-option>
        <el-option label="银行账户" value="bank"></el-option>
        <el-option label="虚拟账户" value="virtual"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="隐藏"><el-switch v-model="account.Hide"></el-switch></el-form-item>

    <el-form-item>
      <el-button icon="el-icon-folder-checked" type="primary" @click="saveaccount">保存</el-button>
      <el-button icon="el-icon-delete" type="danger" size="small">删除</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'

export default{
  props:['id'],
  data() {
    return {
      account: {},
      id_names:{},
    }
  },
  methods:{
    load_data(){
      let that=this
      axios.get("api/account/" + this.id).then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        that.account = response.data.data
      })
    },
    saveaccount(){
      let that=this
      axios.post("api/account/" + this.id, this.account).then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        that.$router.go(-1)
      })
    }
  },
  mounted () {
    this.load_data();
  }
}
</script>
