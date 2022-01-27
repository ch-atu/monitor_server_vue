<template>
  <Row>
    <Row>
      <Input v-model="host_search"
             placeholder="ip地址"
             style="width: 180px" />&nbsp;
      <Button @click="search"
              type="primary">搜索</Button>&nbsp;
      <Button @click="clear_search"
              type="success">刷新</Button>
    </Row>
    <Card>
      <br>
      <Row>
        <Table size="small" border
               :columns="columns"
               :data="data">
        </Table>
      </Row>
      <Row>
        <br>
        <Page :total="count"
              :page_size='page_size'
              @on-change="get_windows_parameter"
              show-elevator
              show-total />
      </Row>
    </Card>
  </Row>
</template>

<script>
import { getWindowsStatList } from '@/api/windows'
import { formatDate } from '@/libs/tools'
import { Tag } from 'iview'
export default {
  data () {
    return {
      show: false,
      columns: [
        {
          type: 'index',
          width: '80%',
          align: 'center'
        },
        {
          title: '标签',
          width: '80%',
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            return h('a', {
              on: {
                'click': () => {
                  this.gotoWindows(tags)
                }
              }
            }, tags)
          }
        },
        {
          title: 'IP地址',
          key: 'host',
          width: '120%',
          sortable: true
        },
        {
          title: '主机名',
          key: 'hostname',
          width: '130%'
        },
        {
          title: '运行天数',
          key: 'updays',
          width: '116%'
        },
        {
          title: '虚拟内存使用率',
          key: 'virtual_mem_used_rate',
          width: '130%',
          render: (h, params) => {
            const virtual_mem_used_rate = params.row.virtual_mem_used_rate
            if (virtual_mem_used_rate >= 90) {
              return h(Tag, { props: { color: 'error' } }, virtual_mem_used_rate + '%')
            }
            if (virtual_mem_used_rate >= 80) {
              return h(Tag, { props: { color: 'warning' } }, virtual_mem_used_rate + '%')
            }
            if (virtual_mem_used_rate === null) {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, virtual_mem_used_rate + '%')
            }
          }
        },
        {
          title: 'CPU使用率',
          key: 'cpu_used_rate',
          width: '100%',
          render: (h, params) => {
            const cpu_used_rate = params.row.cpu_used_rate
            if (cpu_used_rate >= 90) {
              return h(Tag, { props: { color: 'error' } }, cpu_used_rate + '%')
            }
            if (cpu_used_rate >= 80) {
              return h(Tag, { props: { color: 'warning' } }, cpu_used_rate + '%')
            }
            if (cpu_used_rate === null) {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, cpu_used_rate + '%')
            }
          }
        },
        {
          title: '内存使用率',
          key: 'physical_mem_used_rate',
          width: '100%',
          render: (h, params) => {
            const physical_mem_used_rate = params.row.physical_mem_used_rate
            if (physical_mem_used_rate >= 90) {
              return h(Tag, { props: { color: 'error' } }, physical_mem_used_rate + '%')
            }
            if (physical_mem_used_rate >= 80) {
              return h(Tag, { props: { color: 'warning' } }, physical_mem_used_rate + '%')
            }
            if (physical_mem_used_rate === null) {
              return null
            } else {
              return h(Tag, { props: { color: 'success' } }, physical_mem_used_rate + '%')
            }
          }
        },
        {
          title: '采集时间',
          key: 'check_time',
          // width: '100%',
          render: (h, params) => {
            console.log('h的值：', h)
            console.log('params的值是：', params)
            return h('div',
              formatDate(new Date(params.row.check_time), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '状态',
          key: 'status',
          width: '100%',
          render: (h, params) => {
            const levelMap = {
              0: { color: 'green', desc: '正常' },
              1: { color: 'red', desc: '失败' }
            }
            const status = params.row.status
            return h(Tag, { props: { color: levelMap[status]['color'] } }, levelMap[status]['desc'])
          }
          // fixed: 'right'
        }
      ],
      data: [],
      count: 0,
      page_size: 10,
      host_search: '',
      create: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      updateId: null
    }
  },
  computed: {
    access () {
      return this.$store.state.user.access
    }
  },
  created () {
    this.get_windows_stat_list()
  },
  methods: {
    gotoWindows (tags) {
      const path = '/windows/' + tags + '/view'
      this.$router.push({ path: path })
    },
    search () {
      console.log(this.host_search)
      this.get_windows_stat_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_windows_stat_list()
    },
    get_windows_stat_list (parameter) {
      getWindowsStatList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log('获取到的windows列表', this.data)
      }).catch(err => {
        this.$Message.error(`获取windows资源信息错误 ${err}`)
      })
    },
    get_windows_parameter (parameter) {
      console.log(parameter)
      this.get_windows_stat_list(`page=${parameter}`)
    }
  }
}
</script>
<style scoped>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.ivu-table .demo-table-info-cell-danger {
  background-color: #d40f35;
  color: #fff;
}
.ivu-table .demo-table-info-cell-mormal {
  background-color: #22d489;
  color: #fff;
}

.ivu-table-wrapper{
  /*width: 1045px;*/
  margin: 0 auto 0 auto;
}
</style>
