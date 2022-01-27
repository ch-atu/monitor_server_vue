<template>
  <div class="layout">
    <Layout>
      <linux-menu :value="'1'" :tags="this.Tags" ></linux-menu>
      <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
        <Row>
          <i-col span="9">
            <card>
              <Alert show-icon>
                主机信息
                <Icon type="ios-bulb-outline" slot="icon"></Icon>
              </Alert>
              <Table size="small" :show-header="false" :columns="columns1" :data="windows_info_data"></Table>
            </card>

            <card>
              <Alert show-icon>
                磁盘使用率
                <Icon type="ios-bulb-outline" slot="icon"></Icon>
              </Alert>
              <Table size="small" :columns="columnsDisk" :data="linuxdiskList"></Table>
            </card>

            <card>
              <Alert show-icon>
                告警
                <Icon type="ios-bulb-outline" slot="icon"></Icon>
              </Alert>
              <Table size="small" :columns="columnsAlarm" :data="alarmData"></Table>
            </card>
          </i-col>

          <i-col span="15">
            <i-col span="8">
              <Card>
                <simple-chart-pie style="height: 150px;" :value="cpu_used_data" text="CPU使用率"></simple-chart-pie>
              </Card>
            </i-col>

            <i-col span="8">
              <Card>
                <simple-chart-pie style="height: 150px;" :value="physical_mem_used_data" text="内存使用率"></simple-chart-pie>
              </Card>
            </i-col>

            <i-col span="8">
              <Card>
                <simple-chart-pie style="height: 150px;" :value="virtual_mem_used_data" text="虚拟内存使用率"></simple-chart-pie>
              </Card>
            </i-col>
          </i-col>

          <i-col span="15">
            <Card>
              <DatePicker @on-change="handleDaterangechange" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间范围" style="width: 250px"></DatePicker>
              <br>
              <chart-line1 style="height: 200px;" :title=chart1_title :data1="checktimeData" :data2="cpuData"></chart-line1>
              <br>
              <chart-line1 style="height: 200px;" :title=chart2_title :data1="checktimeData" :data2="memData"></chart-line1>
              <br>
<!--              todo 暂不使用-->
<!--              <chart-line2 style="height: 200px;" :title=chart3_title :data1="checktimeData" :data2="readmbData" :data3="writembData"></chart-line2>-->
              <chart-line1 style="height: 200px;" :title=chart3_title :data1="checktimeData" :data2="virtualmemData"></chart-line1>
            </Card>
          </i-col>
        </Row>
      </Content>
    </Layout>
  </div>
</template>

<script>
import { LinuxMenu } from '_c/top-menu'
import { hasOneOf, formatDate } from '@/libs/tools'
import InforCard from '_c/info-card'
import { getWindowsStat, getWindowsStatHis } from '@/api/windows'
import { getAlarmInfo, getExportAlarmInfo } from '@/api/system'
import { ChartPie, SimpleChartPie, ChartLine1, ChartLine2 } from '_c/charts'
import { Tag } from 'iview'

export default {
  name: 'linux_view',
  components: {
    LinuxMenu,
    InforCard,
    SimpleChartPie,
    ChartLine1,
    ChartLine2,
    ChartPie
  },
  data () {
    return {
      Tags: '',
      end: 0,
      asynEndVal: 487,
      integratedEndVal: 3,
      data: [],
      windows_info: [],
      windows_info_list: [],
      linuxdiskList: [],
      alarmData: [],
      columns1: [
        {
          title: 'column1',
          key: 'column1'
        },
        {
          title: 'column2',
          key: 'column2'
        }
      ],
      columnsDisk: [
        {
          title: '磁盘',
          key: 'mount_point',
          width: '100%'
        },
        {
          title: '使用率',
          key: 'used_percent',
          width: '100%',
          render: (h, params) => {
            const used_percent = params.row.used_percent
            if (used_percent >= 95) {
              return h(Tag, { props: { color: 'error' } }, used_percent + '%')
            }
            if (used_percent >= 85) {
              return h(Tag, { props: { color: 'warning' } }, used_percent + '%')
            }
            if (used_percent === null) {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, used_percent + '%')
            }
          }
        },
        {
          title: '剩余空间(GB)',
          key: 'free_size',
          // width: 120
        }
      ],
      columnsAlarm: [
        {
          title: '告警内容',
          key: 'alarm_content',
          width: 250
        },
        {
          title: '告警时间',
          key: 'alarm_header',
          // width: 140,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.alarm_time), 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      windows_info_data: [],
      cpu_used_data: 50,
      physical_mem_used_data: 50,
      virtual_mem_used_data: 50,
      checktimeData: [],
      cpuData: [],
      memData: [],
      virtualmemData: [],
      readmbData: [],
      writembData: [],
      chart1_title: ['CPU', 'CPU使用率'],
      chart2_title: ['内存', '内存使用率'],
      // chart3_title: ['磁盘IO', 'readmb', 'writemb'],
      chart3_title: ['虚拟内存', '虚拟内存使用率'],
      daterangeValue: null,
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.get_windows_stat(`tags=${this.$route.params.tags}`)
    this.get_windows_stat_his(`tags=${this.$route.params.tags} `)
    // this.get_linux_disk(`tags=${this.$route.params.tags} `)
    this.get_export_alarm_info(`tags=${this.$route.params.tags}&alarm_type=linux`)
    // console.log('this.$route.params：', this.$route.params);
    this.Tags = this.$route.params.tags
    this.timer = setInterval(() => {
      // this.get_linux_stat(`tags=${this.$route.params.tags} `)
      // this.get_linux_stat_his(`tags=${this.$route.params.tags} `)
      // this.get_linux_disk(`tags=${this.$route.params.tags} `)
      // // this.get_alarm_info(`tags=${this.$route.params.tags} `)
      // this.get_export_alarm_info(`tags=${this.$route.params.tags}&alarm_type=linux `)
    }, 1000 * 60 * 2)
  },
  methods: {
    init () {
    },
    get_windows_stat (parameter) {
      getWindowsStat(parameter).then(res => {
        this.windows_info = res.data.results[0]
        this.windows_info_data = [
          {
            column1: '主机名: ' + this.windows_info.hostname,
            column2: 'IP信息: ' + this.windows_info.ip_info },
          {
            column1: 'windows发行版本: ' + this.windows_info.windows_version,
            column2: '运行天数: ' + this.windows_info.updays },
          {
            column1: 'CPU型号: ' + this.windows_info.cpu_type,
            column2: 'CPU核数: ' + this.windows_info.cpu_cores },
          {
            column1: 'CPU频率: ' + this.windows_info.cpu_speed,
            column2: 'CPU线程数: ' + this.windows_info.cpu_thread }
        ]
        this.cpu_used_data = this.windows_info.cpu_used_rate
        this.physical_mem_used_data = this.windows_info.physical_mem_used_rate
        this.virtual_mem_used_data = this.windows_info.virtual_mem_used_rate
        console.log(this.windows_info)
      }).catch(err => {
        this.$Message.error(`获取linux资源信息错误 ${err}`)
      })
    },
    get_windows_stat_his (parameter) {
      console.log('get_windows_stat_his被调用')
      getWindowsStatHis(parameter).then(res => {
        this.windows_info_list = res.data.results
        // this.checktimeData = this.windows_info_list.map(linux => linux.check_time)
        this.checktimeData = this.windows_info_list.map(
          windows => {
            console.log('windows.check_time的值是：', windows.check_time)
            return formatDate(new Date(windows.check_time), 'yyyy-MM-dd hh:mm')
          })
        console.log('this.checktimeData:的值是：', this.checktimeData)
        this.cpuData = this.windows_info_list.map(windows => windows.cpu_used_rate)
        this.memData = this.windows_info_list.map(windows => windows.physical_mem_used_rate)
        this.virtualmemData = this.windows_info_list.map(windows => windows.virtual_mem_used_rate)
        // console.log('memData的值为', this.memData);
        // this.readmbData = this.windows_info_list.map(linux => linux.read_mb)
        // this.writembData = this.windows_info_list.map(linux => linux.write_mb)
      }).catch(err => {
        this.$Message.error(`获取windows资源信息错误 ${err}`)
      })
    },
    get_linux_disk (parameter) {
      getLinuxDisk(parameter).then(res => {
        this.linuxdiskList = res.data.results
      }).catch(err => {
        this.$Message.error(`获取linux磁盘信息错误 ${err}`)
      })
    },
    get_export_alarm_info (parameter) {
      getExportAlarmInfo(parameter).then(res => {
        this.alarmData = res.data.results
        this.count = res.data.count
      }).catch(err => {
        this.$Message.error(`获取告警信息错误 ${err}`)
      })
    },
    handleDaterangechange (daterange) {
      this.daterangeValue = daterange
      this.startTime = daterange[0]
      this.endTime = daterange[1]
      this.get_windows_stat_his(`tags=${this.$route.params.tags}&start_time=${this.startTime}&end_time=${this.endTime}`)
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
@baseColor: ~"#dc9387";
.countto-page-row{
  height: 200px;
}
.count-to-con{
  display: block;
  width: 100%;
  text-align: center;
}
.count-text{
  font-size: 50px;
  color: @baseColor;
}
.slot-text{
  font-size: 22px;
}
.unit-class{
  font-size: 30px;
  color: @baseColor;
}
.layout-footer-center{
  text-align: center;
}
.count-style{
  font-size: 50px;
}
</style>
