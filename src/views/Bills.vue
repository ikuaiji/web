<template>
  <template v-for="iter of bills_by_day" :key="iter.first" >
    <el-divider content-position="left">{{iter[0]}}</el-divider>
    <el-table :data="iter[1]" row-key="ID">
      <el-table-column type="expand" look="展开">
        <template #default="props">
          <el-form inline size="mini">
            <el-row>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="props.row.CategoryId">
                    <template #prefix>科目</template>
                    <el-option label="未设置" :value="0"></el-option>
                    <el-option v-for="(categoryName,categoryId) of id_names.categories" :key="categoryId" :label="categoryName" :value="parseInt(categoryId)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="props.row.AccountId">
                    <template #prefix>账户</template>
                    <el-option label="未设置" :value="0"></el-option>
                    <el-option v-for="(accountName,accountId) of id_names.accounts" :key="accountId" :label="accountName" :value="parseInt(accountId)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="props.row.MemberId">
                    <template #prefix>成员</template>
                    <el-option label="未设置" :value="0"></el-option>
                    <el-option v-for="(memberName,memberId) of id_names.members" :key="memberId" :label="memberName" :value="parseInt(memberId)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input :controls="false" :precision="2" type="number" v-model="props.row.Amount">
                    <template #prefix>金额</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="props.row.ProjectId">
                    <template #prefix>项目</template>
                    <el-option label="未设置" :value="0"></el-option>
                    <el-option v-for="(projectName,projectId) of id_names.projects" :key="projectId" :label="projectName" :value="parseInt(projectId)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="props.row.StoreId">
                    <template #prefix>商户</template>
                    <el-option label="未设置" :value="0"></el-option>
                    <el-option v-for="(storeName,storeId) of id_names.stores" :key="storeId" :label="storeName" :value="parseInt(storeId)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-date-picker size="mini" v-model="props.row.BillAt" type="datetime"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                  <el-input size="mini" v-model="props.row.Note" clearable>
                    <template #prefix>备注</template>
                  </el-input>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-form-item>
                  <el-button type="primary" icon="el-icon-upload" @click="saveBill(props.row)">保存</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeBill(props.row)">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </template>
      </el-table-column>

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

      <el-table-column label="成员" width="120" align="center"><template #default="scope">{{ idToName("members", scope.row.MemberId) }}</template></el-table-column>

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
    idToName(type,id) {
      return this.id_names[type][id]
    },
    saveBill(bill) {
      //TODO
      console.log(bill)
    },
    removeBill(bill) {
      //TODO
      console.log(bill)
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
