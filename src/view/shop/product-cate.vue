<template>
  <div class="product-cate boxright">
    <div class="filter-container">
        <div class="filter-item">
          <el-button type="primary" @click="handleadd(0,'增加分类',true,true)"><i class="el-icon-circle-plus"></i> 增加分类</el-button>
        </div>
      </div>
    
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <!-- <el-table-column type="expand" align="center">
          <template slot-scope="props">
             <el-table :data="props.row.Category" border fit highlight-current-row >
                <el-table-column label="分类名称" prop="Name" align="center" >
                </el-table-column>           
                <el-table-column label="图片" align="center" width="100px">
                  <template slot-scope="scope">
                    <img :src="scope.row.Img+'?imageView2/1/w/40/h/40'" class="img">
                  </template>
                </el-table-column>  
                <el-table-column label="排序" align="center">
                  <template slot-scope="scope">
                    <span @click="sort2(scope.row,scope.$index,-1,props.$index)" :class="scope.$index==0?'disabled':''">  
                    <i class="fa fa-arrow-up"></i>上移  
                    </span>&nbsp;&nbsp;&nbsp;  
                    <span @click="sort2(scope.row,scope.$index,+1,props.$index)" :class="scope.$index==props.row.Category.length-1?'disabled':''">  
                    <i class="fa fa-arrow-down"></i>下移  
                    </span> 
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"  type="primary"
                      @click="handleditor(scope.row,'修改子分类',false,false)"><i class="el-icon-edit"></i> 编辑</el-button>
                    <el-button
                      size="mini" type="danger"
                      @click="handledel(scope.row)"><i class="el-icon-delete"></i> 删除</el-button>
                  </template>
                </el-table-column>
             </el-table>
          </template>
      </el-table-column> -->
      <el-table-column label="分类名称" prop="Name" align="center">
      </el-table-column>      
      <!-- <el-table-column label="图片" align="center" width="100px">
        <template slot-scope="scope">
          <img v-if="scope.row.Img" :src="scope.row.Img+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>   -->
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
            @click="handleditor(scope.row,'修改分类',true,false)"><i class="el-icon-edit"></i></el-button>
          <el-button
            size="mini" type="danger"
            @click="handledel(scope.row)"><i class="el-icon-delete"></i></el-button>
          <!-- <el-button
            size="mini" type="success"
            @click="handleadd(scope.row,'增加子分类',false,true,scope.$index)"><i class="el-icon-circle-plus"></i> 增加子分类</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">        
        <el-form-item label="类型" prop="Type" style="width:500px">
          <el-select
            v-model="temp.Type"
            placeholder="选择类型"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
          </el-select>
        </el-form-item> 
        <el-form-item label="分类名称" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写分类名称"/>
        </el-form-item>
        <!-- <el-form-item label="图片：" prop="Img">
          <Uploadimgs v-model="temp.Img" ref="upLoadimg"></Uploadimgs>
          <div class="chicun">尺寸：170*170</div>
        </el-form-item> -->
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
  name: "menus",
  components: { Uploadimgs },
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
        Id: 0,
        Name: '',
        ParentId: 0,
        Img:'',
        Type:''
      },
      flag:true,//排序连点禁止
      dialogStatus:'',//面板标题    
      dialogFormVisible: false,//面板是否展示
      ismain:false,//是否一级
      iscreate:false,//是否是添加
      index:0,//当前index
      Model:[],
      rules: {
        Name: [{ required: true, message: '分类名称必须填写！', trigger: 'blur' }],
        Type: [{ required: true, message: '类型必须选择！', trigger: 'blur' }]
      },
    };
  },
  created() {
    request({
      url: "ProductCategory/GetCategoryList",
      method: "get",
      params: {}
    }).then(response => {
      if(response.Status==1){
        this.list = response.List;
        this.listLoading = false;
      }
    });
    request({
      url: "ProductCategory/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if(response.Status==1){
        this.Model = response.List;
      }
    });
  },
  methods: {
    handleditor(row,title,isok,creat){      
      this.temp={
        Id: row.Id,
        Name: row.Name,
        ParentId: row.ParentId,
        Img:row.Img,
        Type:row.Type.toString()
      };
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.ismain=isok;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handledel(row,title,isok){
      var data=this.$qs.stringify({Id:row.Id});
      this.$confirm("确定要删除该产品分类吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           request({
            url: "ProductCategory/Del",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              this.$message({
                message: response.Msg,
                type: 'success'
              });          
              if(row.ParentId==0){
                const index = this.list.indexOf(row)
                this.list.splice(index, 1)
              }else{
                  for(let i in this.list){
                    if(this.list[i].Id===row.ParentId){
                      for (let v in this.list[i].Category) {                      
                        if (this.list[i].Category[v].Id === row.Id) {
                          this.list[i].Category.splice(v, 1)
                          break
                        }
                      }
                    }
                  }
              } 
            }                      
          });
        }).catch(() => {         
      })  
    },
    handleadd(row,title,isok,creat,index){   
      if(isok){
        this.temp={
          Id: 0,
          Name: '',
          ParentId: 0,
          Category:[],
          Img:'',
          Type:''
        };
      }else{
        this.temp={
          Id: 0,
          Name: '',
          ParentId: 0,
          Img:''
        };
      }  
      if(row!=0){
        this.temp.ParentId=row.Id;
      };
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.ismain=isok;
      isok?this.index=0:this.index=index;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          this.subrequest(); 
        }
      })
    },   
    subrequest(){
      var data=this.$qs.stringify(this.temp);
      request({
          url: "ProductCategory/SetCategory",
          method: "post",
          data
        }).then(response => {
          if(response.Status==1){
            if(this.iscreate){
              this.temp.Id=response.Id;
              if(this.ismain){
                this.list.push(this.temp);
              }else{
                this.list[this.index].Category.push(this.temp);
              }              
            }else{
              if(this.temp.ParentId==0){
                for (let i in this.list) {
                  if (this.list[i].Id === this.temp.Id) {
                    this.list[i].Name=this.temp.Name;
                    this.list[i].Img=this.temp.Img;
                    break
                  }
                }
              }else{
                for(let i in this.list){
                  if(this.list[i].Id===this.temp.ParentId){
                    for (let v in this.list[i].Category) {                      
                      if (this.list[i].Category[v].Id === this.temp.Id) {
                        this.list[i].Category[v].Name=this.temp.Name;
                        this.list[i].Category[v].Img=this.temp.Img;
                        break
                      }
                    }
                  }
                }
              }              
            }
            this.dialogFormVisible = false;
            this.$refs.upLoadimg.clearimgs();
            this.$message({
              message: response.Msg,
              type: 'success'
            })
          }
        });
    },
    sort: function (item, index, type) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移  
        this.setup(item, index, type,this.list);
    },
    sort2: function (item, index, type,indexbig) {//使用方法：传递当前数组的item,index下标,-1为上移，+1为下移   
        this.setup(item, index, type,this.list[indexbig].Category);
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
          url: "ProductCategory/Sort",
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
  .product-cate .disabled{color: #C0C4CC;}
  .product-cate span{cursor: pointer;}
  
  .product-cate .chicun {
    color: #f00;
  }
</style>
