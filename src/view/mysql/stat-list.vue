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
              @on-change="get_mysql_parameter"
              show-elevator
              show-total />
      </Row>
    </Card>
  </Row>
</template>

<script>
import { getMysqlStatList } from '@/api/mysql'
import { formatDate } from '@/libs/tools'
import { Tag } from 'iview'
export default {
  data () {
    return {
      show: false,
      columns: [
        {
          type: 'index',
          minWidth: 60,
          align: 'center'
        },
        {
          title: '标签',
          minWidth: 80,
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            return h('a', {
              on: {
                'click': () => {
                  this.gotoMysql(tags)
                }
              }
            }, tags)
          }
        },
        {
          title: 'IP地址',
          key: 'host',
          minWidth: 120,
          sortable: true
        },
        {
          title: '端口',
          key: 'port',
          minWidth: 80
        },
        {
          title: '版本',
          key: 'version',
          minWidth: 100
        },
        {
          title: '运行天数',
          key: 'updays',
          minWidth: 100
        },
        {
          title: '连接线程数',
          key: 'threads_connected',
          minWidth: 100
        },
        {
          title: '活动线程数',
          key: 'threads_running',
          minWidth: 100
        },
        {
          title: '等待线程数',
          key: 'threads_waited',
          minWidth: 100
        },
        // {
        //   title: 'QPS',
        //   key: 'qps',
        //   width: 70
        // },
        // {
        //   title: 'TPS',
        //   key: 'tps',
        //   width: 70
        // },
        {
          title: '采集时间',
          key: 'check_time',
          minWidth: 200,
          render: (h, params) => {
            return h('div',
              formatDate(new Date(params.row.check_time), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '状态',
          key: 'status',
          minWidth: 100,
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
    this.get_mysql_stat_list()
    this.timer = setInterval(() => {
      this.get_mysql_stat_list()
    }, 1000 * 20)
  },
  methods: {
    gotoMysql (tags) {
      const path = '/mysql/' + tags + '/view'
      this.$router.push({ path: path })
    },
    search () {
      console.log(this.host_search)
      this.get_mysql_stat_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_mysql_stat_list()
    },
    get_mysql_stat_list (parameter) {
      getMysqlStatList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log(this.data)
      }).catch(err => {
        this.$Message.error(`获取mysql资源信息错误 ${err}`)
      })
    },
    get_mysql_parameter (parameter) {
      console.log(parameter)
      this.get_mysql_stat_list(`page=${parameter}`)
    }
  },
  destroyed () {
    clearInterval(this.timer)
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
  margin: 0 auto 0 auto;
}
</style>
