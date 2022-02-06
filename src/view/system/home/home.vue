<template>
  <div>
    <Row :gutter="10">
      <i-col :md="24" :lg="6" style="margin-bottom: 20px">
        <Card shadow>
          <p slot="title" style="font-size: larger">
            <Icon type="ios-pie"></Icon>
            Windows
          </p>
          <p style="font-size: small; color: black">
            总数量：{{ this.windows_count}}
          </p>
          <chart-pie3
            style="height: 160px"
            :value="WindowsData"
            text="Windows"
          ></chart-pie3>
        </Card>
      </i-col>

      <i-col :md="24" :lg="6" style="margin-bottom: 20px">
        <Card shadow>
          <p slot="title" style="font-size: larger">
            <Icon type="ios-pie"></Icon>
            Linux服务器
          </p>
          <p style="font-size: small; color: black">
            总数量：{{ this.linux_count }}
          </p>
          <chart-pie3
            style="height: 160px"
            :value="this.LinuxData"
            text="Linux"
          ></chart-pie3>
        </Card>
      </i-col>

      <i-col :md="24" :lg="6" style="margin-bottom: 20px">
        <Card shadow>
          <p slot="title" style="font-size: larger">
            <Icon type="ios-pie"></Icon>
            MySQL数据库
          </p>
          <p style="font-size: small; color: black">
            总数量：{{ this.mysql_count }}
          </p>
          <chart-pie3
            style="height: 160px"
            :value="MysqlData"
            text="MySQL"
          ></chart-pie3>
        </Card>
      </i-col>

      <i-col :md="24" :lg="6" style="margin-bottom: 20px">
        <Card shadow>
          <p slot="title" style="font-size: larger">
            <Icon type="ios-pie"></Icon>
            Redis
          </p>
          <p style="font-size: small; color: black">
            总数量：{{ this.redis_count }}
          </p>
          <chart-pie3
            style="height: 160px"
            :value="RedisData"
            text="Redis"
          ></chart-pie3>
        </Card>
      </i-col>

      <i-col span="12">
        <card>
          <p slot="title" style="font-size: larger">
            <Icon type="ios-warning"></Icon>
            告警消息
          </p>
          <Scroll>
            <List>
              <ListItem v-for="info in alarminfoList" :key="info.id">
                <ListItemMeta
                  :title="info.alarm_header"
                  :description="info.alarm_content"
                />
              </ListItem>
            </List>
          </Scroll>
        </card>
      </i-col>

    </Row>

  </div>
</template>

<script>
import { CountTo } from '_c/count-to'
import { ChartPie, ChartBar, ChartPie3 } from '_c/charts'
import { getExportAlarmInfo } from '@/api/system'
import {getWindowsStatList} from '@/api/windows'
import { getLinuxStatList } from '@/api/linux'
import { getMysqlStatList } from '@/api/mysql'
import { getRedisStatList } from '@/api/redis'
import { statuscheck } from '@/libs/tools'

export default {
  name: 'home',
  components: {
    CountTo,
    ChartPie,
    ChartBar,
    ChartPie3
  },
  data () {
    return {
      WindowsData: [],
      LinuxData: [],
      MysqlData: [],
      RedisData: [],
      alarminfoList: [],
      windows_stat_list: [],
      linuxstatList: [],
      mysqlstatList: [],
      redisstatList: [],
      alarm_count: null,
      linux_count: null,
      mysql_count: null,
      redis_count: null,
      windows_count: null
    }
  },
  created () {
    this.get_export_alarm_info()
    this.get_windows_stat_list()
    this.get_linux_stat_list()
    this.get_mysql_stat_list()
    this.get_redis_stat_list()
    this.timer = setInterval(() => {
      this.get_export_alarm_info()
      this.get_windows_stat_list()
      this.get_linux_stat_list()
      this.get_mysql_stat_list()
      this.get_redis_stat_list()
    }, 1000 * 20)
  },
  methods: {
    get_export_alarm_info () {
      // 初始化时默认查询当天告警信息
      getExportAlarmInfo(`day=1`).then(res => {
        this.alarminfoList = res.data.results
        this.alarm_count = res.data.count
      }).catch(err => {
        this.$Message.error(`获取告警信息错误！${err}`)
      })
    },
    get_windows_stat_list (parameter) {
      getWindowsStatList(parameter)
        .then((res) => {
          this.windows_stat_list = res.data.results
          this.windows_count = res.data.count
          this.WindowsData = statuscheck(this.windows_stat_list)
          console.log(this.windows_stat_list)
        })
        .catch((err) => {
          this.$Message.error(`获取windows状态列表错误 ${err}`)
        })
    },
    get_mysql_stat_list (parameter) {
      getMysqlStatList(parameter)
        .then((res) => {
          this.mysqlstatList = res.data.results
          this.mysql_count = res.data.count
          this.MysqlData = statuscheck(this.mysqlstatList)
          console.log(this.data)
        })
        .catch((err) => {
          this.$Message.error(`获取mysql状态列表错误 ${err}`)
        })
    },
    get_redis_stat_list (parameter) {
      getRedisStatList(parameter)
        .then((res) => {
          this.redisstatList = res.data.results
          this.redis_count = res.data.count
          this.RedisData = statuscheck(this.redisstatList)
          console.log(this.data)
        })
        .catch((err) => {
          this.$Message.error(`获取redis状态列表错误 ${err}`)
        })
    },
    get_linux_stat_list(parameter){
      getLinuxStatList(parameter)
        .then((res) => {
          this.linuxstatList = res.data.results
          this.linux_count = res.data.count
          this.LinuxData = statuscheck(this.linuxstatList)
        })
        .catch((err) => {
          this.$Message.error(`获取linux状态列表错误 ${err}`)
        })
    }
  },
  mounted () {
    //
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
