<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格占位 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                :show-index="true" border class="treeTable">

                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" style="color: #d2568c;" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color: grey;" v-else></i>
                </template>

                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="addCateDialogClosed">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- options用来指定数据源 -->
                    <!-- props用来指定配置对象 -->
                    <el-cascader :options="parentCateList" :props="cascaderProps" v-model="selectedKeys"
                        @change="parentCateChanged" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑商品分类的Dialog对话框 -->
        <el-dialog title="修改商品分类信息" :visible.sync="editCateDialogVisible" width="40%" @close="editCateDialogClosed">
            <!-- ialog内容主体区 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>
            </el-form>

            <!-- dialog底部按钮区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Cate',
        data() {
            return {
                //查询条件
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                //商品分类的数据列表,默认为空
                cateList: [],
                //商品父级分类的列表
                parentCateList: [],
                //选中的父级分类的id数组
                selectedKeys: [],
                //修改分类时用来暂时存放信息的数组
                editForm: [],
                //添加分类的表单数据对象
                addCateForm: {
                    //将要添加的分类的名称
                    cat_name: '',
                    //父级分类的id
                    cat_pid: 0,
                    //分类的等级,默认为一级分类
                    cat_level: 0
                },
                //添加验证表单规则的对象
                addCateFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类的名称', trigger: 'blur' }
                    ]
                },
                //指定级联选择器的配置对象  
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover',
                    checkStrictly: true,
                    multiple: true
                },
                editFormRules: {
                    cat_name: [
                        {required: true, message: "请输入分类名", trigger: "blur" }
                    ]
                },
                //总数居条数
                total: 0,
                //为table指定列
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        //将当前列定义为模板列
                        type: 'template',
                        //表示当前列所使用的模板名称
                        template: 'isOk'
                    },
                    {
                        label: '排序',
                        //将当前列定义为模板列
                        type: 'template',
                        //表示当前列所使用的模板名称
                        template: 'order'
                    },
                    {
                        label: '操作',
                        //将当前列定义为模板列
                        type: 'template',
                        //表示当前列所使用的模板名称
                        template: 'opt'
                    },
                ],
                //控制添加分类对话框的展示状态
                addCateDialogVisible: false,
                //控制编辑分类对话框的展示状态
                editCateDialogVisible: false
            }
        },
        methods: {
            //获取商品分类数据
            async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败');
                }
                //把数据列表赋值给cateList
                this.cateList = res.data.result
                this.total = res.data.total
            },

            //监听pagesize改变的事件
            handleSizeChange(newSize) {
                const temporaryTotal = this.queryInfo.pagesize * this.queryInfo.pagenum
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = (temporaryTotal / this.queryInfo.pagesize) + 1
                this.getCateList()
            },

            //监听pagenum改变的方法
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },

            //点击按钮展示添加分类的对话框
            showAddCateDialog() {
                //先获取父级分类的数据列表
                this.getParentCateList()
                //再展示出添加分类的对话框
                this.addCateDialogVisible = true
            },

            //获取父级分类的数据列表
            async getParentCateList() {
                const { data: res } = await this.$http.get('categories', {
                    params: {
                        type: 2
                    }
                })
                if (res.meta.status !== 200) {
                    this.$message.error('获取父级分类数据失败')
                }
                this.parentCateList = res.data
            },

            //select级联选择项发生变化时触发该函数
            parentCateChanged() {
                //如果selectedKeys数组中的length > 0，证明选中了父级分类，反之就没有选中任何父级分类
                if (this.selectedKeys.length > 0) {
                    //父级分类的id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    //为当前分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },

            //点击按钮，添加新的分类
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post('categories', this.addCateForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加分类失败')
                    }
                    this.$message.success('添加分类成功')
                    this.getCateList()
                    this.addCateDialogVisible = false
                })
            },

            //监听添加分类的Dialog对话框的关闭事件，重置表单数据
            addCateDialogClosed() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            },

            //展示修改角色的dialog对话框
            async showEditDialog(id) {
                const { data: res } = await this.$http.get('categories/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询角色信息失败')
                }
                this.editForm = res.data
                this.editCateDialogVisible = true
            },

            //监听修改角色对话框dialog的关闭事件
            editCateDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },

            //点击确认按钮修改角色信息预校验方法
            async editCate() {
                const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id,
                    {
                        cat_name: this.editForm.cat_name
                    })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新分类信息失败')
                } else {
                    //关闭对话框
                    this.editCateDialogVisible = false
                    //刷新数据列表
                    this.getCateList()
                    //提示修改成功
                    this.$message.success('更新分类信息成功')
                }
            },

            //根据id删除分类信息的方法
            async removeCateById(id) {
                //弹框询问用户是否删除数据
                const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                //如果用户点击确认，返回值为字符串‘confirm’
                //如果用户点击取消，返回值为字符串‘cancel’
                if (confirmResult !== 'confirm') {
                    return this.$message('已取消删除该分类')
                }
                const { data: res } = await this.$http.delete('categories/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除分类信息失败')
                }
                this.$message.success('删除分类成功')
                this.getCateList()
            },



        },
        created() {
            this.getCateList()
        },
    }
</script>

<style scoped lang="less">
    .treeTable {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>