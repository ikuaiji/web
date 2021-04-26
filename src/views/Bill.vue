<template>
  <el-form label-width="120px" label-position="left">
    <el-form-item label="科目">
      <el-select v-model="bill.CategoryId" :disabled="bill.Type=='alter' || bill.Type=='transfer'">
        <el-option label="无" :value="0"></el-option>
        <el-option v-for="(name, id) in id_names.categories" :key="id" :label="name" :value="parseInt(id)"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="帐户">
      <el-select v-model="bill.AccountId">
        <el-option v-for="(name, id) in id_names.accounts" :key="id" :label="name" :value="parseInt(id)"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="金额"><el-input v-model="bill.Amount" type="number" style="width:213px"/></el-form-item>

    <el-form-item label="成员">
      <el-select v-model="bill.MemberId">
        <el-option label="无" :value="0"></el-option>
        <el-option v-for="(name, id) in id_names.members" :key="id" :label="name" :value="parseInt(id)"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="时间">
      <el-date-picker v-model="bill.BillAt" type="datetime" :clearable="false"></el-date-picker>
    </el-form-item>

    <el-form-item label="项目">
      <el-select v-model="bill.ProjectId">
        <el-option label="无" :value="0"></el-option>
        <el-option v-for="(name, id) in id_names.projects" :key="id" :label="name" :value="parseInt(id)"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="收款帐户/商户">
      <el-select v-if="bill.Type=='transfer'" v-model="bill.Account2Id">
        <el-option label="无" :value="0"></el-option>
        <el-option v-for="(name, id) in id_names.accounts" :key="id" :label="name" :value="parseInt(id)"></el-option>
      </el-select>

      <template v-else-if="bill.Type=='alter'"></template>
      <el-select v-else v-model="bill.StoreId">
        <el-option label="无" :value="0"></el-option>
        <el-option v-for="(name, id) in id_names.stores" :key="id" :label="name" :value="parseInt(id)"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="备注">
      <el-input v-model="bill.Note"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button icon="el-icon-folder-checked" type="primary" @click="saveBill">保存</el-button>
      <el-button icon="el-icon-delete" type="danger" @click="deleteBill">删除</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'

export default{
  props:['id'],
  data() {
    return {
      bill: {},
      id_names:{},
    }
  },
  methods:{
    load_data(){
      let that=this
      axios.get("api/bill/" + this.id).then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        that.id_names = response.data.data.id_names
        that.bill = response.data.data.bill
      })
    },
    saveBill(){
      let that=this
      axios.put("api/bill/" + this.id, this.bill).then(function (response) {
        if (response.data.code!=0) {
          //todo:提示错误信息
          return
        }

        that.$router.go(-1)
      })
    },
    deleteBill(){
      let that=this
      axios.delete("api/bill/" + this.id, this.bill).then(function (response) {
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
