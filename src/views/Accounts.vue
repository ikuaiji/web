<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="银行账户">
      <el-space wrap size="large">
        <el-card v-for="iter of accounts.bank" :key="iter.ID">
          <template #header>{{iter.Name}}</template>

          <h1><span style="color:gray;font-size:10px;">CNY:</span>{{get_balance(iter.ID)}}</h1>
          <el-button class="button" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button class="button" type="text" icon="el-icon-delete">删除</el-button>
          <el-button class="button" type="text" icon="el-icon-view">隐藏</el-button>
          <el-button class="button" type="text" icon="el-icon-document">对账</el-button>
        </el-card>
      </el-space>
    </el-tab-pane>

    <el-tab-pane label="虚拟账户">
      <el-space wrap size="large">
        <el-card v-for="iter of accounts.virtual" :key="iter.ID" >
          <template #header>{{iter.Name}}</template>

          <h1><span style="color:gray;font-size:10px;">CNY:</span>{{get_balance(iter.ID)}}</h1>
          <el-button class="button" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button class="button" type="text" icon="el-icon-delete">删除</el-button>
          <el-button class="button" type="text" icon="el-icon-view">隐藏</el-button>
          <el-button class="button" type="text" icon="el-icon-document">对账</el-button>
        </el-card>
      </el-space>
    </el-tab-pane>

    <el-tab-pane label="借贷账户">
      <el-space wrap size="large">
        <el-card v-for="iter of accounts.debt" :key="iter.ID" >
          <template #header>{{iter.Name}}</template>

          <h1><span style="color:gray;font-size:10px;">CNY:</span>{{get_balance(iter.ID)}}</h1>
          <el-button class="button" type="text" icon="el-icon-edit">编辑</el-button>
          <el-button class="button" type="text" icon="el-icon-delete">删除</el-button>
          <el-button class="button" type="text" icon="el-icon-view">隐藏</el-button>
          <el-button class="button" type="text" icon="el-icon-document">对账</el-button>
        </el-card>
      </el-space>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import axios from 'axios'

export default{
  data() {
    return {
      accounts:{
        debt:[],
        bank:[],
        virtual:[],
      },
      account_balances:{},
    }
  },
  methods:{
    get_balance(id) {
      return Math.round(this.account_balances[id] * 100)/100
    },
    saveBill(bill) {
      //TODO
      console.log(bill)
    },
  },
  mounted () {
    let that=this

    axios.get("/api/account_balances").then(function (response) {
      if (response.data.code!=0) {
        //todo:提示错误信息
        return
      }

      that.account_balances = response.data.data
    })

    axios.get("/api/accounts").then(function (response) {
      if (response.data.code!=0) {
        //todo:提示错误信息
        return
      }

      //分类账户，并过滤掉隐藏账户
      let debt=[]
      let bank=[]
      let virtual=[]
      for (const account of response.data.data) {
        if (account.Hide) {
          continue;
        }
        switch(account.Type) {
          case "debt": debt.push(account); break;
          case "bank": bank.push(account); break;
          case "virtual": virtual.push(account); break;
        }
      }

      that.accounts.debt = debt
      that.accounts.bank = bank
      that.accounts.virtual = virtual
    })
  }
}
</script>
