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
              @on-change="get_redis_parameter"
              show-elevator
              show-total />
      </Row>
    </Card>
  </Row>
</template>

<script>
import { getRedisStatList } from '@/api/redis'
import { Tag } from 'iview'
import { formatDate } from '@/libs/tools'
export default {
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
          minWidth: 80,
          sortable: true,
          render: (h, params) => {
            const tags = params.row.tags
            return h('a', {
              on: {
                'click': () => {
                  this.gotoRedis(tags)
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
          minWidth: 80
        },
        {
          title: '运行天数',
          key: 'updays',
          minWidth: 100
        },
        // {
        //   title: '对象数',
        //   key: 'total_keys',
        //   width: 100
        // },
        {
          title: '最大内存配置',
          key: 'maxmemory',
          minWidth: 110,
          render: (h, params) => {
            const maxmemory = Number(params.row.maxmemory / 1024 / 1024).toFixed(2)
            return h('div', maxmemory + 'MB')
          }
        },
        {
          title: '内存使用率',
          key: 'maxmemory,used_memory',
          minWidth: 100,
          render: (h, params) => {
            const maxmemory = Number(params.row.maxmemory / 1024 / 1024).toFixed(2)
            const used_memory = params.row.used_memory
            const memory_rate = Number(used_memory / maxmemory * 100).toFixed(2)
            if (maxmemory >= 0) {
              console.log('memory_rate:', memory_rate, typeof memory_rate)
            }
            if (isNaN(memory_rate)) {
              return h('i-progress', { props: { percent: 0, status: 'wrong' } })
            }
            if (memory_rate === 'Infinity') {
              console.log('Infinity执行了')
              return h('i-progress', { props: { percent: 100 } }, '无限制')
            }
            if (memory_rate > 80) {
              console.log('一锤八十')
              return h('i-progress', { props: { percent: memory_rate } }, memory_rate + '%')
            }
            if (memory_rate > 60 && memory_rate < 80) {
              return h('i-progress', { props: { percent: memory_rate } }, memory_rate + '%')
            } else {
              return h('i-progress', { props: { percent: memory_rate } }, memory_rate + '%')
            }
          }
        },
        {
          title: '连接数',
          key: 'connected_clients',
          minWidth: 75
        },
        {
          title: '角色',
          key: 'role',
          minWidth: 75
        },
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
          minWidth: 85,
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

        // todo 未开放功能
        // {
        //   title: '命中率',
        //   key: 'hits,misses',
        //   width: 110,
        //   render: (h, params) => {
        //     const hits = params.row.hits
        //     const misses = params.row.misses
        //     const all = hits + misses
        //     var hits_rate = -1
        //     console.log('hits的值是：', hits);
        //     console.log('misses的值是：', misses);
        //     if (all > 0) {
        //       hits_rate = Number(hits / all).toFixed(2)
        //     }
        //     if (hits_rate !== -1 && hits_rate < 0.6) {
        //       return h(Tag, { props: { color: 'error' } }, hits_rate)
        //     }
        //     if (hits_rate !== -1 && hits_rate > 0.6 && hits_rate < 1) {
        //       return h(Tag, { props: { color: 'warning' } }, hits_rate)
        //     } else {
        //       return h(Tag, { props: { color: 'success' } }, hits_rate)
        //     }
        //   }
        // },

        // todo 未开放功能
        // {
        //   title: '碎片率',
        //   key: 'mem_fragmentation_ratio',
        //   width: 110,
        //   render: (h, params) => {
        //     const mem_fragmentation_ratio = params.row.mem_fragmentation_ratio
        //     if (mem_fragmentation_ratio < 1) {
        //       return h(Tag, { props: { color: 'error' } }, mem_fragmentation_ratio)
        //     }
        //     if (mem_fragmentation_ratio > 1.5) {
        //       return h(Tag, { props: { color: 'warning' } }, mem_fragmentation_ratio)
        //     } else {
        //       return h(Tag, { props: { color: 'success' } }, mem_fragmentation_ratio + '%')
        //     }
        //   }
        // },
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
    this.get_redis_stat_list()
    this.timer = setInterval(() => {
      this.get_redis_stat_list()
    }, 1000 * 20)
  },
  methods: {
    gotoRedis (tags) {
      const path = '/redis/' + tags + '/view'
      this.$router.push({ path: path })
    },
    search () {
      console.log(this.host_search)
      this.get_redis_stat_list(`host=${this.host_search}`)
    },
    clear_search () {
      this.host_search = ''
      this.get_redis_stat_list()
    },
    get_redis_stat_list (parameter) {
      getRedisStatList(parameter).then(res => {
        this.data = res.data.results
        this.count = res.data.count
        console.log('get_redis_stat_list ', this.data)
      }).catch(err => {
        this.$Message.error(`获取redis资源信息错误 ${err}`)
      })
    },
    get_redis_parameter (parameter) {
      console.log(parameter)
      this.get_redis_stat_list(`page=${parameter}`)
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
