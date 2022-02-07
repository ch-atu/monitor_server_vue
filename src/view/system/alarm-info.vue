<style lang="less">
@import "./common.less";
</style>
<template>
  <div class="layout">
     <Layout>
        <Content :style="{margin: '10px 0 0', background: '#fff', minHeight: '500px'}">
         <Button icon="md-download" :loading="exportLoading" @click="exportExcel">导出文件</Button>
         <day-select style="margin-left: 5px" @change_select="get_select_alarm_info"></day-select>
          <Card>
            <br>
              <Table size="small"
                     :columns="columns"
                     :data="data">
              </Table>
              <br>
              <Page :total="count"
                    :page-size='page_size'
                    @on-change="get_export_alarm_info_page"
                    show-elevator
                    show-total />
          </Card>
        </Content>
     </Layout>
  </div>
</template>

<script>
import { getAlarmInfo, getExportAlarmInfo, getExcelAlarmInfo } from '@/api/system'
import { hasOneOf, formatDate } from '@/libs/tools'
import excel from '@/libs/excel'
import { Button, Table, Modal, Message, Tag } from 'iview'

import daySelect from '_c/content'
export default {
  components: {
    // 增加日期选择器
    daySelect
  },
  data () {
    return {
      show: false,
      columns: [
        {
          type: 'index',
          minWidth: 50,
          align: 'center'
        },
        {
          title: '标签',
          key: 'tags',
          minWidth: 100
        },
        {
          title: '告警名称',
          key: 'alarm_type',
          minWidth: 150
        },
        {
          title: '服务地址',
          key: 'url',
          minWidth: 120
        },
        {
          title: '告警内容',
          key: 'alarm_content',
          minWidth: 400
        },
        {
          title: '告警时间',
          key: 'alarm_time',
          minWidth: 140,
          sortable: true,
          render: (h, params) => {
            return h('div', formatDate(new Date(params.row.alarm_time), 'yyyy-MM-dd hh:mm')
            )
          }
        }
      ],
      data: [],
      count: 0,
      page_size: 10,
      create: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null,
      // 新增导入文件
      exportLoading: false,
      exportData: null,
      day: 1

    }
  },
  computed: {
    access () {
      return this.$store.state.user.access
    }
  },
  created () {
    this.get_export_alarm_info()
  },
  methods: {
    // 新增导入表格
    exportExcel () {
      if (this.exportData.length) {
        this.exportLoading = true
        const params = {
          title: ['标签', '告警名称', '服务地址', '告警内容', '告警时间'],
          key: ['tags', 'alarm_type', 'url', 'alarm_content', 'alarm_time'],
          data: this.exportData,
          autoWidth: true,
          filename: '告警信息'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('无数据！表格数据不能为空！')
      }
    },
    // 初始化时默认查询当天告警信息 或 获取day=xx&page=xx的告警信息
    get_export_alarm_info (parameter) {
      // 初始化时默认查询当天告警信息
      if (parameter === undefined) {
        getExportAlarmInfo(`day=1`).then(res => {
          // this.exportData = res.data.results
          this.data = res.data.results
          this.count = res.data.count
        }).catch(err => {
          this.$Message.error(`获取告警信息错误！${err}`)
        })
        getExcelAlarmInfo(`day=1`).then(res => {
          // console.log('告警日志获取：', res);
          this.exportData = res.data
        }).catch(err => {
          this.$Message.error(`导出告警信息错误！${err}`)
        })
      } else {
        // 获取day=xx&page=xx的告警信息
        getExportAlarmInfo(parameter).then(res => {
          // this.exportData = res.data.results
          console.log('获取页码数的告警信息：', res)
          this.data = res.data.results
          this.count = res.data.count
        }).catch(err => {
          this.$Message.error(`获取告警信息错误！${err}`)
        })
      }
    },
    // 查询选择日期的告警信息
    get_select_alarm_info (val) {
      this.day = val
      getExportAlarmInfo(`day=${val}`).then(res => {
        console.log('getExportAlarmInfo的res值为：', res)
        this.data = res.data.results
        this.count = res.data.count
      }).catch(err => {
        this.$Message.error(`获取告警信息错误！${err}`)
      })
      getExcelAlarmInfo(`day=${val}`).then(res => {
        console.log('告警日志获取：', res)
        this.exportData = res.data
      }).catch(err => {
        this.$Message.error(`导出告警信息错误！${err}`)
      })
    },
    // 页码跳转的事件处理
    get_export_alarm_info_page (parameter) {
      this.get_export_alarm_info(`day=${this.day}&page=${parameter}`)
    }
  }
}
</script>
<style scoped>
.ivu-table-wrapper{
  margin: 0 auto 0 auto;
}

</style>
