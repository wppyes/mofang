<template>
  <div class="activity boxright">
    <div class="filter-container">
            <el-select
        v-model="listQuery.cptype"
        placeholder="类型"
        clearable
        style="width: 150px"
        class="filter-item"
        @change="resetfenlei"
      >
        <el-option v-for="item in CPTypeList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-select  v-if="listQuery.cptype==2"
          v-model="listQuery.difference"
          placeholder="选择分类"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in DifferenceList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select> 
      <el-select
        v-if="listQuery.cptype==1"
          v-model="listQuery.receivingtype"
          placeholder="选择邮寄方式"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in ReceivingList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select>
      <el-input
        placeholder="订单编号"
        v-model="listQuery.ordernum"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="用户编号"
        v-model="listQuery.userid"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="产品名字"
        v-model="listQuery.productname"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-input
        placeholder="姓名/手机"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />
      <el-select
        v-model="listQuery.status"
        placeholder="订单状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in Model" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      
      <el-select
        v-model="listQuery.code"
        placeholder="物业选择"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in CompanyList" :label="item.CellName" :value="item.Code" :key="item.Code"></el-option>
      </el-select>
        <el-date-picker
        class="filter-item"
        v-model="value7"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>   
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载订单</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="类型" align="center" prop="CPType" width="80px">
        <template slot-scope="scope">
         {{scope.row.CPType ==1 ?'实体':'虚拟'}}<br/>
         <div v-if="scope.row.CPType ==1">
          <span class="status1" v-if="scope.row.ReceivingType==1 || scope.row.ReceivingType==3 && scope.row.IsMail==1">邮寄</span>
          <span class="status2" v-if="scope.row.ReceivingType==2 || scope.row.ReceivingType==3 && scope.row.IsMail==2">自提</span>
         </div>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="left" prop="PayOrderNum" width="220px">
        <template slot-scope="scope">
         UserId：{{scope.row.UserId}}<br/>内部：{{scope.row.OrderNum}}<br/>支付：{{scope.row.PayOrderNum}}
        </template>
      </el-table-column>
      <el-table-column label="产品" align="left" prop="Title">
        <template slot-scope="scope">
          名称：{{scope.row.ProductName}}
          <br/>
           规格：{{JSON.parse(scope.row.Specifications).AttrName}} {{JSON.parse(scope.row.Specifications).SpecName}}
        </template>
      </el-table-column>
      <el-table-column label="支付" align="left" prop="PayAmount" width="160px">
         <template slot-scope="scope">
          <span>展示价格：{{scope.row.Amount}}</span>元 <br/>
          类型：<span v-text="setype(scope.row.Type)"></span> <br/>
          <span v-if="scope.row.Type!=1">积分：{{scope.row.IntegralPrice}}</span>
          <br/>
          <span v-if="scope.row.Type!=0"> 现金：{{scope.row.CashPrice}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="Number" width="50px"></el-table-column>      
      <el-table-column label="用户信息" align="left" prop="PayOrderNum" width="160px">
        <template slot-scope="scope">
         物业名称：{{scope.row.CellName}}<br/>昵称：{{scope.row.NickName}}<br/>电话：{{scope.row.Phone}}
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr" width="160px"></el-table-column>
      <el-table-column label="状态" align="center" prop="Status" width="100px">
        <template slot-scope="scope">
          <span :class="'status'+scope.row.Status" v-text="setliexing(scope.row.Status)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px" class="caozuo">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
          <el-button size="mini" type="primary" 
          v-if="scope.row.Status==1 && scope.row.CPType==1 && scope.row.ReceivingType==3&& scope.row.IsMail==2 || scope.row.Status==1 && scope.row.CPType==1 && scope.row.ReceivingType==2"
          @click="change(scope.row,6,'发货')">发货</el-button>
          <el-button size="mini" type="primary" 
            v-if="scope.row.Status==1 && scope.row.CPType==1 && scope.row.ReceivingType==3&& scope.row.IsMail==1 || scope.row.Status==1 && scope.row.CPType==1 && scope.row.ReceivingType==1"
             @click="fahuoshou(scope.row)">发货</el-button>             
          <el-button size="mini" type="primary" 
            v-if="scope.row.Status==6 && scope.row.CPType==1 && scope.row.ReceivingType==3 && scope.row.IsMail==1 || scope.row.Status==6 && scope.row.CPType==1 && scope.row.ReceivingType==1" 
            @click="change(scope.row,3,'签收')">签收</el-button>
          <el-button size="mini" type="primary" 
            v-if="scope.row.Status==1 && scope.row.CPType==1 && scope.row.ReceivingType==3&& scope.row.IsMail==1 || scope.row.Status==1 && scope.row.CPType==1 && scope.row.ReceivingType==1"
           @click="dizhishow(scope.row)">修改地址</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.CPType==2 && scope.row.Status==1 &&  scope.row.Difference==1 " @click="chongzhisub(scope.row)">充值</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.CPType==2 && scope.row.Status==10 &&  scope.row.Difference==1 " @click="chongzhisus(scope.row)">成功</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.CPType==2 && scope.row.Status==10 &&  scope.row.Difference==1 " @click="chongzhifail(scope.row)">失败</el-button>
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
    <el-dialog :title="titles" :visible.sync="dialogdingdan" :close-on-click-modal="false" width="700px">
        <ul class="beizhu">
          <li>备注信息：{{item.Remark}}</li>
          <li>规格详情：{{item.Specifications}}</li>
          <li v-if="item.CPType ==1 && item.ReceivingType==1 || item.CPType ==1 && item.ReceivingType==3 && item.IsMail==2">地址：{{item.CellName}}</li>
          <li v-if="item.CPType ==1 && item.ReceivingType==2 || item.CPType ==1 && item.ReceivingType==3 && item.IsMail==1">
            姓名：{{item.objContacts.Name}}<br/>电话：{{item.objContacts.Phone}}<br/>
            地址： {{item.objContacts.Province}}{{item.objContacts.City}}{{item.objContacts.Area}}
              {{item.objContacts.Address}}
            <div v-if="item.objContacts.ShipperName">物流：{{item.objContacts.ShipperName}}<br/> 单号：{{item.objContacts.LogisticCode}}</div>
          </li>
          <li v-if="item.CPType ==2 && item.Difference==1">
            充值号码：{{item.objPhone.Phone}}
          </li>
          <li v-if="item.CPType ==2 && item.Difference==2">
            卡号：{{item.CodeList.Number}}
          </li>
          <li v-if="item.CPType ==2 && item.Difference==3">
            卡号：{{item.CodeList.Number}}<br/>
            密码：{{item.CodeList.Kalman}}
          </li>
          
        </ul>
    </el-dialog>
    <el-dialog title="修改收货地址" :visible.sync="dialogdizhiVisible" :close-on-click-modal="false" width="800px">
      <el-row>
        <el-col :span="10" style="margin-right:20px">
           <el-card >
            <div v-for="item in dizhiist" style="cursor:pointer; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:8px" @click="xuanrandizhi(item)">
             姓名： {{item.Name}}<br/>
             手机： {{item.Phone}}<br/>
             地址： {{item.Address}}<br/>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
           <el-card >
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 300px;">
               <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" placeholder="请收货人姓名"/>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="temp.phone" placeholder="请收货人手机号码"/>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input type="textarea" v-model="temp.address" placeholder="请收货人地址"/>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogdizhiVisible = false">取消</el-button>
        <el-button type="primary" @click="subdizhi">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="发货" :visible.sync="dialogfahuoVisible" :close-on-click-modal="false" width="500px">
       <el-form ref="datafahuo" :rules="rulesfahuo" :model="tempfahuo" label-position="left" label-width="80px" style="width: 300px;">
          <el-form-item label="选择物流" prop="id">
           <el-select
              v-model="tempfahuo.id"
              placeholder="选择物流"
              clearable
              style="width: 150px"
              class="filter-item"
            >
              <el-option v-for="item in wuliuList" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="运单编号" prop="logisticcode">
          <el-input v-model="tempfahuo.logisticcode" placeholder="请收货人运单编号"/>
        </el-form-item>
      </el-form>    
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogfahuoVisible = false">取消</el-button>
        <el-button type="primary" @click="fahuosub">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
var tabarr = [];
export default {
  name: "activity",
  components: { Pagination },
  data() {
    return {
      titles:'',
      Model: [],
      list: [], //列表
      total: 0, //总数量
      listLoading: false, //列表加载
      dialogdingdan:false,
      dialogdizhiVisible:false,
      value7:'',
      downloadLoading:false,
      dialogfahuoVisible:false,
      listQuery: {
        //搜素分页处理
        pageIndex: 1,
        pageSize: 6,
        status: "",  
        ordernum: "",
        userid: "",
        productname: "",      
        starttime:'',
        endtime:'',
        code:'',
        name:'',
        cptype:'',
        receivingtype:'',
        difference:'',
      },
      item:{},
      TypeList:[],
      CompanyList:[],
      temp:{
        id:'',
        ordernum:'',
        name:'',
        phone:'',
        address:''
      },
      rules: {
        name: [{ required: true, message: '姓名必须填写！', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号码必须填写！', trigger: 'blur' }],
        address: [{ required: true, message: '地址必须填写！', trigger: 'blur' }],
      },
      tempfahuo:{
        ordernum:'',
        id:'',
        logisticcode:''
      },      
      rulesfahuo: {
        logisticcode: [{ required: true, message: '请填写物流单号！', trigger: 'blur' }]
      },
      CPTypeList:[],
      DifferenceList:[],
      ReceivingList:[],
      wuliuList:[],
      dizhiist:[]
    };
  },
  created() {
    this.getList();
    this.getmodel();
  },
  mounted() {
    this.$bus.$on("navactivechange", () => {
      this.getList();
    });
  },
  watch: {
    value7(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    }
  },
  methods: { 
    chongzhisus(row){
       var str= '确认要设置成功吗？';
      var data = this.$qs.stringify({ ordernum: row.OrderNum});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Orders/UpdatePhoneSuccess",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=3;
            }
          });
        })
        .catch(() => {});
    },
    chongzhifail(row){
       var str= '确认要设置失败吗？';
      var data = this.$qs.stringify({ ordernum: row.OrderNum});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Orders/UpdatePhoneFail",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=11;
            }
          });
        })
        .catch(() => {});
    },
    chongzhisub(row){
       var str= '确认要充值吗？';
      var data = this.$qs.stringify({ ordernum: row.OrderNum});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Orders/UpdatePhone",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=10;
            }
          });
        })
        .catch(() => {});
    },
    xuanrandizhi(item){
      this.temp.id=item.Id;
      this.temp.name=item.Name;
      this.temp.phone=item.Phone;
      this.temp.address=item.Address;
    },
    subdizhi(){
      this.$refs["dataForm"].validate(valid => {
        if (valid) { 
          var param={
              ordernum:this.temp.ordernum,
              id:this.temp.id,
              name:this.temp.name,
              phone:this.temp.phone,
              address:this.temp.address
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "Orders/UpdateOrderContacts",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {               
              this.dialogdizhiVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },
    dizhishow(row){
      this.dialogdizhiVisible=true;
      this.item=row;
      this.temp.ordernum=row.OrderNum;
      this.temp.id='';
      this.temp.name='';
      this.temp.phone='';
      this.temp.address='';
      this.getdizhi(row.OrderNum)
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    getdizhi(ordernum){
      request({
        url: "Orders/GetContacts",
        method: "get",
        params: {ordernum,ordernum}
      }).then(response => {
        if (response.Status == 1) {
          this.dizhiist=response.List;
        }
      });
    },
    fahuoshou(row){
      this.dialogfahuoVisible=true;
      this.item=row;    
      this.tempfahuo.ordernum=row.OrderNum;
      this.tempfahuo.id='';
      this.tempfahuo.logisticcode='';
      this.getwuliu(row.OrderNum);
      this.$nextTick(() => {
        this.$refs["datafahuo"].clearValidate();
      });
    },
    fahuosub(){
       this.$refs["datafahuo"].validate(valid => {
        if (valid) { 
          var param={
              ordernum:this.tempfahuo.ordernum,
              id:this.tempfahuo.id,
              logisticcode:this.tempfahuo.logisticcode
          };     
          var data = this.$qs.stringify(param);
          request({
            url: "Orders/UpdateOrderExpress",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {               
              this.dialogfahuoVisible = false;
              for(let i in this.list){
                if(this.list[i].OrderNum==this.tempfahuo.ordernum){
                  this.list[i].Status=6;
                }
              }
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    
    },
    resetfenlei(){
      if(this.listQuery.cptype==2){
        this.listQuery.receivingtype='';
      }else{
        this.listQuery.difference=''
      }
    },
    getwuliu(ordernum){
      request({
        url: "Orders/GetExpress",
        method: "get",
        params: {ordernum,ordernum}
      }).then(response => {
        if (response.Status == 1) {
          this.wuliuList=response.List;
        }
      });
    },
    change(row,value,title) {
      var str= '确认要'+title+'该订单吗？';
      var data = this.$qs.stringify({ ordernum: row.OrderNum,status:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Orders/UpdateOrders",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.Status=value;
            }
          });
        })
        .catch(() => {});
    },     
    setype(type){
      for(let i in this.TypeList){
        if(this.TypeList[i].Value==type){
          return this.TypeList[i].Text;
        }
      }
    },
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要下载订单吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Orders/GetOrderExcel",
            method: "get",
            params: {name:this.listQuery.name,
                      ordernum:this.listQuery.ordernum,
                      userid:this.listQuery.userid,
                      productname:this.listQuery.productname,
                      code:this.listQuery.code,
                      status:this.listQuery.status,
                      starttime:this.listQuery.starttime,
                      endtime:this.listQuery.endtime}
          }).then(response => {
              if(response.Status==1){
                import('@/vendor/Export2Excel').then(excel => {
                  const tHeader = response.TableTitle;
                  const filterVal = response.TableField;
                  const data = this.formatJson(filterVal, response.List)
                  if(response.List){
                    excel.export_json_to_excel({
                      header: tHeader,
                      data,
                      filename: '订单'
                    });
                  }
                
              }); 
              this.downloadLoading = false
            }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    detail(row) {      
      this.titles=row.NickName+'的订单详情';
      this.dialogdingdan=true;
      this.item=row;
      
    },
    getmodel() {
      request({
        url: "Orders/DDL",
        method: "get",
        params: {}
      }).then(response => {
        if (response.Status == 1) {
          this.Model = response.Model;
          this.TypeList=response.TypeList;
          this.CompanyList=response.CompanyList;
          this.CPTypeList=response.CPTypeList;
          this.DifferenceList=response.DifferenceList;
          this.ReceivingList=response.ReceivingList;
        }
      });
    },
    setliexing(type) {
      for (let i in this.Model) {
        if (this.Model[i].Value == type) {
          return this.Model[i].Text;
        }
      }
    },
    getList() {
      this.listLoading = true;
      request({
        url: "Orders/GetOrdersList",
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.activity {
  .img {
    width: 40px;
    height: 40px;
  }
  .status3 {
    color: #f56c6c;
  }
  .status0,.status6 {
    color: #67c23a;
  }
  .status1,.status10 {
    color: #e6a23c;
  }
  .status2 {
    color: #409eff;
  }
  .status4,status11 {
    color: #909399;
  }
  .qingkong {
    margin-left: 30px;
    color: #409eff;
  }
  ul li{list-style: none; line-height: 30px;}
  .flex{display: flex;}
  .flex ul{width: 570px; margin-left: 10px;
  }
  .cell .el-button{margin-bottom: 10px;}
  .beizhu li{border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 10px;}
  .beizhu li:last-of-type{border-bottom: none;}
}
</style>
