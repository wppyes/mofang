<template>
  <div class="advise boxright">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in DDL" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select> 
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="类型" align="center" prop="TypeStr" width="120px"></el-table-column>
      <el-table-column label="内容" align="left" prop="Details"></el-table-column> 
      <el-table-column label="时间" align="center" prop="CreatedStr" width="180px"></el-table-column> 
      <el-table-column label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handle(scope.row)" v-if="scope.row.Status==0">
            操作
          </el-button>
          <el-button size="mini" type="primary" @click="show(scope.row)">
            详情
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
    <el-dialog title="详情" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="710px">
        <div class="details">
          {{detail}}
        </div>
        <el-divider content-position="left">图片展示</el-divider>
        <el-image v-for="item in img"
          style="width: 80px; height: 80px; margin:10px"
          :src="item" 
          :key="item"
          :preview-src-list="img">
        </el-image>
        
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "advise",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        type:''
      },
      img:[],      
      detail:'',
      DDL:[],
      dialogFormVisible:false,
    };
  },
  created() {  
    request({
        url: "PComplaint/GetDDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.DDL = response.List;
        }
    });
    this.getList(); 
  },
  mounted () {
  },  
  methods: {
    show(row){
      this.img=[];
      this.detail=row.Details;
      if(row.Img){
        this.img=JSON.parse(row.Img)
      };
      this.dialogFormVisible=true;
    },
    getList(){
      this.listLoading = true;
      request({
        url: "PComplaint/GetPComplaintList",
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
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },   
    handle(row){
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定已处理该问题吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Guarantee/UpdateStatus",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });              
              row.Status=value;
              row.StatusStr='已处理';
            }
          });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .advise{
    .status2{color:#F56C6C;}
    .status0{color:#67C23A;}
    .status1{color:#E6A23C;}
    .status3{color:#409EFF;}
    .status4{color:#909399;}
    .details{line-height: 40px;}
  }
</style>
