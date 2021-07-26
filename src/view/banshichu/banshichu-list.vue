<template>
  <div class="wuye boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary"  @click="handleadd(0,'增加街道办',true)">
          <i class="el-icon-circle-plus"></i> 增加街道办
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="识别码" align="center" prop="UniqueId" width="100px"></el-table-column>  
      <el-table-column label="街道办名字" align="center" prop="Agency" width="180px"></el-table-column>  
      <el-table-column label="地址" align="left" prop="Address" width="250px">
        <template slot-scope="scope">
         <span v-text="setdizhi(scope.row)"></span>{{scope.row.Address}}
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="Name" width="100px"></el-table-column>  
      <el-table-column label="电话" align="center" prop="Phone" width="150px"></el-table-column>  
      <el-table-column label="固话" align="center" prop="Fixed" width="150px"></el-table-column>  
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
         <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column>   -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleditor(scope.row,'修改街道办',false)">
            <i class="el-icon-edit"></i>
          </el-button>  
          <el-button size="mini" v-if="scope.row.BSwitch==0" type="primary" @click="shangjai(scope.row,1,'开启')">
            开启（轮播图）
          </el-button>
          <el-button size="mini" type="danger" @click="shangjai(scope.row,0,'关闭')" v-if="scope.row.BSwitch==1">
            关闭（轮播图）
          </el-button>
          <el-button size="mini" type="primary" @click="linkto(scope.row)">
            轮播图
          </el-button>     
          <el-button size="mini" type="primary" @click="linktoad(scope.row)">
            广告位
          </el-button> 
          <div style="margin-top:5px">     
            <el-button size="mini" type="primary" @click="linktonew(scope.row)">
              新闻
            </el-button>     
            <el-button size="mini" type="primary" @click="linktonotice(scope.row)">
              公告
            </el-button>     
            <el-button size="mini" type="primary" @click="linktoactive(scope.row)">
              活动
            </el-button>     
            <el-button size="mini" type="primary" @click="linktoservice(scope.row)">
              投诉
            </el-button>     
            <el-button size="mini" type="primary" @click="linktorange(scope.row)">
              排行
            </el-button>    
            <el-button size="mini" type="primary" @click="linktoshenqu(scope.row)">
              社区
            </el-button> 
          </div>       
          <!-- <el-button size="mini" v-if="scope.row.Status!=2" type="danger" @click="shangjai(scope.row,2,'解约')">
            解约
          </el-button> -->
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
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:10px;">
        <el-form-item label="选择地址" prop="Province">
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
              @change="getquname"
            >
              <el-option v-for="item in qu" :label="item.name" :value="item.code" :key="item.code"></el-option>
            </el-select> 

        </el-form-item>
        <el-form-item label="地址" prop="Address">
          <el-input v-model="temp.Address" placeholder="请填写地址"/>
        </el-form-item>
        <el-form-item label="街道办名称" prop="Agency">
          <el-input v-model="temp.Agency" placeholder="请填写地址"/>
        </el-form-item>
        <el-form-item label="负责人" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写负责人"/>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="temp.Phone" placeholder="请填写电话"/>
        </el-form-item>
        <el-form-item label="固话" prop="Fixed">
          <el-input v-model="temp.Fixed" placeholder="请填写固话"/>
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
import citys from '@/utils/city.json'
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
        Id: 0,
        Province:'',
        City: '',
        County: '',
        Address: '',
        Agency: '',
        Name: '',
        Phone: '',
        Fixed:''
      },
      rules: {
        Province: [{ required: true, message: '市区必须填写！', trigger: 'blur' }],
        Address: [{ required: true, message: '区域必须填写！', trigger: 'blur' }],
        Agency: [{ required: true, message: '街道办名称必须填写！', trigger: 'blur' }],
        Name: [{ required: true, message: '负责人必须填写！', trigger: 'blur' }],
        Fixed: [{ required: true, message: '固定电话必须填写！', trigger: 'blur' }],
        Phone: [{ required: true, trigger: ["blur"], validator: validPhone }]
      },
      StatusList:[{Value:'0',Text:'启用'},{Value:'1',Text:'禁用'}],
      citys:[],
      shi:[],
      qu:[],
      quyu:{
        sheng:'',
        shi:'',
        qu:''
      }
    };
  },
  created() {
    this.getList();   
    this.citys=citys;
  },
  methods: {
    linktoactive(row){
      this.$router.push({
        path: "banshichu-list/activity-list",
        query: { oid:row.Id }
      });
    },
    linktorange(row){
      this.$router.push({
        path: "banshichu-list/range-list",
        query: { oid:row.Id }
      });
    },
    linktoshenqu(row){
      this.$router.push({
        path: "banshichu-list/shequ-banshi",
        query: { oid:row.Id }
      });
    },
    linktoservice(row){
      this.$router.push({
        path: "banshichu-list/advise",
        query: { oid:row.Id }
      });
    },
    linktonotice(row){
      this.$router.push({
        path: "banshichu-list/notice-list",
        query: { oid:row.Id }
      });
    },
    linktonew(row){
      this.$router.push({
        path: "banshichu-list/news-list",
        query: { oid:row.Id }
      });
    },
    linktoad(row){
      this.$router.push({
        path: "/banshichu/banshichu-list/ads-list-banshi",
        query: { id:row.Id }
      });
    },
    linkto(row){
      this.$router.push({
        path: "/banshichu/banshichu-list/banner-list-banshi",
        query: { id:row.Id }
      });
    },
    setdizhi(row){
      var str='';
       for(let i in this.citys){
        if(this.citys[i].code==row.Province){
          // str+=this.citys[i].name;
          for(let j in this.citys[i].cityList){
            if(this.citys[i].cityList[j].code==row.City){
               str+=this.citys[i].cityList[j].name;
               for(let k in this.citys[i].cityList[j].areaList){
                 if(this.citys[i].cityList[j].areaList[k].code==row.County){
                   str+=this.citys[i].cityList[j].areaList[k].name;
                   return str
                 }
               }
            }
          }
        }
      }
    },
    getshi(type,bo){
      for(let i in this.citys){
        if(this.citys[i].code==this.listQuery.province && type==1){
          this.shi=this.citys[i].cityList;
          this.listQuery.city='';
          this.listQuery.county='';
          break;
        }
        if(this.citys[i].code==this.temp.Province && type==2){
          this.shi=this.citys[i].cityList;  
          this.quyu.sheng=this.citys[i].name;
          if(!bo){
           this.temp.City='';
          this.temp.County='';
          }
          break;
        }
      }
    },
    getqu(type,bo){
      for(let i in this.shi){
        if(this.shi[i].code==this.listQuery.city && type==1){
          this.qu=this.shi[i].areaList;
          this.listQuery.county='';
          break;
        }
        if(this.shi[i].code==this.temp.City && type==2){
          this.qu=this.shi[i].areaList;
          this.quyu.shi=this.shi[i].name;
           if(!bo){
            this.temp.County='';
          }
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
    shangjai(row,value,title) {
      var str= '要'+title+'轮播图吗？';
      var data = this.$qs.stringify({ Id: row.Id,BSwitch:value});
      this.$confirm(str, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Office/UpdateBSwitch",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              this.$message({
                message: response.Msg,
                type: "success"
              });
              row.BSwitch=value;
            }
          });
        })
        .catch(() => {});
    },  
    getList(){
      this.listLoading = true;
      request({
        url: "Office/GetOfficeList",
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
        Id: 0,
        Province:'',
        City: '',
        County: '',
        Address: '',
        Agency: '',
        Name: '',
        Phone: '',
        Fixed:''
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
        Id: row.Id,
        Province:row.Province.toString(),
        City: row.City.toString(),
        County: row.County.toString(),
        Address: row.Address,
        Agency: row.Agency,
        Fixed:row.Fixed,
        Name:row.Name,
        Phone: row.Phone
      };
      this.getshi(2,true);
      this.getqu(2,true);
      this.getquname();
      this.dialogStatus = title;
      this.dialogFormVisible = true;
      this.iscreate=creat;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      // var address=this.quyu.sheng+this.quyu.shi+this.quyu.qu+this.temp.Address;
      // this.temp.Address=address;
      var data=this.$qs.stringify(this.temp);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {              
          request({
            url: "Office/SetOffice",
            method: "post",
            data
          }).then(response => {
            if(response.Status==1){
              if(this.iscreate){
                this.temp.Status=0;
                this.temp.Id=data.Id;
                this.temp.UniqueId=data.UniqueId;
                this.list.push(this.temp);            
              }else{
                 for (let i in this.list) {
                    if (this.list[i].Id === this.temp.Id) {
                      this.list[i].Name=this.temp.Name;
                      this.list[i].Province=this.temp.Province;
                      this.list[i].City=this.temp.City;
                      this.list[i].County=this.temp.County;
                      this.list[i].Agency=this.temp.Agency;
                      this.list[i].Fixed=this.temp.Fixed;
                      this.list[i].Phone=this.temp.Phone;
                      this.list[i].Address=this.temp.Address;
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
