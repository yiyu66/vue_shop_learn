<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"> 添加分类</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="cateList"
          style="width: 100%; margin-bottom: 20px"
          row-key="cat_id"
          border
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="cat_name" label="分类名称" sortable width="180"> </el-table-column>
          <el-table-column type="template" prop="cat_deleted" label="是否有效" sortable width="180">
            <template slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
              <i class="el-icon-error" v-else style="color: red"></i>
            </template>
          </el-table-column>
          <el-table-column prop="cat_level" label="排序" sortable width="180">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
              <el-tag size="mini" v-else type="warning">三级</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">搜索</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[3, 5, 10]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: 'true',
            }"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      parentCateList: [],
      addCateVisible: false,
      selectedKeys: [], // 选中的父级分类ID数组
      addCateForm: {
        cat_name: '',
        cat_pid: 0, // 分类父 ID
        cat_level: 0 // 默认添加一级分类
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类')
      }

      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.addCateVisible = true
      this.getParentCateList()
    },
    // 获取父级分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      this.parentCateList = res.data
    },
    parentCateChange () {
      console.log(this.selectedKeys)
    }
  }
}
</script>
<style lang="less">
.el-cascader {
  width: 100%;
}
.el-cascader-menu{
  height: 400px;
}
</style>
