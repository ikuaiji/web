<template>
  <el-row>
    <el-col :span="10">
      <h1>资产状况</h1>
      <p>总资产<el-tag type="warning">¥: {{balance}}</el-tag></p>
      <p>今天是您记账的第<el-tag type="success">{{totalDay}}</el-tag>天</p>
      <p>此账本共记录<el-tag>{{records_count}}</el-tag>笔流水</p>
    </el-col>
    <el-col :span="10">
      <h2>收支表</h2>
      <el-table :data="summary_by_time">
        <el-table-column prop="Title"></el-table-column>
        <el-table-column prop="Week" label="本周"></el-table-column>
        <el-table-column prop="Month" label="本月"></el-table-column>
        <el-table-column prop="Year" label="本年"></el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="10">
      <h2>本月分类支出</h2>
    </el-col>
    <el-col :span="10">
      <h2>本月支出趋势图</h2>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios"

export default{
  computed: {
    totalDay(){
      return Math.round((Date.now() - this.from) / (1000*24*60*60))
    },
  },
  data(){
    return {
      from: Date.now(),
      records_count: 1439,
      balance: 108888,
      summary_by_time:[
        //fixme: 用真实数据填充
        {Title: "收入", Week: 55, Month: 666, Year: 7777},
        {Title: "支出", Week: 55, Month: 666, Year: 7777},
      ],
    }
  },
  mounted(){
    this.loadData()
  },
  methods:{
    loadData(){
      let that = this
      axios.get("api/summary").then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        that.from = Date.parse(response.data.data.From)
        that.records_count = response.data.data.RecordsCount
        that.balance = response.data.data.Balance
      })
    }
  }
}
</script>
