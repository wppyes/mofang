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
        <el-form-item label="积分" prop="integral">
          <el-input v-model="temp.integral" placeholder="请输入积分"/>
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
        integral: ''
      },      
      rules: {
        integral: [{ required: true, message: "积分必须填写！", trigger: "change" }],    
      }
    };
  },
  created() {
    request({
      url: "Integral/GetIntegral",
      method: "get",
      params: {}
    }).then(response => {
       if(response.Status){ 
        this.temp.integral = response.Model;
       }
    });
  },
  methods: {
     createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Integral/SetIntegral",
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
