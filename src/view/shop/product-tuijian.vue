<template>
  <div class="product-unit boxright">
    <div class="filter-container">
        <div class="filter-item">
          <el-button type="primary" @click="handleadd(0,'增加专题',true)"><i class="el-icon-circle-plus"></i> 增加专题</el-button>
        </div>
      </div>
    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="专题" prop="Name" align="center">
      </el-table-column>
      <el-table-column label="排序" align="center">
         <template slot-scope="scope">
          <span @click="sort(scope.row,scope.$index,-1)" :class="scope.$index==0?'disabled':''">  
          <i class="fa fa-arrow-up"></i>上移  
          </span>&nbsp;&nbsp;&nbsp;  
          <span @click="sort(scope.row,scope.$index,+1)" :class="scope.$index==list.length-1?'disabled':''">  
          <i class="fa fa-arrow-down"></i>下移  
          </span> 
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
         <template slot-scope="scope">
          <el-button
            size="mini"  type="primary"
            @click="handleditor(scope.row,'修改专题',false)"><i class="el-icon-edit"></i> 编辑</el-button>
          <el-button
            size="mini"  type="primary"
            @click="setprodut(scope.row)"><i class="el-icon-edit"></i> 设置产品</el-button>
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="专题名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写专题名称"/>
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
  name: "menus",
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
        Id: 0,
        Name: ''
      },
      flag:true,//排序连点禁止
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      iscreate:false,//是否是添加
      rules: {
        Name: [{ required: true, message: '专题名称必须填写！', trigger: 'blur' }]
      },
    };
  },
  created() {
      this.getList()
  },
  mounted () {
    this.$bus.$on('choicechange', ()=> {
      this.getList()
    })
  },
  methods: {
    getList(){
      request({
        url: "Special/GetSpecialList",
        method: "get",
        params: {}
      }).then(response => {
        if(response.Status==1){
          this.list = response.List;
          this.listLoading = false;
        }
      });
    },
    setprodut(row){
       this.$router.push({
        path: "/shop/product-tuijian/choice-product",
        query: { id:row.Id }
      });
    },
    handleditor(row,title,creat){      
      this.temp={
        Id: row.Id,
        Name: row.Name
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handledel(row){
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除该专题吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "Special/Del",
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
    handleadd(row,title,creat,index){   
      this.temp={
          Id: 0,
          Name: ''
      };
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      var data=this.$qs.stringify(this.temp);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          request({
            url: "Special/SetSpecial",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              if(this.iscreate){
                this.temp.Id=response.Id;
                this.list.push(this.temp);            
              }else{
                 for (let i in this.list) {
                    if (this.list[i].Id === this.temp.Id) {
                      this.list[i].Name=this.temp.Name;
                      break
                    }
                  }             
              }
              this.dialogFormVisible = false
              this.$message({
                message: response.Msg,
                type: 'success'
              })
            }
          });
        }
      })
    },    
    sort: function (item, index, type) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移  
        this.setup(item, index, type,this.list);
    },
    setup: function (item, index, type, arr1) {
        if (!this.flag) {
            return;
        }
        this.flag = false;
        if ((type < 0 && index == 0) || (type > 0 && index == arr1.length - 1)) {
            return;
        }; 
        var temp = arr1[index];        
        var id1 = item.Id, id2 = arr1[index + type].Id;//当前id为 id1,替换id为id2
        var data=this.$qs.stringify({id1: id1, id2: id2,});
        request({
          url: "Special/Sort",
          method: "post",
          data
        }).then(response => {
          if(response.Status==1){              
            this.$set(arr1, index, arr1[index + type]);
            this.$set(arr1, index + type, temp);
          }
          this.flag = true;
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .product-unit .disabled{color: #C0C4CC;}
  .product-unit span{cursor: pointer;}
</style>
