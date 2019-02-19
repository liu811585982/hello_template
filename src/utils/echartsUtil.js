// 导入echarts
const echarts = require('echarts');
import util from  'index@/utils/util'
let echartsUntil = {
  //创建仪表盘图表
  createInstruments (id, getDataFunction,resizeCharts){
    // 基于准备好的dom，初始化echarts图表
    let myChart = echarts.init(document.getElementById(id));
    let option = {
      // 默认色板
      color: [
        '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
        '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
      ],
      tooltip : {
        formatter: "{a}: {c}%"
      },
      toolbox: {
        color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
        effectiveColor : '#ff4500',
        show : false
      },
      series : [
        {
          name:vm.$t('analysis.cap.label7'),
          type:'gauge',
          detail : {formatter:'{value}%'},
          startAngle: 180,
          endAngle : 0,
          radius:"160%",
          center: ['50%','70%'],
          data:[{value: 50, name: ''}],
          axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 5
            }
          },
          axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length :8,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: 'auto'
            }
          },
          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: 'auto'
            }
          },
          splitLine: {           // 分隔线
            length : 12,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'auto'
            }
          },
          pointer : {
            length : '90%',
            width : 3,
            color : 'auto'
          },
          title : {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: '#333',
              fontSize:13
            }
          },
          detail : {
            offsetCenter: [0, -40],       // x, y，单位px
            formatter:'{value}%',
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: 'auto',
              fontSize:12
            }
          }
        }
      ]
    };

    let setValue = function( title , value,radius,location ,color ) {
      option.series[0].data[0].value = value;
      option.series[0].data[0].name = title;
      color && (option.series[0].axisLine.lineStyle.color = color);
      radius && (option.series[0].radius = radius);
      location && (option.series[0].center = location);

      myChart.setOption(option, true);
    }
    getDataFunction(setValue);

    if (resizeCharts) {
      return myChart;
    }

  },


  // 创建多指标项百分百环饼图
  createMutliPercentRingPie (id, radius, getDataFunction,callback ) {
      // 基于准备好的dom，初始化echarts图表
      let myChart = echarts.init(document.getElementById(id));
      if ( radius == undefined ||  radius == null || radius == "")
        radius = [ 40, 60 ];
      let option = {
        title:{
          text:"",
          x: 0,
          y: 0,
          textStyle:{
            fontSize: 14,
            fontWeight: 'bolder',
            fontFamily:'微软雅黑',
            color: '#4a8bc2'
          }
        },
        tooltip : {
          trigger : 'item',
          formatter: "{b} <br/>{d}%"
        },
        series : [{
          name : '',
          type : 'pie',
          radius : radius,
          selectedMode: 'single',
          legendHoverLink: true,
          center : [ '50%', '70%' ],
          data : null

        }]
      };
      let setValue = function(title,data,callback) {
        let nums = 0;
        let labels = Object.keys(data).map(function (key) {
          return data[key].name;
        });
        let values = Object.keys(data).map(function (key) {
          return data[key].value;
        });
        let keys = Object.keys(data).map(function (key) {
          return data[key].code;
        });

        option.legend={
          show : true,
          orient : 'horizontal',
          x : 'left',
          y : 'top',
          itemGap : 5,
          selectedMode : false,
          data : labels
        };
        option.series[0].data = new Array();
        option.title.text = title;
        let color =  ["#29cc97","#4b7efe","#5b6378"];

        if ( labels.length == 0 )
          option.calculable = true;

        for (let i = 0; i < values.length; i++) {
          option.series[0].data.push({
            value : values[i],
            name : labels[i],
            key: keys[i],
            selected: (i== nums),
            itemStyle : {
              normal : {
                color : color[i],
                label : {
                  show :true,
                  formatter: "{c}"+vm.$t('overview.survey.ge'),
                  textStyle : {
                    fontSize : '12',
                    fontFamily : '微软雅黑'
                  }
                },
                labelLine : {
                  show : true,
                  length: 4
                }
              }
            }
          });
        }
        myChart.setOption(option, true);
        myChart.on('click', function (params) {
          callback(params.data.key);
        });
      };
      getDataFunction(setValue);
  },
  //创建竖直柱状图
  createBar : function(id, getDataFunction,nodeMax, hasDataZoom) {
      // 基于准备好的dom，初始化echarts图表
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        color:['#6085ff'],
        tooltip : {
          trigger : 'axis',
          formatter : '{b}<br/>{a}: {c}'+vm.$t('overview.survey.ge')
        },
        legend : {
          selectedMode : false,
          data : [ {
            name : "",
            textStyle : {
              fontWeight : "bold"
            }
          } ]
        },
        grid : {
          y : 30,
          x : 60,
          width: '96%'
        },
        dataZoom : {
          realtime : true,
          start : 0,
          end : 100
        },
        xAxis : [ {

          axisLine : {
            lineStyle : {
              color : [ '#9fa7b3' ],
              width : 1,
              type : 'solid'
            }
          },
          splitLine : {
            lineStyle : {
              color : [ '#e7eaef' ],
              width : 1,
              type : 'dashed'
            }
          },
          type : 'category',
          data : [ '' ]
        } ],
        yAxis : [ {
          axisLine : {
            lineStyle : {
              color : [ '#9fa7b3' ],
              width : 1,
              type : 'solid'
            }
          },
          min:0,
          max: nodeMax < 6 ? 6 : Math.ceil(Math.ceil(nodeMax)*1.1),
          splitLine : {
            lineStyle : {
              color : [ '#e7eaef' ],
              width : 1,
              type : 'dashed'
            }
          },
          type : 'value',
          axisLabel : {
            formatter : '{value}'+vm.$t('overview.survey.num')
          }
        } ],
        series : [ {
          name : "默认",
          type : 'bar',
          data : [ 0 ],
          barWidth: 50,
          itemStyle : {
            normal : {
              label : {
                show : true,
                position : 'top',
                formatter : '{c}'+vm.$t('overview.survey.num')
              },
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params){
                var colorList = [
                  '#c00000','#ee3947','#ff7b53','#6085ff'
                ];
                return colorList[params.dataIndex] || '#6085ff'
              }
            }
          }
        } ]
      };

      var setValue = function(title, label, data, suffix) {
        option.legend.data[0].name = title;
        option.series[0].name = title;
        option.xAxis[0].data = label.length > 0 ? label : [""];
        option.series[0].data = data.length > 0 ? data : [0];
        myChart.setOption(option, true);
        return myChart;
      };
      getDataFunction(setValue);
  },
  //创建水平柱状图
  createHorizontalBar (id, getDataFunction,total) {
    let myChart = echarts.init(document.getElementById(id));
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 100;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.08;
    ctx.font = '20px Microsoft Yahei';
    ctx.translate(50, 50);
    ctx.rotate(-Math.PI / 4);

    let option = {
      backgroundColor: {
        type: 'pattern',
        image: canvas,
        repeat: 'repeat'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'+vm.$t('overview.survey.ge')
      },
      grid: [{
        top: 0,
        width: '90%',
        bottom: '10%',
        left: 10,
        containLabel: true
      }],
      xAxis: [{
        type: 'value',
        splitLine: {
          show: false
        }
      }],
      yAxis: [{
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: 30
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        type: 'bar',
        stack: 'chart',
        selectedMode: true,
        barWidth: total < 10 ? 30 : '50%',
        z: 3,
        label: {
          normal: {
            position: 'right',
            formatter: '{c}'+vm.$t('overview.survey.ge'),
            show: true
          }
        },
        itemStyle : {
          normal : {
            label : {
              show : true,
              position : 'inside',
              formatter : '{c}'+vm.$t('overview.survey.num'),
            },
            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
            color: function (params){
              var colorList = [
                '#c00000','#ee3947','#ff7b53','#6085ff'
              ];
              return colorList[total - params.dataIndex - 1] || '#6085ff'
            }
          }
        }
      }]
    };

    let setValue = function(title,label,value,callback) {
      option.yAxis[0].data = label;
      option.series[0].data = value;
      myChart.setOption(option, true);
      myChart.on('click', function (params) {
         /*let index = data.findIndex((value, index, arr) => {
            return value.name == params.name;
          });*/
          callback(params);
      });
      return myChart;

    };
    getDataFunction(setValue);
  },

  //创建饼图
  createTablePie (id,getDataFunction,dataPara,unit,callback,legend,showTitle) {
    let width = document.documentElement.clientWidth;
    let myChart = echarts.init(document.getElementById(id));
    let option = {
      title: {
        show:showTitle || false,
        text:'',
        x: '200',
        y:'90%',
        textStyle:{
          fontSize: 14,
          fontWeight: 100,
          color: '#333'
        }
      },
      calculable : true,
      //  color:['#69918f', '#44d3e4','#dfdfdf'],
      color:['#dfdfdf', '#6085ff'],
      tooltip: {
        show: showTitle ? false : true,
        trigger: 'item',
        formatter:function(params){
          if (callback)
            return callback(params);
          else if (dataPara)
            return  params.name + ':'  +'\n\t' + util.changeTwoDecimal_f2(params.value,dataPara) + ' ' +unit ;
          else if (legend)
            return  params.name +'(' + params.percent + '%)';
          else
            return  params.name +':' + params.value + unit;
        } /*"{a} <br/>{b}: {c} ({d}%)"*/
      },
      legend: {
        show: legend ? true : false,
        orient: 'vertical',
        x:'left',
        y:'center',
        selectedMode: false
      },
      series: [
        {
          name:'',
          type: 'pie',
          radius : ['42%', '56%'],
          center: ['25%', '50%'],
          minAngle: 5,
          avoidLabelOverlap: false,
          itemStyle: {
            normal:{
              label:{
                show: true,
                position : 'center',
                rich: {
                  useSpace: {
                    color: '#333',
                    fontSize: width < 1450 ? 24 : 32,
                    fontFamily: 'BebasNeue',
                    fontWeight: 'bold',
                    align: 'center'
                  },
                  name: {
                    color: '#bebebe',
                    fontSize: 14,
                  },
                  pre: {
                    color: '#bebebe',
                    borderRadius: 2
                  }
                },
                textStyle: {
                  fontSize:'22',
                  color: '#999'
                }
              },
              labelLine :{
                show:false
              }
            },
            emphasis: {}
          },
          data:[]
        }
      ]
    };

    let setValue = function(title,lable,data,radius,location,color,legend) {
      //去掉为0值的数据
      let zeroIndex = [];
      data.forEach(function (v, i) {
        if (v == '0') {
          zeroIndex.push(i);
        }
      });

      zeroIndex.forEach(function(v){
        delete lable[v];
        delete data[v];
        color && delete color[v];
      });

      lable = lable.filter(function(val){
        return val != undefined;
      });

      data = data.filter(function(val){
        return val != undefined;
      });

      if (color) {
        color = color.filter(function (val) {
          return val != undefined;
        });
      }

      let numLen = lable.length;

      option.series[0].itemStyle.normal.label.formatter = function(params){

        if (numLen > 1) {
          if (params.percent == 100)
            params.percent = 99.99;
          if (params.percent == 1)
            params.percent = 0.01;
        }

        if (legend == 'cluster') {
          if (params.name.indexOf(vm.$t('analysis.cap.has')) != -1)
            return   '{useSpace|'+params.percent+'}' + '{pre|%}'
          else
            return '';
        }
        if (params.dataIndex == 0 && params.name.indexOf(vm.$t('analysis.device.t2')) == -1){
          let name = '';
          if (params.name.split(':').length > 2) {
            name = params.name.split(':')[0] + ":" + params.name.split(':')[1];
          } else {
            name = params.name.split(':')[0];
          }
          return  '{useSpace|'+params.percent+'}' + '{pre|%}'  +'\n\t' + '{name|'+ name +'}' ;
        } else {
          return '';
        }
      };

      if (title) {
        option.title.text = title;
      }

      option.legend.show = legend ? true : false;

      if (!color && data[0] > data[1]) {
        //在线率低于50%，红色
        option.color[1] = '#ee3947';
      }

      color && (option.color = color);

      if (!data.length) {lable=[0];data=[0]}

      if (data.length == 1 && data[0] == 0) {
        //无数据
        option.color = '#eee';
        option.series[0].itemStyle.normal.label.formatter = '{name|'+ vm.$t('overview.alarm.noData') +'}';
        option.series[0].itemStyle.emphasis.color= '#eee';
        option.legend.show = false;
      }

      lable.forEach(function(v, i){
        option.series[0].data.push({
          name: v,
          value: data[i]
        });
      });


      if ((legend =='cap') && data[0]/(data[1] + data[0]) < 0.1) {
        //剩余容量低于10%，红色
        option.color[0] = '#ee3947';
        option.color[1] = '#dfdfdf';
      }

      radius && (option.series[0].radius = radius);
      location && (option.series[0].center = location);

      myChart.setOption(option, true);
      return myChart;
    };
    getDataFunction(setValue);
  },

  //创建饼图
  createTablePie1 (id,getDataFunction,index,keepZero) {
    let myChart = echarts.init(document.getElementById(id));
    let option = {
      title: {
        show:true,
        text:'',
        x: '200',
        y:'90%',
        textStyle:{
          fontSize: 14,
          fontWeight: 100,
          color: '#333'
        }
      },
      //  color:['#69918f', '#44d3e4','#dfdfdf'],
      color:['#6085ff','#dfdfdf'],
      legend: {
        show: true,
        orient: 'vertical',
        x:'left',
        y:'center',
        selectedMode: false,
        formatter: function (name) {
          let nameArr = name.split(vm.$t('common.colon'));
          let rName = nameArr[0] + vm.$t('common.colon') + '\t\n' + nameArr[1];
          return rName;
        },
      },
      series: [
        {
          name:'',
          type: 'pie',
          radius : ['42%', '56%'],
          center: ['25%', '50%'],
          minAngle: keepZero ? 0 : 5,
          avoidLabelOverlap: false,
          itemStyle: {
            normal:{
              label:{
                show: true,
                position : 'center',
                rich: {
                  useSpace: {
                    color: '#333',
                    fontWeight:900,
                    fontSize: 30,
                    fontFamily: 'BebasNeue'
                  },
                  name: {
                    color: '#4d4d4d',
                    fontSize: 14,
                  },
                  pre: {
                    color: '#bebebe',
                    borderRadius: 2
                  }
                },
                textStyle: {
                  fontSize:'22',
                  color: '#999'
                }
              },
              labelLine :{
                show:false
              }
            }
          },
          data:[]
        }
      ]
    };

    let setValue = function(title,lable,data,radius,location,color,hideT) {
      color && (option.series[0].color = color);
      //去掉为0值的数据
      if (!keepZero) {
        let zeroIndex = [];
        data.forEach(function (v, i) {
          if (v == '0') {
            zeroIndex.push(i);
          }
        });

        zeroIndex.forEach(function(v){
          delete lable[v];
          delete data[v];
          color && delete color[v];
        });

        lable = lable.filter(function(val){
          return val != undefined;
        });

        data = data.filter(function(val){
          return val != undefined;
        });

        if (color) {
          color = color.filter(function (val) {
            return val != undefined;
          });
        }
      }

      let numLen = lable.length;

      option.series[0].itemStyle.normal.label.formatter = function(params){

        if (numLen > 1 && !keepZero) {
          if (params.percent == 100)
            params.percent = 99.99;
          if (params.percent == 1)
            params.percent = 0.01;
        }

        if ( params.name.indexOf(vm.$t('analysis.cap.chart2')) != -1 )
          return '{useSpace|'+ params.percent +'}{pre|%}'   +'\t\n {name|'+ vm.$t('analysis.cap.remain') +'}';
        if (params.dataIndex == 0 )
          return '{useSpace|'+ params.percent +'}{pre|%}';
        else
          return '';
      };

      lable.forEach(function(v, i){
        option.series[0].data.push({
          name: v,
          value: data[i]
        });

      });
      option.title.text = title;

      if (hideT) {
        option.title.show = false;
      }

      if (index == 0 && data[0]/(data[1] + data[0]) >= 0.9) {
        //90%，红色
        option.color[0] = '#ee3947';
      }

      if (index == 1 && data[0]/(data[1] + data[0]) <= 0.1) {
        //90%，红色
        option.color[0] = '#ee3947';
      }

      radius && (option.series[0].radius = radius);
      location && (option.series[0].center = location);


      myChart.setOption(option, true);
      return myChart;
    };
    getDataFunction(setValue);
  },


  //创建水平柱状图
  createHorizontalBar1 (id, getDataFunction,index) {
    let myChart = echarts.init(document.getElementById(id));

    let option = {
      color: ['#6085ff'],
      tooltip : {
        trigger: 'item'
      },
      grid: {
        width: '98%',
        left: '1%',
        top: '15%',
        bottom: '2%',
        containLabel: true
      },

      xAxis : [
        {
          type : 'category',
          data : [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %'
          }
        }
      ],
      series : [
        {
          name:'',
          type:'bar',
          barWidth : 50,//柱图宽度
          itemStyle: {
            //通常情况下：
            normal:{
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params){
                if (params.value >= 80)
                  return '#e74955';
                else
                  return '#6085ff';
              }
            }
          },
          data:[10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };

    let setValue = function(title,labelData,dataValue) {
      option.xAxis[0].data = labelData;
      option.tooltip.formatter = function (a){
        return a.name + '<br/><span class="echartTips">'+ vm.$t('analysis.cap.remain') +'</span>' + util.changeTwoDecimal_f2(dataValue[a.dataIndex] && dataValue[a.dataIndex][1],1024) + ' GB<br/><span class="echartTips">'+ vm.$t('analysis.cap.used') +'</span>' +   util.changeTwoDecimal_f2(dataValue[a.dataIndex][0],1024) + ' GB<br/><span class="echartTips">'+ vm.$t('analysis.cap.chart3') +'</span>' + util.changeTwoDecimal_f2(dataValue[a.dataIndex][0] + dataValue[a.dataIndex][1],1024) + ' GB';
      }

      let dataArr = [];
      dataValue.forEach(function(v, i){
        dataArr[i] = parseInt(v[0] / (v[0] + v[1]) * 100);
      });

      dataArr = dataArr.sort((a,b)=>{return b-a});
      option.series[0].data = dataArr;

      myChart.setOption(option, true);
      return myChart;
    };
    getDataFunction(setValue);
  },

  // 云可用空间分析  柱状+线图
  createBarLine (id, getDataFunction, hasDataZoom,unitArr) {
    var unit1 = unitArr && unitArr[0] ;
    var unit2 = unitArr && unitArr[1] ;

      // 基于准备好的dom，初始化echarts图表
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        tooltip : {
          trigger : 'axis',
          formatter: ''
        },
        title:{
          text:"",
          x:60,
          y:10,
          textStyle:{
            fontSize: 14,
            fontWeight: 'bolder',
            fontFamily:'微软雅黑',
            color: '#4a8bc2'
          }
        },
        legend : {
          y: 34,
          selectedMode : false,
          data : [ {
            name : "",
            textStyle : {
              fontWeight : "bold",
              color: ["#ff7f50"]
            }
          } ]
        },
        xAxis : [ {
          type : 'category',
          data : [],
          axisLine : {
            lineStyle : {
              width : 1,
              type : 'solid'
            }
          },
          splitLine : {
            lineStyle : {
              width : 1,
              type : 'dashed'
            }
          }
        } ],
        yAxis : [ {
          type : 'value',
          name : '',
          axisLine : {
            lineStyle : {
              width : 1,
              type : 'solid'
            }
          },
          splitLine : {
            lineStyle : {
              width : 1,
              type : 'dashed'
            }
          }
        }, {
          type : 'value',
          name : '',
          axisLine : {
            lineStyle : {
              width : 1,
              type : 'solid'
            }
          },
          splitLine : {
            lineStyle : {
              width : 1,
              type : 'dashed'
            }
          }
        } ],
        series : [
          {
            name : '',
            type : 'bar',
            data : [],
            barWidth: 32,
            itemStyle : {
              normal : {
                color : unit1 ? '#6085ff' : '#ff7f50' ,
                lineStyle : {
                  color : unit1 ? '#6085ff' : '#ff7f50'
                }
              }
            }
          },
          {
            name : '',
            type : 'line',
            yAxisIndex : 1,
            data : [],
            itemStyle : {
              normal : {
                color : unit1 ? '#ff7f50' : '#6085ff',
                lineStyle : {
                  color : unit1 ? '#ff7f50' : '#6085ff'
                }
              }
            }
          },{
            name : '',
            type : 'line',
            yAxisIndex : 0,
            data : [],
            itemStyle : {
              normal : {
                color : '#6da1c9',
                lineStyle : {
                  color : '#6da1c9',
                  type: 'dotted'
                }
              }
            }
          }]
      };

      //数据回调显示
      var setValue = function(title, yLTitle,yRTitle,label, leftYdata, rightYdata,data2) {
        //yLTitle = 可用空间 		//yRTitle 可用百分比
        //显示横坐标值
        option.xAxis[0].data = label.length > 0 ? label : [""];
        option.yAxis[0].name=yLTitle;
        option.yAxis[1].name=yRTitle;

        option.title.text = title;
        option.series[0].name = yLTitle;
        option.series[0].data = leftYdata.length > 0 ? leftYdata : [0];


        option.series[1].name = yRTitle;
        option.series[1].data = rightYdata.length > 0 ? rightYdata : [0];

        myChart.setOption(option,true);
        return myChart;
      };
      getDataFunction(setValue);
  },

  //创建堆叠柱状图
  createStackBar (id, getDataFunction,cluster,unit,cloudName,nodeMax,length,unit2) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById(id));
    let option = {
      title: {
        show:false,
        text:'',
        x: '30',
        textStyle:{
          fontSize: 14,
          fontWeight: 'bolder',
          color: '#333'
        }
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(param) {
          let clouds='';
          if (cloudName) {
            clouds = vm.$t('analysis.device.cloud') + vm.$t('common.colon') +cloudName[param[0].dataIndex] + '<br/>';
          }
          if (cluster == 'cluster') {
            return clouds + param[0].seriesName + ': ' + param[0].value + (unit || 'TB') +'<br/>' + param[1].seriesName + ': ' + param[1].value +  ( unit2 || (unit ? '%' : vm.$t('overview.survey.ge')));
          } else {
            return clouds + param[0].seriesName + ': ' + param[0].value + (unit || 'TB') + '<br/>' + param[1].seriesName + ': ' + param[1].value + (unit || 'TB') +'<br/>' + param[2].seriesName + ': ' + param[2].value + (cluster == 'bucket' ? '%' : vm.$t('overview.survey.ge'));
          }

        }
      },
      legend: {
        data:[]
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '40px',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          data : [],
          axisLabel:{
            interval: 0,//标签设置为全部显示
            formatter:function(params){
              let split = [15,15,13,10,10,10,10,10,8,6];
              var newParamsName = "";// 最终拼接成的字符串
              var paramsNameNumber = params.length;// 实际标签的个数
              var provideNumber = split[length] || 6;// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";// 表示每一次截取的字符串
                  var start = p * provideNumber;// 开始截取的位置
                  var end = start + provideNumber;// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;// 最终拼成的字符串
                }

              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              //将最终的字符串返回
              return newParamsName
            }
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          name: vm.$t('analysis.cap.unit1',{x:unit || 'TB'})
        },{
          type : 'value',
          name: unit ? vm.$t('analysis.cap.unit2') : vm.$t('analysis.cap.unit3'),
          // 分割线设置
          splitLine:{
            show:false,  //显示分割线
          },
          min:0
        }
      ],
      series : [
        {
          name:'',
          type:'bar',
          barWidth: 30,
          stack: 'cap',
          itemStyle : {
            normal : {
              color : '#74b749',
              lineStyle : {
                color : '#74b749'
              }
            }
          },
          data:[]
        },{
          name:'',
          type:'line',
          yAxisIndex: 1,
          itemStyle : {
            normal : {
              color : '#ee3947',
              lineStyle : {
                color : '#ee3947'
              }
            }
          },
          data:[]
        }
      ]
    };

    if (cluster == 'bucket') {
      option.series = [
        {
          name:'',
          type:'bar',
          barWidth: 30,
          stack: 'cap',
          itemStyle : {
            normal : {
              color : '#74b749',
              lineStyle : {
                color : '#74b749'
              }
            }
          },
          data:[]
        },
        {
          name:'',
          type:'bar',
          barWidth: 30,
          stack: 'cap',
          itemStyle : {
            normal : {
              color : '#dfdfdf',
              lineStyle : {
                color : '#dfdfdf'
              }
            }
          },
          data:[]
        },
        {
          name:'',
          type:'line',
          yAxisIndex: 1,
          itemStyle : {
            normal : {
              color : '#ee3947',
              lineStyle : {
                color : '#ee3947'
              }
            }
          },
          data:[]
        }
      ];
    }

    let setValue = function(title,legend,labelData,dataValue,color,bar,name) {

      color && (option.color = color);
      option.title.text = title;
      if (bar) {
        option.series.unshift({
          name:'',
            type:'bar',
            barWidth: 30,
            data:[]
        });
        option.yAxis[1].name=vm.$t('analysis.cap.unit4');
      }
      name && (option.yAxis[1].name = name);
      option.legend.data = legend;
      option.xAxis[0].data = labelData;

      //判断柱状图5个以内用固定宽度，5个以上用百分比
      let num = labelData.length;

      if (nodeMax && nodeMax < 6)
        option.yAxis[1].max = 6;

      option.series.forEach(function(v,i){
        v.name = legend[i];
        v.data = dataValue[i];
        v.barWidth = num <= 5 ? 30 : '30%';
      });

      myChart.setOption(option, true);
      return myChart;
    };
    getDataFunction(setValue);
  },

  createLabelPie (id,getDataFunction,unit,alarm,callback) {
    let width = document.documentElement.clientWidth;
    let myChart = echarts.init(document.getElementById(id));
    let option = {
      title: {
        show:true,
        text:'',
        x: '200',
        y:'90%',
        textStyle:{
          fontSize: 14,
          fontWeight: 100,
          color: '#333'
        }
      },
      //  color:['#69918f', '#44d3e4','#dfdfdf'],
      color:['#275196','#3857c0','#6085ff','#dfdfdf'],
      graphic: {
        type: 'text',
        left:'center',
        top:'43%',
        z: 2,
        zlevel: 100,
        style: {
          text: '',
          textAlign: 'center',
          fontSize: width < 1400 ? '12' :'14',
          fill: '#333',
          width:30,
          height:30
        }
      },
      series: [
        {
          name:'',
          type: 'pie',
          selectedMode: 'single',
          legendHoverLink: alarm ? true : false,
          radius : ['42%', '56%'],
          center: ['25%', '50%'],
          minAngle: 5,           　　 //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
          avoidLabelOverlap: true,
          labelLine:{
            normal:{
              length: alarm ? 12 : 2
            }
          },
          itemStyle: {
            normal:{
              label:{
                show: true,
                rich: {
                  useSpace: {
                    align:'right',
                    color: '#275196',
                    fontSize: 12
                  },
                  name: {
                    color: '#fff',
                    align:'right',
                    fontSize: 12,
                    backgroundColor:'#666',
                    padding:[0,10,0,10],
                    borderRadius: 2
                  },
                  pre: {
                    align:'right',
                    color: '#4d4d4d',
                    padding: [0,0,0,5],
                    borderRadius: 2
                  }
                },
                textStyle: {
                  fontSize:'12',
                  color: '#999'
                }
              },
              labelLine :{
                show:true
              }
            },
            emphasis: {
               //color: 'auto'
            }
          },
          data:[]
        }
      ]
    };

    let setValue = function(title,lable,data,radius,location,centerTxt,color) {
      //去掉为0值的数据
      let zeroIndex = [];
      (data.length > 1) && data.forEach(function (v, i) {
        if (v == '0') {
          zeroIndex.push(i);
        }
      });

      zeroIndex.forEach(function(v){
        delete lable[v];
        delete data[v];
        color && delete color[v];
      });

      lable = lable.filter(function(val){
        return val != undefined;
      });

      data = data.filter(function(val){
        return val != undefined;
      });

      if (color && color.length ) {
        color = color.filter(function (val) {
          return val != undefined;
        });
      }

      let numLen = lable.length;

      option.series[0].itemStyle.normal.label.formatter = function(params){

        if (numLen > 1) {
          if (params.percent == 100)
            params.percent = 99.99;
          if (params.percent == 1)
            params.percent = 0.01;
        }

        let text = params.name;
        let len = util.getByteSize(text);
        if(len > 20 && len <= 30){
          text = `${text.slice(0,10)}...`;
        }
        return '{name|'+ text +'}\t\n{pre|'+ params.value+unit+'}{useSpace|('+ params.percent +'%)}' ;
      };

      lable.forEach(function(v, i){
        option.series[0].data.push({
          name: v,
          value: data[i]
        });

      });
      option.title.text = title;
      color && (option.color = color);
      option.graphic.style.text = centerTxt;
      radius && (option.series[0].radius = radius);
      location && (option.series[0].center = location);

      if (data.length == 1 && data[0] == 0) {
        //无数据
        option.color = ['#eee'];
        option.series[0].itemStyle.normal.label.formatter = vm.$t('overview.alarm.noData');
        option.series[0].itemStyle.emphasis.color= '#eee';
      } else {
        option.tooltip = {
          show:!alarm,
          formatter: '{b}: {c}'+ unit +'({d}%)'
        }
      }

      //告警类型的饼图特殊处理
      if (alarm) {
        option.series[0].itemStyle = {
          normal:{
            label:{
              show: true,
                formatter: function(params){
                return '{name|'+ params.name +'}{pre|'+ params.value+vm.$t('overview.survey.num')+'}\n\t{useSpace|('+ params.percent +'%)}' ;
              },
              rich: {
                useSpace: {
                  color: '#333',
                    fontSize: 32,
                    fontFamily: 'BebasNeue',
                    fontWeight: 'bold',
                    align: 'center'
                },
                name: {
                  color: '#fff',
                    align:'right',
                    fontSize: 12,
                    backgroundColor:'#666',
                    padding:[5,10,5,10],
                    borderRadius: 2
                },
                pre: {
                  align:'right',
                    color: '#4d4d4d',
                    padding: [0,0,0,5],
                    borderRadius: 2
                }
              },
              textStyle: {
                fontSize:'12',
                  color: '#999'
              }
            },
            labelLine :{
              show:true
            }
          },
          emphasis: {
            //color: 'auto'
          }
        };
      }

      myChart.setOption(option, true);
      myChart.on('pieselectchanged', function( param ){
       callback && callback(param);
      });
      return myChart;
    };
    getDataFunction(setValue);
  },

  //折线图
  createLineChart (id,getDataFunction) {
    let myChart = echarts.init(document.getElementById(id));
    let option = {

      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400,
        inRange: {
          color: ['#7782e2', '#fdfb5d']
        }
      }],

      title:{
        text: '',
        x: 'center',
        y: 'top',
        textStyle:{
          fontSize:12
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: "{b}: {c}"
      },
      xAxis: {
        data: [],
        axisLine:{
          lineStyle:{
            color: '#aaa'
          }
        }
      },
      yAxis: {
        name: '',
        splitLine: {
          show: true,
          lineStyle:{
            color: '#eee',
            type:'dotted'
          }
        },
        axisLine:{
          lineStyle:{
            color: '#aaa'
          }
        }
      },
      grid: {
        width: '88%',
        height: '72%',
        left: '10%',
        top: '14%',
        bottom: '10%'
      },
      series: {
        type: 'line',
        showSymbol: false,
        smooth:true,
        data: []
      }
    };
    let setValue = function(title,label,data) {
      option.title.text = title;
      option.xAxis.data = label;
      option.series.data = data;

      myChart.setOption(option, true);
      return myChart;
    };
    getDataFunction(setValue);
  },

  //面积图
  createAreaLine (id,statsType, xAxisData, yAxisLabels, yAxisDatas, unit) {
    var optionText = '';
    if (statsType == 'statsUploadFlow') {
      optionText = unit ? '上传流量(' + unit + ')': '上传流量';
    } else if (statsType == 'statsWriteRequest') {
      optionText = '写入请求';
    }

    let myChart = echarts.init(document.getElementById(id));
    let option = {
      title: {
        text: optionText,
        x: 100,
        y: 20,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bolder',
          fontFamily: '微软雅黑',
          color: '#4a8bc2'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        selectedMode: true,
        data: ['默认'],
        y: 20
      },
      dataZoom: {
        show: false,
        realtime: true,
        start: 0,
        end: 100
      },
      xAxis: [{
        axisLabel: {
          show: true,
          interval: 'auto'
        },
        axisLine: {
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        splitLine: {
          lineStyle: {
            width: 1,
            type: 'dashed'
          }
        },
        type: 'category',
        boundaryGap: false,
        data: [ ]
      }],
      yAxis: [{
        axisLine: {
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        splitLine: {
          lineStyle: {
            width: 1,
            type: 'dashed'
          }
        },
        type: 'value',
        axisLabel: {
          formatter : '{value}'
        }
      }],
      series: []
    };

    if (yAxisLabels) {
      let colorArray = ["#00C1DE","#FF6A00","#1F77B4"];
      for (var i = 0; i < yAxisLabels.length; i++) {
        option.series.push({
          name: yAxisLabels[i].toString(),
          type: 'line',
          smooth: true,
          data: yAxisDatas[i].length > 0 ? yAxisDatas[i] : [0],
          itemStyle: {
            normal: {
              color: colorArray[i],
              lineStyle: {
                color: colorArray[i]
              },
              areaStyle: {
                type: 'default'
              }
            }
          }
        });
      }

      option.xAxis[0].data = xAxisData.length > 0 ? xAxisData : [""];
      option.legend.data = yAxisLabels;
    }

    myChart.setOption(option, true);
    return myChart;
  }
};

export default echartsUntil;
