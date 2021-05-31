<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card> <div id="main" style="width: 750px; height: 400px"></div></el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {

  },
  // 此时页面上的元素已经被渲染结束
  async mounted () {
    // 初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据失败')
    }
    this.$message.success('获取数据成功')
    const returnedTarget = Object.assign(this.options, res.data)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(returnedTarget)
  },
  methods: {
    // async getData () {
    //   const { data: res } = await this.$http.get('reports/type/1')
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取数据失败')
    //   }
    //   this.$message.success('获取数据成功')
    //   console.log(res)
    //   return res.data
    // }
  }
}
</script>

<style lang="less" scoped>
</style>
