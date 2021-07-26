<template>
  <div class="user-list boxright">
    <div class="filter-container">      
        <div class="filter-item" style="margin-right:20px;">
          <el-button type="primary" @click="handleadd()">
            <i class="el-icon-circle-plus"></i> 新增
          </el-button>
        </div> 
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="周" align="left" prop="Week"></el-table-column>
      <el-table-column label="奖励" align="center" prop="Reward"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handereditor(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>   
    </el-table>     
    
    <el-dialog :title="titles" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="570px">
      <el-form ref="qiandaoForm" :rules="qiandaoFormRuls" :model="temp" label-position="left" label-width="80px" style="width: 480px; margin-left:10px;">
        <el-form-item label="周" prop="Week">
          <el-input v-model="temp.Week" placeholder="请填写周"/>
        </el-form-item>
        <el-form-item label="奖励" prop="Reward">
          <el-input v-model="temp.Reward" placeholder="请填写奖励"/>
        </el-form-item>
        <el-form-item label="额外奖励" prop="ExtraReward">
          <el-input v-model="temp.ExtraReward" placeholder="请填写额外奖励"/>
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
  name: "product",
  data() {
    return {
      list: [], //列表
      listLoading: false, //列表加载
      titles:'',
      dialogFormVisible:false,
      temp:{
        Id:'',
        Week:'',
        Reward:'',
        ExtraReward:''
      },
      qiandaoFormRuls:{
        Week: [
          { required: true, message: "请填写周！", trigger: "blur" }
        ],
        Reward: [
          { required: true, message: "请填写奖励！", trigger: "blur" }
        ],
        ExtraReward: [
          { required: true, message: "请填写额外奖励！", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();    
  },
  methods: {
    handleadd(){
      this.dialogFormVisible=true;
      this.temp.Id='';
      this.temp.Week='';
      this.temp.Reward='';   
      this.temp.ExtraReward='';
      this.titles='增加' ;
      this.$nextTick(() => {
        this.$refs["qiandaoForm"].clearValidate();
      });
    },
    handereditor(row){
      this.dialogFormVisible=true; 
      this.titles='修改' ;
      this.temp.Id=row.Id;
      this.temp.Week=row.Week;
      this.temp.Reward=row.Reward;    
      this.temp.ExtraReward=row.ExtraReward;  
      this.$nextTick(() => {
        this.$refs["qiandaoForm"].clearValidate();
      });
    },
    createData(){
       this.$refs["qiandaoForm"].validate(valid => {
        if (valid) {    
          var data = this.$qs.stringify(this.temp);
          request({
            url: "SignTask/SetSignTask",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if(this.temp.Id==0){
                var param={
                    Week:this.temp.Week,
                    Reward:this.temp.Reward,
                    ExtraReward:this.temp.ExtraReward,
                    Id:response.Id
                }; 
                this.list.push(param) 
              }else{
                for(let i in this.list){
                  if(this.list[i].Id==this.temp.Id){
                    this.list[i].Week=this.temp.Week;
                    this.list[i].ExtraReward=this.temp.ExtraReward;
                    this.list[i].Reward=this.temp.Reward;
                    break
                  }
                }
              }  
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
    getList(){
      this.listLoading = true;
      request({
        url: "SignTask/GetSignTaskList",
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
