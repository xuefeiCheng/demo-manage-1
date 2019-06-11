<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="任务名称">
            <Input type="text" v-model="search.name" placeholder="请输入想要查询的任务名称" />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="下发时间">
            <DatePicker type="daterange" placement="bottom-end" style="width: 100%;" v-model="search.time" placeholder="请选择想要查询的时间"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8" style="text-align: center;">
          <FormItem>
            <Button type="success" icon="ios-search" class="searchBtn" @click="handleSearch">查询</Button>
            <Button type="info"  icon="ios-refresh" class="searchBtn" @click="handleReset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <Divider />

    <Button type="primary" icon="ios-add-circle-outline" @click="singleAdd">新增</Button>
    <Table
      border
      :loading="tableLoading"
      highlight-row
      :columns="columns"
      :data="tableData"
      style="margin-top:1rem;"
    ></Table>
    <div class="tab_footer">
      <Page
        :total="pageConfig.total"
        :current="pageConfig.current"
        :page-size="pageConfig.pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
        show-sizer
        show-elevator
        show-total
      />
    </div>
    <!-- 单个新增 -->
    <Modal
      v-model="singleAddModal"
      title="新增"
      class="modal-add"
      width="600"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="singleAddForm"
        :model="singleAddForm"
        :label-width="100"
        :rules="validateSingleAddForm"
      >
      <!-- 新增 增加什么字段 暂时 号码 + 增加原因 （用户输入？ 下拉选择）-->
      <!-- 确认新增 是否需要再次确认 还是直接点击按钮就新增 -->
      <!-- 号码校验是否需要？ -->
        <FormItem label="任务名称" prop="name">
          <Input type="text" v-model="singleAddForm.name" placeholder="任务名称"></Input>
        </FormItem>
        <FormItem label="发送人群" prop="source">
          <Select v-model="singleAddForm.source">
            <Option value="1">老人群体</Option>
            <Option value="2">大学生群体</Option>
            <Option value="3">网购群体</Option>
            <Option value="4">自分析受害号码群体</Option>
          </Select>
        </FormItem>
        <FormItem label="发送区域" prop="area">
          <Input type="text" v-model="singleAddForm.area" placeholder="发送区域"></Input>
        </FormItem>
        <FormItem>
          <div id="baiduMap" style="height:200px;width:100%;">地图区域</div>
        </FormItem>
        <FormItem label="短信内容" prop="content">
          <Input type="textarea" v-model="singleAddForm.content" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入短信内容···"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="cancalAddSingleData('singleAddForm')">取消</Button>
        <Button type="primary" @click="addSingleData('singleAddForm')">确认</Button>
        <!-- <Button type="info" @click="resetSingleData('singleAddForm')">重置</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import { timeFilter } from '@/utils/methods'
export default {
  data () {
    return {
      map: null,
      search: {
        name: '',
        time: [null, null]
      },
      // ---------------------表格数据------------------------------------
      tableLoading: false,
      columns: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '任务名称',
          key: 'name'
        },
        {
          title: '下发时间',
          key: 'createTime',
          render: (h, params) => {
            return h('span', timeFilter(params.row.createTime))
          }
        },
        {
          title: '下发成功数量',
          key: 'successNum'
        },
        {
          title: '失败数量',
          key: 'failNum'
        }
      ],
      tableData: [
        {
          name: '高频提醒下发',
          createTime: '201906041334',
          successNum: '1000',
          failNum: '0'
        },
        {
          name: '响一声提醒下发',
          createTime: '201906041334',
          successNum: '998',
          failNum: '2'
        },
        {
          name: '恶意“呼死你”提醒下发',
          createTime: '201906041334',
          successNum: '1000',
          failNum: '0'
        },
        {
          name: '低频诈骗提醒下发',
          createTime: '201906041334',
          successNum: '891',
          failNum: '109'
        }
      ],
      pageConfig: {
        total: 4,
        current: 1,
        pageSize: 10
      },
      // ------------------------单条数据 新增--------------------------------
      singleAddModal: false,
      singleAddForm: {
        name: '',
        content: '',
        area: '', // 发送区域
        source: '' // 数据来源
      },
      validateSingleAddForm: {
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        content: [
          {
            required: true,
            message: '短信内容不能为空',
            trigger: 'blur'
          }
        ],
        area: [
          {
            required: true,
            message: '发送区域不能为空',
            trigger: 'blur'
          }
        ],
        source: [
          {
            required: true,
            message: '发送人群不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.createMap()
    // this.initailSearch('searchForm')
  },
  methods: {
    init () {
      // 默认请求数据
    },
    searchArguments () {
      // 搜索条件
    },
    handleSearch () {
      // 搜索查询
    },
    handleReset () {
      // 重置搜索条件
      this.search = {
        name: '',
        time: [null, null]
      }
      this.pageConfig = {
        total: 4,
        current: 1,
        pageSize: 10
      }
      // 请求数据
      // this.init()
    },
    singleAdd () {
      // 新增按钮 触发 新增弹框
      this.singleAddModal = true
    },
    addSingleData (formName) {
      // 单条数据新增 实现
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addModal = false
        } else {
          this.addModal = true
          this.$Message.warning('数据格式错误，请填写正确再提交')
        }
      })
    },
    cancalAddSingleData (formName) {
      // 取消单条数据新增
      this.singleAddModal = false
      this.$refs[formName].resetFields()
    },
    resetSingleData (formName) {
      // 重置新增弹框
      this.$refs[formName].resetFields()
    },
    pageChange (pageIndex) {
      this.pageConfig.current = pageIndex
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
    },
    createMap () {
      this.map = new window.BMap.Map('baiduMap', {})
      this.map.setCurrentCity('北京') // 创建中心城市
      this.map.centerAndZoom(new window.BMap.Point(116.3283802349904, 39.968705687675566), 12) // 创建中心点
      this.map.enableScrollWheelZoom() // 开启鼠标滚轮缩放
      this.map.setMinZoom(8) // 最小缩放级别
      this.map.setMaxZoom(15) // 最大缩放级别
      this.map.addEventListener('click', this.showInfo)
    },
    showInfo (e) {
      this.singleAddForm.area = e.point.lng + ', ' + e.point.lat
    }
  }
}
</script>

<style lang="css" scoped>
@import "../../../static/css/base.css";
.modal-add .ivu-modal-body {
  max-height: none !important;
}
</style>
