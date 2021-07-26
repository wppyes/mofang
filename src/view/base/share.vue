<template>
  <div class="bannerlist boxright">
    <div class="filter-container">
        <el-select
          v-model="listQuery.type"
          placeholder="类型"
          clearable
          style="width: 150px"
          class="filter-item"
        >
        <el-option v-for="item in TypeList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" class="filter-item" @click="handleadd('增加分享',true)">
          <i class="el-icon-circle-plus"></i> 增加分享
        </el-button>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="页面" align="center" prop="Type">
        <template slot-scope="scope">
          <span v-text="settype(scope.row.Type)"></span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="Title"></el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.Url+'?imageView2/1/w/150/h/50'">
        </template>
      </el-table-column>
      <el-table-column label="连接" align="center" prop="Link"></el-table-column>
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
      
        <el-form-item label="页面" prop="Type" v-if="temp.Id==0">
          <el-select v-model="temp.Type" placeholder="请选择页面">
            <el-option v-for="item in TypeList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="Title">
          <el-input v-model="temp.Title" placeholder="请填写标题"/>
        </el-form-item>
        <el-form-item label="链接设置" prop="Link">
          <el-input v-model="temp.Link" placeholder="请输入连接"/>
        </el-form-item>
        <el-form-item label="图片：" prop="Url">
          <div class="video">
            <Uploadimgs v-model="temp.Url" ref="upLoadimg"></Uploadimgs>
            <div class="chicun">尺寸：525*420</div>  
          </div>
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
import Uploadimgs from '@/components/Uploadqiniu/single';
export default {
  name: "bannerlist",
  components: {Uploadimgs },
  data() {
    return {
      list: [], //列表
      listLoading: false, //列表加载
      dialogStatus:'',//弹框标题
      dialogFormVisible:false,//是否展示弹框
      iscreate:true,//是否是增加
      temp:{
        Id:0,
        Type:'',
        Link:'',
        Url:'',
        Title:''
      }, 
      listQuery: {
        type: '',
      },
      TypeList:[],
      rules:{   
        Type: [
          { required: true, message: "页面必须选择！", trigger: "blur" }
        ],
        Title: [
          { required: true, message: "标题必须填写！", trigger: "blur" }
        ],
        Url: [
          { required: true, message: "图片必须上传！", trigger: "blur" }
        ],
        Link:[
          { required: true, message: "请填写链接", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    request({
      url: "WXShare/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.TypeList=response.List
      }
    });      
    this.getList();
  },
  methods: {
    settype(type){
      for(let i in this.TypeList){
        if(this.TypeList[i].Value==type){
          return this.TypeList[i].Text
        }
      }
    },
    getList() {
      this.listLoading = true;
      request({
        url: "WXShare/GetWXShareList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.ConfigList=response.ConfigList;
          this.listLoading = false;
        }
      });
    },
    handleFilter(){
      this.getList();
    },
    handleadd(title,creat){
      this.temp.Id=0;
      this.temp.Url='';
      this.temp.Type='';
      this.temp.Link='';
      this.temp.Title='';
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate = creat;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },   
    handleditor(row, title, creat) {
      this.temp.Id=row.Id;
      this.temp.Url=row.Url;
      this.temp.Link=row.Link;
      this.temp.Title=row.Title;
      this.temp.Type=row.Type;
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
              Title:this.temp.Title,
              Url:this.temp.Url,
              Link:this.temp.Link
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "WXShare/SetWXShare",
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
      var data = this.$qs.stringify({ Id: row.Id, Type:this.temp.Type });
      this.$confirm("确定要删除该分享吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "WXShare/Del",
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
