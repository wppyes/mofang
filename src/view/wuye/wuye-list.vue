<template>
  <div class="wuye boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary"  @click="handleadd(0,'增加物业',true)">
          <i class="el-icon-circle-plus"></i> 增加物业
        </el-button>
      </div>
      <el-input
        placeholder="请输入名称"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      /> 
      <el-select
        v-model="listQuery.province"
        placeholder="省"
        clearable
        style="width: 150px"
        class="filter-item"
         @change="getshi(1)"
      >
        <el-option v-for="item in citys" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select> 
      <el-select
        v-model="listQuery.city"
        placeholder="市"
        clearable
        style="width: 200px"
        class="filter-item"
         @change="getqu(1)"
      >
        <el-option v-for="item in shi" :label="item.name" :value="item.code" :key="item.code"></el-option>
      </el-select> 
      <el-select
        v-model="listQuery.county"
        placeholder="区"
        clearable
        style="width: 200px"
        class="filter-item"        
      >
        <el-option v-for="item in qu" :label="item.name" :value="item.code" :key="item.code"></el-option>
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
      <div class="filter-item">
          <el-button @click="showlist=!showlist">{{showlist?'隐藏':'显示'}}CODE/识别码</el-button>
        </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="CODE" align="left" prop="Code" width="110px" v-if="showlist"></el-table-column>
      <el-table-column label="识别码" align="left" prop="UniqueId" width="150px" v-if="showlist"></el-table-column>
      <el-table-column label="街道办" align="left" prop="Agency" width="150px"></el-table-column>
      <el-table-column label="小区名称" align="center" prop="CellName" width="150px"></el-table-column>  
      <el-table-column label="公司名称" align="center" prop="Corporate" width="150px"></el-table-column>  
      <el-table-column label="负责人" align="center" prop="Name" width="80px"></el-table-column>  
      <el-table-column label="电话" align="center" prop="Phone" width="120px"></el-table-column>  
      <el-table-column label="地址" align="left" prop="Address" width="150px"></el-table-column>  
      <el-table-column label="状态" align="center" width="60px">
        <template slot-scope="scope">
         <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column>        
      <el-table-column label="支付" align="center" width="150px">
        <template slot-scope="scope">
         <!-- <span :class="'status'+scope.row.Switch">{{scope.row.Switch==0?'未开启':'开启'}}</span> -->
         <div>

          <el-button size="mini" type="primary" @click="zhifu(scope.row)">
            设置
          </el-button>          
          <el-button size="mini" v-if="scope.row.Switch==0 && scope.row.AppId" @click="changes(scope.row,1)">
            开启
          </el-button>
          <el-button size="mini" type="danger" v-if="scope.row.Switch==1 && scope.row.AppId" @click="changes(scope.row,0)">
            关闭
          </el-button>
         </div>
        </template>
      </el-table-column>  
      <el-table-column label="物业" align="center" width="60px">
        <template slot-scope="scope">
         <span :class="scope.row.IsProperty==0?'status2':'status0'">{{scope.row.IsProperty==1?'有':'无'}}</span>
        </template>
      </el-table-column>  
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改物业',false)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="shangjai(scope.row,1,'禁用')" v-if="scope.row.Status!=1">
            禁用
          </el-button>
          <el-button size="mini" v-if="scope.row.Status!=2" type="danger" @click="shangjai(scope.row,2,'解约')">
            解约
          </el-button>
          <el-button size="mini" v-if="scope.row.Status!=0" type="danger" @click="shangjai(scope.row,0,'启用')">
            启用
          </el-button>
          <el-button size="mini" @click="linktoadd(scope.row.Code)">
            人员
          </el-button>
        </template>
      </el-table-column>
    </el-table> 
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:10px;">
         <el-form-item label="选择地址" prop="Province" v-if="temp.Code==''">
            <el-select
              v-model="temp.Province"
              placeholder="省"
              clearable
              style="width: 130px"
              class="filter-item"
              @change="getshi(2)"
            >
              <el-option v-for="item in citys" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 
            <el-select
              v-model="temp.City"
              placeholder="市"
              clearable
              style="width: 130px"
              class="filter-item"
              @change="getqu(2)"
            >
              <el-option v-for="item in shi" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 
            <el-select
              v-model="temp.County"
              placeholder="区"
              clearable
              style="width: 130px"
              class="filter-item"
              @change="getbanshi"
            >
              <el-option v-for="item in qu" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 

        </el-form-item>
        <el-form-item label="街道办" prop="OId">
           <el-select
              v-model="temp.OId"
              placeholder="选择街道办"
              class="filter-item"
              @change="getjiedao"
              v-if="temp.Code==''"
            >
              <el-option v-if="temp.Code==''" v-for="item in banshichulist" :label="item.Agency" :value="item.Id" :key="item.Id"></el-option>
            </el-select> 
            <el-input v-if="temp.Code!=''" v-model="temp.Agency" placeholder="请填写小区名称" disabled />
        </el-form-item>
        <el-form-item label="街道办社区" prop="OCId">
           <el-select
              v-model="temp.OCId"
              placeholder="选择街道办社区"
              class="filter-item"
            >
              <el-option v-for="item in shequlist" :label="item.Name" :value="item.Id" :key="item.Id"></el-option>
            </el-select> 
        </el-form-item>
        <el-form-item label="小区名称" prop="CellName">
          <el-input v-model="temp.CellName" placeholder="请填写小区名称"/>
        </el-form-item>
        <el-form-item label="公司名称" prop="Corporate">
          <el-input v-model="temp.Corporate" placeholder="请填写公司名称"/>
        </el-form-item>
        <el-form-item label="负责人" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写负责人"/>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="temp.Phone" placeholder="请填写电话"/>
        </el-form-item>
        <el-form-item label="地址" prop="Address">
          <el-input v-model="temp.Address" placeholder="请填写地址"/>
        </el-form-item>
        <el-form-item label="物业" prop="IsProperty">
          <el-switch
            v-model="temp.IsProperty"
            active-color="#409EFF"
            inactive-color="#eee"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="支付设置" :visible.sync="dialogzhifuVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="datazhifuForm" :rules="zhifurules" :model="zhifutemp" label-position="left" label-width="100px" style="width: 500px; margin-left:10px;">
          <el-form-item label="MchId" prop="MchId">
            <el-input v-model="zhifutemp.MchId" placeholder="请填写MchId" show-password/>
          </el-form-item>
          <el-form-item label="AppId" prop="AppId">
            <el-input v-model="zhifutemp.AppId" placeholder="请填写AppId" show-password/>
          </el-form-item>
          <el-form-item label="ApiKey" prop="ApiKey">
            <el-input v-model="zhifutemp.ApiKey" placeholder="请填写ApiKey" show-password/>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogzhifuVisible = false">取消</el-button>
        <el-button type="primary" @click="sub">确定</el-button>
      </div>
    </el-dialog>
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
import citys from '@/utils/city.json'
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import { isvalidPhone } from "@/utils/validate";
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
export default {
  name: "wuye",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载      
      iscreate:false,//是否是添加
      dialogStatus:'',
      dialogFormVisible:false,
      dialogzhifuVisible:false,
      listQuery: {
        //搜素分页处理
        name:'',
        pageIndex: 1,
        pageSize: 15,
        status:'',
        province:'',
        city:'',
        county:''
      },
      temp:{
        Code: 0,
        CellName: '',
        Corporate: '',
        Phone: '',
        Name: '',
        Address: '',
        Province:'',
        City: '',
        County: '',
        OId:'',
        Agency:'', 
        OCId:'',       
        IsProperty:false
      },
      shequlist:[],
      zhifutemp:{
        AppId:'',
        MchId:'',
        ApiKey:'',
        Code:''
      },
      Payment:'',
      Switch:false,
      showlist:false,
      rules: {
        Name: [{ required: true, message: '负责人必须填写！', trigger: 'blur' }],
        OId: [{ required: true, message: '请选择街道办！', trigger: 'blur' }],
        CellName: [{ required: true, message: '小区名称必须填写！', trigger: 'blur' }],
        Corporate: [{ required: true, message: '公司名称必须填写！', trigger: 'blur' }],
        Phone: [{ required: true, trigger: ["blur"], validator: validPhone }],
        Address: [{ required: true, message: '地址必须填写！', trigger: 'blur' }],
      },
      zhifurules:{
        AppId: [
          { required: true, message: "AppId必须填写！", trigger: "blur" }
        ],
        MchId: [
          { required: true, message: "MchId必须填写！", trigger: "blur" }
        ],
        ApiKey: [{ required: true, message: "ApiKey必须填写！", trigger: "blur" }]
      },
      StatusList:[],
      citys:[],
      shi:[],
      qu:[],
      banshichulist:[],
      quyu:{
        sheng:'',
        shi:'',
        qu:''
      }
    };
  },
  created() {
    this.getList();    
    request({
      url: "Company/DDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.StatusList=response.Model;
      }
    });
    this.citys=citys;
  },
  methods: {
    getshequ(){         
      request({
        url: "Company/GetCommunityList",
        method: "get",
        params: {oid:this.temp.OId}
      }).then(response => {
        if (response.Status == 1) {
          this.shequlist=response.List;         
        }
      });
    },
    changes(row,type){
      var str = type==1?'开启':'关闭'
      var data = this.$qs.stringify({ isswitch: type,Code:row.Code});
      this.$confirm("确定要"+str+"支付吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Company/Update",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
                this.$message({
                    message: response.Msg,
                    type: "success"
                });
                row.Switch=type;
            }
          });
        })
        .catch(() => {});
    },
    getjiedao(){
      for(var i=0; i<this.banshichulist.length; i++){
        if(this.banshichulist[i].Id==this.temp.OId){
          this.temp.Agency=this.banshichulist[i].Agency;
        }
      }      
      this.temp.OCId='';
      this.getshequ();
    },
    zhifu(row){
      this.dialogzhifuVisible=true;
      this.zhifutemp.AppId=row.AppId;
      this.zhifutemp.MchId=row.MchId;
      this.zhifutemp.ApiKey=row.ApiKey;
      this.zhifutemp.Code=row.Code;
      this.$nextTick(() => {
        this.$refs['datazhifuForm'].clearValidate()
      })
    },
    sub(){
      this.$refs["datazhifuForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.zhifutemp);
          request({
            url: "Company/SetPayment",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });          
              this.dialogzhifuVisible=false;    
              this.getList();   
            }
          });
        }
      });
    },
    linktoadd(id){
      this.$router.push({
        path: "/wuye/wuye-list/wuye-renyuan",
        query: { id:id }
      });
    },
    getshi(type){
      for(let i in this.citys){
        if(this.citys[i].code==this.listQuery.province && type==1){
          this.shi=this.citys[i].cityList;
          this.listQuery.city='';
          this.listQuery.county='';
          this.temp.Agency='';
          break;
        }
        if(this.citys[i].code==this.temp.Province && type==2){
          this.shi=this.citys[i].cityList;  
          this.quyu.sheng=this.citys[i].name;
           this.temp.City='';
          this.temp.County='';
          this.temp.Agency='';
          break;
        }
      }
    },
    getqu(type){
      for(let i in this.shi){
        if(this.shi[i].code==this.listQuery.city && type==1){
          this.qu=this.shi[i].areaList;
          this.listQuery.county='';
          break;
        }
        if(this.shi[i].code==this.temp.City && type==2){
          this.qu=this.shi[i].areaList;
          this.quyu.shi=this.shi[i].name;
          this.temp.County='';
          break;
        }
      }
    },
    getquname(){
      for(let i in this.qu){
        if(this.qu[i].code==this.temp.County){
          this.quyu.qu=this.qu[i].name;
          break;
        }
      }
    },
    getbanshi(){     
      this.temp.OId='';
      this.temp.OCId=''; 
      request({
        url: "Company/GetOffice",
        method: "get",
        params: {county:this.temp.County}
      }).then(response => {
        if (response.Status == 1) {
          this.banshichulist=response.List;         
        }
      });
    },
    shangjai(row,value,title) {
      var str= '要'+title+'该物业吗？';
      var data = this.$qs.stringify({ code: row.Code,Status:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Company/UpdateStatus",
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
    getList(){
      this.listLoading = true;
      request({
        url: "Company/GetCompanyList",
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
    handleadd(row,title,creat,index){   
      this.temp={
        Code: '',
        CellName: '',
        Corporate: '',
        Phone: '',
        Name: '',
        Address: '',
        Province:'',
        City: '',
        County: '',
        OId:'',
        Agency:'',       
        OCId:'', 
        IsProperty:false
      };
      this.iscreate=creat;
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleditor(row,title,creat){      
      this.temp={
        Code: row.Code,
        CellName: row.CellName,
        Corporate: row.Corporate,
        Phone: row.Phone,
        Name:row.Name,
        Address: row.Address,
        OId:row.OId,
        Agency:row.Agency,
        OCId:row.OCId == 0?'':row.OCId,
        Province:'',
        City: '',
        County: '',
        IsProperty:row.IsProperty==1?true:false
      };
      this.getshequ();
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      var temps={
        Code: this.temp.Code,
        CellName: this.temp.CellName,
        Corporate: this.temp.Corporate,
        Phone: this.temp.Phone,
        Name:this.temp.Name,
        Address: this.temp.Address,
        Province:this.temp.Province,
        City:this.temp.City,
        County:this.temp.County,
        OId:this.temp.OId,
        OCId:this.temp.OCId,
        IsProperty:this.temp.IsProperty?1:0
      }
      var data=this.$qs.stringify(temps);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          request({
            url: "Company/SetCompany",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              if(this.iscreate){
                this.temp.UniqueId=response.UniqueId;
                this.temp.Code=response.Code;
                this.temp.Status=0;
                this.list.push(this.temp);            
              }else{
                 for (let i in this.list) {
                    if (this.list[i].Code === this.temp.Code) {
                      this.list[i].Name=this.temp.Name;
                      this.list[i].CellName=this.temp.CellName;
                      this.list[i].Corporate=this.temp.Corporate;
                      this.list[i].Phone=this.temp.Phone;
                      this.list[i].Address=this.temp.Address;
                      this.list[i].Province=this.temp.Province;
                      this.list[i].City=this.temp.City;
                      this.list[i].County=this.temp.County;
                      this.list[i].OId=this.temp.OId;
                      this.list[i].OCId=this.temp.OCId;
                      this.list[i].IsProperty=this.temp.IsProperty;
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
.wuye {
  .img{width:40px; height:40px;}
  .status2{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status3{color:#409EFF;}
  .status4{color:#909399;}
  .qingkong{margin-left: 30px; color: #409EFF;}
}
</style>
