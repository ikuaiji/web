<template>
  <el-row>
    <el-space>
      <el-select v-model="filter_account" @change="do_filter">
        <el-option label="全部账户" :value="0"></el-option>
        <el-option v-for="(accountName,accountId) of id_names.accounts" :key="accountId" :label="accountName" :value="parseInt(accountId)"></el-option>
      </el-select>

      <el-date-picker v-model="filter_month" :default-value="filter_month" type="month" placeholder="选择月" @change="do_filter"></el-date-picker>
    </el-space>
  </el-row>

  <el-table :data="bills_tree" default-expand-all row-key="ID" size="mini" highlight-current-row>
    <el-table-column label="时间" width="140">
      <template #default="scope">
        <strong v-if="scope.row.children">{{scope.row.ID}}</strong>
        <template v-else>{{scope.row.BillAt.substring(11,19)}}</template>
      </template>
    </el-table-column>

    <el-table-column label="科目" width="140" align="center">
      <template #default="scope">{{idToName("categories", scope.row.CategoryId)}}</template>
    </el-table-column>

    <el-table-column label="类型" width="60" prop="Type">
      <template #default="scope">
        <el-tag effect="plain" size="mini" v-if="scope.row.Type=='income'" type="success">收</el-tag>
        <el-tag effect="plain" size="mini" v-if="scope.row.Type=='outcome'" type="warning">支</el-tag>
        <el-tag effect="plain" size="mini" v-if="scope.row.Type=='alter'" type="danger">改</el-tag>
        <el-tag effect="plain" size="mini" v-if="scope.row.Type=='transfer'" type="info">转</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="金额" width="100" prop="Amount" align="right"></el-table-column>

    <el-table-column label="账号" width="120" prop="AccountId" align="center">
      <template #default="scope">{{ idToName("accounts", scope.row.AccountId) }}</template>
    </el-table-column>

    <el-table-column label="成员" width="120" align="center"><template #default="scope">{{ idToName("members", scope.row.MemberId) }}</template></el-table-column>

    <el-table-column label="商户/对方账号" width="150" align="center">
      <template #default="scope">
        <template v-if="scope.row.Type!='transfer'">{{ idToName("stores", scope.row.StoreId) }}</template>
        <template v-else>{{ idToName("accounts", scope.row.Account2Id) }}</template>
      </template>
    </el-table-column>

    <el-table-column label="备注" :show-overflow-tooltip="true">
      <template #default="scope">
        <el-space v-if="scope.row.children">
          <el-tag effect="plain" size="mini" type="success">收:{{scope.row.Summary.Income}}</el-tag>
          <el-tag effect="plain" size="mini" type="warning">支:{{scope.row.Summary.Outcome}}</el-tag>
          <el-tag effect="plain" size="mini" type="info"   >转:{{scope.row.Summary.Transfer}}</el-tag>
          <el-tag effect="plain" size="mini" type="danger" >改:{{scope.row.Summary.Alter}}</el-tag>
        </el-space>
        <template v-else>{{scope.row.Note}}</template>
      </template>
    </el-table-column>

    <el-table-column label="-" width="120">
      <template #default="scope">
        <router-link :to="{name:'Bill', params:{id: scope.row.ID}}" v-if="!scope.row.children">
          <el-button icon="el-icon-edit" plaint size="mini"></el-button>
        </router-link>
      </template>
    </el-table-column>
  </el-table>
</template>

<style>
/*每日汇总行的样式*/
.el-table .summary-row{background: #f5f7fa;color:blue;font-size:1.2em;}
</style>

<script>
import axios from 'axios'

export default{
  data() {
    let account_id = parseInt(this.$route.query.account_id);
    if (isNaN(account_id)) {
      account_id = 0;
    }

    //从URL Query中初始化
    let month = new Date()
    if (this.$route.query.year) {
      month.setYear(this.$route.query.year)
    }
    if (this.$route.query.month) {
      month.setMonth(this.$route.query.month)
    }

    return {
      filter_month: month,
      filter_account: account_id,//过滤的账户
      bills_by_day: new Map(),
      bills_tree:[],
      id_names:{},
    }
  },
  methods:{
    idToName(type,id) {
      if (id == null) {
        return
      }

      let name = this.id_names[type][id]
      if (name != null) {
        return name
      }

      if(type=="accounts") {
        return "未知账户"
      }
      if(type=="categories") {
        return "未分类"
      }

      return "-"
    },
    tableRowClassName(param) {
      if (param.row.children) {
        return 'summary-row'
      }
      return ''
    },
    saveBill(bill) {
      //TODO
      console.log(bill)
    },
    removeBill(bill) {
      //TODO
      console.log(bill)
    },
    do_filter(){
      const query = {
        account_id: this.filter_account,
        year: this.filter_month.getFullYear(),
        month: this.filter_month.getMonth(),
      }
      this.$router.push({query:query})
      this.load_data();
    },
    load_data(){
      let that=this
      const params = {
        account_id: this.filter_account,
        year: this.filter_month.getFullYear(),
        month: this.filter_month.getMonth() + 1,//Month是从0开始的
      }

      axios.get("api/bills", {params: params}).then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        that.id_names = response.data.data.id_names

        //账目需要按日期分组
        let bills_by_day = new Map()
        for (const bill of response.data.data.bills) {
          let day = bill.BillAt.substring(0,10)
          if (!bills_by_day.has(day)) {
            bills_by_day.set(day,new Array())
          }
          bills_by_day.get(day).push(bill)
        }

        let bills_tree = []
        for (let [day, bills] of bills_by_day) {
          let total = 0
          let income = 0
          let outcome= 0
          let transfer= 0
          let alter= 0
          for (let bill of bills) {
            total += bill.Amount
            switch(bill.Type) {
              case "income": income += bill.Amount; break
              case "outcome": outcome += bill.Amount; break
              case "transfer": transfer += bill.Amount; break
              case "alter": alter += bill.Amount; break
            }
          }
          let summary = {Total:total, Income:income, Outcome: outcome, Transfer: transfer, Alter:alter}
          bills_tree.push({ID: day, Summary:summary, children: bills})
        }

        that.bills_by_day = bills_by_day
        that.bills_tree = bills_tree
      })
    }
  },
  mounted () {
    this.load_data();
  }
}
</script>
