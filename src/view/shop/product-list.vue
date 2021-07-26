<template>
  <div class="product boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加产品
        </el-button>
      </div>
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        style="width: 150px"
        class="filter-item"
        @change="resetfenlei"
      >
        <el-option v-for="item in TypeList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-select  v-if="listQuery.type==2"
          v-model="listQuery.difference"
          placeholder="选择分类"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in DifferenceList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select> 
      <el-select
        v-if="listQuery.type==1"
        v-model="temp.cate1"
        placeholder="一级分类"
        clearable
        style="width: 150px"
        class="filter-item"
        @change="temp.cate2='';listQuery.categoryid=temp.cate1"
      >
        <el-option v-for="item in CategoryList" v-if="item.ParentId==0" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
      </el-select>
      <el-select
        v-if="listQuery.type==1"
        v-model="temp.cate2"
        placeholder="二级分类"
        clearable
        style="width: 150px"
        class="filter-item"
        :disabled="temp.cate1==''"
        @change="listQuery.categoryid=temp.cate2"
      >
        <el-option v-for="item in CategoryList" v-if="item.ParentId==temp.cate1" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in StatusList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-input
        placeholder="请输入商品名称"
        v-model="listQuery.productname"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-select
        v-if="listQuery.type==1"
          v-model="listQuery.receivingtype"
          placeholder="选择邮寄方式"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in ReceivingList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="类型" align="center" prop="Type" width="80px">
        <template slot-scope="scope">
         <span v-text="settype(scope.row.Type)" :class="'status'+scope.row.Type"></span>
        </template>        
      </el-table-column>
      <el-table-column label="产品名称" align="left" prop="ProductName" width="500px"></el-table-column>
      <el-table-column label="产品图片" align="center" width="80px">
        <template slot-scope="scope">
          <img :src="scope.row.ProductImg+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>  
      <el-table-column label="销量" align="center" prop="SaleNum" width="100px"></el-table-column>   
      <el-table-column label="邮寄方式" align="center" prop="ReceivingType" width="80px">
        <template slot-scope="scope">
         <span v-if="scope.row.Type==1" v-text="setyouji(scope.row.ReceivingType)" :class="'status'+scope.row.ReceivingType"></span>
        </template> 
      </el-table-column>
      <el-table-column label="库存" align="left" prop="Specifications" width="250px">
        <template slot-scope="scope">
          <div v-for="item in scope.row.Spec">{{item.AttrName}} {{item.SpecName}}:{{item.Stock}}</div>
        </template>
      </el-table-column>   
      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="scope">
         <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column>  
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row.Id)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="shangjai(scope.row,1,'上架')" v-if="scope.row.Status!=1">
            上架
          </el-button>
          <el-button size="mini" v-if="scope.row.Status==1" type="danger" @click="shangjai(scope.row,2,'下架')">
            下架
          </el-button>
          <el-button size="mini" type="danger" @click="shangjai(scope.row,3,'删除')">
            删除
          </el-button>
          <el-button size="mini" type="primary" @click="zhiding(scope.row)">
            置顶
          </el-button>
          <el-button size="mini" type="primary" @click="chakan(scope.row.Id)" v-if="scope.row.Type==1 && scope.row.Difference>1">
            查看卡密
          </el-button>
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
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "product",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        //搜素分页处理
        productname:'',
        pageIndex: 1,
        pageSize: 15,
        categoryid:'',
        status:'',
        type:'',
        difference:'',
        receivingtype:''
      },
      temp:{
        cate1:'',
        cate2:''
      },
      CategoryList:[],
      StatusList:[],
      TypeList:[],
      DifferenceList:[],
      ReceivingList:[],
    };
  },
  created() {
    this.getList();    
    request({
      url: "Product/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.CategoryList=response.CategoryList;
        this.StatusList=response.StatusList;
        this.TypeList=response.TypeList;  
        this.ReceivingList=response.ReceivingList;  
        this.DifferenceList=response.DifferenceList;   
      }
    });
  },
  mounted () {
    this.$bus.$on('productchange', ()=> {
      this.getList()
    })
  },
  methods: {
    chakan(id){
      this.$router.push({
        path: "/shop/product-list/kami",
        query: { id:id }
      });
    },
    settype(code){
      for(let i in this.TypeList){
        if(this.TypeList[i].Value == code){
          return this.TypeList[i].Text;
        }
      }
    },
    setyouji(code){
      for(let i in this.ReceivingList){
        if(this.ReceivingList[i].Value == code){
          return this.ReceivingList[i].Text;
        }
      }
    },
    resetfenlei(){
      if(this.listQuery.type==2){
        this.listQuery.receivingtype='';
        this.listQuery.categoryid='';
        this.temp.cate1='';
        this.temp.cate2='';
      }else{
        this.listQuery.difference=''
      }
    },
    getList(){
      this.listLoading = true;
      request({
        url: "Product/GetProductList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          for(let i in response.List){
            if(response.List[i].Specifications){
              response.List[i].Spec=JSON.parse(response.List[i].Specifications)
            }
          }
          this.list = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
        }
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },   
    zhiding(row){
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要置顶该产品吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Product/UpdateTime",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {});
    },
    shangjai(row,value,title) {
      var str= value==2?'下架产品彻底消失，确定要'+title+'该产品吗？':'确定要'+title+'该产品吗？';
      var data = this.$qs.stringify({ Id: row.Id,Status:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Product/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=value;
              if(value==3){
                 const index = this.list.indexOf(row)
                this.list.splice(index, 1)
              }
            }
          });
        })
        .catch(() => {});
    },    
    linktoadd(id){
      this.$router.push({
        path: "/shop/product-list/add-product",
        query: { id:id }
      });
    },
    setstatus(code){
      for(let i in this.StatusList){
        if(this.StatusList[i].Value == code){
          return this.StatusList[i].Text;
        }
      }
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.product {
  .img{width:40px; height:40px;}
  .status2{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status3{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
