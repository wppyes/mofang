<template>
  <div class="bannerlist boxright">
    
     <el-tabs v-model="temp.Type" type="card" @tab-click="getList()">
        <el-tab-pane v-for="item in TypeList" :label="item.Text" :name="item.Value" :key="item.Value"></el-tab-pane>
      </el-tabs>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" class="filter-item" @click="handleadd('增加分类',true)">
          <i class="el-icon-circle-plus"></i> 增加分类
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名称" align="center" prop="Name"></el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <span @click="sort(scope.row,scope.$index,-1)" :class="scope.$index==0?'disabled':''">
            <i class="fa fa-arrow-up"></i>上移
          </span>&nbsp;&nbsp;&nbsp; 
          <span
            @click="sort(scope.row,scope.$index,+1)"
            :class="scope.$index==list.length-1?'disabled':''"
          >
            <i class="fa fa-arrow-down"></i>下移
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改',false)">
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
        <el-form-item label="标题" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写标题"/>
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
import Pagination from "@/components/Pagination";
import Uploadimgs from '@/components/Uploadqiniu/single';
var validnum = (rule, value, callback) => {
  if (value==0) {
    callback(new Error("请选择"));
    return;
  }
  callback();
};
export default {
  name: "bannerlist",
  components: { Pagination,Uploadimgs },
  data() {
    return {
      list: [], //列表
      flag:true,
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      listLoading:true,
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        Type:'',
        Name:''
      }, 
      TypeList:[],
      templist:[],
      rules:{   
        Name: [
          { required: true, message: "名字必须填写！", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    request({
        url: "EnumMold/GetEnumMoldList",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.TypeList=response.TypeList;
          this.temp.Type=response.TypeList[0].Value;
          this.templist=response.List;
          this.listLoading=false;
          this.getList();
        }
      });
  },
  methods: {
    getList(){
        this.list=[];
          for(let i =0 ;i<this.templist.length; i++){
            if(this.templist[i].Type==this.temp.Type){
              this.list.push(this.templist[i])
            }
          }
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
              Type:this.temp.Type,
              Name:this.temp.Name
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "EnumMold/SetEnumMold",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {   
              if(this.iscreate){
                param.Id=response.Id;
                this.templist.push(param)
              }else{
                for(let i =0 ;i<this.templist.length; i++){
                  if(this.templist[i].Id==this.temp.Id){
                    this.templist[i].Name=this.temp.Name;
                  }
                }
              }
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
      this.$confirm("确定要删除吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "EnumMold/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              const index = this.templist.indexOf(row);
              this.templist.splice(index, 1);
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    sort: function(item, index, type) {
      //使用方法：传递当前数组的item,index下标,-1为上移，+1为下移
      this.setup(item, index, type, this.list);
    },
    setup: function(item, index, type, arr1) {
      if (!this.flag) {
        return;
      }
      this.flag = false;
      if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
        return;
      }
      var temp = arr1[index];
      var id1 = item.Id,
        id2 = arr1[index + type].Id; //当前id为 id1,替换id为id2
      var data = this.$qs.stringify({ id1: id1, id2: id2 });
      request({
        url: "EnumMold/Sort",
        method: "post",
        data
      }).then(response => {
        if (response.Status == 1) {
          this.$set(arr1, index, arr1[index + type]);
          this.$set(arr1, index + type, temp);
          var bigindex1,bigindex2;
          for(let i in this.templist){
            if(this.templist[i].Id==id1){
              bigindex1=i;
            }
            if(this.templist[i].Id==id2){
              bigindex2=i;
            }
          }
          var temp1=this.templist[bigindex1];
          this.$set(this.templist, bigindex1, this.templist[bigindex2]);
          this.$set(this.templist, bigindex2, temp1);
          console.log(this.templist)
        }
        this.flag = true;
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.bannerlist {
  .disabled {
    color: #c0c4cc;
  }
   .el-radio{margin-bottom: 10px;}
  span {
    cursor: pointer;
  }
  .video .avatar-uploader{
    width: 200px;
    .el-upload{width: 200px;
      .avatar{width: 200px;}
    }
    
  }

  .chicun {
    color: #f00;
  }
}
</style>
