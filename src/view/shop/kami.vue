<template>
  <div class="kami boxright">
     <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container">
        <div class="filter-item">
          <el-button type="primary" @click="handleadd"><i class="el-icon-circle-plus"></i> 增加卡密</el-button>
          <el-input  placeholder="请输入卡号" v-model="listQuery.number"  style="width: 150px;" clearable/>  
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> 
          <el-button type="danger" @click="delall">删除全部</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleup">上传</el-button>
          <span style="color:#f00;">({{Difference}})</span>
        </div>
      </div>
    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="卡号" prop="Number" align="center">
      </el-table-column>   
      <el-table-column label="状态" prop="Number" align="center">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status">{{scope.row.Status==0?'未使用':'已使用'}}</span>
        </template>
      </el-table-column>     
      <el-table-column label="操作" align="center">
         <template slot-scope="scope">
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      small
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog title="增加卡密" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="卡号" prop="Number">
          <el-input v-model="temp.Number" minlength="4" placeholder="请填写卡号"/>
        </el-form-item>
        <el-form-item label="密码" prop="Kalman">
          <el-input v-model="temp.Kalman" minlength="4" placeholder="请填写密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'上传'+Difference" :visible.sync="dialogwuliuVisible" :close-on-click-modal="false" width="650px">
      <el-form
        ref="datawuliu"
        :rules="ruleswuliu"
        :model="temp1"
        label-position="left"
        label-width="100px"
        style="width: 350px; margin-left:50px;"
      >    
        <el-form-item :label="'上传'+Difference" prop="filepath">          
          <el-upload
              class="upload-demo"
              drag
              ref="upload"
              accept=".xls,.xlsx"
              action=""
              :http-request="upLoad"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogwuliuVisible = false">取消</el-button>
        <el-button type="primary" @click="subwuliu">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
var validlength = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入卡号"));
  } else if (value.length<4) {
    callback(new Error("长度不能小于4"));
  } else {
    callback();
  }
};
import request from "@/utils/request";
import upfile from '@/utils/upload';
import Pagination from "@/components/Pagination";
export default {
  name: "menus",
  components: {Pagination},
  data() {
    return {
      list: null,
      listLoading: true,
      total:0,//总数量
      downloadLoading:false,  
      listQuery: {
        //搜素分页处理
        pid:'',
        pageIndex: 1,
        pageSize: 10,
        number:'',
      },
      temp: {
        Number: '',
        Kalman:'',
        PId:''
      },
      temp1:{
        filepath:'',
        PId:''
      },
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      dialogwuliuVisible:false,
      rules: {
        Number: [{ required: true , validator: validlength, trigger: 'blur' }]
      },
      Difference:'',
      ruleswuliu:{ 
        filepath: [
          { required: true, message: "请上传文件！", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.listQuery.pid = this.$route.query.id;
    this.temp.PId = this.$route.query.id;
    this.temp1.PId = this.$route.query.id;
     request({
        url: "Product/GetProduct_Id",
        method: "get",
        params: {id:this.$route.query.id}
      }).then(response => {
        if (response.Status == 1) {          
          this.Difference = response.Difference;
        }
      });
    this.getList();    
  },
  methods: {  
    backto() { 
      this.$router.go(-1); 
    },  
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    }, 
    getList(){
      this.listLoading = true;
      request({
        url: "Product/GetCodeList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
        }
      });
    },
    delall(){      
      var data=this.$qs.stringify({PId:this.$route.query.id});
      this.$confirm("确定要全部删除吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Product/DelAll",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });   
              this.listQuery.pageIndex = 1; 
              this.getList();      
            }                      
          });
        }).catch(() => {         
      })  
    },
    handledel(row){
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Product/Del",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            }                      
          });
        }).catch(() => {         
      })  
    },
    handleadd(){   
      this.temp.Number='';
      this.temp.Kalman='';
      this.dialogFormVisible=true;
      if(this.$refs['dataForm']){
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
         var data=this.$qs.stringify(this.temp);
          request({
              url: "Product/SetCode",
              method: "post",
              data
            }).then(response => {
              if(response.Status==1){
                let param={
                  Number:this.temp.Number,
                  Kalman:this.temp.Kalman,
                  Id:response.Id,
                  Status:0
                }
                this.dialogFormVisible=false;
                this.list.push(param);
                this.$message({
                  message: response.Msg,
                  type: 'success'
                })
              }
            });
        }
      })
    },
    handleup(){
      this.dialogwuliuVisible=true;
      this.temp1.filepath='';
      this.$nextTick(() => {
        this.$refs["datawuliu"].clearValidate();
      });
    },    
    upLoad(param){
        upfile(param.file,'Upload/UploadFile',(data => {
            if(data.Status){
                this.temp1.filepath=data.Path;
            }else{
                this.$message({
                  message: data.Msg,
                  type: "error"
              });
            };
        }))
    }, 
    subwuliu(){
      this.$refs["datawuliu"].validate(valid => {
        if (valid) { 
          var param={
              filepath:this.temp1.filepath,
              PId:this.temp1.PId
          };  
          var data = this.$qs.stringify(param);
          request({
            url: "Product/UploadQM",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();  
              this.$refs['upload'].clearFiles();  
              this.dialogwuliuVisible = false;
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
  .kami {
  .status1{color:#F56C6C;}
  .status0{color:#409EFF;}
}
</style>
