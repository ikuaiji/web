<template>
  <el-row>
    <el-select v-model="filter_account" @change="do_filter">
      <el-option label="全部账户" :value="0"></el-option>
      <el-option v-for="(accountName,accountId) of id_names.accounts" :key="accountId" :label="accountName" :value="parseInt(accountId)"></el-option>
    </el-select>
  </el-row>

  <el-table :data="bills_tree" default-expand-all row-key="ID" :indent="0">
    <el-table-column label="科目" width="140" align="center">
      <template #default="scope">
        <strong v-if="scope.row.children">{{scope.row.ID}}</strong>
        <template v-else>{{idToName("categories", scope.row.CategoryId)}}</template>
      </template>
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

    <el-table-column label="备注">
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
  </el-table>
</template>

<script>
import axios from 'axios'

export default{
  data() {
    let account_id = parseInt(this.$route.query.account_id);
    if (isNaN(account_id)) {
      account_id = 0;
    }
    return {
      filter_account: account_id,//过滤的账户
      bills_by_day: new Map(),
      bills_tree:[],
      id_names:{},
    }
  },
  methods:{
    idToName(type,id) {
      let name = this.id_names[type][id]
      if (name) {
        return name
      }

      if (type=="categories") {
        return '-'
      }
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
      this.$router.push({query:{account_id: this.filter_account}})
      this.load_data();
    },
    load_data(){
      let that=this
      axios.get("/bills", {params: {account_id: this.filter_account}}).then(function (response) {
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
