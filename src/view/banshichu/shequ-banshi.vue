<template>
  <div class="shequ-banshi boxright">    
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-button type="primary" @click="handleadd('增加社区',true)">
          <i class="el-icon-circle-plus"></i> 增加社区
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="Name"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改社区',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "bannerlist",
  data() {
    return {
      bannerqu:{
        oid:''
      },
      list: [], //列表
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        Name:'',
        OId:''
      }, 
      rules:{
        Name: [
          { required: true, message: "名称必须填写！", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.temp.OId=this.$route.query.oid;
    this.bannerqu.oid=this.$route.query.oid;
    this.getList();
  },
  methods: {
    backto() {      
      this.$router.go(-1);
    },
    getList() {
      this.listLoading = true;
      request({
        url: "OCommunity/GetCommunityList",
        method: "get",
        params: this.bannerqu
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.listLoading = false;
        }
      });
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.Name='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Name=row.Name;
      console.log(this.temp)
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(){  
      this.$refs["dataForm"].validate(valid => {
        if (valid) {  
          var param={
              Id:this.temp.Id,
              Name:this.temp.Name,
              OId:this.temp.OId
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "OCommunity/SetCommunity",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();          
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },  
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该社区吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "OCommunity/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
