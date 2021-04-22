<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="科目报表">
      <el-date-picker v-model="filter_month" :default-value="filter_month" type="month" placeholder="选择月" @change="do_filter"></el-date-picker>
      <el-divider></el-divider>
      <el-space alignment="stretch" wrap>
        <el-card v-for="bills_group of bills_by_category" :key="bills_group.Name">
          <template #header>{{bills_group.ParentName}}</template>

          <el-table :data="bills_group.children" show-summary :show-header="false">
            <el-table-column label="分类" prop="Name"></el-table-column>
            <el-table-column label="总金额" prop="Amount" width="160" align='right'></el-table-column>
          </el-table>
        </el-card>
      </el-space>
    </el-tab-pane>
  </el-tabs>
</template>

<style>
.el-card{min-height: 500px; min-width:400px}
</style>

<script>
import axios from 'axios'

export default{
  data() {
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
      category_id_names:{},
      category_parent_id_names:{},
      bills_by_category:[],
    }
  },
  methods:{
    categoryIdToName(id) {
      return this.category_id_names[id]
    },
    categoryParentIdToName(id) {
      return this.category_parent_id_names[id]
    },
    do_filter(){
      const query = {
        year: this.filter_month.getFullYear(),
        month: this.filter_month.getMonth(),
      }
      this.$router.push({query:query})
      this.loadCategorySums();
    },
    async loadCategories(){
      let that=this
      await axios.get("api/categories").then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        let category_id_names = {}
        for (let category of response.data.data) {
          category_id_names[category.ID] = category.Name
        }

        let category_parent_id_names = {}
        for (let category of response.data.data) {
          category_parent_id_names[category.ID] = category_id_names[category.ParentId]
        }

        that.category_id_names = category_id_names
        that.category_parent_id_names = category_parent_id_names
      })
    },
    async loadCategorySums(){
      let that=this
      const params = {
        year: this.filter_month.getFullYear(),
        month: this.filter_month.getMonth() + 1,//Month是从0开始的
      }
      await axios.get("api/category_sums", {params: params}).then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        console.log(that.category_id_names)
        console.log(that.category_parent_id_names)
        //遍历各科目的总金额，并按父科目分组
        let bills_by_parent_category_name=new Map()
        for (let category_id in response.data.data) {
          let category_name = that.category_id_names[category_id]
          let category_parent_name = that.category_parent_id_names[category_id]

          if (!bills_by_parent_category_name.has(category_parent_name)) {
            bills_by_parent_category_name.set(category_parent_name, [])
          }

          let amount = Math.round(response.data.data[category_id] * 100)/100
          bills_by_parent_category_name.get(category_parent_name).push({Name: category_name, Amount: amount})
        }

        console.log("bills_by_parent_category_name",bills_by_parent_category_name)

        let bills_by_category = []
        for (let [category_parent_name, bills] of bills_by_parent_category_name) {
          bills_by_category.push({ParentName: category_parent_name, children: bills})
        }

        console.log("bills_by_category",bills_by_category)
        console.log(bills_by_category)
        that.bills_by_category = bills_by_category
      })

    }
  },
  async mounted () {
    await this.loadCategories()
    await this.loadCategorySums()
  }
}
</script>
