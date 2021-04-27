<template>
  <el-select :value="value" @input="$emit('input', $event.target.value)">
    <el-option label="全部账户" :value="0"></el-option>
    <el-option-group v-for="(accounts, t) of account_groups" :key="t" :label="t">
      <el-option v-for="(account) of accounts" :key="account.ID" :label="account.Name" :value="account.ID"></el-option>
    </el-option-group>
  </el-select>
</template>

<script>
import axios from 'axios'

export default{
  props:['value'],
  data() {
    return {
      account_groups:{
        virtual:[],
        bank:[],
        debt:[],
        hidden:[],
      },
    }
  },
  mounted () {
    let that=this

    axios.get("api/accounts").then(function (response) {
      if (response.data.code!=0) {
        //todo:提示错误信息
        return
      }

      //分类账户，并过滤掉隐藏账户
      let debt=[]
      let bank=[]
      let virtual=[]
      let hidden=[]
      for (const account of response.data.data) {
        if (account.Hide) {
          hidden.push(account)
          continue
        }
        switch(account.Type) {
          case "debt": debt.push(account); break;
          case "bank": bank.push(account); break;
          case "virtual": virtual.push(account); break;
        }
      }

      that.account_groups.debt = debt
      that.account_groups.bank = bank
      that.account_groups.virtual = virtual
      that.account_groups.hidden = hidden
    })
  }
}
</script>

