<template>
  <template v-for="iter of bills_by_day" :key="iter.first" >
    <el-divider content-position="left">{{iter[0]}}</el-divider>

    <el-table :data="iter[1]">
      <el-table-column label="科目" width="120" align="center">
        <template #default="scope">{{ idToName("categories", scope.row.CategoryId) }}</template>
      </el-table-column>

      <el-table-column label="类型" width="60" prop="Type">
        <template #default="scope">
          <el-tag v-if="scope.row.Type=='income'" type="success">收</el-tag>
          <el-tag v-if="scope.row.Type=='outcome'" type="warning">支</el-tag>
          <el-tag v-if="scope.row.Type=='alter'" type="danger">改</el-tag>
          <el-tag v-if="scope.row.Type=='transfer'" type="info">转</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="金额" width="100" prop="Amount" align="right"></el-table-column>
      <el-table-column label="账号" width="120" align="center"><template #default="scope">{{ idToName("accounts", scope.row.AccountId) }}</template></el-table-column>
      <el-table-column label="备注" prop="Note"></el-table-column>
    </el-table>
  </template>
</template>

<script>
import axios from 'axios'

export default{
  data() {
    return {
      bills_by_day: new Map(),
      id_names:{},
    }
  },
  methods:{
    idToName: function(type,id) {
      return this.id_names[type][id]
    },
  },
  mounted () {
    let that=this
    axios.get("/bills").then(function (response) {
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
      that.bills_by_day = bills_by_day
    })
  }
}
</script>
