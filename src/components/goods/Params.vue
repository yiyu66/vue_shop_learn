<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"> </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleCateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 111111添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            :disabled="isBtnDisabled"
            @click="addParamsVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{
                  item
                }}</el-tag>
                <!-- 添加输入参数Tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 222222添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            :disabled="isBtnDisabled"
            @click="addParamsVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{
                  item
                }}</el-tag>
                <!-- 添加输入参数Tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamsVisible" width="50%" @close="addParamsClose">
      <!-- 添加动态参数对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name"> <el-input v-model="addForm.attr_name"> </el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editParamsVisible" width="50%" @close="editParamsClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name"> <el-input v-model="editForm.attr_name"> </el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      selectedCateKeys: [], // 级联选择框选中项
      activeName: 'many', // 被激活的页签名称
      manyTableDate: [], // 动态参数数据
      onlyTableDate: [],
      addParamsVisible: false,
      editParamsVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{
          required: true, message: '请输入参数名称', trigger: 'blur'
        }]
      },
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [{
          required: true, message: '请输入参数名称', trigger: 'blur'
        }]
      }
    }
  },
  created () { this.getCateList() },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.$message.success('获取商品分类成功')
      this.cateList = res.data
    },
    async handleCateChange () {
      this.getParamsData()
    },
    // 切换tab
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数列表
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) { // 只能选中3级分类
        this.selectedCateKeys = []
        this.manyTableDate = []
        this.onlyTableDate = []
      }

      // 根据当前面板获取对应参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableDate = res.data
      } else {
        this.onlyTableDate = res.data
      }
    },
    // 监听对话框关闭
    addParamsClose () {
      this.$refs.addFormRef.resetFields()
    },
    editParamsClose () {
      this.$refs.editFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败')
          return
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addParamsVisible = false
      })
    },
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.addParamsVisible = false
      })
    },
    async removeParams (attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        attr_name: this.editForm.attr_name,
        attr_sel: this.activeName
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数信息失败')
      }
      this.editForm = res.data
      this.editParamsVisible = true
    },
    // 文本框添加参数确认
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
      }
      row.inputVisible = false
      this.saveAttrParams(row)
    },
    async saveAttrParams (row) {
      // 发起请求 保存新加的参数
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
      // this.getParamsData()
    },
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 作用：页面重新渲染之后才运行后面的代码！
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrParams(row)
    }
  },

  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  width: auto;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
