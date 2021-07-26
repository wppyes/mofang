<template>
  <div class="boxright">
    <el-row :gutter="20">
      <el-col :span="6">
        <div style="background: rgba(103, 194, 58, 0.75)" class="numbs">
          <div>当日平台用户注册量</div>
         <a :href="'/#/user/user-list'"> {{ Model.UserTotal }}</a><span>人</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="background: rgba(245, 108, 108, 0.75)" class="numbs">
          <div>当日平台订单交易量</div>
         <a :href="'/#/order/order-list'"> {{ Model.OrderTotal }}</a><span>条</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="background: rgba(230, 162, 60, 0.75)" class="numbs">
          <div>平台总用户注册量</div>
          {{ SumModel.UserTotal }}<span>人</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="background: rgba(64, 158, 255, 0.75)" class="numbs">
          <div>平台总订单交易量</div>
          {{ SumModel.OrderTotal }}<span>条</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="titlesconsole">当月统计</div>
        <div id="main" style="width: 100%; height: 300px"></div>
      </el-col>
      <el-col :span="6">
        <div class="titlesconsole">积分排行榜</div>
        <div class="consolerightheight">
          <div v-for="item in list" class="names">
            <div style="display:flex">
                <img :src="item.headimgUrl" class="imgs">            
                {{item.NickName }}
            </div>            
            <div>
              <span>{{ item.Balance }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="titlesconsole">性别分析</div>
        <div id="sex" style="width: 100%; height: 350px"></div>
      </el-col>
      <el-col :span="18">
        
      </el-col>
    </el-row>
    <div>        
        

    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "index",
  components: {},
  data() {
    return {
      list: [], //列表
      listQuery: {
        starttime: "",
        endtime: "",
      },
      value7: "",
      Model: {},
      SumModel: {},
    };
  },
  watch: {
    value7(val, oldval) {
      if (val) {
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      } else {
        this.listQuery.starttime = "";
        this.listQuery.endtime = "";
      }
    },
  },
  created() {
    this.getStatistics();
  },
  methods: {
    getStatistics() {
      request({
        url: "Console/GetStatistics",
        method: "get",
        params: {},
      }).then((response) => {
        if (response.Status == 1) {
          this.Model = response.Model;
          this.SumModel = response.SumModel;
          this.list = response.UserList;
          this.setone(response.TJList);
          this.settwo(response.SexModel)
        }
      });
    },
    settwo(model){        
      var myChart = this.$echarts.init(document.getElementById("sex"));
           var option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '访问性别',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {value: model.Female, name: '女'},
                            {value: model.Male, name: '男'},
                            {value: model.Neutral, name: '未知'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            
      myChart.setOption(option);
    },
    setone(arr) {
      var datas = [],
        order = [],
        user = [];
      for (let i in arr) {
        datas.push(arr[i].Day + "日");
        order.push(arr[i].OrderTotal);
        user.push(arr[i].UserTotal);
      }
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      var option = {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["订单数量", "用户数量"],
        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {},
        //   },
        // },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: datas,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "订单数量",
            type: "line",
            stack: "总量",
            data: order,
          },
          {
            name: "用户数量",
            type: "line",
            stack: "总量",
            data: user,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.titlesconsole {
  padding: 8px 16px;
  background-color: rgb(244, 244, 245);
  border-radius: 4px;
  border-left: 5px solid #f56c6c;
  margin: 10px 0 5px 0;
}
.numbs {
  text-align: center;
  color: #fff;
  height: 110px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 36px;
  a:hover{text-decoration: underline;}
}
.numbs div {
  padding-top: 20px;
  font-size: 14px;
  margin-bottom: 5px;
}
.numbs span {
  font-size: 14px;
  margin-left: 5px;
}
.consolerightheight {
  height: 300px;
  overflow-y: auto;
  line-height: 40px;
  .names {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    color: #909399;
    span{color: #f56c6c; margin-right: 10px;}
  }
  .imgs {
    width: 40px;
    height: 40px;
    border: 1px solid #eee;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.consolerightheight::-webkit-scrollbar {width: 4px; }
.consolerightheight::-webkit-scrollbar-thumb { border-radius: 10px;  background: rgba(0,0,0,0.1);}
.consolerightheight::-webkit-scrollbar-track {border-radius: 0;background: #fff;}
</style>