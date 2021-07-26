<template>
  <div class="addproduct boxright">
    <el-tabs v-model="temp.Type" type="card" @tab-click="changedesc()">
       <el-tab-pane v-for="item in TypeList" :label="item.Text" :name="item.Value" :key="item.Value"></el-tab-pane>
    </el-tabs>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="0"
      style="width: 1100px;"
    >
      <el-form-item label="" prop="Controller" style="width:1100px">
        <Tinymce ref="editor" v-model="temp.Controller" :key="tinymceFlag" :height="700" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import Tinymce from '@/components/Tinymce';
export default {
  name: "addproduct",
  components: {Tinymce },
  data() {
    return {
      temp: {
        Id:0,
        Type:'0',
        Controller:'',
      },
      TypeList:[],
      List:[],
      tinymceFlag:1,
      rules: {
        Controller: [
          { required: true, message: "内容必须填写！", trigger: "blur" }
        ],
      },  
    };
  },
  created() {
    this.getdetail();
  },
  methods: {
    changedesc(){
      this.getdetail();     
    },
    getdetail() {
      request({
        url: "Copywriting/GetCopywritingList",
        method: "get",
        params: { type: this.temp.Type }
      }).then(response => {
        if (response.Status == 1) {
          this.TypeList=response.TypeList;
          this.List=response.List;
          this.temp.Controller='';
          this.temp.Id='';
          this.$refs.editor.setContent(this.temp.Controller);   
          for(let i in this.List){
            if(this.List[i].Type==this.temp.Type){
              this.temp.Id=this.List[i].Id;
              this.temp.Controller=this.List[i].Controller;
              this.$refs.editor.setContent(this.List[i].Controller);
            }
          } 
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      });
    },    
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Copywriting/SetCopywriting",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {
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
.addproduct {
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  
  .chicun {
    color: #f00;
  }
}
</style>
