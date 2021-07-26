<template>
  <div class="navconfig boxright">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="MchId" prop="MchId">
            <el-input v-model="temp.MchId" placeholder="请填写MchId" show-password/>
          </el-form-item>
          <el-form-item label="AppId" prop="AppId">
            <el-input v-model="temp.AppId" placeholder="请填写AppId" show-password/>
          </el-form-item>
          <el-form-item label="ApiKey" prop="ApiKey">
            <el-input v-model="temp.ApiKey" placeholder="请填写ApiKey" show-password/>
          </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "navconfig",
  data() {
    return {
      temp:{
        AppId:'',
        MchId:'',
        ApiKey:''
      },      
      rules: {
        AppId: [
          { required: true, message: "AppId必须填写！", trigger: "blur" }
        ],
        MchId: [
          { required: true, message: "MchId必须填写！", trigger: "blur" }
        ],
        ApiKey: [{ required: true, message: "ApiKey必须填写！", trigger: "blur" }]
      }
    };
  },
  created() {
    request({
      url: "MallPayment/GetMallPayment",
      method: "get",
      params: {}
    }).then(response => {
       if(response.Status){ 
        this.temp.AppId = response.Model.AppId;
        this.temp.MchId = response.Model.MchId;
        this.temp.ApiKey = response.Model.ApiKey;
       }
    });
  },
  methods: {
     createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "MallPayment/UpdateMallPayment",
            method: "post",
            data
          }).then(response => {
            if (response.Status) {  
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },    
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.navconfig .tdspan span {
  margin-right: 10px;
}
  .navconfig .disabled{color: #C0C4CC;}
  .navconfig span{cursor: pointer;}
.navconfig  .chicun {
    color: #f00;
  }
</style>
