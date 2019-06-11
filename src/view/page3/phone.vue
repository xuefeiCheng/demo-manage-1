<template>
  <div ref="divWidth" class="div-border">
    <Form ref="search" :model="search" :label-width="80">
      <Row>
        <Col span="8">
          <FormItem label="辖区">
            <Select v-model="search.name">
                <Option value="1">北京市</Option>
                <Option value="2">怀柔区</Option>
                <Option value="3">延庆区</Option>
                <Option value="4">密云区</Option>
                <Option value="5">平谷区</Option>
                <Option value="6">昌平区</Option>
                <Option value="7">顺义区</Option>
                <Option value="8">门头沟区</Option>
                <Option value="9">房山区</Option>
                <Option value="10">大兴区</Option>
                <Option value="11">通州区</Option>
                <Option value="12">朝阳区</Option>
                <Option value="13">丰台区</Option>
                <Option value="14">东城区</Option>
                <Option value="15">西城区</Option>
                <Option value="16">石景山</Option>
                <Option value="17">海淀区</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="时间">
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

    <Button type="success" icon="ios-cloud-upload" @click="batchAdd">导入</Button>
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

    <!-- 导入modal -->
    <Modal
      v-model="importModal"
      title="导入"
      @on-ok="handleUpload('add')"
      @on-cancel="cancel('add')"
      :loading="add.loading"
    >
      <Form ref="add" :model="add.data" :label-width="100"  label-position="right">
        <FormItem label="疑似号码文件" prop="file">
          <Upload :before-upload="beforeUpload" ref="uploadBtn" action="" :accept="add.accept" :format="add.format">
            <Button icon="ios-cloud-upload-outline">请选择疑似号码文件</Button>
            <span style="margin-left: 10px; color: red;">只支持txt、csv格式的文件</span>
          </Upload>
          <div v-if="add.data.fileName !== null">已选中文件: {{ add.data.fileName }}</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { timeFilter } from '@/utils/methods'
export default {
  data () {
    return {
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
          title: '疑似号码',
          key: 'phoneNumber'
        },
        {
          title: '发现日期',
          key: 'createTime',
          render: (h, params) => {
            return h('span', timeFilter(params.row.createTime))
          }
        },
        {
          title: '可疑行为',
          key: 'action'
        },
        {
          title: '提醒方式',
          key: 'tixing'
        },
        {
          title: '归属运营商',
          key: 'yys'
        },
        {
          title: '归属地',
          key: 'localtion'
        }
      ],
      tableData: [
        {
          phoneNumber: '16262626282',
          createTime: '201906041334',
          action: '短信轰炸',
          tixing: '高频提醒下发',
          yys: '中国移动',
          localtion: '北京'
        },
        {
          phoneNumber: '16262626282',
          createTime: '201906041334',
          action: '短信轰炸',
          tixing: '响一声提醒下发',
          yys: '中国移动',
          localtion: '北京'
        },
        {
          phoneNumber: '16262626282',
          createTime: '201906041334',
          action: '短信轰炸',
          tixing: '恶意“呼死你”提醒下发',
          yys: '中国移动',
          localtion: '北京'
        },
        {
          phoneNumber: '16262626282',
          createTime: '201906041334',
          action: '短信轰炸',
          tixing: '低频诈骗提醒下发',
          yys: '中国移动',
          localtion: '北京'
        }
      ],
      pageConfig: {
        total: 4,
        current: 1,
        pageSize: 10
      },
      // ----------------------------导入数据----------------------------
      importModal: false,
      add: {
        loading: true,
        appept: '.txt',
        format: ['.txt'],
        data: {
          source: '',
          file: null,
          fileName: null
        }
      }
    }
  },
  mounted () {
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
    batchAdd () {
      // 批量新增按钮 触发 弹框展示
      this.importModal = true
    },
    pageChange (pageIndex) {
      this.pageConfig.current = pageIndex
      this.searchData()
    },
    pageSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize
    },
    handleUpload (name) { // 导入 实现
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.add.data.file == null) {
            this.$Message.error('请选择号码文件')
          } else {
            this.importModal = false
            this.cancel(name)
          }
        } else {
        }
      })
    },
    // --------------------导入相关方法------------------------------
    beforeUpload (file) {
      this.add.data.file = file
      this.add.data.fileName = file.name
      return false
    },
    cancel (name) { // 取消批量新增
      this.add.data.fileName = null
      this.add.data.file = null
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="css">
@import "../../../static/css/base.css";
</style>
