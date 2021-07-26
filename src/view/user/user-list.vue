<template>
  <div class="user-list boxright">
    <div class="filter-container">      
        <div class="filter-item" style="margin-right:20px;">
          <el-button type="primary" @click="handleadd('新增用户',true)">
            <i class="el-icon-circle-plus"></i> 新增用户
          </el-button>
        </div>
      <el-input
        placeholder="请输入名称"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="头像" align="center" width="60px">
        <template slot-scope="scope">
          <img :src="scope.row.headimgUrl+'?imageView2/1/w/40/h/40'" class="img">
        </template>
      </el-table-column>  
      <el-table-column label="昵称" align="left" prop="NickName" width="150px"></el-table-column>
      <el-table-column label="性别" align="center" prop="Sex" width="60px">
        <template slot-scope="scope">
          {{scope.row.Sex==1?'男':scope.row.Sex==0?'未知':'女'}}
        </template>
      </el-table-column>    
      <el-table-column label="姓名" align="center" prop="Name" width="100px"></el-table-column>
      <el-table-column label="身份证号" align="center" prop="CardNo" width="210px"></el-table-column>
      <el-table-column label="手机号" align="center" prop="Phone" width="110px"></el-table-column>
      <el-table-column label="积分" align="center" prop="Balance" width="100px"></el-table-column>
      <el-table-column label="注册时间" align="center" prop="CreatedStr" width="170px"></el-table-column>
      <el-table-column label="停留时间" align="center" prop="LastTimeStr" width="170px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showjifen(scope.row)">
            积分明细
          </el-button>
          <el-button size="mini" type="primary" @click="showwuye(scope.row)">
            物业
          </el-button>
          <el-button size="mini" type="primary" @click="addjifen(scope.row)">
            增加积分
          </el-button>
        </template>
      </el-table-column>   
    </el-table>     
      <pagination
      class="pagination-container1"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="titles" :visible.sync="addjifenVisible" :close-on-click-modal="false" width="550px">
       <el-form ref="addjifenForm" :rules="addjifenrules" :model="addjifentemp" label-position="left" label-width="80px" style="width: 480px; margin-left:10px;">
        <el-form-item label="积分" prop="balance">
          <el-input v-model="addjifentemp.balance" placeholder="请填写积分数量"/>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="addjifentemp.remark" placeholder="请填写描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addjifenVisible = false">取消</el-button>
        <el-button type="primary" @click="addsub">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titles" :visible.sync="dialogwuyeVisible" :close-on-click-modal="false" width="550px">
      
    </el-dialog>
    <el-dialog :title="titles" :visible.sync="dialogjifenVisible" :close-on-click-modal="false" width="850px">
      <el-table v-loading="listLoadingjifen" :data="listjifen" border fit highlight-current-row>
        <el-table-column label="类型" align="center" prop="TypeStr"></el-table-column>   
        <el-table-column label="来源" align="center" prop="ClassifyStr"></el-table-column>   
        <el-table-column label="金额" align="center" prop="Amount">
          <template slot-scope="scope">
          <span :class="'status'+scope.row.Type">{{scope.row.Type==1?'+':'-'}}</span>{{scope.row.Amount}}
        </template>
        </el-table-column>
        <el-table-column label="余额" align="center" prop="Balance"></el-table-column>
        <el-table-column label="备注" align="center" prop="Remark"></el-table-column>   
        <el-table-column label="时间" align="center" prop="CreatedStr" width="180px"></el-table-column>
      </el-table> 
      <pagination
        small
        :total="totaljifen"
        :page.sync="jifen.pageIndex"
        :limit.sync="jifen.pageSize"
        @pagination="getjifenList"
      />

    </el-dialog>
    
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="570px">
      <el-form ref="yonghuForm" :rules="yonghurules" :model="yonghutemp" label-position="left" label-width="80px" style="width: 480px; margin-left:10px;">
        <el-form-item label="userid" prop="unionId">
          <el-input v-model="yonghutemp.unionId" placeholder="请填写userid"/>
        </el-form-item>
        <el-form-item label="昵称" prop="NickName">
          <el-input v-model="yonghutemp.NickName" placeholder="请填写昵称"/>
        </el-form-item>
        <el-form-item label="头像" prop="headimgUrl">
          <div class="video">            
            <Uploadimgs v-model="yonghutemp.headimgUrl" ref="upLoadimg"></Uploadimgs>
            <div class="chicun">尺寸：300*300</div>  
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
import Pagination from "@/components/Pagination";
import Uploadimgs from '@/components/Uploadqiniu/single';
export default {
  name: "product",
  components: { Pagination,Uploadimgs },
  data() {
    return {
      list: [], //列表
      listjifen: [], //列表
      total:0,//总数量
      totaljifen:0,//总数量
      listLoading: false, //列表加载
      listLoadingjifen: false, //列表加载
      listQuery: {
        //搜素分页处理
        name:'',
        pageIndex: 1,
        pageSize: 9
      },
      jifen:{
        pageIndex: 1,
        pageSize: 8,
        Userid:''
      },
      titles:'',
      addjifenVisible:false,
      dialogwuyeVisible:false,
      dialogjifenVisible:false,
      dialogFormVisible:false,
      temp:{},
      yonghutemp:{
        NickName:'',
        headimgUrl:'',
        unionId:''
      },
      addjifentemp:{
        userId:'',
        balance:'',
        remark:''
      },
      addjifenrules:{
        balance: [
          { required: true, message: "请填写积分！", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请填写描述！", trigger: "blur" }
        ],
      },
      yonghurules:{  
        headimgUrl: [
          { required: true, message: "头像必须上传！", trigger: "blur" }
        ],
        NickName:[
          { required: true, message: "请填写昵称", trigger: "blur" }
        ],
        unionId:[
          { required: true, message: "请填写userid", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();    
  },
  methods: {
    addjifen(row){
      this.titles='新增'+row.NickName+'的积分'
      this.addjifenVisible=true;
      this.addjifentemp.userId=row.UserId;
      this.addjifentemp.balance='';    
      this.addjifentemp.remark='';

      this.$nextTick(() => {
        this.$refs["addjifenForm"].clearValidate();
      });
    },
    handleadd(){
      this.dialogFormVisible=true;
      this.yonghutemp.NickName='';
      this.yonghutemp.headimgUrl='';    
      this.yonghutemp.unionId='shequmofang'  ;
      this.$nextTick(() => {
        this.$refs["yonghuForm"].clearValidate();
      });
    },
    addsub(){
      this.$refs["addjifenForm"].validate(valid => {
        if (valid) {    
          var data = this.$qs.stringify(this.addjifentemp);
          request({
            url: "User/SaveBalance",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.getList();          
              this.addjifenVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    
    },
    createData(){
       this.$refs["yonghuForm"].validate(valid => {
        if (valid) {    
          var data = this.$qs.stringify(this.yonghutemp);
          request({
            url: "User/SaveUser",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              var param={
                  NickName:this.yonghutemp.NickName,
                  headimgUrl:this.yonghutemp.headimgUrl,
                  unionId:this.yonghutemp.unionId
              }; 
              this.list.push(param)
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
    showjifen(item){
      this.temp=item;
      this.dialogjifenVisible=true;
      this.titles=item.NickName+'的积分明细';
      this.jifen.Userid=item.UserId;
      this.getjifenList()
    },
    showwuye(item){
      this.temp=item;
      this.dialogwuyeVisible=true;
      this.titles=item.Name+'的物业详情';
    },
    getjifenList(){
      this.listLoadingjifen = true;
      request({
        url: "User/GetUserTransactionList",
        method: "get",
        params: this.jifen
      }).then(response => {
        if (response.Status == 1) {
          this.listjifen = response.List;
          this.totaljifen = response.PageCount;
          this.listLoadingjifen = false;
        }
      });
    },
    getList(){
      this.listLoading = true;
      request({
        url: "User/GetUserList",
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
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
  .user-list .img{width: 40px;}
  .user-list{
    .status2{color:#F56C6C;}
    .status0{color:#E6A23C;}
    .status1{color:#67C23A;}
    .status3{color:#409EFF;}
    .status4{color:#909399;}
  }
</style>
