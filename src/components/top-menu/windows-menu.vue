<template>
  <Menu mode="horizontal" theme="light" :active-name="this.value" ref="windows">
    <div class="layout-nav">
      <MenuItem name="1" :to="this.view" >
        <Icon type="ios-navigate"></Icon>
        概览
      </MenuItem>
<!--      todo 暂时不用-->
<!--      <MenuItem name="2" :to="this.io" >-->
<!--        <Icon type="ios-keypad"></Icon>-->
<!--        磁盘IO-->
<!--      </MenuItem>-->
<!--      <MenuItem name="3" :to="this.memory">-->
<!--        <Icon type="ios-analytics"></Icon>-->
<!--        内存&虚拟内存-->
<!--      </MenuItem>-->
    </div>
  </Menu>
</template>

<script>
export default {
  name: 'windows-menu',
  props: {
    value: String,
    tags: String
  },
  data () {
    return {
      view: '',
      io: '',
      memory: ''
    }
  },
  methods: {
    init () {
      this.view = '/windows/' + this.tags + '/view'
      // todo 暂时不用
      // this.io = '/linux/' + this.tags + '/io'
      // this.memory = '/linux/' + this.tags + '/memory'
    }
  },
  mounted () {
    console.log('来到windows-menu!');
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style scoped>

</style>
